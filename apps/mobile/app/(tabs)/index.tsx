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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useEntitlements } from "@/hooks/useEntitlements";
import { EmptyState, ErrorState, Card, Skeleton } from "@forzza/ui/native";
import { colors, fontSize, spacing, radius, typography } from "@forzza/ui/tokens";

const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

interface StudentProfile {
  id: string;
  user_id: string;
  display_name: string | null;
}

// Shape canónico del JSONB routines.exercises
interface RoutineExercise {
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
}

interface Routine {
  id: string;
  title: string;
  student_id: string;
  exercises: RoutineExercise[];
}

// coach_assignments con coach_profiles embebido
interface CoachAssignment {
  id: string;
  student_id: string;
  coach_id: string;
  status: string;
  // TODO: regenerar db-types
  coach_profiles: { display_name: string } | null;
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
    sets_data: Array<{ sets: unknown[] }>;
  };
}): React.JSX.Element {
  const date = new Date(session.started_at);
  const formatted = date.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const totalSets = session.sets_data.reduce(
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
  const insets = useSafeAreaInsets();

  const tenDaysAgo = new Date(Date.now() - TEN_DAYS_MS).toISOString();

  // Perfil del alumno (solo columnas que existen en student_profiles)
  const { data: profile, isLoading: profileLoading, isError: profileError } = useQuery({
    queryKey: ["student_profile", user?.id],
    queryFn: async (): Promise<StudentProfile | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("student_profiles")
        .select("id, user_id, display_name")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data as StudentProfile;
    },
    enabled: !!user,
  });

  // Rutina activa: la más reciente donde active=true y student_id=user.id
  const { data: routine, isLoading: routineLoading, isError: routineError } = useQuery({
    queryKey: ["active_routine", user?.id],
    queryFn: async (): Promise<Routine | null> => {
      if (!user) return null;
      // TODO: regenerar db-types — cast mínimo hasta que se actualice el esquema generado
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("routines")
        .select("id, title, student_id, exercises")
        .eq("student_id", user.id)
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) return null;
      return data as Routine | null;
    },
    enabled: !!user,
  });

  // Assignment activo (para saber si tiene coach y mostrar el nombre)
  const { data: activeAssignment, isLoading: assignmentLoading } = useQuery({
    queryKey: ["active_assignment", user?.id],
    queryFn: async (): Promise<CoachAssignment | null> => {
      if (!user) return null;
      // TODO: regenerar db-types — cast mínimo
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("coach_assignments")
        .select(
          "id, student_id, coach_id, status, coach_profiles!coach_assignments_coach_id_fkey(display_name)"
        )
        .eq("student_id", user.id)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();
      if (error) return null;
      return data as CoachAssignment | null;
    },
    enabled: !!user,
  });

  const displayName =
    profile?.display_name ?? user?.email?.split("@")[0] ?? "atleta";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  // Last 3 completed sessions — free users: only from last 10 days
  // sets_data es el campo correcto en la store para sesiones completadas
  const allRecentSessions = syncQueue
    .filter((item) => item.payload?.status === "completed")
    .slice(-3)
    .reverse()
    .map((item) => ({
      routine_name: item.payload?.routine_name ?? "Entreno",
      started_at: item.payload?.started_at ?? new Date().toISOString(),
      sets_data: item.payload?.sets_data ?? [],
    }));

  const recentSessions = isPro
    ? allRecentSessions
    : allRecentSessions.filter((s) => s.started_at >= tenDaysAgo);

  const isLoading = profileLoading || routineLoading || assignmentLoading;
  const isError = profileError || routineError;
  const hasCoach = activeAssignment !== null;

  if (isError) {
    return (
      <View style={[styles.scroll, styles.errorContainer, { paddingTop: insets.top + spacing[2] }]}>
        <ErrorState
          title="No pudimos cargar tu inicio"
          description="Revisá tu conexión e intentá de nuevo."
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing[2] }]}>
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
            <Text style={styles.routineName}>{routine.title}</Text>
            <Text style={styles.routineHint}>Tocá para ver los ejercicios</Text>
          </Card>
        ) : hasCoach ? (
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[20],
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
    fontSize: fontSize.screenTitle,
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
