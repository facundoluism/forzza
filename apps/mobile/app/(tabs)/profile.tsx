import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Switch,
  TextInput,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useState, useEffect } from "react";

const LANGUAGES: { code: AppLanguage; label: string; native: string }[] = [
  { code: "es", label: "ES", native: "Español" },
  { code: "en", label: "EN", native: "English" },
];

interface NotificationPrefs {
  push_enabled: boolean;
  email_enabled: boolean;
  quiet_start: number;
  quiet_end: number;
}

const DEFAULT_PREFS: NotificationPrefs = {
  push_enabled: true,
  email_enabled: true,
  quiet_start: 22,
  quiet_end: 8,
};

function NotificationPrefsSection({ userId }: { userId: string }): React.JSX.Element {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [saveError, setSaveError] = useState(false);

  const { data: fetchedPrefs, isSuccess } = useQuery<NotificationPrefs | null>({
    queryKey: ["notification-prefs", userId],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from("notification_preferences")
        .select("push_enabled, email_enabled, quiet_start, quiet_end")
        .eq("user_id", userId)
        .maybeSingle();
      return (data as NotificationPrefs | null) ?? null;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isSuccess && fetchedPrefs) {
      setPrefs(fetchedPrefs);
    }
  }, [isSuccess, fetchedPrefs]);

  const { mutate: savePrefs, isPending: saving } = useMutation({
    mutationFn: async (updated: NotificationPrefs) => {
      // HUMAN_REQUIRED: Expo push notifications require EAS project ID in app.json
      // + proper credentials setup. Token registration is wrapped in try/catch to
      // not break profile if push not configured.
      let push_token: string | null = null;
      try {
        const ExpoPushNotifications = await import("expo-notifications");
        const tokenResult = await ExpoPushNotifications.getExpoPushTokenAsync();
        push_token = tokenResult.data;
      } catch {
        // Push not configured — silently ignore
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("notification_preferences")
        .upsert(
          {
            user_id: userId,
            push_enabled: updated.push_enabled,
            email_enabled: updated.email_enabled,
            quiet_start: updated.quiet_start,
            quiet_end: updated.quiet_end,
            updated_at: new Date().toISOString(),
            ...(push_token ? { push_token } : {}),
          },
          { onConflict: "user_id" }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      setSaveError(false);
      void queryClient.invalidateQueries({ queryKey: ["notification-prefs", userId] });
    },
    onError: () => {
      setSaveError(true);
    },
  });

  function updatePref<K extends keyof NotificationPrefs>(key: K, value: NotificationPrefs[K]) {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    savePrefs(updated);
  }

  return (
    <View style={notifStyles.section}>
      <Text style={notifStyles.sectionTitle}>{t("notificationPrefs.sectionTitle")}</Text>

      <View style={notifStyles.row}>
        <Text style={notifStyles.rowLabel}>{t("notificationPrefs.pushEnabled")}</Text>
        <Switch
          value={prefs.push_enabled}
          onValueChange={(v) => updatePref("push_enabled", v)}
          trackColor={{ false: colors.surface3, true: colors.lime }}
          thumbColor={colors.white}
          testID="notif-push-switch"
        />
      </View>

      <View style={notifStyles.row}>
        <View style={notifStyles.rowLabelWrap}>
          <Text style={notifStyles.rowLabel}>{t("notificationPrefs.emailEnabled")}</Text>
          <Text style={notifStyles.rowNote}>{t("notificationPrefs.emailNote")}</Text>
        </View>
        <Switch
          value={prefs.email_enabled}
          onValueChange={(v) => updatePref("email_enabled", v)}
          trackColor={{ false: colors.surface3, true: colors.lime }}
          thumbColor={colors.white}
          testID="notif-email-switch"
        />
      </View>

      <Text style={notifStyles.quietLabel}>{t("notificationPrefs.quietHours")}</Text>
      <View style={notifStyles.quietRow}>
        <View style={notifStyles.quietItem}>
          <Text style={notifStyles.quietItemLabel}>{t("notificationPrefs.quietStart")}</Text>
          <TextInput
            style={notifStyles.quietInput}
            value={String(prefs.quiet_start)}
            onChangeText={(v) => {
              const n = parseInt(v, 10);
              if (!isNaN(n) && n >= 0 && n <= 23) updatePref("quiet_start", n);
            }}
            keyboardType="numeric"
            returnKeyType="done"
            maxLength={2}
            testID="notif-quiet-start"
          />
        </View>
        <View style={notifStyles.quietItem}>
          <Text style={notifStyles.quietItemLabel}>{t("notificationPrefs.quietEnd")}</Text>
          <TextInput
            style={notifStyles.quietInput}
            value={String(prefs.quiet_end)}
            onChangeText={(v) => {
              const n = parseInt(v, 10);
              if (!isNaN(n) && n >= 0 && n <= 23) updatePref("quiet_end", n);
            }}
            keyboardType="numeric"
            returnKeyType="done"
            maxLength={2}
            testID="notif-quiet-end"
          />
        </View>
        {saving && <ActivityIndicator color={colors.muted} size="small" />}
      </View>

      {saveError && (
        <Text style={notifStyles.errorText}>{t("notificationPrefs.error")}</Text>
      )}
    </View>
  );
}

const notifStyles = StyleSheet.create({
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  rowLabelWrap: {
    flex: 1,
    marginRight: spacing[3],
  },
  rowLabel: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
  },
  rowNote: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    marginTop: spacing[1],
  },
  quietLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: spacing[3],
    marginBottom: spacing[2],
  },
  quietRow: {
    flexDirection: "row",
    gap: spacing[3],
    alignItems: "center",
  },
  quietItem: {
    flex: 1,
  },
  quietItemLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    marginBottom: spacing[1],
  },
  quietInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[3],
    color: colors.text,
    fontFamily: typography.mono,
    fontSize: fontSize.lg,
    textAlign: "center",
    minHeight: 44,
  },
  errorText: {
    fontFamily: typography.body,
    color: colors.error,
    fontSize: fontSize.sm,
    marginTop: spacing[2],
  },
});

