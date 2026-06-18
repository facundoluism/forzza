import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useRef } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useLanguageStore } from "@/stores/languageStore";
import { quoteOfTheDay, quoteText } from "@forzza/core";
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
  exercise_id?: string;
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

const WEEK_DAYS = ["L", "M", "X", "J", "V", "S", "D"] as const;

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
  const { t } = useTranslation();
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
          <Text style={styles.sessionMetaMono}>{totalSets}</Text>
          {" "}{t("home.series", { count: totalSets })}
        </Text>
      </View>
    </Card>
  );
}

function QuickStartButton({ onPress }: { onPress: () => void }): React.JSX.Element {
  const { t } = useTranslation();
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
        <Text style={styles.quickStartText}>{t("home.startWorkout")}</Text>
      </Animated.View>
    </Pressable>
  );
}

function estimateRoutineMinutes(exercises: RoutineExercise[]): number {
  const seconds = exercises.reduce((acc, exercise) => {
    const setWorkSeconds = exercise.sets * 45;
    const restSeconds = Math.max(0, exercise.sets - 1) * exercise.rest_seconds;
    return acc + setWorkSeconds + restSeconds;
  }, 0);

  return Math.max(5, Math.ceil(seconds / 60));
}

interface CoachMessageCardProps { coachId: string; }

function CoachMessageCard({ coachId }: CoachMessageCardProps): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();

  const { data: lastMessage, isLoading } = useQuery({
    queryKey: ["coach_last_message", coachId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("messages")
        .select("id, body, created_at, sender_id")
        .eq("coach_id", coachId)
        .eq("student_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) return null;
      return data as { id: string; body: string; created_at: string; sender_id: string } | null;
    },
    enabled: !!user && !!coachId,
    staleTime: 60_000,
  });

  if (isLoading) return <Skeleton width="100%" height={80} />;
  if (!lastMessage) return <></>;

  const initial = (coachId ?? "C").charAt(0).toUpperCase();

  return (
    <Card style={styles.coachMsgCard}>
      <View style={styles.coachMsgRow}>
        <View style={styles.coachMsgAvatar}>
          <Text style={styles.coachMsgAvatarText}>{initial}</Text>
        </View>
        <Text style={styles.coachMsgBody} numberOfLines={2}>{lastMessage.body}</Text>
      </View>
      <TouchableOpacity
        style={styles.coachMsgBtn}
        onPress={() => router.push("/(tabs)/chat" as never)}
        testID="coach-message-reply"
      >
        <Text style={styles.coachMsgBtnText}>{t("home.coachMessageReply")}</Text>
      </TouchableOpacity>
    </Card>
  );
}

