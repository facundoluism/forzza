import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { colors, spacing, radius, typography } from "@forzza/ui/tokens";

interface Conversation {
  id: string;
  coach_id: string;
  student_id: string;
  created_at: string;
  updated_at: string;
  other_name: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

interface RawConversation {
  id: string;
  coach_id: string;
  student_id: string;
  created_at: string;
  updated_at: string;
}

interface RawMessage {
  body: string;
  created_at: string;
}

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function ConversationItem({
  item,
  onPress,
}: {
  item: Conversation;
  onPress: () => void;
}): React.JSX.Element {
  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.other_name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.other_name}
          </Text>
          <Text style={styles.itemTime}>{timeAgo(item.last_message_at)}</Text>
        </View>
        <View style={styles.itemFooter}>
          <Text style={styles.itemPreview} numberOfLines={1}>
            {item.last_message ?? "Sin mensajes aún"}
          </Text>
          {item.unread_count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.unread_count > 99 ? "99+" : String(item.unread_count)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ChatTab(): React.JSX.Element {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConversations = useCallback(async () => {
    if (!user) return;

    const { data: assignments, error } = await supabase
      .from("coach_assignments")
      .select(
        `id, coach_id, student_id,
        coach_profiles!coach_assignments_coach_id_fkey(display_name),
        student_profiles!coach_assignments_student_id_fkey(display_name)`
      )
      .or(`coach_id.eq.${user.id},student_id.eq.${user.id}`)
      .eq("status", "active");

    if (error || !assignments) {
      setLoading(false);
      return;
    }

    const convList: Conversation[] = [];

    for (const a of assignments) {
      const isCoach = a.coach_id === user.id;
      const coachProfiles = a.coach_profiles as unknown as
        | { display_name: string }
        | null;
      const studentProfiles = a.student_profiles as unknown as
        | { display_name: string | null }
        | null;

      const otherName = isCoach
        ? (studentProfiles?.display_name ?? "Alumno")
        : (coachProfiles?.display_name ?? "Coach");

      // Buscar conversación existente
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: conv } = await (supabase as any)
        .from("conversations")
        .select("id, created_at, updated_at")
        .eq("coach_id", a.coach_id)
        .eq("student_id", a.student_id)
        .single();

      let convId: string;
      if (!conv) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: newConv } = await (supabase as any)
          .from("conversations")
          .insert({ coach_id: a.coach_id, student_id: a.student_id })
          .select("id, created_at, updated_at")
          .single();
        if (!newConv) continue;
        convId = (newConv as RawConversation).id;
      } else {
        convId = (conv as RawConversation).id;
      }

      // Último mensaje
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: lastMsg } = await (supabase as any)
        .from("messages")
        .select("body, created_at")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      // Mensajes no leídos
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count: unreadCount } = await (supabase as any)
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("conversation_id", convId)
        .neq("sender_id", user.id)
        .is("read_at", null);

      const rawConv = conv as RawConversation | null;
      const rawMsg = lastMsg as RawMessage | null;

      convList.push({
        id: convId,
        coach_id: a.coach_id,
        student_id: a.student_id,
        created_at: rawConv?.created_at ?? "",
        updated_at: rawConv?.updated_at ?? "",
        other_name: otherName,
        last_message: rawMsg?.body ?? null,
        last_message_at: rawMsg?.created_at ?? null,
        unread_count: (unreadCount as number | null) ?? 0,
      });
    }

    convList.sort((a, b) => {
      const ta = a.last_message_at ?? a.created_at;
      const tb = b.last_message_at ?? b.created_at;
      return new Date(tb).getTime() - new Date(ta).getTime();
    });

    setConversations(convList);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.lime} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensajes</Text>
      </View>
      {conversations.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>Sin conversaciones</Text>
          <Text style={styles.emptyBody}>
            Tus chats con coaches o alumnos aparecen acá.
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationItem
              item={item}
              onPress={() => router.push(`/chat/${item.id}` as never)}
            />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
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
    padding: spacing[6],
  },
  header: {
    paddingTop: spacing[12],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray800,
  },
  headerTitle: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: 32,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  list: {
    paddingVertical: spacing[2],
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.gray800,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: 22,
  },
  itemContent: {
    flex: 1,
    gap: spacing[1],
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontFamily: typography.body,
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  itemTime: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 12,
    marginLeft: spacing[2],
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemPreview: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: 13,
    flex: 1,
  },
  badge: {
    backgroundColor: colors.lime,
    borderRadius: radius.full,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing[1],
    marginLeft: spacing[2],
  },
  badgeText: {
    fontFamily: typography.body,
    color: colors.black,
    fontSize: 11,
    fontWeight: "700",
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray800,
    marginLeft: spacing[4] + 48 + spacing[3],
  },
  emptyTitle: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: 24,
    textTransform: "uppercase",
    marginBottom: spacing[2],
  },
  emptyBody: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: 14,
    textAlign: "center",
  },
});
