import { useState } from "react";
import {
  View,
  Text,
  TextInput,
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
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", padding: 24 }]}>
        <Text style={{ fontSize: 64, marginBottom: 24 }}>📧</Text>
        <Text style={{ color: "#FAFAFA", fontSize: 24, fontWeight: "bold", marginBottom: 12, textAlign: "center" }}>
          {t('auth.signup.successTitle')}
        </Text>
        <Text style={{ color: "#AAAAAA", textAlign: "center", lineHeight: 22 }}>
          {t('auth.signup.successDesc')}
        </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")} style={[styles.button, { marginTop: 32 }]}>
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

        <TextInput
          style={styles.input}
          placeholder={t('auth.login.email')}
          placeholderTextColor="#6A6A6A"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder={t('auth.signup.passwordPlaceholder')}
          placeholderTextColor="#6A6A6A"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder={t('auth.signup.confirmPasswordPlaceholder')}
          placeholderTextColor="#6A6A6A"
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
            ? <ActivityIndicator color="#0A0A0A" />
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
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  content: { padding: 24, paddingTop: 80 },
  logo: { fontSize: 48, color: "#C8FF00", fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#AAAAAA", marginBottom: 32 },
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
  error: { color: "#FF4444", marginBottom: 12, fontSize: 14 },
  button: {
    backgroundColor: "#C8FF00",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: { backgroundColor: "#4A4A4A" },
  buttonText: { color: "#0A0A0A", fontWeight: "bold", fontSize: 16 },
  link: { alignItems: "center", paddingVertical: 8 },
  linkTextMuted: { color: "#6A6A6A", fontSize: 14 },
});
