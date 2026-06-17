import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { loginSchema, TRACKED_EVENTS } from "@forzza/core";
import { track } from "@/lib/analytics";
import { Input } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

export default function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? t('auth.login.errorInvalidData'));
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(t('auth.login.errorInvalidCredentials'));
      setLoading(false);
      return;
    }

    track(TRACKED_EVENTS.LOGIN, { role: 'student' });
    router.replace("/(tabs)");
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>FORZZA</Text>
        <Text style={styles.subtitle}>{t('auth.login.title')}</Text>

        <Input
          testID="email-input"
          accessibilityLabel={t('auth.login.email')}
          placeholder={t('auth.login.email')}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
          state={error ? "error" : "default"}
        />

        <Input
          testID="password-input"
          accessibilityLabel={t('auth.login.password')}
          placeholder={t('auth.login.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          testID="login-submit"
          accessibilityLabel={t('auth.login.submit')}
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => { void handleLogin(); }}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={colors.black} />
            : <Text style={styles.buttonText}>{t('auth.login.submit')}</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/signup")}
          style={styles.link}
        >
          <Text style={styles.linkText}>{t('auth.login.noAccount')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          style={styles.link}
        >
          <Text style={styles.linkTextMuted}>{t('auth.login.forgotPassword')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, padding: spacing[6], justifyContent: "center" },
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
  linkText: { color: colors.lime, fontSize: fontSize.sm },
  linkTextMuted: { color: colors.gray, fontSize: fontSize.sm },
});
