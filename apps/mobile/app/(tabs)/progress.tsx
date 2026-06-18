import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useEntitlements } from "@/hooks/useEntitlements";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import {
  completedSessionsFromQueue,
  fetchCompletedWorkoutSessions,
  mergeCompletedWorkoutSessions,
  type CompletedWorkoutSession,
} from "@/services/workoutHistory";
import { EmptyState, ErrorState, Card, UpgradeModal, LineChart } from "@forzza/ui/native";
import { colors, fontSize, spacing, radius, typography } from "@forzza/ui/tokens";

// ─── Coach Feedback ───────────────────────────────────────────────────────────

type FeedbackTargetType = "metric" | "photo";

interface CoachFeedbackItem {
  id: string;
  coach_id: string;
  target_type: FeedbackTargetType;
  target_id: string;
  feedback_text: string;
  created_at: string;
  coach_display_name: string | null;
}

function CoachFeedbackSection({ userId }: { userId: string }): React.JSX.Element {
  const { t } = useTranslation();

  const {
    data: feedbackItems = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<CoachFeedbackItem[]>({
    queryKey: ["coach_feedback", userId],
    queryFn: async (): Promise<CoachFeedbackItem[]> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("coach_feedback")
        .select(
          "id, coach_id, target_type, target_id, feedback_text, created_at, coach_profiles!coach_feedback_coach_id_fkey(display_name)"
        )
        .eq("student_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      return ((data ?? []) as Array<{
        id: string;
        coach_id: string;
        target_type: FeedbackTargetType;
        target_id: string;
        feedback_text: string;
        created_at: string;
        coach_profiles: { display_name: string } | null;
      }>).map((row) => ({
        id: row.id,
        coach_id: row.coach_id,
        target_type: row.target_type,
        target_id: row.target_id,
        feedback_text: row.feedback_text,
        created_at: row.created_at,
        coach_display_name: row.coach_profiles?.display_name ?? null,
      }));
    },
    enabled: !!userId,
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <ActivityIndicator
        color={colors.lime}
        style={{ marginVertical: spacing[4] }}
        testID="coach-feedback-loading"
      />
    );
  }

  if (isError) {
    return (
      <ErrorState
        title={t("common.error")}
        description={t("common.noConnection")}
        onRetry={() => { void refetch(); }}
      />
    );
  }

  if (feedbackItems.length === 0) {
    return (
      <EmptyState
        title={t("coachFeedback.noFeedback")}
        description=""
        icon="💬"
      />
    );
  }

  return (
    <View style={feedbackStyles.list} testID="coach-feedback-list">
      {feedbackItems.map((item) => (
        <Card key={item.id} style={feedbackStyles.card} testID={`coach-feedback-item-${item.id}`}>
          <View style={feedbackStyles.header}>
            {item.coach_display_name ? (
              <Text style={feedbackStyles.coachName}>{item.coach_display_name}</Text>
            ) : null}
            <View style={feedbackStyles.targetBadge}>
              <Text style={feedbackStyles.targetBadgeText}>
                {t("coachFeedback.on")}{" "}
                {item.target_type === "metric"
                  ? t("coachFeedback.targetMetric")
                  : t("coachFeedback.targetPhoto")}
              </Text>
            </View>
          </View>
          <Text style={feedbackStyles.text}>{item.feedback_text}</Text>
          <Text style={feedbackStyles.date}>
            {new Date(item.created_at).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </Card>
      ))}
    </View>
  );
}

const feedbackStyles = StyleSheet.create({
  list: {
    gap: spacing[3],
  },
  card: {
    gap: spacing[2],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[2],
  },
  coachName: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.sm,
    fontWeight: "700",
    flex: 1,
  },
  targetBadge: {
    backgroundColor: colors.surface3,
    borderRadius: radius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  targetBadgeText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  text: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    lineHeight: 22,
  },
  date: {
    fontFamily: typography.mono,
    color: colors.muted,
    fontSize: fontSize.xs,
  },
});

const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

function calcStreak(sessions: CompletedWorkoutSession[]): number {
  if (sessions.length === 0) return 0;

  const sortedDates = sessions
    .map((s) => new Date(s.started_at).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i) // unique dates
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);

  for (const dateStr of sortedDates) {
    const sessionDate = new Date(dateStr);
    const diff = Math.floor(
      (checkDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0 || diff === 1) {
      streak++;
      checkDate = sessionDate;
    } else {
      break;
    }
  }

  return streak;
}

function sessionsThisWeek(sessions: CompletedWorkoutSession[]): number {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  return sessions.filter((s) => new Date(s.started_at) >= startOfWeek).length;
}

