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
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { EmptyState, ScreenHeader } from "@forzza/ui/native";
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

function iconColorForType(type: string): string {
  switch (type) {
    case "new_message":
      return colors.info;
    case "checkin_reminder":
      return colors.lime;
    case "payment_received":
      return colors.warning;
    default:
      return colors.purple;
  }
}

function iconEmojiForType(type: string): string {
  switch (type) {
    case "new_message":
      return "💬";
    case "checkin_reminder":
      return "🏋️";
    case "payment_received":
      return "💳";
    default:
      return "🔔";
  }
}

function NotificationItem({
  item,
  onPress,
  timeLabel,
}: {
  item: Notification;
  onPress: () => void;
  timeLabel: string;
}): React.JSX.Element {
  const isUnread = item.read_at === null;
  const iconColor = iconColorForType(item.type);

  return (
    <TouchableOpacity
      style={[styles.item, isUnread && styles.itemUnread]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: `${iconColor}20` }]}>
        <Text style={styles.iconEmoji}>{iconEmojiForType(item.type)}</Text>
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text
            style={[styles.itemTitle, isUnread && styles.itemTitleUnread]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <View style={styles.timeChip}>
            <Text style={styles.itemTime}>{timeLabel}</Text>
          </View>
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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const router = useRouter();
  const channelRef = useRef<RealtimeChannel | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = notifications.filter((n) => n.read_at === null).length;

  function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return t('notifications.timeNow');
    if (minutes < 60) return t('notifications.timeMinutes', { n: minutes });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('notifications.timeHours', { n: hours });
    const days = Math.floor(hours / 24);
    if (days < 7) return t('notifications.timeDays', { n: days });
    return new Date(iso).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });
  }

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
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.lime} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header visual */}
      <View style={[styles.header, { paddingTop: insets.top + spacing[4] }]}>
        <ScreenHeader
          title={t("notifications.screenTitle")}
          onBack={() => router.back()}
          right={
            unreadCount > 0 ? (
              <TouchableOpacity
                onPress={() => void markAllAsRead()}
                disabled={markingAll}
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
              >
                <Text style={styles.markAllText}>
                  {markingAll ? t("notifications.markingRead") : t("notifications.markAllRead")}
                </Text>
              </TouchableOpacity>
            ) : undefined
          }
        />
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            title={t('notifications.emptyTitle')}
            description={t('notifications.emptyDesc')}
            icon="🔔"
          />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onPress={() => handlePress(item)}
              timeLabel={timeAgo(item.created_at)}
            />
          )}
          contentContainerStyle={styles.list}
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
    backgroundColor: colors.bg,
    padding: spacing[6],
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  markAllText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: 13,
    fontWeight: "600",
  },
  list: {
    paddingTop: spacing[2],
    paddingBottom: spacing[8],
  },
  emptyContainer: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    marginHorizontal: spacing[4],
    marginVertical: spacing[1],
    gap: spacing[3],
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemUnread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.lime,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconEmoji: {
    fontSize: 20,
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
    color: colors.muted,
    fontSize: fontSize.md,
    fontWeight: "600",
    flex: 1,
  },
  itemTitleUnread: {
    color: colors.text,
  },
  timeChip: {
    flexShrink: 0,
  },
  itemTime: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 11,
  },
  itemBody: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
