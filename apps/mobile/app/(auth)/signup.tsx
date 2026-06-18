import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { signupSchema, TRACKED_EVENTS } from "@forzza/core";
import { track } from "@/lib/analytics";
import { Input } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

export default function SignupScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup() {
    setError(null);
    const result = signupSchema.safeParse({ email, password, confirmPassword });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? t('auth.login.errorInvalidData'));
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(t('auth.signup.errorCreate'));
      setLoading(false);
      return;
    }

    track(TRACKED_EVENTS.SIGNUP_COMPLETED);
    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <View
        style={[
          styles.container,
          styles.successContainer,
          { paddingTop: insets.top + spacing[8], paddingBottom: insets.bottom + spacing[8] },
        ]}
      >
        <Text style={styles.successEmoji}>📧</Text>
        <Text style={styles.successTitle}>{t('auth.signup.successTitle')}</Text>
        <Text style={styles.successDesc}>{t('auth.signup.successDesc')}</Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          style={[styles.button, styles.successButton]}
        >
          <Text style={styles.buttonText}>{t('auth.signup.goToLogin')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing[8], paddingBottom: insets.bottom + spacing[8] },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>⚡</Text>
          </View>
          <Text style={styles.logoText}>FORZZA</Text>
        </View>

        <View style={styles.headlineBlock}>
          <Text style={styles.headlineLine}>{t('auth.signup.headlineTop')}</Text>
          <Text style={[styles.headlineLine, styles.headlineAccent]}>{t('auth.signup.headlineBottom')}</Text>
        </View>
        <Text style={styles.headlineSubtitle}>{t('auth.signup.headlineSubtitle')}</Text>

        {/* Card de bienvenida */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeCardRow}>
            <Text style={styles.welcomeCardIcon}>⚡</Text>
            <Text style={styles.welcomeCardTitle}>{t('auth.signup.welcomeCardTitle')}</Text>
          </View>
          <Text style={styles.welcomeCardSubtitle}>{t('auth.signup.welcomeCardSubtitle')}</Text>
        </View>

        {/* Campos */}
        <Text style={styles.inputLabel}>{t('auth.signup.emailLabel')}</Text>
        <Input
          placeholder={t('auth.login.email')}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <Text style={[styles.inputLabel, styles.inputLabelSpaced]}>{t('auth.signup.passwordLabel')}</Text>
        <Input
          placeholder={t('auth.signup.passwordPlaceholder')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <Text style={[styles.inputLabel, styles.inputLabelSpaced]}>{t('auth.signup.confirmPasswordLabel')}</Text>
        <Input
          placeholder={t('auth.signup.confirmPasswordPlaceholder')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => { void handleSignup(); }}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={colors.black} />
            : <Text style={styles.buttonText}>{t('auth.signup.submit')}</Text>
          }
        </TouchableOpacity>

        {/* Link al login: 2 textos */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          style={styles.loginLinkRow}
        >
          <Text style={styles.loginLinkPre}>{t('auth.signup.loginLinkPre')}</Text>
          <Text style={styles.loginLinkAction}>{t('auth.signup.loginLinkAction')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  successContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: spacing[6],
  },
  successEmoji: {
    fontSize: fontSize["5xl"],
    marginBottom: spacing[6],
  },
  successTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize["3xl"],
    marginBottom: spacing[3],
    textAlign: "center",
  },
  successDesc: {
    fontFamily: typography.body,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
  },
  successButton: {
    marginTop: spacing[8],
    width: "100%",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing[6],
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    marginBottom: spacing[8],
  },
  logoBox: {
    width: 32,
    height: 32,
    backgroundColor: colors.lime,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    fontSize: fontSize.base,
  },
  logoText: {
    fontFamily: typography.heading,
    fontSize: 26,
    color: colors.text,
  },
  headlineBlock: {
    marginBottom: spacing[2],
  },
  headlineLine: {
    fontFamily: typography.heading,
    fontSize: 42,
    lineHeight: 44,
    color: colors.text,
  },
  headlineAccent: {
    color: colors.lime,
  },
  headlineSubtitle: {
    fontFamily: typography.body,
    fontSize: fontSize.md,
    color: colors.muted,
    marginBottom: spacing[6],
  },
  welcomeCard: {
    backgroundColor: colors.limeGlow,
    borderWidth: 1,
    borderColor: colors.limeDim,
    borderRadius: radius.lg,
    padding: spacing[4],
    marginBottom: spacing[6],
  },
  welcomeCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  welcomeCardIcon: {
    fontSize: fontSize.xl,
    color: colors.lime,
  },
  welcomeCardTitle: {
    fontFamily: typography.heading,
    fontSize: fontSize.lg,
    color: colors.lime,
  },
  welcomeCardSubtitle: {
    fontFamily: typography.body,
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  inputLabel: {
    fontFamily: typography.body,
    fontSize: fontSize.sm,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing[2],
  },
  inputLabelSpaced: {
    marginTop: spacing[4],
  },
  error: {
    color: colors.error,
    marginBottom: spacing[3],
    fontSize: fontSize.sm,
    fontFamily: typography.body,
    marginTop: spacing[2],
  },
  button: {
    backgroundColor: colors.lime,
    paddingVertical: spacing[4],
    borderRadius: radius.lg,
    alignItems: "center",
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
  buttonDisabled: {
    backgroundColor: colors.gray700,
  },
  buttonText: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: fontSize.lg,
    letterSpacing: 1,
  },
  loginLinkRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing[1],
    paddingVertical: spacing[4],
  },
  loginLinkPre: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  loginLinkAction: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.sm,
  },
});
