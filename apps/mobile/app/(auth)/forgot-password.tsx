import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { forgotPasswordSchema } from "@forzza/core";
import { Input } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

type PageState = "idle" | "loading" | "success" | "error";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<PageState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleReset() {
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? t('auth.forgotPassword.error'));
      return;
    }

    setState("loading");
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email);

    if (authError) {
      setState("error");
      setError(t('auth.forgotPassword.error'));
      return;
    }

    setState("success");
  }

  if (state === "success") {
    return (
      <View style={[styles.container, styles.successContainer]}>
        <Text style={styles.successEmoji}>✅</Text>
        <Text style={styles.successTitle}>{t('auth.forgotPassword.successTitle')}</Text>
        <Text style={styles.successDesc}>{t('auth.forgotPassword.successDesc')}</Text>
        <TouchableOpacity onPress={() => router.back()} style={[styles.button, styles.successButton]}>
          <Text style={styles.buttonText}>{t('auth.forgotPassword.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('auth.forgotPassword.title')}</Text>
        <Text style={styles.desc}>{t('auth.forgotPassword.placeholder')}</Text>

        <Input
          placeholder={t('auth.forgotPassword.emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          state={error ? "error" : "default"}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, state === "loading" && styles.buttonDisabled]}
          onPress={() => { void handleReset(); }}
          disabled={state === "loading"}
        >
          {state === "loading"
            ? <ActivityIndicator color={colors.black} />
            : <Text style={styles.buttonText}>{t('auth.forgotPassword.submit')}</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>{t('auth.forgotPassword.back')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  successContainer: { justifyContent: "center", alignItems: "center", padding: spacing[6] },
  successEmoji: { fontSize: fontSize["5xl"], marginBottom: spacing[6] },
  successTitle: { color: colors.white, fontSize: fontSize.xl, fontFamily: typography.body, fontWeight: "700", marginBottom: spacing[3], textAlign: "center" },
  successDesc: { color: colors.muted, textAlign: "center" },
  successButton: { marginTop: spacing[8] },
  content: { flex: 1, padding: spacing[6], paddingTop: spacing[20] },
  title: { fontSize: fontSize["2xl"], fontFamily: typography.heading, color: colors.text, fontWeight: "700", marginBottom: spacing[2] },
  desc: { color: colors.muted, marginBottom: spacing[8] },
  error: { color: colors.error, marginBottom: spacing[3], fontSize: fontSize.sm },
  button: {
    backgroundColor: colors.lime,
    padding: spacing[4],
    borderRadius: radius.md,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: colors.gray700 },
  buttonText: { color: colors.black, fontFamily: typography.body, fontWeight: "700", fontSize: fontSize.base },
  backLink: { alignItems: "center", paddingTop: spacing[4] },
  backLinkText: { color: colors.gray, fontSize: fontSize.sm },
});
