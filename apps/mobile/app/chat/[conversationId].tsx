// Nota: el parámetro de ruta "conversationId" representa el assignment_id
// (el chat es 1:1 por assignment, no existe tabla conversations)
import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
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
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { EmptyState } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";
import type { RealtimeChannel } from "@supabase/supabase-js";

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
}: {
  message: Message;
  isOwn: boolean;
  timeStr: string;
}): React.JSX.Element {
  return (
    <View
      style={[
        styles.bubbleWrapper,
        isOwn ? styles.bubbleWrapperOwn : styles.bubbleWrapperOther,
      ]}
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
    </View>
  );
}

const PAGE_SIZE = 50;

// TODO: regenerar db-types — cast mínimo hasta que se actualice el esquema generado
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export default function ConversationScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation();
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

  useLayoutEffect(() => {
    navigation.setOptions({ title: t('conversation.screenTitle') });
  }, [t, navigation]);

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

    const { error } = await db.from("messages").insert({
      assignment_id: assignmentId,
      sender_id: user.id,
      content,
    });

    if (error) {
      setText(content);
    }

    setSending(false);
  }, [text, user, assignmentId, sending]);

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.lime} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {loadingMore && (
        <View style={styles.loadingMoreBar}>
          <ActivityIndicator size="small" color={colors.muted} />
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isOwn={item.sender_id === user?.id}
            timeStr={formatTime(item.created_at)}
          />
        )}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
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
