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
import { EmptyState } from "@forzza/ui/native";
import { colors, spacing, radius, typography } from "@forzza/ui/tokens";

// El chat se modela 1:1 por assignment (no existe tabla conversations)
interface AssignmentChat {
  assignmentId: string;
  coachDisplayName: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

// Tipos internos para el select
interface RawCoachProfile {
  display_name: string;
}

interface RawAssignment {
  id: string;
  student_id: string;
  coach_id: string;
  status: string;
  coach_profiles: RawCoachProfile | null;
}

interface RawMessage {
  content: string;
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

function AssignmentItem({
  item,
  onPress,
}: {
  item: AssignmentChat;
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
          {item.coachDisplayName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.coachDisplayName}
          </Text>
          <Text style={styles.itemTime}>{timeAgo(item.lastMessageAt)}</Text>
        </View>
        <View style={styles.itemFooter}>
          <Text style={styles.itemPreview} numberOfLines={1}>
            {item.lastMessage ?? "Sin mensajes aún"}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.unreadCount > 99 ? "99+" : String(item.unreadCount)}
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
  const [chats, setChats] = useState<AssignmentChat[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChats = useCallback(async () => {
    if (!user) return;

    // Cargar assignments activos del alumno con datos del coach_profiles
    // coach_id en coach_assignments referencia coach_profiles.id (no users.id)
    // TODO: regenerar db-types — cast mínimo
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const { data: assignments, error } = await db
      .from("coach_assignments")
      .select(
        "id, student_id, coach_id, status, coach_profiles!coach_assignments_coach_id_fkey(display_name)"
      )
      .eq("student_id", user.id)
      .eq("status", "active");

    if (error || !assignments) {
      setLoading(false);
      return;
    }

    const chatList: AssignmentChat[] = [];

    for (const a of assignments as RawAssignment[]) {
      const coachName = a.coach_profiles?.display_name ?? "Coach";

      // Último mensaje de este assignment
      const { data: lastMsgData } = await db
        .from("messages")
        .select("content, created_at")
        .eq("assignment_id", a.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const lastMsg = lastMsgData as RawMessage | null;

      // Mensajes no leídos del otro lado
      const { count: unreadCount } = await db
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("assignment_id", a.id)
        .neq("sender_id", user.id)
        .is("read_at", null);

      chatList.push({
        assignmentId: a.id,
        coachDisplayName: coachName,
        lastMessage: lastMsg?.content ?? null,
        lastMessageAt: lastMsg?.created_at ?? null,
        unreadCount: (unreadCount as number | null) ?? 0,
      });
    }

    chatList.sort((a, b) => {
      const ta = a.lastMessageAt ?? "";
      const tb = b.lastMessageAt ?? "";
      return new Date(tb).getTime() - new Date(ta).getTime();
    });

    setChats(chatList);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void loadChats();
  }, [loadChats]);

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
      {chats.length === 0 ? (
        <EmptyState
          title="Sin conversaciones"
          description="Los chats con tu coach aparecen acá cuando contratás un paquete."
          icon="💬"
        />
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.assignmentId}
          renderItem={({ item }) => (
            <AssignmentItem
              item={item}
              onPress={() =>
                router.push(`/chat/${item.assignmentId}` as never)
              }
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
    backgroundColor: colors.bg,
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
    paddingTop: spacing[2],
    paddingBottom: spacing[20],
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
