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
import { supabase } from "@/lib/supabase";
import { signupSchema, TRACKED_EVENTS } from "@forzza/core";
import { track } from "@/lib/analytics";
import { Input } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

export default function SignupScreen() {
  const { t } = useTranslation();
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
      <View style={[styles.container, styles.successContainer]}>
        <Text style={styles.successEmoji}>📧</Text>
        <Text style={styles.successTitle}>{t('auth.signup.successTitle')}</Text>
        <Text style={styles.successDesc}>{t('auth.signup.successDesc')}</Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")} style={[styles.button, styles.successButton]}>
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
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>FORZZA</Text>
        <Text style={styles.subtitle}>{t('auth.signup.title')}</Text>

        <Input
          placeholder={t('auth.login.email')}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
        <Input
          placeholder={t('auth.signup.passwordPlaceholder')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
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

        <TouchableOpacity onPress={() => router.push("/(auth)/login")} style={styles.link}>
          <Text style={styles.linkTextMuted}>{t('auth.signup.alreadyHaveAccount')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  successContainer: { justifyContent: "center", alignItems: "center", padding: spacing[6] },
  successEmoji: { fontSize: fontSize["5xl"], marginBottom: spacing[6] },
  successTitle: { color: colors.white, fontSize: fontSize["2xl"], fontFamily: typography.body, fontWeight: "700", marginBottom: spacing[3], textAlign: "center" },
  successDesc: { color: colors.muted, textAlign: "center", lineHeight: 22 },
  successButton: { marginTop: spacing[8] },
  content: { padding: spacing[6], paddingTop: spacing[20] },
  logo: { fontSize: fontSize["5xl"], color: colors.lime, fontFamily: typography.heading, marginBottom: spacing[2] },
  subtitle: { fontSize: fontSize.base, color: colors.muted, marginBottom: spacing[8] },
  error: { color: colors.error, marginBottom: spacing[3], fontSize: fontSize.sm },
  button: {
    backgroundColor: colors.lime,
    padding: spacing[4],
    borderRadius: radius.md,
    alignItems: "center",
    marginBottom: spacing[4],
    marginTop: spacing[2],
  },
  buttonDisabled: { backgroundColor: colors.gray700 },
  buttonText: { color: colors.black, fontFamily: typography.body, fontWeight: "700", fontSize: fontSize.base },
  link: { alignItems: "center", paddingVertical: spacing[2] },
  linkTextMuted: { color: colors.gray, fontSize: fontSize.sm },
});
