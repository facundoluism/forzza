// Nota: el parámetro de ruta "conversationId" representa el assignment_id
// (el chat es 1:1 por assignment, no existe tabla conversations)
import { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { EmptyState, ScreenHeader } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { ReportModal } from "@/components/ReportModal";

interface Message {
  id: string;
  assignment_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

function MessageBubble({
  message,
  isOwn,
  timeStr,
  onLongPress,
}: {
  message: Message;
  isOwn: boolean;
  timeStr: string;
  onLongPress?: () => void;
}): React.JSX.Element {
  return (
    <TouchableOpacity
      style={[
        styles.bubbleWrapper,
        isOwn ? styles.bubbleWrapperOwn : styles.bubbleWrapperOther,
      ]}
      onLongPress={onLongPress}
      activeOpacity={0.9}
      delayLongPress={400}
      accessible={false}
    >
      <View
        style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}
      >
        <Text style={[styles.bubbleText, isOwn && styles.bubbleTextOwn]}>
          {message.content}
        </Text>
      </View>
      <Text style={[styles.bubbleTime, isOwn && styles.bubbleTimeOwn]}>
        {timeStr}
      </Text>
    </TouchableOpacity>
  );
}

const PAGE_SIZE = 50;

// TODO: regenerar db-types — cast mínimo hasta que se actualice el esquema generado
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export default function ConversationScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // El parámetro "conversationId" es en realidad el assignment_id
  const { conversationId: assignmentId } = useLocalSearchParams<{
    conversationId: string;
  }>();
  const { user } = useAuth();
  const flatListRef = useRef<FlatList<Message>>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  // Report modal state
  const [reportMessageId, setReportMessageId] = useState<string | null>(null);

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const markRead = useCallback(
    async (msgIds: string[]) => {
      if (!user || msgIds.length === 0) return;
      await db
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .in("id", msgIds)
        .neq("sender_id", user.id)
        .is("read_at", null);
    },
    [user]
  );

  const loadMessages = useCallback(
    async (before?: string) => {
      if (!assignmentId) return;

      let query = db
        .from("messages")
        .select("id, assignment_id, sender_id, content, read_at, created_at")
        .eq("assignment_id", assignmentId)
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE);

      if (before) {
        query = query.lt("created_at", before);
      }

      const { data, error } = await query;
      if (error || !data) return;

      const msgs = (data as Message[]).reverse();

      if (!before) {
        setMessages(msgs);
        setHasMore(msgs.length === PAGE_SIZE);
        const unreadIds = msgs
          .filter((m) => m.sender_id !== user?.id && !m.read_at)
          .map((m) => m.id);
        void markRead(unreadIds);
      } else {
        setMessages((prev) => [...msgs, ...prev]);
        setHasMore(msgs.length === PAGE_SIZE);
      }
    },
    [assignmentId, user?.id, markRead]
  );

  // Carga inicial
  useEffect(() => {
    void loadMessages().then(() => setLoading(false));
  }, [loadMessages]);

  // Suscripción Realtime — filtrar por assignment_id (columna real de messages)
  useEffect(() => {
    if (!assignmentId) return;

    const channel = supabase
      .channel(`messages:assignment_id=eq.${assignmentId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `assignment_id=eq.${assignmentId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          if (newMsg.sender_id !== user?.id) {
            void markRead([newMsg.id]);
          }
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      void supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [assignmentId, user?.id, markRead]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loadingMore || messages.length === 0) return;
    setLoadingMore(true);
    const oldest = messages[0]?.created_at;
    await loadMessages(oldest);
    setLoadingMore(false);
  }, [hasMore, loadingMore, messages, loadMessages]);

  const handleSend = useCallback(async () => {
    const content = text.trim();
    if (!content || !user || !assignmentId || sending) return;

    setSending(true);
    setText("");

    const { data, error } = await db
      .from("messages")
      .insert({
        assignment_id: assignmentId,
        sender_id: user.id,
        content,
      })
      .select("id, assignment_id, sender_id, content, read_at, created_at")
      .single();

    if (error || !data) {
      // Restituir el texto y avisar: no silenciar el fallo de envío.
      setText(content);
      Alert.alert(t("conversation.sendError"));
      setSending(false);
      return;
    }

    // Optimista: mostrar el mensaje al instante. Si Realtime luego lo trae,
    // el dedup por id (handler de postgres_changes) evita duplicarlo.
    const sent = data as Message;
    setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]));
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setSending(false);
  }, [text, user, assignmentId, sending, t]);

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.chatHeader, { paddingTop: insets.top + spacing[4] }]}>
          <ScreenHeader title={t("conversation.screenTitle")} onBack={() => router.back()} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.lime} size="large" />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={[styles.chatHeader, { paddingTop: insets.top + spacing[4] }]}>
        <ScreenHeader title={t("conversation.screenTitle")} onBack={() => router.back()} />
      </View>
      {loadingMore && (
        <View style={styles.loadingMoreBar}>
          <ActivityIndicator size="small" color={colors.muted} />
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isOwn = item.sender_id === user?.id;
          return (
            <MessageBubble
              message={item}
              isOwn={isOwn}
              timeStr={formatTime(item.created_at)}
              {...(!isOwn ? { onLongPress: () => setReportMessageId(item.id) } : {})}
            />
          );
        }}
        contentContainerStyle={styles.messageList}
        onEndReachedThreshold={0.1}
        onStartReached={() => void handleLoadMore()}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <EmptyState
            title={t("conversation.emptyTitle")}
            description={t("conversation.emptyHint")}
            icon="💬"
          />
        }
      />

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={t('conversation.inputPlaceholder')}
          placeholderTextColor={colors.muted}
          multiline
          maxLength={2000}
          returnKeyType="default"
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!text.trim() || sending) && styles.sendButtonDisabled,
          ]}
          onPress={() => void handleSend()}
          disabled={!text.trim() || sending}
          activeOpacity={0.8}
        >
          {sending ? (
            <ActivityIndicator size="small" color={colors.bg} />
          ) : (
            <Text style={styles.sendButtonText}>{t('conversation.send')}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* P1.5 — Report message modal */}
      {reportMessageId !== null && (
        <ReportModal
          visible={reportMessageId !== null}
          targetType="message"
          targetId={reportMessageId}
          onClose={() => setReportMessageId(null)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  chatHeader: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  loadingMoreBar: {
    paddingVertical: spacing[2],
    alignItems: "center",
  },
  messageList: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  bubbleWrapper: {
    marginBottom: spacing[3],
    maxWidth: "78%",
  },
  bubbleWrapperOwn: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  bubbleWrapperOther: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  bubble: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  bubbleOwn: {
    backgroundColor: colors.lime,
    borderBottomRightRadius: radius.sm,
  },
  bubbleOther: {
    backgroundColor: colors.surface2,
    borderBottomLeftRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  bubbleTextOwn: {
    color: colors.bg,
    fontWeight: "500",
  },
  bubbleTime: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    marginTop: spacing[1],
    marginHorizontal: spacing[1],
    opacity: 0.7,
  },
  bubbleTimeOwn: {
    color: colors.gray,
  },
  // ── Input bar ──
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing[3],
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    color: colors.text,
    fontFamily: typography.body,
    fontSize: fontSize.md,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: colors.lime,
    borderRadius: radius.full,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    alignItems: "center",
    justifyContent: "center",
    minWidth: 68,
    minHeight: 44,
  },
  sendButtonDisabled: {
    backgroundColor: colors.surface4,
  },
  sendButtonText: {
    fontFamily: typography.heading,
    color: colors.bg,
    fontSize: fontSize.base,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
