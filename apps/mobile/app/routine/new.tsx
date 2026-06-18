import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import type { Json } from "@forzza/db-types";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { track } from "@/lib/analytics";
import { Input, Button, Card, NumInput } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";
import { ExerciseLibraryPicker } from "@/components/ExerciseLibraryPicker";
import { getExerciseIcon } from "@/constants/exerciseIcons";

// Shape canónico del JSONB routines.exercises
interface RoutineExercise {
  exercise_id?: string;
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
  order?: number;
}

// Tipo local extendido para la UI: guarda icon_id solo en memoria, no se persiste en JSONB
interface RoutineExerciseUI extends RoutineExercise {
  _icon_id?: string | null;
}

type Step = "info" | "exercises" | "review";

const STEP_ORDER: Step[] = ["info", "exercises", "review"];

const DEFAULT_EXERCISE: RoutineExerciseUI = {
  name: "",
  sets: 3,
  reps: "10",
  rest_seconds: 60,
  notes: "",
  _icon_id: null,
};

// ─── Exercise card editor ─────────────────────────────────────────────────────

interface ExerciseEditorProps {
  exercise: RoutineExerciseUI;
  index: number;
  onChange: (updated: RoutineExerciseUI) => void;
  onRemove: () => void;
  onPickFromLibrary: () => void;
  removeLabel: string;
  tapToSwapLabel: string;
  pickFromLibraryLabel: string;
  setsLabel: string;
  restLabel: string;
  repsLabel: string;
  repsPlaceholder: string;
  notesLabel: string;
  notesPlaceholder: string;
}

function ExerciseEditor({
  exercise,
  index,
  onChange,
  onRemove,
  onPickFromLibrary,
  removeLabel,
  tapToSwapLabel,
  pickFromLibraryLabel,
  setsLabel,
  restLabel,
  repsLabel,
  repsPlaceholder,
  notesLabel,
  notesPlaceholder,
}: ExerciseEditorProps): React.JSX.Element {
  const hasExercise = exercise.name.trim().length > 0;
  const icon = getExerciseIcon(exercise._icon_id ?? null);

  return (
    <Card style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseIndexBadge}>
          <Text style={styles.exerciseIndexText}>{index + 1}</Text>
        </View>
        <TouchableOpacity
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.removeButton}
        >
          <Text style={styles.removeButtonText}>{removeLabel}</Text>
        </TouchableOpacity>
      </View>

      {/* Selector de ejercicio desde biblioteca */}
      {hasExercise ? (
        <TouchableOpacity
          style={styles.exerciseSelectedRow}
          onPress={onPickFromLibrary}
          activeOpacity={0.7}
        >
          <Text style={styles.exerciseSelectedEmoji}>{icon.emoji}</Text>
          <View style={styles.exerciseSelectedInfo}>
            <Text style={styles.exerciseSelectedName}>{exercise.name}</Text>
            <Text style={styles.exerciseSelectedHint}>{tapToSwapLabel}</Text>
          </View>
          <Text style={styles.exerciseSelectedChevron}>›</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.pickExerciseButton}
          onPress={onPickFromLibrary}
          activeOpacity={0.7}
        >
          <Text style={styles.pickExerciseButtonText}>{pickFromLibraryLabel}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.exerciseStepperRow}>
        <View style={styles.stepperItem}>
          <NumInput
            label={setsLabel}
            value={exercise.sets}
            onChange={(v) => onChange({ ...exercise, sets: v })}
            min={1}
            max={20}
          />
        </View>
        <View style={styles.stepperItem}>
          <NumInput
            label={restLabel}
            value={exercise.rest_seconds}
            onChange={(v) => onChange({ ...exercise, rest_seconds: v })}
            min={0}
            max={600}
            step={15}
          />
        </View>
      </View>

      <View style={styles.repsField}>
        <Text style={styles.inputLabel}>{repsLabel}</Text>
        <Input
          placeholder={repsPlaceholder}
          value={exercise.reps}
          onChangeText={(v) => onChange({ ...exercise, reps: v })}
          keyboardType="default"
          returnKeyType="next"
        />
      </View>

      <Input
        label={notesLabel}
        placeholder={notesPlaceholder}
        value={exercise.notes ?? ""}
        onChangeText={(v) => {
          // exactOptionalPropertyTypes: spread condicional para campos opcionales
          const base: Omit<RoutineExerciseUI, "notes"> = {
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            rest_seconds: exercise.rest_seconds,
            ...(exercise.exercise_id !== undefined && { exercise_id: exercise.exercise_id }),
            ...(exercise.order !== undefined && { order: exercise.order }),
            ...(exercise._icon_id !== undefined && { _icon_id: exercise._icon_id }),
          };
          onChange(v ? { ...base, notes: v } : base);
        }}
        autoCapitalize="sentences"
        returnKeyType="done"
      />
    </Card>
  );
}

