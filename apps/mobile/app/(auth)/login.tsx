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
} from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { loginSchema, TRACKED_EVENTS } from "@forzza/core";
import { track } from "@/lib/analytics";

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

        <TextInput
          testID="email-input"
          accessibilityLabel={t('auth.login.email')}
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
          testID="password-input"
          accessibilityLabel={t('auth.login.password')}
          style={styles.input}
          placeholder={t('auth.login.password')}
          placeholderTextColor="#6A6A6A"
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
            ? <ActivityIndicator color="#0A0A0A" />
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
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  content: { flex: 1, padding: 24, justifyContent: "center" },
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
  linkText: { color: "#C8FF00", fontSize: 14 },
  linkTextMuted: { color: "#6A6A6A", fontSize: 14 },
});
