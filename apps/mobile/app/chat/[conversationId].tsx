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
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { colors, spacing, radius, typography } from "@forzza/ui/tokens";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageBubble({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
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
          {message.body}
        </Text>
      </View>
      <Text style={[styles.bubbleTime, isOwn && styles.bubbleTimeOwn]}>
        {formatTime(message.created_at)}
      </Text>
    </View>
  );
}

const PAGE_SIZE = 50;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export default function ConversationScreen(): React.JSX.Element {
  const { conversationId } = useLocalSearchParams<{
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
      if (!conversationId) return;

      let query = db
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
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
    [conversationId, user?.id, markRead]
  );

  // Carga inicial
  useEffect(() => {
    void loadMessages().then(() => setLoading(false));
  }, [loadMessages]);

  // Suscripción Realtime
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:conversation_id=eq.${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
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
  }, [conversationId, user?.id, markRead]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loadingMore || messages.length === 0) return;
    setLoadingMore(true);
    const oldest = messages[0]?.created_at;
    await loadMessages(oldest);
    setLoadingMore(false);
  }, [hasMore, loadingMore, messages, loadMessages]);

  const handleSend = useCallback(async () => {
    const body = text.trim();
    if (!body || !user || !conversationId || sending) return;

    setSending(true);
    setText("");

    const { error } = await db.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body,
    });

    if (error) {
      setText(body);
    }

    setSending(false);
  }, [text, user, conversationId, sending]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.lime} />
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
          <ActivityIndicator size="small" color={colors.gray400} />
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble message={item} isOwn={item.sender_id === user?.id} />
        )}
        contentContainerStyle={styles.messageList}
        onEndReachedThreshold={0.1}
        onStartReached={() => void handleLoadMore()}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Escribí el primer mensaje para empezar la conversación.
            </Text>
          </View>
        }
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Escribí un mensaje..."
          placeholderTextColor={colors.gray500}
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
            <ActivityIndicator size="small" color={colors.black} />
          ) : (
            <Text style={styles.sendButtonText}>Enviar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.black,
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
    maxWidth: "75%",
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
    backgroundColor: colors.gray800,
    borderBottomLeftRadius: radius.sm,
  },
  bubbleText: {
    fontFamily: typography.body,
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleTextOwn: {
    color: colors.black,
  },
  bubbleTime: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 11,
    marginTop: spacing[1],
    marginHorizontal: spacing[1],
  },
  bubbleTimeOwn: {
    color: colors.gray600,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing[16],
  },
  emptyText: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 14,
    textAlign: "center",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.gray800,
    backgroundColor: colors.black,
    gap: spacing[3],
  },
  input: {
    flex: 1,
    backgroundColor: colors.gray900,
    borderWidth: 1,
    borderColor: colors.gray700,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    color: colors.white,
    fontFamily: typography.body,
    fontSize: 15,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    alignItems: "center",
    justifyContent: "center",
    minWidth: 72,
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray700,
  },
  sendButtonText: {
    fontFamily: typography.body,
    color: colors.black,
    fontSize: 14,
    fontWeight: "700",
  },
});
