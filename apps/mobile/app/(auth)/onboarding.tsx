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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { isMinor, TRACKED_EVENTS } from "@forzza/core";
import { track } from "@/lib/analytics";
import type { TablesInsert } from "@forzza/db-types";
import { Input } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

type Step = 1 | 2 | 3;

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

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

  const goalIcons = ["🔥", "💪", "🏃", "⚡", "🏆"];
  const levelIcons: Record<string, string> = {
    principiante: "🌱",
    intermedio: "📚",
    avanzado: "🏆",
  };

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

  const stepSubs = [
    t('auth.onboarding.step1Sub'),
    t('auth.onboarding.step2Sub'),
    t('auth.onboarding.step3Sub'),
  ];
  const stepLabels = [
    t('auth.onboarding.step1Label'),
    t('auth.onboarding.step2Label'),
    t('auth.onboarding.step3Label'),
  ];

  return (
    <View style={styles.container}>
      {/* Barra de progreso delgada — 3 segmentos */}
      <View style={[styles.progressContainer, { paddingTop: insets.top + spacing[4] }]}>
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            style={[styles.progressSegment, s <= step && styles.progressSegmentActive]}
          />
        ))}
      </View>

      {/* Scroll content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header del step */}
        <View style={styles.stepHeader}>
          {step > 1 && (
            <TouchableOpacity
              onPress={() => setStep((step - 1) as Step)}
              style={styles.backBtn}
            >
              <Text style={styles.backBtnText}>‹</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.stepSub}>{stepSubs[step - 1]}</Text>
          <Text style={styles.stepTitle}>{stepLabels[step - 1]}</Text>

          {/* Dots indicadores */}
          <View style={styles.dotsRow}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[styles.dot, s === step && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        {/* Paso 1: Datos básicos */}
        {step === 1 && (
          <View>
            {/* Card de bienvenida */}
            <View style={styles.welcomeCard}>
              <View style={styles.welcomeCardRow}>
                <Text style={styles.welcomeCardIcon}>⚡</Text>
                <Text style={styles.welcomeCardTitle}>{t('auth.onboarding.welcomeCardTitle')}</Text>
              </View>
              <Text style={styles.welcomeCardSubtitle}>{t('auth.onboarding.welcomeCardSubtitle')}</Text>
            </View>

            <Text style={styles.label}>{t('auth.onboarding.labelName')}</Text>
            <Input
              placeholder={t('auth.onboarding.placeholderName')}
              value={displayName}
              onChangeText={setDisplayName}
            />

            <Text style={[styles.label, styles.labelSpaced]}>{t('auth.onboarding.labelAge')}</Text>
            <Input
              placeholder={t('auth.onboarding.placeholderBirthDate')}
              value={birthDate}
              onChangeText={setBirthDate}
              keyboardType="numeric"
              maxLength={10}
            />

            {error && <Text style={styles.error}>{error}</Text>}
          </View>
        )}

        {/* Paso 2: Objetivos */}
        {step === 2 && (
          <View>
            <Text style={styles.sectionLabel}>{t('auth.onboarding.goalSectionLabel')}</Text>

            {GOALS.map((goal, idx) => (
              <TouchableOpacity
                key={goal}
                style={[styles.goalRow, selectedGoals.includes(goal) && styles.goalRowSelected]}
                onPress={() => toggleGoal(goal)}
              >
                <Text style={styles.goalIcon}>{goalIcons[idx] ?? "•"}</Text>
                <Text style={[styles.goalText, selectedGoals.includes(goal) && styles.goalTextSelected]}>
                  {goal}
                </Text>
                {selectedGoals.includes(goal) && <Text style={styles.goalCheck}>✓</Text>}
              </TouchableOpacity>
            ))}

            {error && <Text style={styles.error}>{error}</Text>}
          </View>
        )}

        {/* Paso 3: Nivel + consentimiento parental si aplica */}
        {step === 3 && (
          <View>
            <Text style={styles.sectionLabel}>{t('auth.onboarding.levelSectionLabel')}</Text>

            {LEVELS.map((lvl) => (
              <TouchableOpacity
                key={lvl.value}
                style={[
                  styles.levelCard,
                  level === lvl.value && styles.levelCardSelected,
                ]}
                onPress={() => setLevel(lvl.value)}
              >
                <View style={styles.levelCardHeader}>
                  <Text style={styles.levelIcon}>{levelIcons[lvl.value] ?? "•"}</Text>
                  <Text style={[styles.levelTitle, level === lvl.value && styles.levelTitleSelected]}>
                    {lvl.label}
                  </Text>
                </View>
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
          </View>
        )}
      </ScrollView>

      {/* Footer sticky con botón Continuar */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing[4] }]}>
        <TouchableOpacity
          style={[styles.footerButton, loading && styles.footerButtonDisabled]}
          onPress={() => {
            if (step === 1) {
              goToStep2();
            } else if (step === 2) {
              if (selectedGoals.length === 0) {
                setError(t('auth.onboarding.errorRequired'));
                return;
              }
              setError(null);
              setStep(3);
            } else {
              void handleFinish();
            }
          }}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={colors.black} />
            : (
              <Text style={styles.footerButtonText}>
                {step === 3 ? t('auth.onboarding.btnFinish') : t('auth.onboarding.continueBtn')}
              </Text>
            )
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  progressContainer: {
    flexDirection: "row",
    gap: spacing[1],
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
  },
  progressSegment: {
    flex: 1,
    height: 3,
    backgroundColor: colors.surface3,
    borderRadius: radius.sm,
  },
  progressSegmentActive: {
    backgroundColor: colors.lime,
  },
  content: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[6],
  },
  stepHeader: {
    marginBottom: spacing[6],
  },
  backBtn: {
    paddingVertical: spacing[1],
    marginBottom: spacing[2],
    alignSelf: "flex-start",
  },
  backBtnText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 28,
    lineHeight: 32,
  },
  stepSub: {
    fontFamily: typography.body,
    fontSize: fontSize.xs,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing[1],
  },
  stepTitle: {
    fontFamily: typography.heading,
    fontSize: fontSize.screenTitle,
    color: colors.text,
    marginBottom: spacing[3],
  },
  dotsRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface3,
  },
  dotActive: {
    width: 20,
    height: 6,
    backgroundColor: colors.lime,
  },
  welcomeCard: {
    backgroundColor: colors.limeGlow,
    borderWidth: 1,
    borderColor: colors.limeDim,
    borderRadius: radius.lg,
    padding: spacing[4],
    marginBottom: spacing[6],
  },
  welcomeCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  welcomeCardIcon: {
    fontSize: fontSize.xl,
    color: colors.lime,
  },
  welcomeCardTitle: {
    fontFamily: typography.heading,
    fontSize: fontSize.lg,
    color: colors.lime,
  },
  welcomeCardSubtitle: {
    fontFamily: typography.body,
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  label: {
    fontFamily: typography.body,
    color: colors.muted,
    marginBottom: spacing[2],
    fontSize: fontSize.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  labelSpaced: {
    marginTop: spacing[4],
  },
  error: {
    color: colors.error,
    marginTop: spacing[2],
    marginBottom: spacing[3],
    fontSize: fontSize.sm,
    fontFamily: typography.body,
  },
  sectionLabel: {
    fontFamily: typography.body,
    fontSize: fontSize.xs,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing[3],
  },
  // Goal rows
  goalRow: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surface4,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  goalRowSelected: {
    borderColor: colors.lime,
    backgroundColor: colors.limeGlow,
  },
  goalIcon: {
    fontSize: fontSize.xl,
  },
  goalText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    flex: 1,
  },
  goalTextSelected: {
    color: colors.lime,
  },
  goalCheck: {
    color: colors.lime,
    fontSize: fontSize.base,
    fontFamily: typography.body,
  },
  // Level cards
  levelCard: {
    padding: spacing[4],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface4,
    backgroundColor: colors.surface,
    marginBottom: spacing[3],
  },
  levelCardSelected: {
    borderColor: colors.lime,
    backgroundColor: colors.limeGlow,
  },
  levelCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  levelIcon: {
    fontSize: fontSize.xl,
  },
  levelTitle: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
  },
  levelTitleSelected: {
    color: colors.lime,
  },
  levelDesc: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  levelDescSelected: {
    color: colors.muted,
  },
  parentalBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: radius.md,
    padding: spacing[4],
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
  parentalTitle: {
    fontFamily: typography.body,
    color: colors.warning,
    marginBottom: spacing[2],
  },
  parentalText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 13,
    marginBottom: spacing[3],
    lineHeight: 18,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[2],
    marginTop: spacing[2],
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.gray,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  checkboxLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  // Footer
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    backgroundColor: colors.bg,
  },
  footerButton: {
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
  },
  footerButtonDisabled: {
    backgroundColor: colors.gray700,
  },
  footerButtonText: {
    fontFamily: typography.heading,
    fontSize: fontSize.lg,
    color: colors.black,
    letterSpacing: 1,
  },
});
