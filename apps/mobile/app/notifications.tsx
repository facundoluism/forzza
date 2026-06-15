import { useEffect, useRef, useState, useCallback } from "react";
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
import { colors, fontSize, spacing, radius, typography } from "@forzza/ui/tokens";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  data: Record<string, unknown> | null;
  created_at: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days}d`;
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
}

function NotificationItem({
  item,
  onPress,
}: {
  item: Notification;
  onPress: () => void;
}): React.JSX.Element {
  const isUnread = item.read_at === null;

  return (
    <TouchableOpacity
      style={[styles.item, isUnread && styles.itemUnread]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.itemLeft}>
        {isUnread && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text
            style={[styles.itemTitle, isUnread && styles.itemTitleUnread]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text style={styles.itemTime}>{timeAgo(item.created_at)}</Text>
        </View>
        <Text style={styles.itemBody} numberOfLines={3}>
          {item.body}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function navigateForType(
  router: ReturnType<typeof useRouter>,
  notification: Notification
): void {
  const meta = notification.data ?? {};
  switch (notification.type) {
    case "checkin_reminder":
      router.push("/(tabs)/routines" as never);
      break;
    case "new_message":
      // El chat se modela por assignment_id (no existe tabla conversations)
      // La metadata de la notificación envía assignment_id
      if (meta.assignment_id) {
        router.push(`/chat/${String(meta.assignment_id)}` as never);
      }
      break;
    case "assignment_confirmed":
    case "payment_received":
      router.push("/(tabs)/index" as never);
      break;
    default:
      break;
  }
}

export default function NotificationsScreen(): React.JSX.Element {
  const { user } = useAuth();
  const router = useRouter();
  const channelRef = useRef<RealtimeChannel | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = notifications.filter((n) => n.read_at === null).length;

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (!error && data) {
      setNotifications(data as unknown as Notification[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  // Realtime subscription for live updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`notifications:user_id=eq.${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as Notification;
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n))
          );
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      void supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [user]);

  const markAsRead = useCallback(
    async (notification: Notification) => {
      if (notification.read_at !== null) return;
      const now = new Date().toISOString();
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, read_at: now } : n
        )
      );
      await supabase
        .from("notifications")
        .update({ read_at: now })
        .eq("id", notification.id);
    },
    []
  );

  const handlePress = useCallback(
    (notification: Notification) => {
      void markAsRead(notification);
      navigateForType(router, notification);
    },
    [markAsRead, router]
  );

  const markAllAsRead = useCallback(async () => {
    if (!user || unreadCount === 0) return;
    setMarkingAll(true);
    const now = new Date().toISOString();
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.read_at === null ? { ...n, read_at: now } : n))
    );
    await supabase
      .from("notifications")
      .update({ read_at: now })
      .eq("user_id", user.id)
      .is("read_at", null);
    setMarkingAll(false);
  }, [user, unreadCount]);

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
        <Text style={styles.headerTitle}>Notificaciones</Text>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={() => void markAllAsRead()}
            disabled={markingAll}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
            style={styles.markAllBtn}
          >
            <Text style={styles.markAllText}>
              {markingAll ? "Marcando..." : "Marcar todas como leídas"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <EmptyState
          title="Sin notificaciones"
          description="Tus notificaciones van a aparecer acá."
          icon="🔔"
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onPress={() => handlePress(item)}
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
    paddingTop: spacing[4],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray800,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: fontSize.screenTitle,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  markAllBtn: {
    minHeight: 44,
    justifyContent: "center",
  },
  markAllText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: 13,
    fontWeight: "600",
    paddingBottom: spacing[1],
  },
  list: {
    paddingTop: spacing[1],
    paddingBottom: spacing[8],
  },
  item: {
    flexDirection: "row",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  itemUnread: {
    backgroundColor: `${colors.gray900}80`,
  },
  itemLeft: {
    width: 10,
    alignItems: "center",
    paddingTop: spacing[2],
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.lime,
  },
  itemContent: {
    flex: 1,
    gap: spacing[2],
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing[2],
  },
  itemTitle: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  itemTitleUnread: {
    color: colors.white,
  },
  itemTime: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 12,
    flexShrink: 0,
  },
  itemBody: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: 13,
    lineHeight: 18,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray800,
    marginLeft: spacing[4] + 10 + spacing[3],
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