function formatDuration(startedAt: string, completedAt: string): string {
  const diff = new Date(completedAt).getTime() - new Date(startedAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours}h ${remaining}min`;
}

function SessionItem({ session }: { session: CompletedWorkoutSession }): React.JSX.Element {
  const { t } = useTranslation();
  const date = new Date(session.started_at).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const duration = formatDuration(session.started_at, session.completed_at);

  return (
    <Card style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionName}>{session.routine_name}</Text>
        <Text style={styles.sessionDate}>{date}</Text>
      </View>
      <View style={styles.sessionMeta}>
        <Text style={styles.sessionMetaItem}>{duration}</Text>
        <Text style={styles.sessionMetaDot}>·</Text>
        <Text style={styles.sessionMetaItem}>
          <Text style={styles.sessionMetaMono}>{session.total_sets}</Text>
          {" "}{t("progress.series", { count: session.total_sets })}
        </Text>
      </View>
    </Card>
  );
}

function ProGatedCard({ title }: { title: string }): React.JSX.Element {
  const { t } = useTranslation();
  return (
    <Card style={styles.proCard}>
      <Text style={styles.proLockIcon}>🔒</Text>
      <Text style={styles.proTitle}>{title}</Text>
      <Text style={styles.proDescription}>
        {t("progress.proGated_desc")}
      </Text>
    </Card>
  );
}

interface BodyMetric {
  id: string;
  weight_g: number;
  body_fat_pct: number | null;
  recorded_at: string;
}

function BodyMetricsCard({ userId, isPro: userIsPro }: { userId: string; isPro: boolean }): React.JSX.Element {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [weightKg, setWeightKg] = useState("");
  const [bodyFatPct, setBodyFatPct] = useState("");
  const [savingMetrics, setSavingMetrics] = useState(false);

  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

  const {
    data: metrics = [],
    isLoading: metricsLoading,
    isError: metricsError,
  } = useQuery<BodyMetric[]>({
    queryKey: ["body-metrics", userId, userIsPro ? "pro" : "free"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from("body_metrics")
        .select("id, weight_g, body_fat_pct, recorded_at")
        .eq("student_id", userId)
        .order("recorded_at", { ascending: false })
        .limit(10);

      if (!userIsPro) {
        query = query.gte("recorded_at", tenDaysAgo.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as BodyMetric[];
    },
    enabled: !!userId,
    staleTime: 30 * 1000,
  });

  async function handleSaveMetric() {
    if (!weightKg.trim()) return;
    const kg = parseFloat(weightKg);
    if (isNaN(kg) || kg <= 0) return;

    setSavingMetrics(true);
    try {
      const fat = bodyFatPct.trim() ? parseFloat(bodyFatPct) : null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("body_metrics")
        .insert({
          student_id: userId,
          weight_g: Math.round(kg * 1000),
          body_fat_pct: fat !== null && !isNaN(fat) ? Math.round(fat * 10) : null,
          recorded_at: new Date().toISOString(),
        });
      if (error) throw error;
      setWeightKg("");
      setBodyFatPct("");
      void queryClient.invalidateQueries({ queryKey: ["body-metrics", userId] });
    } catch {
      // silent — user can retry
    } finally {
      setSavingMetrics(false);
    }
  }

  const chartData = metrics
    .slice()
    .reverse()
    .map((m) => m.weight_g / 1000);

  return (
    <Card style={metricsStyles.card}>
      <Text style={metricsStyles.sectionTitle}>{t("bodyMetrics.sectionTitle")}</Text>

      {metricsLoading && (
        <ActivityIndicator color={colors.lime} style={metricsStyles.loader} />
      )}

      {metricsError && !metricsLoading && (
        <ErrorState
          title={t("bodyMetrics.error_title")}
          description={t("bodyMetrics.error_desc")}
        />
      )}

      {!metricsLoading && !metricsError && chartData.length === 0 && (
        <Text style={metricsStyles.emptyText}>{t("bodyMetrics.empty_desc")}</Text>
      )}

      {!metricsLoading && !metricsError && chartData.length > 0 && (
        <>
          <Text style={metricsStyles.chartTitle}>{t("bodyMetrics.chartTitle")}</Text>
          <LineChart
            data={chartData}
            height={100}
            color={colors.lime}
            showDots
            style={metricsStyles.chart}
          />
        </>
      )}

      {/* Input form */}
      <View style={metricsStyles.inputRow}>
        <View style={metricsStyles.inputGroup}>
          <Text style={metricsStyles.inputLabel}>{t("bodyMetrics.weightKg")}</Text>
          <TextInput
            style={metricsStyles.input}
            value={weightKg}
            onChangeText={setWeightKg}
            keyboardType="decimal-pad"
            returnKeyType="done"
            placeholder="70.5"
            placeholderTextColor={colors.gray600}
            testID="body-metrics-weight-input"
          />
        </View>
        <View style={metricsStyles.inputGroup}>
          <Text style={metricsStyles.inputLabel}>{t("bodyMetrics.bodyFatPct")}</Text>
          <TextInput
            style={metricsStyles.input}
            value={bodyFatPct}
            onChangeText={setBodyFatPct}
            keyboardType="decimal-pad"
            returnKeyType="done"
            placeholder="15.4"
            placeholderTextColor={colors.gray600}
            testID="body-metrics-fat-input"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[metricsStyles.saveBtn, savingMetrics && metricsStyles.saveBtnDisabled]}
        onPress={() => { void handleSaveMetric(); }}
        disabled={savingMetrics || !weightKg.trim()}
        testID="body-metrics-save-btn"
      >
        {savingMetrics
          ? <ActivityIndicator color={colors.bg} size="small" />
          : <Text style={metricsStyles.saveBtnText}>
              {savingMetrics ? t("bodyMetrics.saving") : t("bodyMetrics.save")}
            </Text>
        }
      </TouchableOpacity>
    </Card>
  );
}

const metricsStyles = StyleSheet.create({
  card: {
    padding: spacing[4],
  },
  sectionTitle: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: "700",
    marginBottom: spacing[3],
  },
  chartTitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: spacing[2],
  },
  chart: {
    marginBottom: spacing[4],
  },
  loader: {
    marginVertical: spacing[4],
  },
  emptyText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    marginBottom: spacing[3],
  },
  inputRow: {
    flexDirection: "row",
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    marginBottom: spacing[1],
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surface3,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[3],
    color: colors.text,
    fontFamily: typography.mono,
    fontSize: fontSize.base,
    textAlign: "center",
    minHeight: 44,
  },
  saveBtn: {
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    fontFamily: typography.body,
    color: colors.bg,
    fontSize: fontSize.base,
    fontWeight: "700",
  },
});

type ProgressTabType = "graficos" | "medidas" | "historial";

export default function ProgressTab(): React.JSX.Element {
  const { t } = useTranslation();
  const { user } = useAuth();
  const syncQueue = useWorkoutStore((s) => s.syncQueue);
  const { isPro } = useEntitlements();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [progressTab, setProgressTab] = useState<ProgressTabType>("graficos");
  const [storeHydrated, setStoreHydrated] = useState(
    () => useWorkoutStore.persist.hasHydrated()
  );
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (storeHydrated) return;
    return useWorkoutStore.persist.onFinishHydration(() => {
      setStoreHydrated(true);
    });
  }, [storeHydrated]);

  const { data: remoteCompletedSessions = [] } = useQuery({
    queryKey: ["completed-workout-sessions", user?.id, isPro ? "pro" : "free"],
    queryFn: () => fetchCompletedWorkoutSessions(user!.id, isPro ? 365 : 30),
    enabled: !!user?.id,
    staleTime: 60 * 1000,
  });

  const tenDaysAgo = new Date(Date.now() - TEN_DAYS_MS);
  const localCompletedSessions = completedSessionsFromQueue(syncQueue, user?.id);
  const allCompletedSessions = mergeCompletedWorkoutSessions(
    remoteCompletedSessions,
    localCompletedSessions
  );

  // Free users: only show sessions from last 10 days (NEVER delete — filter only)
  const completedSessions = isPro
    ? allCompletedSessions
    : allCompletedSessions.filter(
        (s) => new Date(s.started_at) >= tenDaysAgo
      );

  const weekCount = sessionsThisWeek(completedSessions);
  const streak = calcStreak(completedSessions);
  const lastFive = completedSessions.slice(0, 5);

  if (!storeHydrated) {
    return (
      <View style={[styles.scroll, styles.loadingContainer, { paddingTop: insets.top + spacing[2] }]}>
        <ActivityIndicator color={colors.lime} size="large" />
      </View>
    );
  }

  const TABS: { key: ProgressTabType; label: string }[] = [
    { key: "graficos", label: t("progress.tabGraficos") },
    { key: "medidas", label: t("progress.tabMedidas") },
    { key: "historial", label: t("progress.tabHistorial") },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing[2] }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>{t("progress.title")}</Text>
        <Text style={styles.screenSubtitle}>{t("progress.subtitle", { count: completedSessions.length })}</Text>
      </View>

      {/* Stats pills */}
      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Text style={styles.statPillValue}>{weekCount}</Text>
          <Text style={styles.statPillLabel}>{t("progress.thisWeek").toUpperCase()}</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={styles.statPillValue}>{streak}</Text>
          <Text style={styles.statPillLabel}>{t("progress.streakDay", { count: streak }).toUpperCase()}</Text>
        </View>
      </View>

      {/* Tabs visuales */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabBtn, progressTab === tab.key && styles.tabBtnActive]}
            onPress={() => setProgressTab(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabBtnText, progressTab === tab.key && styles.tabBtnTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab: Gráficos */}
      {progressTab === "graficos" && (
        <>
          {/* Last sessions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("progress.last5Workouts")}</Text>
            {lastFive.length === 0 ? (
              <EmptyState
                title={t("progress.empty_title")}
                description={t("progress.empty_desc")}
                icon="📊"
              />
            ) : (
              lastFive.map((session) => (
                <SessionItem key={session.client_uuid} session={session} />
              ))
            )}

            {/* Free-user history promo banner */}
            {!isPro && (
              <Pressable
                style={styles.historyBanner}
                onPress={() => setShowUpgradeModal(true)}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <Text style={styles.historyBannerTitle}>{t("progress.historyBanner_title")}</Text>
                <Text style={styles.historyBannerSub}>
                  {t("progress.historyBanner_sub")}
                </Text>
                <Text style={styles.historyBannerCta}>{t("progress.historyBanner_cta")}</Text>
              </Pressable>
            )}
          </View>

          {/* Progress photos — PRO only */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("progress.progressPhotos")}</Text>
            {isPro ? (
              <Pressable
                style={styles.photosCard}
                onPress={() => router.push("/progress-photos")}
                testID="progress-photos-link"
              >
                <Text style={styles.photosCardText}>{t("progress.progressPhotos")}</Text>
                <Text style={styles.photosCardArrow}>›</Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.proCard}
                onPress={() => setShowUpgradeModal(true)}
                testID="progress-photos-upgrade"
              >
                <ProGatedCard title={t("progress.progressPhotos")} />
              </Pressable>
            )}
          </View>
        </>
      )}

      {/* Tab: Medidas */}
      {progressTab === "medidas" && user?.id && (
        <View style={styles.section}>
          <BodyMetricsCard userId={user.id} isPro={isPro} />
        </View>
      )}

      {/* Tab: Historial */}
      {progressTab === "historial" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("progress.last5Workouts")}</Text>
          {lastFive.length === 0 ? (
            <EmptyState
              title={t("progress.empty_title")}
              description={t("progress.empty_desc")}
              icon="📊"
            />
          ) : (
            lastFive.map((session) => (
              <SessionItem key={session.client_uuid} session={session} />
            ))
          )}
        </View>
      )}

      {/* Coach feedback — shown in graficos tab */}
      {progressTab === "graficos" && user?.id && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("coachFeedback.sectionTitle")}</Text>
          <CoachFeedbackSection userId={user.id} />
        </View>
      )}

      <UpgradeModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          // TODO: deep-link to upgrade page when mobile linking is set up
        }}
        feature={t("progress.upgradeFeature")}
      />
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
    paddingBottom: spacing[8],
  },
  headerRow: {
    marginBottom: spacing[4],
  },
  screenTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize.screenTitle,
    letterSpacing: -1,
    textTransform: "uppercase",
  },
  screenSubtitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // Stats pills
  statsRow: {
    flexDirection: "row",
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  statPill: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[3],
    alignItems: "center",
  },
  statPillValue: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -1,
  },
  statPillLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    letterSpacing: 1,
    marginTop: spacing[1],
    textAlign: "center",
  },
  // Tabs
  tabsRow: {
    flexDirection: "row",
    gap: spacing[2],
    marginBottom: spacing[5],
  },
  tabBtn: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    paddingVertical: spacing[2],
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtnActive: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  tabBtnText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  tabBtnTextActive: {
    color: colors.black,
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
  sectionGap: {
    height: spacing[3],
  },
  sessionCard: {
    marginBottom: spacing[3],
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing[2],
  },
  sessionName: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  sessionDate: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 13,
    flexShrink: 0,
    marginLeft: spacing[2],
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  sessionMetaItem: {
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
  historyBanner: {
    backgroundColor: colors.limeGlow,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lime,
    padding: spacing[4],
    marginTop: spacing[3],
  },
  historyBannerTitle: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: 20,
    letterSpacing: -0.5,
    marginBottom: spacing[2],
  },
  historyBannerSub: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: spacing[3],
  },
  historyBannerCta: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: 14,
    fontWeight: "700",
  },
  photosCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lime,
    padding: spacing[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  photosCardText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  photosCardArrow: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: 20,
  },
  proCard: {
    alignItems: "center",
    paddingVertical: spacing[6],
    borderStyle: "dashed",
    borderColor: colors.border,
  },
  proLockIcon: {
    fontSize: 32,
    marginBottom: spacing[2],
  },
  proTitle: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing[1],
  },
  proDescription: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 13,
    textAlign: "center",
  },
});
