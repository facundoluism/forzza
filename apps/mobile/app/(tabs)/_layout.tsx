import { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { colors, spacing, typography } from "@forzza/ui/tokens";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface TabIconProps {
  label: string;
  focused: boolean;
}

function TabIcon({ label, focused }: TabIconProps) {
  return (
    <Text
      style={[
        styles.tabIcon,
        focused ? styles.tabIconActive : styles.tabIconInactive,
      ]}
    >
      {label}
    </Text>
  );
}

function NotificationBadge({ count }: { count: number }): React.JSX.Element | null {
  if (count === 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {count > 99 ? "99+" : String(count)}
      </Text>
    </View>
  );
}

function HomeTabIcon({ focused }: { focused: boolean }): React.JSX.Element {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!user) return;

    // Initial fetch of unread count
    void supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("read_at", null)
      .then(({ count }) => {
        setUnreadCount(count ?? 0);
      });

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`notif_badge:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          setUnreadCount((prev) => prev + 1);
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
          // If read_at was just set, decrement
          const updated = payload.new as { read_at: string | null };
          const old = payload.old as { read_at: string | null };
          if (!old.read_at && updated.read_at) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      void supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [user]);

  return (
    <View style={styles.iconWrapper}>
      <Text
        style={[
          styles.tabIcon,
          focused ? styles.tabIconActive : styles.tabIconInactive,
        ]}
      >
        {"🏠"}
      </Text>
      <NotificationBadge count={unreadCount} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.lime,
        tabBarInactiveTintColor: "#4A4A4A",
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ focused }) => <HomeTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="routines"
        options={{
          title: "Rutinas",
          tabBarIcon: ({ focused }) => <TabIcon label="📋" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progreso",
          tabBarIcon: ({ focused }) => <TabIcon label="📈" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => <TabIcon label="💬" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => <TabIcon label="👤" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: typography.body,
    fontWeight: "600",
  },
  tabIcon: {
    fontSize: 20,
  },
  tabIconActive: {
    // Lime glow on active emoji icons
    shadowColor: colors.lime,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  tabIconInactive: {
    opacity: 0.5,
  },
  iconWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: colors.lime,
    borderRadius: 9999,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing[1],
  },
  badgeText: {
    fontFamily: typography.body,
    color: colors.black,
    fontSize: 9,
    fontWeight: "700",
  },
});
