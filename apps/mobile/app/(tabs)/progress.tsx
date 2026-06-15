import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/providers/AuthProvider";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useEntitlements } from "@/hooks/useEntitlements";
import { EmptyState, Card, UpgradeModal } from "@forzza/ui/native";
import { colors, fontSize, spacing, radius, typography } from "@forzza/ui/tokens";

const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

interface CompletedSessionEntry {
  client_uuid: string;
  routine_name: string;
  started_at: string;
  completed_at: string; // columna real: completed_at (no finished_at)
  total_sets: number;
}

function calcStreak(sessions: CompletedSessionEntry[]): number {
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

function sessionsThisWeek(sessions: CompletedSessionEntry[]): number {
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

function SessionItem({ session }: { session: CompletedSessionEntry }): React.JSX.Element {
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
          {" "}{session.total_sets === 1 ? "serie" : "series"}
        </Text>
      </View>
    </Card>
  );
}

function StatCard({ label, value, featured = false }: { label: string; value: string | number; featured?: boolean }): React.JSX.Element {
  return (
    <Card style={styles.statCard} featured={featured}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function ProGatedCard({ title }: { title: string }): React.JSX.Element {
  return (
    <Card style={styles.proCard}>
      <Text style={styles.proLockIcon}>🔒</Text>
      <Text style={styles.proTitle}>{title}</Text>
      <Text style={styles.proDescription}>
        Función disponible en el plan Pro. Próximamente.
      </Text>
    </Card>
  );
}

export default function ProgressTab(): React.JSX.Element {
  useAuth(); // ensure auth context is available
  const syncQueue = useWorkoutStore((s) => s.syncQueue);
  const { isPro } = useEntitlements();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
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

  const tenDaysAgo = new Date(Date.now() - TEN_DAYS_MS);

  // Build list of completed sessions from local sync queue
  const allCompletedSessions: CompletedSessionEntry[] = syncQueue
    .filter((item) => item.payload?.status === "completed")
    .map((item) => ({
      client_uuid: item.client_uuid,
      routine_name: item.payload?.routine_name ?? "Entreno",
      started_at: item.payload?.started_at ?? new Date().toISOString(),
      completed_at: item.payload?.completed_at ?? new Date().toISOString(), // columna real
      total_sets: (item.payload?.sets_data ?? []).reduce( // columna real: sets_data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc: number, ex: any) => acc + (ex.sets?.length ?? 0),
        0
      ),
    }))
    .sort(
      (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
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

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing[2] }]}>
      <Text style={styles.screenTitle}>Tu Progreso</Text>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statCell}>
          <StatCard label="Esta semana" value={weekCount} featured={weekCount > 0} />
        </View>
        <View style={styles.statCell}>
          <StatCard
            label={streak === 1 ? "Día seguido" : "Días seguidos"}
            value={streak}
            featured={streak > 1}
          />
        </View>
      </View>

      {/* Last sessions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimos 5 entrenos</Text>
        {lastFive.length === 0 ? (
          <EmptyState
            title="Todavía no completaste ningún entreno"
            description="Cuando termines tu primer entreno, vas a ver tus estadísticas acá."
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
            <Text style={styles.historyBannerTitle}>Ver historial completo</Text>
            <Text style={styles.historyBannerSub}>
              Tu historial gratis muestra los últimos 10 días. Actualizá al plan PRO para acceder a todo.
            </Text>
            <Text style={styles.historyBannerCta}>Ver planes →</Text>
          </Pressable>
        )}
      </View>

      {/* PRO gated features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Funciones Pro</Text>
        <ProGatedCard title="Métricas corporales" />
        <View style={styles.sectionGap} />
        <ProGatedCard title="Fotos de progreso" />
      </View>

      <UpgradeModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          // TODO: deep-link to upgrade page when mobile linking is set up
        }}
        feature="historial completo de sesiones"
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
  screenTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize.screenTitle,
    fontWeight: "900",
    letterSpacing: -1,
    textTransform: "uppercase",
    marginBottom: spacing[5],
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  statCell: {
    flex: 1,
  },
  statCard: {
    alignItems: "center",
    paddingVertical: spacing[5],
  },
  statValue: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -1,
  },
  statLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 13,
    marginTop: spacing[1],
    textAlign: "center",
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
    backgroundColor: colors.surface,
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
    fontWeight: "900",
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
