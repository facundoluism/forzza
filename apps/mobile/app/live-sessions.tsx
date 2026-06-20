import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { useEntitlements } from "@/hooks/useEntitlements";
import { supabase } from "@/lib/supabase";
import { EmptyState, ErrorState, ScreenHeader } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

type LiveSessionStatus = "scheduled" | "completed" | "canceled";

interface LiveSession {
  id: string;
  coach_id: string;
  student_id: string;
  assignment_id: string | null;
  title: string;
  scheduled_at: string;
  room_url: string | null;
  status: LiveSessionStatus;
  // joined
  coach_display_name: string | null;
}

function formatSessionDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatSessionTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isUpcoming(scheduledAt: string): boolean {
  return new Date(scheduledAt) > new Date();
}

function StatusPill({ status }: { status: LiveSessionStatus }): React.JSX.Element {
  const { t } = useTranslation();
  const labelKey =
    status === "scheduled"
      ? "liveSessions.statusScheduled"
      : status === "completed"
      ? "liveSessions.statusCompleted"
      : "liveSessions.statusCanceled";

  const pillColor =
    status === "scheduled"
      ? colors.info
      : status === "completed"
      ? colors.success
      : colors.muted;

  return (
    <View style={[statusStyles.pill, { borderColor: pillColor }]}>
      <Text style={[statusStyles.pillText, { color: pillColor }]}>{t(labelKey)}</Text>
    </View>
  );
}

const statusStyles = StyleSheet.create({
  pill: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  pillText: {
    fontFamily: typography.body,
    fontSize: fontSize.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

function SessionCard({ session }: { session: LiveSession }): React.JSX.Element {
  const { t } = useTranslation();
  const upcoming = session.status === "scheduled" && isUpcoming(session.scheduled_at);

  async function handleJoin() {
    if (!session.room_url) return;
    const canOpen = await Linking.canOpenURL(session.room_url);
    if (!canOpen) {
      Alert.alert(t("common.error"), t("common.noConnection"));
      return;
    }
    await Linking.openURL(session.room_url);
  }

  return (
    <View
      style={[cardStyles.card, !upcoming && cardStyles.cardPast]}
      testID={`live-session-card-${session.id}`}
    >
      <View style={cardStyles.header}>
        <Text style={cardStyles.title} numberOfLines={2}>
          {session.title}
        </Text>
        <StatusPill status={session.status} />
      </View>

      {session.coach_display_name ? (
        <Text style={cardStyles.coachName}>{session.coach_display_name}</Text>
      ) : null}

      <Text style={cardStyles.dateTime}>
        {formatSessionDate(session.scheduled_at)} · {formatSessionTime(session.scheduled_at)}
      </Text>

      {upcoming && session.room_url ? (
        <TouchableOpacity
          style={cardStyles.joinBtn}
          onPress={() => { void handleJoin(); }}
          testID={`live-session-join-${session.id}`}
          activeOpacity={0.8}
        >
          <Text style={cardStyles.joinBtnText}>{t("liveSessions.join")}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  cardPast: {
    opacity: 0.6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing[2],
  },
  title: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: "700",
    flex: 1,
  },
  coachName: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  dateTime: {
    fontFamily: typography.mono,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  joinBtn: {
    backgroundColor: colors.limeGlow,
    borderWidth: 1,
    borderColor: `${colors.lime}60`,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
    marginTop: spacing[1],
  },
  joinBtnText: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: fontSize.base,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function LiveSessionsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { hasCoach, isLoading: entitlementsLoading } = useEntitlements();

  const {
    data: sessions = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<LiveSession[]>({
    queryKey: ["live_sessions", user?.id],
    queryFn: async (): Promise<LiveSession[]> => {
      if (!user) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("live_sessions")
        .select(
          "id, coach_id, student_id, assignment_id, title, scheduled_at, room_url, status, coach_profiles!live_sessions_coach_id_fkey(display_name)"
        )
        .eq("student_id", user.id)
        .order("scheduled_at", { ascending: false });

      if (error) throw error;

      return ((data ?? []) as Array<{
        id: string;
        coach_id: string;
        student_id: string;
        assignment_id: string | null;
        title: string;
        scheduled_at: string;
        room_url: string | null;
        status: LiveSessionStatus;
        coach_profiles: { display_name: string } | null;
      }>).map((row) => ({
        id: row.id,
        coach_id: row.coach_id,
        student_id: row.student_id,
        assignment_id: row.assignment_id,
        title: row.title,
        scheduled_at: row.scheduled_at,
        room_url: row.room_url,
        status: row.status,
        coach_display_name: row.coach_profiles?.display_name ?? null,
      }));
    },
    enabled: !!user,
    staleTime: 60 * 1000,
  });

  const now = new Date();
  const upcoming = sessions.filter(
    (s) => s.status === "scheduled" && new Date(s.scheduled_at) > now
  );
  const past = sessions.filter(
    (s) => s.status !== "scheduled" || new Date(s.scheduled_at) <= now
  );

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (entitlementsLoading || isLoading) {
    return (
      <View style={styles.container} testID="live-sessions-loading">
        <View style={[styles.header, { paddingTop: insets.top + spacing[4] }]}>
          <ScreenHeader title={t("liveSessions.screenTitle")} onBack={() => router.back()} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.lime} size="large" />
        </View>
      </View>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + spacing[4] }]}>
          <ScreenHeader title={t("liveSessions.screenTitle")} onBack={() => router.back()} />
        </View>
        <ErrorState
          title={t("liveSessions.error_title")}
          description={t("liveSessions.error_desc")}
          onRetry={() => { void refetch(); }}
        />
      </View>
    );
  }

  // ── No coach ─────────────────────────────────────────────────────────────────
  if (!hasCoach) {
    return (
      <View
        style={styles.container}
        testID="live-sessions-no-coach"
      >
        <View style={[styles.header, { paddingTop: insets.top + spacing[4] }]}>
          <ScreenHeader title={t("liveSessions.screenTitle")} onBack={() => router.back()} />
        </View>
        <EmptyState
          title={t("liveSessions.empty_title")}
          description={t("liveSessions.noCoach")}
          icon="📅"
          actionLabel={t("home.noCoachNoRoutine_action")}
          onAction={() => router.push("/marketplace/index" as never)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing[4] }]}>
        <ScreenHeader
          title={t("liveSessions.screenTitle")}
          onBack={() => router.back()}
          {...(sessions.length > 0 && sessions[0]?.coach_display_name
            ? { subtitle: sessions[0].coach_display_name }
            : {})}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        testID="live-sessions-screen"
      >
        {/* Próximas sesiones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("liveSessions.sectionUpcoming")}</Text>
          {upcoming.length === 0 ? (
            <EmptyState
              title={t("liveSessions.empty_title")}
              description={t("liveSessions.empty_desc")}
              icon="📅"
            />
          ) : (
            upcoming.map((s) => <SessionCard key={s.id} session={s} />)
          )}
        </View>

        {/* Sesiones pasadas */}
        {past.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("liveSessions.sectionPast")}</Text>
            {past.map((s) => <SessionCard key={s.id} session={s} />)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Header ──
  header: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  // ── Scroll ──
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[12],
  },

  // ── Sección ──
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: spacing[3],
  },
});