export default function HomeTab(): React.JSX.Element {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const syncQueue = useWorkoutStore((s) => s.syncQueue);
  const { isPro } = useEntitlements();
  const insets = useSafeAreaInsets();
  const language = useLanguageStore((s) => s.language);

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
  const greetingKey =
    hour < 12 ? "home.greeting.morning" : hour < 19 ? "home.greeting.afternoon" : "home.greeting.evening";

  // Last 3 completed sessions — free users: only from last 10 days
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

  // Racha semanal: días L-M-X-J-V-S-D de la semana actual con entreno
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Dom,1=Lun,...,6=Sáb
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const completedThisWeek = syncQueue.filter((item) => {
    if (item.payload?.status !== "completed") return false;
    const d = new Date(item.payload.started_at ?? "");
    return d >= monday;
  });

  const trainedDayIndices = new Set<number>(
    completedThisWeek.map((item) => {
      const d = new Date(item.payload!.started_at!);
      const dow = d.getDay(); // 0=Dom,1=Lun
      return dow === 0 ? 6 : dow - 1; // convert to 0=Lun..6=Dom
    })
  );
  const streakCount = completedThisWeek.length;

  // Frase del día
  const epochDay = Math.floor(Date.now() / 86400000);
  const dailyQuote = quoteOfTheDay(epochDay);

  // Meta mensual: sesiones del mes actual vs objetivo 20
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthSessions = syncQueue.filter((item) => {
    if (item.payload?.status !== "completed") return false;
    const d = new Date(item.payload.started_at ?? "");
    return d >= firstDayOfMonth;
  }).length;
  const monthGoal = 20;
  const monthProgress = Math.min(1, monthSessions / monthGoal);

  const isLoading = profileLoading || routineLoading || assignmentLoading;
  const isError = profileError || routineError;
  const hasCoach = activeAssignment !== null;
  const routineExercises = routine?.exercises ?? [];
  const routineExerciseCount = routineExercises.length;
  const routineSetCount = routineExercises.reduce((acc, exercise) => acc + exercise.sets, 0);
  const routineMinutes = routineExercises.length > 0 ? estimateRoutineMinutes(routineExercises) : 0;
  const routinePreviewExercises = routineExercises.slice(0, 3);
  const hiddenExerciseCount = Math.max(0, routineExerciseCount - routinePreviewExercises.length);

  // Avatar inicial
  const avatarInitial = displayName.charAt(0).toUpperCase();

  // Coach name and initials
  const coachDisplayName = activeAssignment?.coach_profiles?.display_name ?? "Coach";
  const coachInitials = coachDisplayName
    .split(" ")
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (isError) {
    return (
      <View style={[styles.scroll, styles.errorContainer, { paddingTop: insets.top + spacing[2] }]}>
        <ErrorState
          title={t("home.error_title")}
          description={t("home.error_desc")}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing[2] }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{t(greetingKey).toUpperCase()}</Text>
          <Text style={styles.displayName}>{displayName}</Text>
        </View>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>{avatarInitial}</Text>
        </View>
      </View>

      {/* Frase del día — antes de la rutina, como en el prototipo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("home.quoteOfTheDay")}</Text>
        <Card style={styles.quoteCard}>
          <Text style={styles.quoteText}>"{quoteText(dailyQuote, language)}"</Text>
          <Text style={styles.quoteAuthor}>— {dailyQuote.author}</Text>
          <Text style={styles.quoteSport}>{dailyQuote.sport}</Text>
        </Card>
      </View>

      {/* Racha semanal */}
      <View style={styles.section}>
        <Card style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Text style={styles.sectionTitle}>{t("home.weeklyStreak")}</Text>
            <Text style={styles.streakCount}>{streakCount} {t("home.days")} 🔥</Text>
          </View>
          <View style={styles.streakGrid}>
            {WEEK_DAYS.map((day, i) => (
              <View key={day} style={styles.streakDayCol}>
                <View style={[styles.streakDayBox, trainedDayIndices.has(i) && styles.streakDayBoxActive]}>
                  {trainedDayIndices.has(i) && (
                    <Text style={styles.streakDayCheck}>✓</Text>
                  )}
                </View>
                <Text style={[styles.streakDayLabel, trainedDayIndices.has(i) && styles.streakDayLabelActive]}>{day}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      {/* Banner contextual */}
      {hasCoach ? (
        <View style={[styles.banner, styles.bannerCoach]}>
          <View style={styles.bannerCoachAvatar}>
            <Text style={styles.bannerCoachAvatarText}>{coachInitials}</Text>
          </View>
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerCoachLabel}>{t("home.bannerCoachLabel")} · Paq.</Text>
            <Text style={styles.bannerCoachName}>{coachDisplayName}</Text>
          </View>
          <TouchableOpacity
            style={styles.bannerCoachChatBtn}
            onPress={() => router.push("/(tabs)/chat" as never)}
          >
            <Text style={styles.bannerCoachChatBtnText}>Chat</Text>
          </TouchableOpacity>
        </View>
      ) : isPro ? (
        <TouchableOpacity
          style={[styles.banner, styles.bannerPro]}
          onPress={() => router.push("/marketplace/index" as never)}
        >
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerProTitle}>{t("home.bannerProTitle")}</Text>
            <Text style={styles.bannerProSub}>{t("home.bannerProSub")}</Text>
          </View>
          <Text style={styles.bannerArrow}>›</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.banner, styles.bannerFree]}
          onPress={() => router.push("/upgrade" as never)}
        >
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerFreeTitle}>{t("home.bannerFreeTitle")}</Text>
            <Text style={styles.bannerFreeSub}>{t("home.bannerFreeSub")}</Text>
          </View>
          <Text style={styles.bannerArrow}>›</Text>
        </TouchableOpacity>
      )}

      {/* Rutina de hoy */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("home.todayRoutine")}</Text>
        {isLoading ? (
          <SkeletonCard />
        ) : routine ? (
          <Card
            testID="today-routine-card"
            accessibilityLabel={t("home.todayRoutine")}
            featured
            style={styles.routineCard}
            onPress={() => router.push(`/routine/${routine.id}`)}
          >
            <Text style={styles.routineName}>{routine.title}</Text>
            <View style={styles.routineStatsRow}>
              <View style={styles.routineStatPill}>
                <Text style={styles.routineStatValue}>{routineExerciseCount}</Text>
                <Text style={styles.routineStatLabel}>{t("home.summaryExercises")}</Text>
              </View>
              <View style={styles.routineStatPill}>
                <Text style={styles.routineStatValue}>{routineSetCount}</Text>
                <Text style={styles.routineStatLabel}>{t("home.summarySets")}</Text>
              </View>
              <View style={styles.routineStatPill}>
                <Text style={styles.routineStatValue}>{routineMinutes}</Text>
                <Text style={styles.routineStatLabel}>{t("home.summaryMinutes")}</Text>
              </View>
            </View>
            {routinePreviewExercises.length > 0 && (
              <View style={styles.routinePreviewList}>
                <Text style={styles.routinePreviewTitle}>{t("home.nextExercises")}</Text>
                {routinePreviewExercises.map((exercise, idx) => (
                  <View key={`${exercise.exercise_id ?? exercise.name}-${idx}`} style={styles.routinePreviewRow}>
                    <Text style={styles.routinePreviewIndex}>{idx + 1}</Text>
                    <View style={styles.routinePreviewInfo}>
                      <Text style={styles.routinePreviewName}>{exercise.name}</Text>
                      <Text style={styles.routinePreviewMeta}>
                        {t("home.exercisePlanLine", {
                          sets: exercise.sets,
                          reps: exercise.reps,
                          rest: exercise.rest_seconds,
                        })}
                      </Text>
                    </View>
                  </View>
                ))}
                {hiddenExerciseCount > 0 && (
                  <Text style={styles.routinePreviewMore}>
                    {t("home.moreExercises", { count: hiddenExerciseCount })}
                  </Text>
                )}
              </View>
            )}
            <View style={styles.routineCta}>
              <Text testID="open-routine-button" style={styles.routineCtaText}>▶ {t("home.openRoutine")}</Text>
            </View>
          </Card>
        ) : hasCoach ? (
          <EmptyState
            title={t("home.coachNoRoutine_title")}
            description={t("home.coachNoRoutine_desc")}
            icon="🏋️"
          />
        ) : (
          <EmptyState
            title={t("home.noCoachNoRoutine_title")}
            description={t("home.noCoachNoRoutine_desc")}
            icon="🔍"
            actionLabel={t("home.noCoachNoRoutine_action")}
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
        <Text style={styles.sectionTitle}>{t("home.lastSessions")}</Text>
        {recentSessions.length > 0 ? (
          recentSessions.map((session, idx) => (
            <RecentSessionCard key={idx} session={session} />
          ))
        ) : (
          <Card style={styles.emptySessionsCard}>
            <Text style={styles.emptySessionsText}>
              {t("home.noSessions")}
            </Text>
          </Card>
        )}
      </View>

      {/* Meta mensual */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("home.monthlyGoal")}</Text>
        <Card style={styles.goalCard}>
          <View style={styles.goalRow}>
            <View style={styles.goalCircleTrack}>
              <View style={styles.goalCircleInner}>
                <Text style={styles.goalCirclePct}>{Math.round(monthProgress * 100)}%</Text>
              </View>
            </View>
            <View style={styles.goalRight}>
              <Text style={styles.goalCount}>
                {monthSessions}/{monthGoal}
              </Text>
              <Text style={styles.goalSub}>{t("home.monthlyGoalSub", { done: monthSessions, total: monthGoal })}</Text>
              <View style={styles.goalProgressBar}>
                <View style={[styles.goalProgressFill, { width: `${Math.round(monthProgress * 100)}%` as `${number}%` }]} />
              </View>
            </View>
          </View>
        </Card>
      </View>

      {/* Acciones rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("home.quickActions")}</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={[styles.quickTile, styles.quickTileTabata]}
            onPress={() => router.push("/tabata" as never)}
            testID="quick-tabata"
          >
            <View style={[styles.quickIconBg, styles.quickIconBgTabata]}>
              <Text style={styles.quickIcon}>⏱</Text>
            </View>
            <Text style={styles.quickLabel}>{t("home.quickTabata")}</Text>
            <Text style={styles.quickSub}>{t("home.quickTabataSub")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickTile, styles.quickTileRegister]}
            onPress={() => router.push("/register-workout" as never)}
            testID="quick-register"
          >
            <View style={[styles.quickIconBg, styles.quickIconBgRegister]}>
              <Text style={styles.quickIcon}>📝</Text>
            </View>
            <Text style={styles.quickLabel}>{t("home.quickRegister")}</Text>
            <Text style={styles.quickSub}>{t("home.quickRegisterSub")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickTile, styles.quickTileNewRoutine]}
            onPress={() => router.push("/routine/new" as never)}
            testID="quick-new-routine"
          >
            <View style={[styles.quickIconBg, styles.quickIconBgNewRoutine]}>
              <Text style={styles.quickIcon}>➕</Text>
            </View>
            <Text style={styles.quickLabel}>{t("home.quickNewRoutine")}</Text>
            <Text style={styles.quickSub}>{t("home.quickNewRoutineSub")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickTile, styles.quickTileProgress]}
            onPress={() => router.push("/(tabs)/progress" as never)}
            testID="quick-progress"
          >
            <View style={[styles.quickIconBg, styles.quickIconBgProgress]}>
              <Text style={styles.quickIcon}>📈</Text>
            </View>
            <Text style={styles.quickLabel}>{t("home.quickProgress")}</Text>
            <Text style={styles.quickSub}>{t("home.quickProgressSub")}</Text>
          </TouchableOpacity>
          {hasCoach && (
            <TouchableOpacity
              style={styles.quickTile}
              onPress={() => router.push("/live-sessions" as never)}
              testID="quick-live-sessions"
            >
              <View style={styles.quickIconBg}>
                <Text style={styles.quickIcon}>📹</Text>
              </View>
              <Text style={styles.quickLabel}>{t("home.quickLiveSessions")}</Text>
              <Text style={styles.quickSub}>{t("home.quickLiveSessionsSub")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Mensaje del coach */}
      {hasCoach && activeAssignment && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("home.coachMessage")}</Text>
          <CoachMessageCard coachId={activeAssignment.coach_id} />
        </View>
      )}
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
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing[6],
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  displayName: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize.screenTitle,
    letterSpacing: -1,
    textTransform: "uppercase",
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.lime,
    backgroundColor: colors.surface3,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing[3],
  },
  headerAvatarText: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: 22,
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
  // Racha semanal
  streakCard: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing[3],
  },
  streakHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  streakCount: { fontFamily: typography.mono, color: colors.lime, fontSize: fontSize.sm, fontWeight: "700" },
  streakGrid: { flexDirection: "row", gap: spacing[1] },
  streakDayCol: { flex: 1, alignItems: "center", gap: spacing[1] },
  streakDayBox: { width: 32, height: 32, borderRadius: radius.md, backgroundColor: colors.surface3, alignItems: "center", justifyContent: "center" },
  streakDayBoxActive: { backgroundColor: colors.lime },
  streakDayCheck: { fontFamily: typography.body, color: colors.black, fontSize: fontSize.sm, fontWeight: "700" },
  streakDayLabel: { fontFamily: typography.body, color: colors.muted, fontSize: fontSize.xs, fontWeight: "600" },
  streakDayLabelActive: { color: colors.text },
  // Banner contextual
  banner: { borderRadius: radius.lg, padding: spacing[3], marginBottom: spacing[4], flexDirection: "row", alignItems: "center" },
  bannerCoach: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  bannerCoachAvatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.limeGlow,
    borderWidth: 2,
    borderColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing[3],
  },
  bannerCoachAvatarText: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: 18,
  },
  bannerPro: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.info },
  bannerFree: { backgroundColor: colors.limeGlow, borderWidth: 1, borderColor: colors.lime },
  bannerTextCol: { flex: 1 },
  bannerCoachLabel: { fontFamily: typography.body, color: colors.muted, fontSize: fontSize.xs, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 },
  bannerCoachName: { fontFamily: typography.body, color: colors.text, fontSize: fontSize.md, fontWeight: "700" },
  bannerCoachChatBtn: {
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    marginLeft: spacing[2],
  },
  bannerCoachChatBtnText: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  bannerProTitle: { fontFamily: typography.body, color: colors.info, fontSize: fontSize.sm, fontWeight: "700", marginBottom: 2 },
  bannerProSub: { fontFamily: typography.body, color: colors.muted, fontSize: fontSize.sm },
  bannerFreeTitle: { fontFamily: typography.body, color: colors.lime, fontSize: fontSize.sm, fontWeight: "700", marginBottom: 2 },
  bannerFreeSub: { fontFamily: typography.body, color: colors.muted, fontSize: fontSize.sm },
  bannerArrow: { fontFamily: typography.body, color: colors.muted, fontSize: 20, marginLeft: spacing[2] },
  // Rutina de hoy
  routineCard: {
    gap: spacing[2],
    paddingTop: spacing[5],
    borderColor: colors.limeGlow,
  },
  routineName: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: 22,
    letterSpacing: -0.5,
    textTransform: "uppercase",
  },
  routineStatsRow: {
    flexDirection: "row",
    gap: spacing[2],
    marginTop: spacing[2],
  },
  routineStatPill: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing[2],
    alignItems: "center",
  },
  routineStatValue: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: 17,
    fontWeight: "700",
  },
  routineStatLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  routinePreviewList: {
    marginTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing[3],
    gap: spacing[2],
  },
  routinePreviewTitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  routinePreviewRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
  },
  routinePreviewIndex: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: "center",
    textAlignVertical: "center",
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: 12,
    lineHeight: 22,
    fontWeight: "700",
  },
  routinePreviewInfo: {
    flex: 1,
  },
  routinePreviewName: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  routinePreviewMeta: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  routinePreviewMore: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 36,
  },
  routineCta: {
    marginTop: spacing[3],
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  routineCtaText: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: 16,
    letterSpacing: 0.5,
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
  // Frase del día
  quoteCard: { gap: spacing[2] },
  quoteText: { fontFamily: typography.body, color: colors.text, fontSize: fontSize.md, fontStyle: "italic", lineHeight: 22 },
  quoteAuthor: { fontFamily: typography.body, color: colors.lime, fontSize: fontSize.sm, fontWeight: "700" },
  quoteSport: { fontFamily: typography.body, color: colors.muted, fontSize: fontSize.xs },
  // Meta mensual — círculo visual
  goalCard: { gap: spacing[2] },
  goalRow: { flexDirection: "row", alignItems: "center", gap: spacing[4] },
  goalCircleTrack: {
    width: 76,
    height: 76,
    borderRadius: radius.full,
    borderWidth: 6,
    borderColor: colors.surface3,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  goalCircleInner: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    borderWidth: 6,
    borderColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  goalCirclePct: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  goalRight: { flex: 1 },
  goalCount: { fontFamily: typography.mono, color: colors.lime, fontSize: fontSize.xl, fontWeight: "700" },
  goalSub: { fontFamily: typography.body, color: colors.muted, fontSize: fontSize.sm, marginTop: 2, marginBottom: spacing[2] },
  goalProgressBar: { height: 4, backgroundColor: colors.surface3, borderRadius: radius.full, overflow: "hidden" },
  goalProgressFill: { height: 4, backgroundColor: colors.lime, borderRadius: radius.full },
  // Acciones rápidas
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing[3] },
  quickTile: { width: "47%", backgroundColor: colors.surface2, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing[4], gap: spacing[1] },
  quickTileTabata: { borderColor: colors.limeGlow },
  quickTileRegister: { borderColor: "rgba(68,136,255,0.2)" },
  quickTileNewRoutine: { borderColor: "rgba(255,136,64,0.2)" },
  quickTileProgress: { borderColor: "rgba(167,139,250,0.2)" },
  quickIconBg: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surface3,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[1],
  },
  quickIconBgTabata: { backgroundColor: colors.limeGlow },
  quickIconBgRegister: { backgroundColor: "rgba(68,136,255,0.12)" },
  quickIconBgNewRoutine: { backgroundColor: "rgba(255,136,64,0.12)" },
  quickIconBgProgress: { backgroundColor: "rgba(167,139,250,0.12)" },
  quickIcon: { fontSize: 20 },
  quickLabel: { fontFamily: typography.body, color: colors.text, fontSize: fontSize.md, fontWeight: "700" },
  quickSub: { fontFamily: typography.body, color: colors.muted, fontSize: fontSize.xs },
  // Coach message
  coachMsgCard: { gap: spacing[3] },
  coachMsgRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing[3] },
  coachMsgAvatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.limeGlow,
    borderWidth: 2,
    borderColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  coachMsgAvatarText: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: 18,
  },
  coachMsgBody: { fontFamily: typography.body, color: colors.text, fontSize: fontSize.md, lineHeight: 20, flex: 1 },
  coachMsgBtn: { backgroundColor: colors.lime, borderRadius: radius.md, paddingVertical: spacing[3], alignItems: "center" },
  coachMsgBtnText: { fontFamily: typography.heading, color: colors.black, fontSize: fontSize.base, letterSpacing: 0.5 },
});
