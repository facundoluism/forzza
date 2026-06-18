import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { loginSchema, TRACKED_EVENTS } from "@forzza/core";
import { track } from "@/lib/analytics";
import { Input } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";
import { FEATURE_FLAGS } from "@forzza/config";

export default function LoginScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirectTo = Linking.createURL("/(auth)/login");

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

  async function handleAppleSignIn() {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo },
    });
    if (authError) {
      Alert.alert(t("auth.login.ssoErrorTitle"), t("auth.login.ssoErrorDesc"));
    }
  }

  async function handleGoogleSignIn() {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (authError) {
      Alert.alert(t("auth.login.ssoErrorTitle"), t("auth.login.ssoErrorDesc"));
    }
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
        {/* Header: logo + marca */}
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>⚡</Text>
          </View>
          <Text style={styles.logoText}>FORZZA</Text>
        </View>

        {/* Headline */}
        <View style={styles.headlineBlock}>
          <Text style={styles.headlineLine}>{t('auth.login.headlineTop')}</Text>
          <Text style={[styles.headlineLine, styles.headlineAccent]}>{t('auth.login.headlineBottom')}</Text>
        </View>
        <Text style={styles.headlineSubtitle}>{t('auth.login.headlineSubtitle')}</Text>

        {/* Campos */}
        <View style={styles.fieldsBlock}>
          <Text style={styles.inputLabel}>{t('auth.login.emailLabel')}</Text>
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

          <Text style={[styles.inputLabel, styles.inputLabelSpaced]}>{t('auth.login.passwordLabel')}</Text>
          <Input
            testID="password-input"
            accessibilityLabel={t('auth.login.password')}
            placeholder={t('auth.login.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          {/* Forgot password — entre el campo y el botón, alineado derecha */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            style={styles.forgotLink}
          >
            <Text style={styles.forgotLinkText}>{t('auth.login.forgotPassword')}</Text>
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        {/* Botón submit */}
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

        {/* Divider SSO */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t("auth.login.orContinueWith")}</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Apple primero en iOS */}
        {Platform.OS === "ios" && FEATURE_FLAGS.APPLE_SIGN_IN && (
          <TouchableOpacity
            testID="apple-signin-button"
            style={styles.ssoButton}
            onPress={() => { void handleAppleSignIn(); }}
          >
            <Text style={styles.ssoButtonText}>{t("auth.login.continueWithApple")}</Text>
          </TouchableOpacity>
        )}

        {FEATURE_FLAGS.GOOGLE_SIGN_IN && (
          <TouchableOpacity
            testID="google-signin-button"
            style={styles.ssoButton}
            onPress={() => { void handleGoogleSignIn(); }}
          >
            <Text style={styles.ssoButtonText}>{t("auth.login.continueWithGoogle")}</Text>
          </TouchableOpacity>
        )}

        {/* Link inferior: 2 textos en fila */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/signup")}
          style={styles.signupLinkRow}
        >
          <Text style={styles.signupLinkPre}>{t('auth.login.noAccountLink')}</Text>
          <Text style={styles.signupLinkAction}>{t('auth.login.signupLink')}</Text>
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
    marginBottom: spacing[8],
  },
  fieldsBlock: {
    marginBottom: spacing[2],
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
  forgotLink: {
    alignSelf: "flex-end",
    paddingVertical: spacing[2],
    marginTop: spacing[1],
    marginBottom: spacing[2],
  },
  forgotLinkText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  error: {
    color: colors.error,
    marginBottom: spacing[3],
    fontSize: fontSize.sm,
    fontFamily: typography.body,
  },
  button: {
    backgroundColor: colors.lime,
    paddingVertical: spacing[4],
    borderRadius: radius.lg,
    alignItems: "center",
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing[4],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    marginHorizontal: spacing[3],
  },
  ssoButton: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.surface3,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
    marginBottom: spacing[3],
  },
  ssoButtonText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
  },
  signupLinkRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing[1],
    paddingVertical: spacing[4],
  },
  signupLinkPre: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  signupLinkAction: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.sm,
  },
});
