import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { isMinor, TRACKED_EVENTS } from "@forzza/core";
import { track } from "@/lib/analytics";
import type { TablesInsert } from "@forzza/db-types";

type Step = 1 | 2 | 3;

const GOALS = [
  "Perder peso",
  "Ganar músculo",
  "Mejorar resistencia",
  "Tonificar",
  "Rehabilitación",
  "Deporte específico",
];

const LEVELS = [
  { value: "principiante", label: "Principiante", description: "Empiezo de cero o casi" },
  { value: "intermedio", label: "Intermedio", description: "Entreno hace algunos meses" },
  { value: "avanzado", label: "Avanzado", description: "Llevo años entrenando" },
] as const;

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [level, setLevel] = useState<"principiante" | "intermedio" | "avanzado" | null>(null);

  // Consentimiento parental
  const [parentalEmail, setParentalEmail] = useState("");
  const [parentalConsent, setParentalConsent] = useState(false);
  const [needsParentalConsent, setNeedsParentalConsent] = useState(false);

  function toggleGoal(goal: string) {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  }

  function validateStep1() {
    if (!displayName.trim() || displayName.length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return false;
    }
    if (!birthDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      setError("Ingresá la fecha en formato DD/MM/AAAA");
      return false;
    }
    return true;
  }

  function goToStep2() {
    if (!validateStep1()) return;
    setError(null);

    // Parsear fecha DD/MM/AAAA → AAAA-MM-DD
    const [dd, mm, yyyy] = birthDate.split("/");
    const isoDate = `${yyyy}-${mm}-${dd}`;
    const minor = isMinor(isoDate);
    setNeedsParentalConsent(minor);

    setStep(2);
  }

  async function handleFinish() {
    if (selectedGoals.length === 0) {
      setError("Elegí al menos un objetivo");
      return;
    }
    if (!level) {
      setError("Seleccioná tu nivel");
      return;
    }
    if (needsParentalConsent && !parentalConsent) {
      setError("El adulto responsable debe aceptar los términos");
      return;
    }

    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Sesión expirada");
      setLoading(false);
      return;
    }

    const [dd, mm, yyyy] = birthDate.split("/");
    const isoDate = `${yyyy}-${mm}-${dd}`;

    const profileData: TablesInsert<"student_profiles"> = {
      user_id: user.id,
      display_name: displayName,
      birth_date: isoDate,
      goals: selectedGoals,
      level,
      parental_email: needsParentalConsent ? parentalEmail : null,
      parental_consent_at: needsParentalConsent ? new Date().toISOString() : null,
    };

    const { error: profileError } = await supabase
      .from("student_profiles")
      .insert(profileData);

    if (profileError) {
      setError("No se pudo guardar tu perfil. Intentá de nuevo.");
      setLoading(false);
      return;
    }

    track(TRACKED_EVENTS.ONBOARDING_STUDENT_COMPLETED, { country_code: 'AR' });
    router.replace("/(tabs)");
  }

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            style={[styles.progressBar, s <= step && styles.progressBarActive]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Paso 1: Datos básicos */}
        {step === 1 && (
          <View>
            <Text style={styles.title}>¡Bienvenido/a a Forzza!</Text>
            <Text style={styles.subtitle}>Contanos un poco sobre vos</Text>

            <Text style={styles.label}>¿Cómo te llamás?</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              placeholderTextColor="#6A6A6A"
              value={displayName}
              onChangeText={setDisplayName}
            />

            <Text style={styles.label}>Fecha de nacimiento</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#6A6A6A"
              value={birthDate}
              onChangeText={setBirthDate}
              keyboardType="numeric"
              maxLength={10}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity style={styles.button} onPress={goToStep2}>
              <Text style={styles.buttonText}>Siguiente →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Paso 2: Objetivos y nivel */}
        {step === 2 && (
          <View>
            <Text style={styles.title}>¿Cuáles son tus objetivos?</Text>
            <Text style={styles.subtitle}>Podés elegir más de uno</Text>

            <View style={styles.chipsContainer}>
              {GOALS.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.chip,
                    selectedGoals.includes(goal) && styles.chipSelected,
                  ]}
                  onPress={() => toggleGoal(goal)}
                >
                  <Text style={[
                    styles.chipText,
                    selectedGoals.includes(goal) && styles.chipTextSelected,
                  ]}>
                    {goal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (selectedGoals.length === 0) {
                  setError("Elegí al menos un objetivo");
                  return;
                }
                setError(null);
                setStep(3);
              }}
            >
              <Text style={styles.buttonText}>Siguiente →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Paso 3: Nivel + consentimiento parental si aplica */}
        {step === 3 && (
          <View>
            <Text style={styles.title}>¿Cuál es tu nivel?</Text>
            <Text style={styles.subtitle}>Para darte el contenido más apropiado</Text>

            {LEVELS.map((lvl) => (
              <TouchableOpacity
                key={lvl.value}
                style={[
                  styles.levelCard,
                  level === lvl.value && styles.levelCardSelected,
                ]}
                onPress={() => setLevel(lvl.value)}
              >
                <Text style={[styles.levelTitle, level === lvl.value && { color: "#0A0A0A" }]}>
                  {lvl.label}
                </Text>
                <Text style={[styles.levelDesc, level === lvl.value && { color: "#2A2A2A" }]}>
                  {lvl.description}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Consentimiento parental */}
            {needsParentalConsent && (
              <View style={styles.parentalBox}>
                <Text style={styles.parentalTitle}>⚠️ Consentimiento parental requerido</Text>
                <Text style={styles.parentalText}>
                  Al ser menor de 18 años, necesitamos el email y el consentimiento de un adulto responsable.
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email del adulto responsable"
                  placeholderTextColor="#6A6A6A"
                  value={parentalEmail}
                  onChangeText={setParentalEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setParentalConsent(!parentalConsent)}
                >
                  <View style={[styles.checkbox, parentalConsent && styles.checkboxChecked]} />
                  <Text style={styles.checkboxLabel}>
                    El adulto responsable acepta los términos y condiciones
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={() => { void handleFinish(); }}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#0A0A0A" />
                : <Text style={styles.buttonText}>¡Empezar!</Text>
              }
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  progressContainer: { flexDirection: "row", gap: 8, padding: 24, paddingBottom: 0 },
  progressBar: { flex: 1, height: 4, backgroundColor: "#2A2A2A", borderRadius: 2 },
  progressBarActive: { backgroundColor: "#C8FF00" },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 28, color: "#FAFAFA", fontWeight: "bold", marginBottom: 8, marginTop: 16 },
  subtitle: { fontSize: 16, color: "#AAAAAA", marginBottom: 24 },
  label: { color: "#AAAAAA", marginBottom: 8, fontSize: 14 },
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
    marginTop: 8,
  },
  buttonDisabled: { backgroundColor: "#4A4A4A" },
  buttonText: { color: "#0A0A0A", fontWeight: "bold", fontSize: 16 },
  chipsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    backgroundColor: "#1A1A1A",
  },
  chipSelected: { backgroundColor: "#C8FF00", borderColor: "#C8FF00" },
  chipText: { color: "#FAFAFA", fontSize: 14 },
  chipTextSelected: { color: "#0A0A0A", fontWeight: "bold" },
  levelCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    backgroundColor: "#1A1A1A",
    marginBottom: 12,
  },
  levelCardSelected: { backgroundColor: "#C8FF00", borderColor: "#C8FF00" },
  levelTitle: { color: "#FAFAFA", fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  levelDesc: { color: "#AAAAAA", fontSize: 14 },
  parentalBox: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#FFAA00",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  parentalTitle: { color: "#FFAA00", fontWeight: "bold", marginBottom: 8 },
  parentalText: { color: "#AAAAAA", fontSize: 13, marginBottom: 12, lineHeight: 18 },
  checkboxRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: "#6A6A6A", marginTop: 2 },
  checkboxChecked: { backgroundColor: "#C8FF00", borderColor: "#C8FF00" },
  checkboxLabel: { color: "#AAAAAA", flex: 1, fontSize: 13, lineHeight: 18 },
});
