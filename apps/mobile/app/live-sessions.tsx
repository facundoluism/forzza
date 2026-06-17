import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { useEntitlements } from "@/hooks/useEntitlements";
import { supabase } from "@/lib/supabase";
import { EmptyState, ErrorState, Card } from "@forzza/ui/native";
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
    <Card style={cardStyles.card} testID={`live-session-card-${session.id}`}>
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
    </Card>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    marginBottom: spacing[3],
    gap: spacing[2],
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
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
    marginTop: spacing[1],
  },
  joinBtnText: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: fontSize.base,
    letterSpacing: 0.5,
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
      <View
        style={[styles.container, styles.centered, { paddingTop: insets.top + spacing[4] }]}
        testID="live-sessions-loading"
      >
        <ActivityIndicator color={colors.lime} size="large" />
      </View>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
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
        style={[styles.container, { paddingTop: insets.top + spacing[4] }]}
        testID="live-sessions-no-coach"
      >
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing[4] },
      ]}
      testID="live-sessions-screen"
    >
      <Text style={styles.screenTitle}>{t("liveSessions.screenTitle")}</Text>

      {/* Upcoming */}
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

      {/* Past */}
      {past.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("liveSessions.sectionPast")}</Text>
          {past.map((s) => <SessionCard key={s.id} session={s} />)}
        </View>
      )}
    </ScrollView>
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
  content: {
    padding: spacing[4],
    paddingBottom: spacing[12],
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
});
