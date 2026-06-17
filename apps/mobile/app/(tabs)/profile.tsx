import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import { useLanguage, type AppLanguage } from "@/stores/languageStore";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useWorkoutStore } from "@/stores/workoutStore";
import {
  completedSessionsFromQueue,
  fetchCompletedWorkoutSessions,
  mergeCompletedWorkoutSessions,
} from "@/services/workoutHistory";
import { supabase } from "@/lib/supabase";
import { Pill, Skeleton } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

const LANGUAGES: { code: AppLanguage; label: string; native: string }[] = [
  { code: "es", label: "ES", native: "Español" },
  { code: "en", label: "EN", native: "English" },
];

export default function ProfileTab() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const { plan, hasCoach, coachId, isLoading: entitlementsLoading } = useEntitlements();
  const syncQueue = useWorkoutStore((s) => s.syncQueue);

  const localCompletedSessions = completedSessionsFromQueue(syncQueue, user?.id);
  const { data: remoteCompletedSessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ["completed-workout-sessions", user?.id, "profile"],
    queryFn: () => fetchCompletedWorkoutSessions(user!.id, 365),
    enabled: !!user?.id,
    staleTime: 60 * 1000,
  });
  const completedSessions = mergeCompletedWorkoutSessions(
    remoteCompletedSessions,
    localCompletedSessions
  ).length;
  const completedSessionsLabel = sessionsLoading && completedSessions === 0
    ? "—"
    : completedSessions;

  // Coach display name — only fetched if coachId is known
  const { data: coachName, isLoading: coachLoading } = useQuery<string | null>({
    queryKey: ["coach-name", coachId],
    queryFn: async () => {
      if (!coachId) return null;
      const { data } = await supabase
        .from("coach_profiles")
        .select("display_name")
        .eq("id", coachId)
        .single();
      return (data as { display_name: string | null } | null)?.display_name ?? null;
    },
    enabled: !!coachId,
    staleTime: 10 * 60 * 1000,
  });

  function planLabel(): string {
    if (plan === "elite") return t("profile.planElite");
    if (plan === "pro") return t("profile.planPro");
    return t("profile.planFree");
  }

  function planPillVariant(): "active" | "default" | "success" {
    if (plan === "elite" || plan === "pro") return "active";
    return "default";
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/(auth)/login");
  }

  function handleDeleteAccount() {
    Alert.alert(
      t("profile.deleteAccount_confirm_title"),
      t("profile.deleteAccount_confirm_msg"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("profile.deleteAccount_confirm_btn"),
          style: "destructive",
          onPress: () => {
            // TODO: Edge Function delete-account (Fase 3 completa)
            void handleSignOut();
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing[4] }]}
    >
      <Text style={styles.title}>{t("profile.title")}</Text>

      {user && (
        <Text style={styles.email}>{user.email}</Text>
      )}

      {/* ── Badge de plan ── */}
      <View style={styles.planRow}>
        {entitlementsLoading
          ? <Skeleton width={64} height={24} />
          : <Pill label={planLabel()} variant={planPillVariant()} />
        }
      </View>

      {/* ── Stats básicas ── */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completedSessionsLabel}</Text>
          <Text style={styles.statLabel}>{t("profile.statSessions")}</Text>
        </View>
        {/* Streak: sin fuente de datos aún — TODO Fase 3 */}
        {hasCoach && (
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {coachLoading ? "—" : (coachName ? "✓" : "—")}
            </Text>
            <Text style={styles.statLabel}>{t("profile.statCoach")}</Text>
          </View>
        )}
      </View>

      {/* ── Sección Coach ── */}
      {(hasCoach || coachId) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("profile.sectionCoach")}</Text>
          <View style={styles.coachCard}>
            {coachLoading
              ? <Skeleton width="60%" height={16} />
              : (
                <View style={styles.coachCardContent}>
                  <Text style={styles.coachName}>
                    {coachName ?? t("profile.coachNone")}
                  </Text>
                  <Pill label={t("profile.coachActive")} variant="success" />
                </View>
              )
            }
          </View>
        </View>
      )}

      {/* ── Sección Idioma ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.language_section")}</Text>
        <View style={styles.langRow}>
          {LANGUAGES.map((lang) => {
            const isActive = language === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langButton, isActive && styles.langButtonActive]}
                onPress={() => setLanguage(lang.code)}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={[styles.langCode, isActive && styles.langCodeActive]}>
                  {lang.label}
                </Text>
                <Text style={[styles.langNative, isActive && styles.langNativeActive]}>
                  {lang.native}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Acciones ── */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => { void handleSignOut(); }}
        >
          <Text style={styles.signOutText}>{t("profile.signOut")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteText}>{t("profile.deleteAccount")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    padding: spacing[6],
    paddingBottom: spacing[20],
  },
  title: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize.screenTitle,
    letterSpacing: -1,
    textTransform: "uppercase",
    marginBottom: spacing[2],
  },
  email: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 14,
    marginBottom: spacing[3],
  },
  planRow: {
    marginBottom: spacing[4],
  },
  // Stats row
  statsRow: {
    flexDirection: "row",
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[3],
    alignItems: "center",
    minHeight: 64,
    justifyContent: "center",
  },
  statValue: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  statLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 10,
    marginTop: spacing[1],
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Coach card
  coachCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
  },
  coachCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  coachName: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  // Sección de idioma
  section: {
    marginBottom: spacing[8],
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
  langRow: {
    flexDirection: "row",
    gap: spacing[3],
  },
  langButton: {
    flex: 1,
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: spacing[3],
    gap: spacing[1],
  },
  langButtonActive: {
    backgroundColor: colors.limeGlow,
    borderColor: colors.lime,
  },
  langCode: {
    fontFamily: typography.heading,
    color: colors.muted,
    fontSize: 22,
    letterSpacing: 1,
  },
  langCodeActive: {
    color: colors.lime,
  },
  langNative: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 12,
  },
  langNativeActive: {
    color: colors.lime,
  },
  // Acciones
  actions: {
    gap: spacing[3],
  },
  signOutButton: {
    padding: spacing[4],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  signOutText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: 16,
  },
  deleteButton: {
    padding: spacing[4],
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  deleteText: {
    fontFamily: typography.body,
    color: colors.error,
    fontSize: 16,
  },
});
