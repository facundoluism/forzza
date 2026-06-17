import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { isMinor, TRACKED_EVENTS } from "@forzza/core";
import { track } from "@/lib/analytics";
import type { TablesInsert } from "@forzza/db-types";
import { Input } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

type Step = 1 | 2 | 3;

export default function OnboardingScreen() {
  const { t } = useTranslation();

  // Arrays defined inside component so they react to language changes
  const GOALS = [
    t('auth.onboarding.goalLoseWeight'),
    t('auth.onboarding.goalGainMuscle'),
    t('auth.onboarding.goalImproveEndurance'),
    t('auth.onboarding.goalStayActive'),
    t('auth.onboarding.goalSport'),
  ];

  const LEVELS = [
    { value: "principiante" as const, label: t('auth.onboarding.levelBeginner'), description: t('auth.onboarding.levelBeginnerDesc') },
    { value: "intermedio" as const, label: t('auth.onboarding.levelIntermediate'), description: t('auth.onboarding.levelIntermediateDesc') },
    { value: "avanzado" as const, label: t('auth.onboarding.levelAdvanced'), description: t('auth.onboarding.levelAdvancedDesc') },
  ];

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
      setError(t('auth.onboarding.errorRequired'));
      return false;
    }
    if (!birthDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      setError(t('auth.onboarding.errorAge'));
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
      setError(t('auth.onboarding.errorRequired'));
      return;
    }
    if (!level) {
      setError(t('auth.onboarding.errorRequired'));
      return;
    }
    if (needsParentalConsent && !parentalConsent) {
      setError(t('auth.onboarding.errorParental'));
      return;
    }

    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError(t('auth.onboarding.errorSave'));
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
      setError(t('auth.onboarding.errorSave'));
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
            <Text style={styles.title}>{t('auth.onboarding.titleAge')}</Text>
            <Text style={styles.subtitle}>{t('auth.onboarding.labelName')}</Text>

            <Text style={styles.label}>{t('auth.onboarding.labelName')}</Text>
            <Input
              placeholder={t('auth.onboarding.placeholderName')}
              value={displayName}
              onChangeText={setDisplayName}
            />

            <Text style={styles.label}>{t('auth.onboarding.labelAge')}</Text>
            <Input
              placeholder={t('auth.onboarding.placeholderBirthDate')}
              value={birthDate}
              onChangeText={setBirthDate}
              keyboardType="numeric"
              maxLength={10}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity style={styles.button} onPress={goToStep2}>
              <Text style={styles.buttonText}>{t('auth.onboarding.btnNext')} →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Paso 2: Objetivos y nivel */}
        {step === 2 && (
          <View>
            <Text style={styles.title}>{t('auth.onboarding.titleGoal')}</Text>

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
                  setError(t('auth.onboarding.errorRequired'));
                  return;
                }
                setError(null);
                setStep(3);
              }}
            >
              <Text style={styles.buttonText}>{t('auth.onboarding.btnNext')} →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Paso 3: Nivel + consentimiento parental si aplica */}
        {step === 3 && (
          <View>
            <Text style={styles.title}>{t('auth.onboarding.titleLevel')}</Text>

            {LEVELS.map((lvl) => (
              <TouchableOpacity
                key={lvl.value}
                style={[
                  styles.levelCard,
                  level === lvl.value && styles.levelCardSelected,
                ]}
                onPress={() => setLevel(lvl.value)}
              >
                <Text style={[styles.levelTitle, level === lvl.value && styles.levelTitleSelected]}>
                  {lvl.label}
                </Text>
                <Text style={[styles.levelDesc, level === lvl.value && styles.levelDescSelected]}>
                  {lvl.description}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Consentimiento parental */}
            {needsParentalConsent && (
              <View style={styles.parentalBox}>
                <Text style={styles.parentalTitle}>⚠️ {t('auth.onboarding.titleParental')}</Text>
                <Text style={styles.parentalText}>
                  {t('auth.onboarding.parentalDesc')}
                </Text>
                <Input
                  placeholder={t('auth.onboarding.placeholderParentalEmail')}
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
                    {t('auth.onboarding.parentalConsent')}
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
                ? <ActivityIndicator color={colors.black} />
                : <Text style={styles.buttonText}>{t('auth.onboarding.btnFinish')}</Text>
              }
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  progressContainer: { flexDirection: "row", gap: spacing[2], padding: spacing[6], paddingBottom: 0 },
  progressBar: { flex: 1, height: 4, backgroundColor: colors.surface3, borderRadius: radius.sm },
  progressBarActive: { backgroundColor: colors.lime },
  content: { padding: spacing[6], paddingBottom: spacing[12] },
  title: { fontSize: fontSize["3xl"], fontFamily: typography.heading, color: colors.text, fontWeight: "700", marginBottom: spacing[2], marginTop: spacing[4] },
  subtitle: { fontSize: fontSize.base, color: colors.muted, marginBottom: spacing[6] },
  label: { color: colors.muted, marginBottom: spacing[2], fontSize: fontSize.sm },
  error: { color: colors.error, marginBottom: spacing[3], fontSize: fontSize.sm },
  button: {
    backgroundColor: colors.lime,
    padding: spacing[4],
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing[2],
  },
  buttonDisabled: { backgroundColor: colors.gray700 },
  buttonText: { color: colors.black, fontFamily: typography.body, fontWeight: "700", fontSize: fontSize.base },
  chipsContainer: { flexDirection: "row", flexWrap: "wrap", gap: spacing[2], marginBottom: spacing[6] },
  chip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.surface4,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.lime, borderColor: colors.lime },
  chipText: { color: colors.text, fontSize: fontSize.sm },
  chipTextSelected: { color: colors.black, fontWeight: "700" },
  levelCard: {
    padding: spacing[4],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surface4,
    backgroundColor: colors.surface,
    marginBottom: spacing[3],
  },
  levelCardSelected: { backgroundColor: colors.lime, borderColor: colors.lime },
  levelTitle: { color: colors.text, fontFamily: typography.body, fontWeight: "700", fontSize: fontSize.base, marginBottom: spacing[1] },
  levelTitleSelected: { color: colors.black },
  levelDesc: { color: colors.muted, fontSize: fontSize.sm },
  levelDescSelected: { color: colors.surface3 },
  parentalBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: radius.md,
    padding: spacing[4],
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
  parentalTitle: { color: colors.warning, fontFamily: typography.body, fontWeight: "700", marginBottom: spacing[2] },
  parentalText: { color: colors.muted, fontSize: 13, marginBottom: spacing[3], lineHeight: 18 },
  checkboxRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing[2] },
  checkbox: { width: 20, height: 20, borderRadius: radius.sm, borderWidth: 2, borderColor: colors.gray, marginTop: 2 },
  checkboxChecked: { backgroundColor: colors.lime, borderColor: colors.lime },
  checkboxLabel: { color: colors.muted, flex: 1, fontSize: 13, lineHeight: 18 },
});
