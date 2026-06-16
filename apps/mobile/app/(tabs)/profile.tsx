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
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import { useLanguage, type AppLanguage } from "@/stores/languageStore";
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
          onPress: async () => {
            // TODO: Edge Function delete-account (Fase 3 completa)
            await signOut();
            router.replace("/(auth)/login");
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

      <Text style={styles.muted}>{t("profile.placeholder")}</Text>

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
                // Tap target mínimo 44×44
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
    marginBottom: spacing[2],
  },
  muted: {
    fontFamily: typography.body,
    color: colors.gray700,
    fontSize: 13,
    marginBottom: spacing[8],
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
    // Garantiza tap target ≥44px
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
