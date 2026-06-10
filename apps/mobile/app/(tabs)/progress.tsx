import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import { useWorkoutStore } from "@/stores/workoutStore";
import { EmptyState, Card } from "@forzza/ui/native";
import { colors, spacing, typography } from "@forzza/ui/tokens";

interface CompletedSessionEntry {
  client_uuid: string;
  routine_name: string;
  started_at: string;
  finished_at: string;
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

function formatDuration(startedAt: string, finishedAt: string): string {
  const diff = new Date(finishedAt).getTime() - new Date(startedAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours}h ${remaining}min`;
}

function SessionItem({ session }: { session: CompletedSessionEntry }) {
  const date = new Date(session.started_at).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const duration = formatDuration(session.started_at, session.finished_at);

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
          {session.total_sets} {session.total_sets === 1 ? "serie" : "series"}
        </Text>
      </View>
    </Card>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function ProGatedCard({ title }: { title: string }) {
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

export default function ProgressTab() {
  const { user: _user } = useAuth();
  const syncQueue = useWorkoutStore((s) => s.syncQueue);

  // Build list of completed sessions from local sync queue
  const completedSessions: CompletedSessionEntry[] = syncQueue
    .filter((item) => item.payload?.status === "completed")
    .map((item) => ({
      client_uuid: item.client_uuid,
      routine_name: item.payload?.routine_name ?? "Entreno",
      started_at: item.payload?.started_at ?? new Date().toISOString(),
      finished_at: item.payload?.finished_at ?? new Date().toISOString(),
      total_sets: (item.payload?.exercises ?? []).reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc: number, ex: any) => acc + (ex.sets?.length ?? 0),
        0
      ),
    }))
    .sort(
      (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    );

  const weekCount = sessionsThisWeek(completedSessions);
  const streak = calcStreak(completedSessions);
  const lastFive = completedSessions.slice(0, 5);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Tu Progreso</Text>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statCell}>
          <StatCard label="Esta semana" value={weekCount} />
        </View>
        <View style={styles.statCell}>
          <StatCard label={streak === 1 ? "Día seguido" : "Días seguidos"} value={streak} />
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
      </View>

      {/* PRO gated features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Funciones Pro</Text>
        <ProGatedCard title="Métricas corporales" />
        <View style={styles.sectionGap} />
        <ProGatedCard title="Fotos de progreso" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.black,
  },
  content: {
    padding: spacing[4],
    paddingTop: spacing[12],
    paddingBottom: spacing[8],
  },
  screenTitle: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: 32,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: spacing[5],
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
    fontSize: 42,
    fontWeight: "700",
  },
  statLabel: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: 13,
    marginTop: spacing[1],
    textAlign: "center",
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
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
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  sessionDate: {
    fontFamily: typography.body,
    color: colors.gray500,
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
    color: colors.gray500,
    fontSize: 13,
  },
  sessionMetaDot: {
    color: colors.gray700,
    fontSize: 13,
  },
  proCard: {
    alignItems: "center",
    paddingVertical: spacing[6],
    borderStyle: "dashed",
    borderColor: colors.gray700,
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
    color: colors.gray600,
    fontSize: 13,
    textAlign: "center",
  },
});