export default function ProfileTab() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const { plan, hasCoach, coachId, isPro, isLoading: entitlementsLoading } = useEntitlements();
  const syncQueue = useWorkoutStore((s) => s.syncQueue);
  const queryClient = useQueryClient();

  // Delete account state
  const [deletingAccount, setDeletingAccount] = useState(false);
  // Cancel coach plan state
  const [cancelingCoach, setCancelingCoach] = useState(false);

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

  // Active coach assignment — only fetched when user has a coach
  const { data: activeAssignment } = useQuery<{ id: string } | null>({
    queryKey: ["active-coach-assignment", coachId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coach_assignments")
        .select("id")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as { id: string } | null;
    },
    enabled: hasCoach,
    staleTime: 5 * 60 * 1000,
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

  // Step-1 confirmation for delete account
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
            // Step 2: second destructive confirmation before calling Edge Function
            Alert.alert(
              t("profile.deleteAccount_confirm2_title"),
              t("profile.deleteAccount_confirm2_msg"),
              [
                { text: t("common.cancel"), style: "cancel" },
                {
                  text: t("profile.deleteAccount_confirm2_btn"),
                  style: "destructive",
                  onPress: () => { void executeDeletion(); },
                },
              ]
            );
          },
        },
      ]
    );
  }

  async function executeDeletion() {
    setDeletingAccount(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;
      Alert.alert(
        t("profile.deleteAccount_scheduled_title"),
        t("profile.deleteAccount_scheduled_msg"),
        [{ text: t("common.close"), onPress: () => { void handleSignOut(); } }]
      );
    } catch {
      Alert.alert(
        t("profile.deleteAccount_error_title"),
        t("profile.deleteAccount_error_msg")
      );
    } finally {
      setDeletingAccount(false);
    }
  }

  // Cancel coach plan
  function handleCancelCoachPlan() {
    if (!activeAssignment) {
      Alert.alert(t("profile.cancelCoach_noAssignment"));
      return;
    }
    Alert.alert(
      t("profile.cancelCoach_confirm_title"),
      t("profile.cancelCoach_confirm_msg"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("profile.cancelCoach_confirm_btn"),
          style: "destructive",
          onPress: () => { void executeCancelCoach(); },
        },
      ]
    );
  }

  async function executeCancelCoach() {
    if (!activeAssignment) return;
    setCancelingCoach(true);
    try {
      const { error } = await supabase.functions.invoke("cancel-coach-plan", {
        body: { assignment_id: activeAssignment.id },
      });
      if (error) throw error;
      Alert.alert(
        t("profile.cancelCoach_success_title"),
        t("profile.cancelCoach_success_msg")
      );
      // Refetch entitlements so hasCoach reflects the updated state
      await queryClient.invalidateQueries({ queryKey: ["entitlements"] });
      await queryClient.invalidateQueries({ queryKey: ["active-coach-assignment", coachId] });
    } catch {
      Alert.alert(
        t("profile.cancelCoach_error_title"),
        t("profile.cancelCoach_error_msg")
      );
    } finally {
      setCancelingCoach(false);
    }
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
        {/* Gestionar suscripción PRO — visible solo cuando isPro */}
        {!entitlementsLoading && isPro && (
          <TouchableOpacity
            style={styles.managePlanLink}
            onPress={() => { router.push("/manage-subscription"); }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            testID="profile-manage-subscription-btn"
          >
            <Text style={styles.managePlanLinkText}>{t("profile.managePlan")}</Text>
          </TouchableOpacity>
        )}
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
          {/* Sesiones en vivo */}
          <TouchableOpacity
            style={styles.liveSessionsButton}
            onPress={() => router.push("/live-sessions" as never)}
            testID="profile-live-sessions-btn"
          >
            <Text style={styles.liveSessionsText}>{t("liveSessions.screenTitle")}</Text>
          </TouchableOpacity>

          {/* Cancelar plan del coach */}
          <TouchableOpacity
            style={[styles.cancelCoachButton, cancelingCoach && styles.buttonDisabled]}
            onPress={handleCancelCoachPlan}
            disabled={cancelingCoach}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            testID="profile-cancel-coach-btn"
          >
            {cancelingCoach
              ? <ActivityIndicator color={colors.warning} size="small" />
              : <Text style={styles.cancelCoachText}>{t("profile.cancelCoachPlan")}</Text>
            }
          </TouchableOpacity>
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

      {/* ── Notificaciones ── */}
      {user?.id && <NotificationPrefsSection userId={user.id} />}

      {/* ── Acciones ── */}
      <View style={styles.actions}>
        {/* Historial de pagos */}
        <TouchableOpacity
          style={styles.paymentsButton}
          onPress={() => router.push("/payments-history")}
          testID="profile-payments-history-btn"
        >
          <Text style={styles.paymentsButtonText}>{t("paymentsHistory.viewHistory")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => { void handleSignOut(); }}
        >
          <Text style={styles.signOutText}>{t("profile.signOut")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteButton, deletingAccount && styles.buttonDisabled]}
          onPress={handleDeleteAccount}
          disabled={deletingAccount}
          testID="profile-delete-account-btn"
        >
          {deletingAccount
            ? <ActivityIndicator color={colors.error} size="small" />
            : <Text style={styles.deleteText}>{t("profile.deleteAccount")}</Text>
          }
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
    gap: spacing[2],
  },
  managePlanLink: {
    paddingVertical: spacing[1],
    alignSelf: "flex-start",
  },
  managePlanLinkText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.sm,
    textDecorationLine: "underline",
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
  liveSessionsButton: {
    marginTop: spacing[3],
    padding: spacing[3],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.info,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  liveSessionsText: {
    fontFamily: typography.body,
    color: colors.info,
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  cancelCoachButton: {
    marginTop: spacing[3],
    padding: spacing[3],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.warning,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  cancelCoachText: {
    fontFamily: typography.body,
    color: colors.warning,
    fontSize: fontSize.md,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  // Acciones
  actions: {
    gap: spacing[3],
  },
  paymentsButton: {
    padding: spacing[4],
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  paymentsButtonText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: 16,
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
