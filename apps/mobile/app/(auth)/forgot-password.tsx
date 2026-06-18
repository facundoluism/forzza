import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { forgotPasswordSchema } from "@forzza/core";
import { Input } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

type PageState = "idle" | "loading" | "success" | "error";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
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
      <View
        style={[
          styles.container,
          styles.successContainer,
          { paddingTop: insets.top + spacing[8], paddingBottom: insets.bottom + spacing[8] },
        ]}
      >
        <Text style={styles.successEmoji}>✅</Text>
        <Text style={styles.successTitle}>{t('auth.forgotPassword.successTitle')}</Text>
        <Text style={styles.successDesc}>{t('auth.forgotPassword.successDesc')}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.button, styles.successButton]}
        >
          <Text style={styles.buttonText}>{t('auth.forgotPassword.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          <Text style={styles.headlineLine}>{t('auth.forgotPassword.headlineTop')}</Text>
          <Text style={[styles.headlineLine, styles.headlineAccent]}>{t('auth.forgotPassword.headlineBottom')}</Text>
        </View>
        <Text style={styles.headlineSubtitle}>{t('auth.forgotPassword.headlineSubtitle')}</Text>

        {/* Campo email con label */}
        <Text style={styles.inputLabel}>{t('auth.forgotPassword.emailLabel')}</Text>
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
      </ScrollView>
    </View>
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
    textAlign: "center",
    marginBottom: spacing[3],
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
    marginBottom: spacing[8],
  },
  inputLabel: {
    fontFamily: typography.body,
    fontSize: fontSize.sm,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing[2],
  },
  error: {
    color: colors.error,
    marginTop: spacing[2],
    marginBottom: spacing[3],
    fontSize: fontSize.sm,
    fontFamily: typography.body,
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
  backLink: {
    alignItems: "center",
    paddingTop: spacing[4],
  },
  backLinkText: {
    fontFamily: typography.body,
    color: colors.gray,
    fontSize: fontSize.sm,
  },
});