// ─── Step indicators ──────────────────────────────────────────────────────────

function StepBar({ current, stepLabels }: { current: Step; stepLabels: Record<Step, string> }): React.JSX.Element {
  return (
    <View style={styles.stepBar}>
      {STEP_ORDER.map((s, i) => {
        const currentIdx = STEP_ORDER.indexOf(current);
        const isPast = i < currentIdx;
        const isActive = i === currentIdx;
        return (
          <View key={s} style={styles.stepBarItem}>
            <View
              style={[
                styles.stepDot,
                isPast && styles.stepDotPast,
                isActive && styles.stepDotActive,
              ]}
            >
              {isPast ? (
                <Text style={styles.stepDotCheckText}>✓</Text>
              ) : (
                <Text style={[styles.stepDotNumber, isActive && styles.stepDotNumberActive]}>
                  {i + 1}
                </Text>
              )}
            </View>
            <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
              {stepLabels[s]}
            </Text>
            {i < STEP_ORDER.length - 1 && <View style={[styles.stepLine, isPast && styles.stepLinePast]} />}
          </View>
        );
      })}
    </View>
  );
}

// ─── Review panel ─────────────────────────────────────────────────────────────

function ReviewPanel({
  title,
  description,
  exercises,
  summaryLine,
  exerciseCountLabel,
  untitledLabel,
}: {
  title: string;
  description: string;
  exercises: RoutineExerciseUI[];
  summaryLine: (ex: RoutineExerciseUI) => string;
  exerciseCountLabel: string;
  untitledLabel: string;
}): React.JSX.Element {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.reviewContent}>
      <Text style={styles.reviewTitle}>{title || untitledLabel}</Text>
      {description ? (
        <Text style={styles.reviewDescription}>{description}</Text>
      ) : null}
      <Text style={styles.reviewSectionLabel}>
        {exerciseCountLabel}
      </Text>
      {exercises.map((ex, idx) => {
        const icon = getExerciseIcon(ex._icon_id ?? null);
        return (
          <Card key={idx} style={styles.reviewExerciseCard}>
            <View style={styles.reviewExerciseRow}>
              <Text style={styles.reviewExerciseEmoji}>{icon.emoji}</Text>
              <View style={styles.reviewExerciseInfo}>
                <Text style={styles.reviewExerciseName}>{ex.name}</Text>
                <Text style={styles.reviewExerciseMeta}>
                  {summaryLine(ex)}
                </Text>
                {ex.notes ? (
                  <Text style={styles.reviewExerciseNotes}>{ex.notes}</Text>
                ) : null}
              </View>
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function NewRoutineScreen(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const STEP_LABELS: Record<Step, string> = {
    info: t('routineNew.stepInfo'),
    exercises: t('routineNew.stepExercises'),
    review: t('routineNew.stepReview'),
  };

  const [step, setStep] = useState<Step>("info");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState<RoutineExerciseUI[]>([{ ...DEFAULT_EXERCISE }]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Estado del picker de biblioteca
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTargetIndex, setPickerTargetIndex] = useState<number | null>(null);

  const currentIdx = STEP_ORDER.indexOf(step);

  // ── Validations ──

  const infoValid = title.trim().length >= 2;

  const exercisesValid =
    exercises.length > 0 &&
    exercises.every((ex) => ex.name.trim().length >= 1 && ex.reps.trim().length >= 1);

  const canAdvance =
    step === "info"
      ? infoValid
      : step === "exercises"
      ? exercisesValid
      : false;

  // ── Handlers ──

  const handleUpdateExercise = useCallback(
    (index: number, updated: RoutineExerciseUI): void => {
      setExercises((prev) => {
        const next = [...prev];
        next[index] = updated;
        return next;
      });
    },
    []
  );

  const handleRemoveExercise = useCallback((index: number): void => {
    setExercises((prev) => {
      if (prev.length <= 1) {
        Alert.alert(t('routineNew.alertMinExercise'), t('routineNew.errorMinExercise'));
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  }, [t]);

  const handleOpenPicker = useCallback((index: number): void => {
    setPickerTargetIndex(index);
    setPickerVisible(true);
  }, []);

  const handlePickerSelect = useCallback(
    (selected: {
      exercise_id: string;
      name: string;
      icon_id: string | null;
      sets: number;
      reps: string;
      rest_seconds: number;
    }): void => {
      if (pickerTargetIndex === null) return;
      setExercises((prev) => {
        const next = [...prev];
        const current = next[pickerTargetIndex] ?? DEFAULT_EXERCISE;
        // Cambiar de ejercicio solo actualiza identidad (id/nombre/ícono).
        // Series/reps/descanso ya ajustados por el usuario se preservan; solo
        // se aplican los sugeridos del picker si el ejercicio estaba vacío.
        const isEmpty = current.name.trim().length === 0;
        next[pickerTargetIndex] = {
          ...current,
          exercise_id: selected.exercise_id,
          name: selected.name,
          _icon_id: selected.icon_id,
          ...(isEmpty
            ? {
                sets: selected.sets,
                reps: selected.reps,
                rest_seconds: selected.rest_seconds,
              }
            : {}),
        };
        return next;
      });
      setPickerVisible(false);
      setPickerTargetIndex(null);
    },
    [pickerTargetIndex]
  );

  const handlePickerClose = useCallback((): void => {
    setPickerVisible(false);
    setPickerTargetIndex(null);
  }, []);

  const handleAddExerciseFromLibrary = useCallback((): void => {
    const newIndex = exercises.length;
    setExercises((prev) => [...prev, { ...DEFAULT_EXERCISE }]);
    // Abre el picker apuntando al nuevo ejercicio vacío
    setPickerTargetIndex(newIndex);
    setPickerVisible(true);
  }, [exercises.length]);

  const handleBack = (): void => {
    if (currentIdx === 0) {
      router.back();
    } else {
      setStep(STEP_ORDER[currentIdx - 1]!);
    }
  };

  const handleNext = (): void => {
    if (step === "exercises") {
      setStep("review");
    } else if (step === "info") {
      setStep("exercises");
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!user) return;
    setSaveError(null);
    setIsSaving(true);

    try {
      // Sanitize exercises: contrato canónico con exercise_id y order
      const cleanExercises: RoutineExercise[] = exercises.map((ex, idx) => ({
        ...(ex.exercise_id ? { exercise_id: ex.exercise_id } : {}),
        name: ex.name.trim(),
        sets: ex.sets,
        reps: ex.reps.trim(),
        rest_seconds: ex.rest_seconds,
        order: idx,
        ...(ex.notes?.trim() ? { notes: ex.notes.trim() } : {}),
      }));

      const { error } = await supabase.from("routines").insert({
        student_id: user.id,
        coach_id: null,
        title: title.trim(),
        description: description.trim() || null,
        exercises: cleanExercises as unknown as Json,
        active: true,
      });

      if (error) throw error;

      // Analytics event
      track("workout_started" as never, { plan: "free", routine_source: "student_created" });

      // Invalidate routines list so it refetches
      await queryClient.invalidateQueries({ queryKey: ["routines", user.id] });

      router.back();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t('routineNew.errorSave');
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Render steps ──

  const renderInfoStep = (): React.JSX.Element => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.stepContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.stepHeading}>{t('routineNew.basicInfo')}</Text>
      <Text style={styles.stepSubheading}>{t('routineNew.headerSubtitle')}</Text>

      <View style={styles.fieldGap}>
        <Input
          label={t('routineNew.routineNameLabel')}
          placeholder={t('routineNew.routineNameExample')}
          value={title}
          onChangeText={setTitle}
          autoCapitalize="sentences"
          returnKeyType="next"
          {...(title.length > 0 && title.trim().length < 2
            ? { error: t('routineNew.errorNameRequired') }
            : {})}
        />
      </View>

      <View style={styles.fieldGap}>
        <Input
          label={t('routineNew.descriptionLabel')}
          placeholder={t('routineNew.descriptionPlaceholder')}
          value={description}
          onChangeText={setDescription}
          autoCapitalize="sentences"
          multiline
          numberOfLines={3}
          returnKeyType="done"
        />
      </View>
    </ScrollView>
  );

  const renderExercisesStep = (): React.JSX.Element => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.stepContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.stepHeading}>{t('routineNew.stepExercises')}</Text>
      <Text style={styles.stepSubheading}>
        {t('routineNew.pickExercisesHint')}
      </Text>

      <View style={styles.exercisesList}>
        {exercises.map((ex, idx) => (
          <ExerciseEditor
            key={idx}
            exercise={ex}
            index={idx}
            onChange={(updated) => handleUpdateExercise(idx, updated)}
            onRemove={() => handleRemoveExercise(idx)}
            onPickFromLibrary={() => handleOpenPicker(idx)}
            removeLabel={t('routineNew.remove')}
            tapToSwapLabel={t('routineNew.tapToSwap')}
            pickFromLibraryLabel={t('routineNew.pickFromLibrary')}
            setsLabel={t('routineNew.sets')}
            restLabel={t('routineNew.restSeconds')}
            repsLabel={t('routineNew.reps')}
            repsPlaceholder={t('routineNew.repsPlaceholder')}
            notesLabel={t('routineNew.notes')}
            notesPlaceholder={t('routineNew.notesPlaceholder')}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.addExerciseButton}
        onPress={handleAddExerciseFromLibrary}
        activeOpacity={0.7}
      >
        <Text style={styles.addExerciseButtonText}>{t('routineNew.addExercise')}</Text>
      </TouchableOpacity>

      {exercises.length > 0 &&
        exercises.some((ex) => ex.name.trim().length === 0) && (
          <Text style={styles.validationHint}>
            {t('routineNew.errorMinExercise')}
          </Text>
        )}
    </ScrollView>
  );

  const renderReviewStep = (): React.JSX.Element => (
    <ReviewPanel
      title={title}
      description={description}
      exercises={exercises}
      summaryLine={(ex) => t('routineNew.summaryLine', { sets: ex.sets, reps: ex.reps, rest: ex.rest_seconds })}
      exerciseCountLabel={t('routineNew.exercise', { count: exercises.length })}
      untitledLabel={t('routineNew.untitled')}
    />
  );

  // ── Layout ──

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>
            {currentIdx === 0 ? t('routineNew.cancel') : t('routineNew.back')}
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('routineNew.screenTitle')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Step indicator */}
      <StepBar current={step} stepLabels={STEP_LABELS} />

      {/* Step body */}
      <View style={styles.body}>
        {step === "info" && renderInfoStep()}
        {step === "exercises" && renderExercisesStep()}
        {step === "review" && renderReviewStep()}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {saveError ? (
          <Text style={styles.saveError}>{saveError}</Text>
        ) : null}

        {step === "review" ? (
          <Button
            label={isSaving ? t('routineNew.saving') : t('routineNew.save')}
            onPress={() => { void handleSave(); }}
            loading={isSaving}
            disabled={isSaving}
            fullWidth
            size="lg"
          />
        ) : (
          <Button
            label={t('routineNew.next')}
            onPress={handleNext}
            disabled={!canAdvance}
            fullWidth
            size="lg"
          />
        )}
      </View>

      {/* Modal: biblioteca de ejercicios */}
      <ExerciseLibraryPicker
        visible={pickerVisible}
        onClose={handlePickerClose}
        onSelect={handlePickerSelect}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing[12],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    minWidth: 72,
  },
  backButtonText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.base,
  },
  headerTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: 20,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerSpacer: {
    minWidth: 72,
  },

  // ── Step bar ──
  stepBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    gap: 0,
  },
  stepBarItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[2],
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  stepDotPast: {
    backgroundColor: colors.limeDark,
    borderColor: colors.limeDark,
  },
  stepDotNumber: {
    fontFamily: typography.mono,
    color: colors.muted,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  stepDotNumberActive: {
    color: colors.black,
  },
  stepDotCheckText: {
    fontFamily: typography.mono,
    color: colors.black,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  stepLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  stepLabelActive: {
    color: colors.lime,
    fontWeight: "700",
    fontSize: fontSize.sm,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: spacing[1],
  },
  stepLinePast: {
    backgroundColor: colors.limeDark,
  },

  // ── Body ──
  body: {
    flex: 1,
  },
  stepContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  stepHeading: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: 28,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: spacing[1],
  },
  stepSubheading: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.md,
    marginBottom: spacing[5],
  },
  fieldGap: {
    marginBottom: spacing[4],
  },

  // ── Exercise editor ──
  exercisesList: {
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  exerciseCard: {
    gap: spacing[3],
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing[1],
  },
  exerciseIndexBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseIndexText: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  removeButton: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  removeButtonText: {
    fontFamily: typography.body,
    color: colors.error,
    fontSize: fontSize.sm,
  },
  exerciseStepperRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing[3],
    marginVertical: spacing[2],
  },
  stepperItem: {
    flex: 1,
    alignItems: "center",
  },
  repsField: {
    marginBottom: spacing[1],
  },
  inputLabel: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: fontSize.md,
    marginBottom: spacing[2],
  },

  // ── Selected exercise display ──
  exerciseSelectedRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface3,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lime,
    padding: spacing[3],
    gap: spacing[3],
    marginBottom: spacing[2],
  },
  exerciseSelectedEmoji: {
    fontSize: 28,
  },
  exerciseSelectedInfo: {
    flex: 1,
  },
  exerciseSelectedName: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: "600",
    marginBottom: spacing[1],
  },
  exerciseSelectedHint: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  exerciseSelectedChevron: {
    color: colors.lime,
    fontSize: 20,
  },

  // ── Pick from library button ──
  pickExerciseButton: {
    borderWidth: 1,
    borderColor: colors.lime,
    borderStyle: "dashed",
    borderRadius: radius.md,
    paddingVertical: spacing[4],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[2],
    backgroundColor: colors.limeGlow,
  },
  pickExerciseButtonText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.base,
    fontWeight: "700",
  },

  // ── Add exercise button ──
  addExerciseButton: {
    borderWidth: 1,
    borderColor: colors.lime,
    borderStyle: "dashed",
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing[2],
  },
  addExerciseButtonText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.base,
    fontWeight: "700",
  },
  validationHint: {
    fontFamily: typography.body,
    color: colors.error,
    fontSize: fontSize.sm,
    marginTop: spacing[3],
    textAlign: "center",
  },

  // ── Review ──
  reviewContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  reviewTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: 32,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: spacing[2],
  },
  reviewDescription: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
    marginBottom: spacing[4],
  },
  reviewSectionLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing[3],
    fontWeight: "700",
  },
  reviewExerciseCard: {
    marginBottom: spacing[3],
  },
  reviewExerciseRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
  },
  reviewExerciseEmoji: {
    fontSize: 24,
    lineHeight: 28,
    marginTop: 2,
  },
  reviewExerciseInfo: {
    flex: 1,
  },
  reviewExerciseName: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: "600",
    marginBottom: spacing[1],
  },
  reviewExerciseMeta: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  reviewExerciseNotes: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: fontSize.sm,
    fontStyle: "italic",
    marginTop: spacing[1],
  },

  // ── Footer ──
  footer: {
    padding: spacing[4],
    paddingBottom: spacing[8],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
    gap: spacing[3],
  },
  saveError: {
    fontFamily: typography.body,
    color: colors.error,
    fontSize: fontSize.sm,
    textAlign: "center",
  },
});
