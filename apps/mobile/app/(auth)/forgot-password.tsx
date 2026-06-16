import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { forgotPasswordSchema } from "@forzza/core";

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
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", padding: 24 }]}>
        <Text style={{ fontSize: 64, marginBottom: 24 }}>✅</Text>
        <Text style={{ color: "#FAFAFA", fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center" }}>
          {t('auth.forgotPassword.successTitle')}
        </Text>
        <Text style={{ color: "#AAAAAA", textAlign: "center" }}>
          {t('auth.forgotPassword.successDesc')}
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={[styles.button, { marginTop: 32 }]}>
          <Text style={styles.buttonText}>{t('auth.forgotPassword.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={{ fontSize: 32, color: "#FAFAFA", fontWeight: "bold", marginBottom: 8 }}>
          {t('auth.forgotPassword.title')}
        </Text>
        <Text style={{ color: "#AAAAAA", marginBottom: 32 }}>
          {t('auth.forgotPassword.placeholder')}
        </Text>

        <TextInput
          style={styles.input}
          placeholder={t('auth.forgotPassword.emailPlaceholder')}
          placeholderTextColor="#6A6A6A"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {error && <Text style={{ color: "#FF4444", marginBottom: 12, fontSize: 14 }}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, state === "loading" && styles.buttonDisabled]}
          onPress={() => { void handleReset(); }}
          disabled={state === "loading"}
        >
          {state === "loading"
            ? <ActivityIndicator color="#0A0A0A" />
            : <Text style={styles.buttonText}>{t('auth.forgotPassword.submit')}</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={{ alignItems: "center", paddingTop: 16 }}>
          <Text style={{ color: "#6A6A6A", fontSize: 14 }}>{t('auth.forgotPassword.back')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  content: { flex: 1, padding: 24, paddingTop: 80 },
  input: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 8,
    padding: 14,
    color: "#FAFAFA",
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#C8FF00",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#4A4A4A" },
  buttonText: { color: "#0A0A0A", fontWeight: "bold", fontSize: 16 },
});
