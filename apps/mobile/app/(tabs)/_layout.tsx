import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { Tabs } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { colors, radius, spacing, typography } from "@forzza/ui/tokens";
import type { RealtimeChannel } from "@supabase/supabase-js";

function TabIcon({ label }: { label: string }) {
  return <Text style={{ color: "#6A6A6A", fontSize: 20 }}>{label}</Text>;
}

function NotificationBadge({ count }: { count: number }): React.JSX.Element | null {
  if (count === 0) return null;
  return (
    <View
      style={{
        position: "absolute",
        top: -4,
        right: -8,
        backgroundColor: colors.lime,
        borderRadius: radius.full,
        minWidth: 16,
        height: 16,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing[1],
      }}
    >
      <Text
        style={{
          fontFamily: typography.body,
          color: colors.black,
          fontSize: 9,
          fontWeight: "700",
        }}
      >
        {count > 99 ? "99+" : String(count)}
      </Text>
    </View>
  );
}

function HomeTabIcon(): React.JSX.Element {
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
    <View style={{ position: "relative" }}>
      <Text style={{ color: "#6A6A6A", fontSize: 20 }}>{"🏠"}</Text>
      <NotificationBadge count={unreadCount} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#0A0A0A", borderTopColor: "#2A2A2A" },
        tabBarActiveTintColor: "#C8FF00",
        tabBarInactiveTintColor: "#6A6A6A",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: () => <HomeTabIcon />,
        }}
      />
      <Tabs.Screen
        name="routines"
        options={{
          title: "Rutinas",
          tabBarIcon: () => <TabIcon label="📋" />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progreso",
          tabBarIcon: () => <TabIcon label="📈" />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: () => <TabIcon label="💬" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: () => <TabIcon label="👤" />,
        }}
      />
    </Tabs>
  );
}
