import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { useRef } from "react";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useEntitlements } from "@/hooks/useEntitlements";
import { EmptyState, Card, Skeleton } from "@forzza/ui/native";
import { colors, spacing, radius, typography } from "@forzza/ui/tokens";

const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

interface StudentProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  coach_id?: string | null;
  active_routine_id?: string | null;
}

interface Routine {
  id: string;
  name: string;
  student_id: string;
}

function SkeletonCard(): React.JSX.Element {
  return (
    <Card style={styles.skeletonCard}>
      <Skeleton width="60%" height={20} />
      <View style={styles.skeletonGap} />
      <Skeleton width="40%" height={14} />
    </Card>
  );
}

function RecentSessionCard({
  session,
}: {
  session: {
    routine_name: string;
    started_at: string;
    exercises: Array<{ sets: unknown[] }>;
  };
}): React.JSX.Element {
  const date = new Date(session.started_at);
  const formatted = date.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const totalSets = session.exercises.reduce(
    (acc, ex) => acc + ex.sets.length,
    0
  );

  return (
    <Card style={styles.sessionCard}>
      <Text style={styles.sessionName}>{session.routine_name}</Text>
      <View style={styles.sessionMeta}>
        <Text style={styles.sessionMetaText}>{formatted}</Text>
        <Text style={styles.sessionMetaDot}>·</Text>
        <Text style={styles.sessionMetaText}>
          <Text style={styles.sessionMetaMono}>{totalSets}</Text> series
        </Text>
      </View>
    </Card>
  );
}

function QuickStartButton({ onPress }: { onPress: () => void }): React.JSX.Element {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();

  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 2 }).start();

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Animated.View style={[styles.quickStartBtn, { transform: [{ scale }] }]}>
        <Text style={styles.quickStartText}>Empezar entreno</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function HomeTab(): React.JSX.Element {
  const { user } = useAuth();
  const router = useRouter();
  const syncQueue = useWorkoutStore((s) => s.syncQueue);
  const { isPro } = useEntitlements();

  const tenDaysAgo = new Date(Date.now() - TEN_DAYS_MS).toISOString();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["student_profile", user?.id],
    queryFn: async (): Promise<StudentProfile | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data as StudentProfile;
    },
    enabled: !!user,
  });

  const { data: routine, isLoading: routineLoading } = useQuery({
    queryKey: ["active_routine", profile?.active_routine_id],
    queryFn: async (): Promise<Routine | null> => {
      if (!profile?.active_routine_id) return null;
      const { data, error } = await supabase
        .from("routines" as never)
        .select("*")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .eq("id", profile.active_routine_id as any)
        .single();
      if (error) return null;
      return data as Routine | null;
    },
    enabled: !!profile?.active_routine_id,
  });

  const displayName =
    profile?.display_name ?? user?.email?.split("@")[0] ?? "atleta";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  // Last 3 completed sessions — free users: only from last 10 days
  const allRecentSessions = syncQueue
    .filter((item) => item.payload?.status === "completed")
    .slice(-3)
    .reverse()
    .map((item) => ({
      routine_name: item.payload?.routine_name ?? "Entreno",
      started_at: item.payload?.started_at ?? new Date().toISOString(),
      exercises: item.payload?.exercises ?? [],
    }));

  const recentSessions = isPro
    ? allRecentSessions
    : allRecentSessions.filter((s) => s.started_at >= tenDaysAgo);

  const isLoading = profileLoading || routineLoading;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting},</Text>
        <Text style={styles.displayName}>{displayName}</Text>
      </View>

      {/* Rutina de hoy */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rutina de hoy</Text>
        {isLoading ? (
          <SkeletonCard />
        ) : routine ? (
          <Card
            featured
            style={styles.routineCard}
            onPress={() => router.push(`/routine/${routine.id}`)}
          >
            <Text style={styles.routineName}>{routine.name}</Text>
            <Text style={styles.routineHint}>Tocá para ver los ejercicios</Text>
          </Card>
        ) : profile?.coach_id ? (
          <EmptyState
            title="Tu coach todavía no asignó una rutina"
            description="Esperá a que tu coach te configure una rutina personalizada."
            icon="🏋️"
          />
        ) : (
          <EmptyState
            title="No tenés un coach asignado"
            description="Encontrá un coach que se adapte a tus objetivos."
            icon="🔍"
            actionLabel="¿Querés un coach?"
            onAction={() => router.push("/marketplace/index" as never)}
          />
        )}
      </View>

      {/* Quick start */}
      <View style={styles.section}>
        <QuickStartButton onPress={() => router.push("/(tabs)/routines")} />
      </View>

      {/* Últimas sesiones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimas sesiones</Text>
        {recentSessions.length > 0 ? (
          recentSessions.map((session, idx) => (
            <RecentSessionCard key={idx} session={session} />
          ))
        ) : (
          <Card style={styles.emptySessionsCard}>
            <Text style={styles.emptySessionsText}>
              Todavía no completaste ningún entreno. ¡Arrancá hoy!
            </Text>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing[4],
    paddingTop: spacing[12],
  },
  header: {
    marginBottom: spacing[6],
  },
  greeting: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 16,
  },
  displayName: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1,
    textTransform: "uppercase",
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: spacing[3],
  },
  routineCard: {
    gap: spacing[2],
    paddingTop: spacing[5],
  },
  routineName: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    textTransform: "uppercase",
  },
  routineHint: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 13,
  },
  skeletonCard: {
    gap: spacing[2],
    padding: spacing[4],
  },
  skeletonGap: {
    height: spacing[2],
  },
  quickStartBtn: {
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
    shadowColor: colors.lime,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  quickStartText: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  sessionCard: {
    marginBottom: spacing[2],
  },
  sessionName: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing[1],
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  sessionMetaText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 13,
  },
  sessionMetaMono: {
    fontFamily: typography.mono,
    color: colors.muted,
    fontSize: 13,
  },
  sessionMetaDot: {
    color: colors.border,
    fontSize: 13,
  },
  emptySessionsCard: {
    alignItems: "center",
    paddingVertical: spacing[6],
  },
  emptySessionsText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 14,
    textAlign: "center",
  },
});
