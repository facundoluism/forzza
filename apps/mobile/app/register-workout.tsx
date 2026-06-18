import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import { useAuth } from "@/providers/AuthProvider";
import { useWorkoutStore } from "@/stores/workoutStore";
import { syncPendingItems } from "@/services/sync";
import { supabase } from "@/lib/supabase";
import { track } from "@/lib/analytics";
import { TRACKED_EVENTS } from "@forzza/core";
import { Card, EmptyState, ErrorState, Confetti, ScreenHeader } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

interface Routine {
  id: string;
  title: string;
  exercises: RoutineExercise[];
}

interface RoutineExercise {
  exercise_id?: string;
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
}

interface SetRow {
  reps: string;
  weightKg: string;
}

interface ExerciseEntry {
  id: string;
  name: string;
  sets: SetRow[];
}

function emptyExercise(): ExerciseEntry {
  return {
    id: randomUUID(),
    name: "",
    sets: [{ reps: "", weightKg: "" }],
  };
}

function dateLabel(t: (key: string) => string, date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return t("registerWorkout.today");
  if (diff === 1) return t("registerWorkout.yesterday");
  if (diff === 2) return t("registerWorkout.twoDaysAgo");
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

const FEELING_EMOJIS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "💀",
  2: "😓",
  3: "😐",
  4: "💪",
  5: "🔥",
};

export default function RegisterWorkoutScreen(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const addToSyncQueue = useWorkoutStore((s) => s.addToSyncQueue);

  // Step 1 state
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  // "libre" is a sentinel value for "no routine selected"
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);

  // Step 2 state
  const [exercises, setExercises] = useState<ExerciseEntry[]>([emptyExercise()]);
  const [feeling, setFeeling] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: routines = [], isLoading: routinesLoading, isError: routinesError } = useQuery<Routine[]>({
    queryKey: ["routines-for-register", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("routines")
        .select("id, title, exercises")
        .eq("student_id", user.id)
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Routine[];
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  });

  function showDatePicker() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    Alert.alert(t("registerWorkout.selectDate"), undefined, [
      { text: t("registerWorkout.today"), onPress: () => setSelectedDate(new Date()) },
      { text: t("registerWorkout.yesterday"), onPress: () => setSelectedDate(yesterday) },
      { text: t("registerWorkout.twoDaysAgo"), onPress: () => setSelectedDate(twoDaysAgo) },
      { text: t("common.cancel"), style: "cancel" },
    ]);
  }

  function handleSelectRoutine(id: string) {
    setSelectedRoutineId(id);
    if (id === "libre") {
      setExercises([emptyExercise(), emptyExercise(), emptyExercise()]);
    } else {
      const routine = routines.find((r) => r.id === id);
      if (routine && Array.isArray(routine.exercises) && routine.exercises.length > 0) {
        setExercises(
          routine.exercises.map((ex) => ({
            id: ex.exercise_id ?? randomUUID(),
            name: ex.name,
            sets: Array.from({ length: ex.sets }, () => ({ reps: "", weightKg: "" })),
          }))
        );
      } else {
        setExercises([emptyExercise()]);
      }
    }
  }

  function handleNext() {
    if (!selectedRoutineId) {
      Alert.alert(t("registerWorkout.selectRoutine"));
      return;
    }
    setStep(2);
  }

  function addSet(exerciseIndex: number) {
    setExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex] = {
        ...updated[exerciseIndex]!,
        sets: [...updated[exerciseIndex]!.sets, { reps: "", weightKg: "" }],
      };
      return updated;
    });
  }

  function updateSet(exerciseIndex: number, setIndex: number, field: "reps" | "weightKg", value: string) {
    setExercises((prev) => {
      const updated = [...prev];
      const sets = [...updated[exerciseIndex]!.sets];
      sets[setIndex] = { ...sets[setIndex]!, [field]: value };
      updated[exerciseIndex] = { ...updated[exerciseIndex]!, sets };
      return updated;
    });
  }

  function updateExerciseName(exerciseIndex: number, name: string) {
    setExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex] = { ...updated[exerciseIndex]!, name };
      return updated;
    });
  }

  function handleSave() {
    if (!user?.id) return;

    if (feeling === null) {
      Alert.alert(t("registerWorkout.errorNoFeeling"));
      return;
    }

    const hasAtLeastOneSet = exercises.some((ex) =>
      ex.sets.some((s) => s.reps.trim().length > 0 || s.weightKg.trim().length > 0)
    );
    if (!hasAtLeastOneSet) {
      Alert.alert(t("registerWorkout.errorNoSets"));
      return;
    }

    setSaving(true);
    try {
      const client_uuid = randomUUID();
      const now = new Date();
      const startedAt = new Date(selectedDate);
      startedAt.setHours(now.getHours(), now.getMinutes(), 0, 0);
      const completedAt = new Date(startedAt.getTime() + 60 * 60 * 1000); // +1h estimate

      const routineId = selectedRoutineId === "libre" ? "" : (selectedRoutineId ?? "");
      const routineName =
        selectedRoutineId === "libre"
          ? "Entreno libre"
          : (routines.find((r) => r.id === selectedRoutineId)?.title ?? "Entreno libre");

      const sets_data = exercises
        .filter((ex) => ex.name.trim().length > 0 || ex.sets.some((s) => s.reps || s.weightKg))
        .map((ex) => ({
          exercise_id: ex.id,
          sets: ex.sets
            .filter((s) => s.reps.trim().length > 0 || s.weightKg.trim().length > 0)
            .map((s, idx) => ({
              set_number: idx + 1,
              reps: s.reps ? parseInt(s.reps, 10) : null,
              weight_kg: s.weightKg ? parseFloat(s.weightKg) : null,
              duration_seconds: null,
              completed_at: completedAt.toISOString(),
            })),
        }))
        .filter((ex) => ex.sets.length > 0);

      const syncItem = {
        client_uuid,
        payload: {
          client_uuid,
          student_id: user.id,
          routine_id: routineId,
          routine_name: routineName,
          status: "completed" as const,
          started_at: startedAt.toISOString(),
          completed_at: completedAt.toISOString(),
          sets_data,
        },
        retries: 0,
      };

      addToSyncQueue(syncItem);
      void syncPendingItems(supabase);

      track(TRACKED_EVENTS.WORKOUT_COMPLETED, {});

      setSaved(true);
    } catch {
      Alert.alert(t("common.error"));
    } finally {
      setSaving(false);
    }
  }

  // ── Saved state ───────────────────────────────────────────────────────────────
  const savedRoutineName =
    selectedRoutineId === "libre"
      ? t("registerWorkout.freeWorkout")
      : (routines.find((r) => r.id === selectedRoutineId)?.title ?? "");

  if (saved) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
        <Confetti active duration={3000} />
        <View style={styles.savedContainer}>
          <Text style={styles.savedEmoji}>💾</Text>
          <Text style={styles.savedTitle}>{t("registerWorkout.saved_title")}</Text>
          <Text style={styles.savedSubtitle}>{savedRoutineName}</Text>
          <TouchableOpacity
            style={styles.registerAnotherBtn}
            onPress={() => {
              setSaved(false);
              setStep(1);
              setSelectedRoutineId(null);
              setExercises([emptyExercise()]);
              setFeeling(null);
              setNotes("");
            }}
          >
            <Text style={styles.registerAnotherBtnText}>{t("registerWorkout.registerAnother")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace("/(tabs)/progress")}
            testID="register-workout-saved-btn"
          >
            <Text style={styles.primaryButtonText}>{t("registerWorkout.saved_back")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {step === 1 && (
        <View style={[styles.headerBar, { paddingTop: insets.top }]}>
          <ScreenHeader
            title={t("registerWorkout.screenTitle")}
            onBack={() => router.back()}
          />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.content}>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>{t("registerWorkout.step1Title")}</Text>

            {/* Info card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>{t("registerWorkout.infoCardTitle")}</Text>
              <Text style={styles.infoCardBody}>{t("registerWorkout.infoCardBody")}</Text>
            </View>

            {/* Date picker */}
            <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
              <Text style={styles.dateButtonLabel}>{t("registerWorkout.dateLabel")}</Text>
              <Text style={styles.dateButtonValue}>{dateLabel(t, selectedDate)}</Text>
            </TouchableOpacity>

            {/* Routine selector */}
            <Text style={styles.sectionLabel}>{t("registerWorkout.routineLabel")}</Text>

            {routinesLoading && (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={colors.lime} />
                <Text style={styles.loadingText}>{t("registerWorkout.routines_loading")}</Text>
              </View>
            )}

            {routinesError && !routinesLoading && (
              <ErrorState
                title={t("registerWorkout.routines_error")}
                description={t("common.noConnection")}
              />
            )}

            {!routinesLoading && !routinesError && (
              <>
                {routines.map((routine) => (
                  <TouchableOpacity
                    key={routine.id}
                    style={[
                      styles.routineRow,
                      selectedRoutineId === routine.id && styles.routineRowSelected,
                    ]}
                    onPress={() => handleSelectRoutine(routine.id)}
                    testID={`routine-row-${routine.id}`}
                  >
                    <View style={styles.routineRowInner}>
                      <View style={styles.routineRowInfo}>
                        <Text
                          style={[
                            styles.routineRowText,
                            selectedRoutineId === routine.id && styles.routineRowTextSelected,
                          ]}
                        >
                          {routine.title}
                        </Text>
                        <Text style={styles.routineRowCount}>
                          {t('routines.exercise', { count: Array.isArray(routine.exercises) ? routine.exercises.length : 0 })}
                        </Text>
                      </View>
                      <Text style={styles.routineRowChevron}>›</Text>
                    </View>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[
                    styles.routineRow,
                    selectedRoutineId === "libre" && styles.routineRowSelected,
                  ]}
                  onPress={() => handleSelectRoutine("libre")}
                  testID="routine-row-libre"
                >
                  <View style={styles.routineRowInner}>
                    <View style={styles.routineRowInfo}>
                      <Text
                        style={[
                          styles.routineRowText,
                          selectedRoutineId === "libre" && styles.routineRowTextSelected,
                        ]}
                      >
                        {t("registerWorkout.freeWorkout")}
                      </Text>
                    </View>
                    <Text style={styles.routineRowChevron}>›</Text>
                  </View>
                </TouchableOpacity>

                {routines.length === 0 && selectedRoutineId !== "libre" && (
                  <EmptyState
                    title={t("routines.empty_title")}
                    description={t("routines.empty_desc")}
                    icon="📋"
                  />
                )}
              </>
            )}

            <TouchableOpacity
              style={[styles.primaryButton, styles.marginTop]}
              onPress={handleNext}
              disabled={!selectedRoutineId}
              testID="register-workout-next-btn"
            >
              <Text style={styles.primaryButtonText}>{t("registerWorkout.next")}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <View>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep(1)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.backButtonText}>{t("registerWorkout.back")}</Text>
            </TouchableOpacity>

            <Text style={styles.stepTitle}>{t("registerWorkout.step2Title")}</Text>

            {exercises.map((exercise, exerciseIndex) => (
              <Card key={exercise.id} style={styles.exerciseCard}>
                <Text style={styles.exerciseSectionLabel}>
                  {t("registerWorkout.exercise", { n: exerciseIndex + 1 })}
                </Text>

                {/* Exercise name — only for libre workouts */}
                {selectedRoutineId === "libre" ? (
                  <TextInput
                    style={styles.exerciseNameInput}
                    value={exercise.name}
                    onChangeText={(v) => updateExerciseName(exerciseIndex, v)}
                    placeholder={t("registerWorkout.exerciseName")}
                    placeholderTextColor={colors.gray600}
                    testID={`exercise-name-${exerciseIndex}`}
                  />
                ) : (
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                )}

                {/* Set rows */}
                {exercise.sets.map((setRow, setIndex) => (
                  <View key={setIndex} style={styles.setRow}>
                    <Text style={styles.setLabel}>#{setIndex + 1}</Text>
                    <TextInput
                      style={styles.setInput}
                      value={setRow.reps}
                      onChangeText={(v) => updateSet(exerciseIndex, setIndex, "reps", v)}
                      placeholder={t("registerWorkout.reps")}
                      placeholderTextColor={colors.gray600}
                      keyboardType="numeric"
                      returnKeyType="done"
                      testID={`set-reps-${exerciseIndex}-${setIndex}`}
                    />
                    <TextInput
                      style={styles.setInput}
                      value={setRow.weightKg}
                      onChangeText={(v) => updateSet(exerciseIndex, setIndex, "weightKg", v)}
                      placeholder={t("registerWorkout.weightKg")}
                      placeholderTextColor={colors.gray600}
                      keyboardType="decimal-pad"
                      returnKeyType="done"
                      testID={`set-weight-${exerciseIndex}-${setIndex}`}
                    />
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.addSetButton}
                  onPress={() => addSet(exerciseIndex)}
                  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                >
                  <Text style={styles.addSetButtonText}>{t("registerWorkout.addSet")}</Text>
                </TouchableOpacity>
              </Card>
            ))}

            {/* Feeling selector */}
            <Text style={styles.sectionLabel}>{t("registerWorkout.feeling")}</Text>
            <View style={styles.feelingRow}>
              {([1, 2, 3, 4, 5] as const).map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[styles.feelingBtn, feeling === val && styles.feelingBtnSelected]}
                  onPress={() => setFeeling(val)}
                  testID={`feeling-btn-${val}`}
                >
                  <Text style={styles.feelingEmoji}>{FEELING_EMOJIS[val]}</Text>
                  <Text style={[styles.feelingLabel, feeling === val && styles.feelingLabelSelected]}>
                    {t(`registerWorkout.feelingScale_${val}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Notes */}
            <Text style={styles.sectionLabel}>{t("registerWorkout.notes")}</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder={t("registerWorkout.notesPlaceholder")}
              placeholderTextColor={colors.gray600}
              multiline
              numberOfLines={3}
              testID="register-workout-notes"
            />

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={saving}
              testID="register-workout-save-btn"
            >
              {saving
                ? <ActivityIndicator color={colors.bg} />
                : <Text style={styles.saveButtonText}>{t("registerWorkout.saveBtn")}</Text>
              }
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  headerBar: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    backgroundColor: colors.bg,
  },
  stepTitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: spacing[4],
  },
  // Info card
  infoCard: {
    backgroundColor: `${colors.info}15`,
    borderWidth: 1,
    borderColor: `${colors.info}40`,
    borderRadius: radius.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  infoCardTitle: {
    fontFamily: typography.body,
    color: colors.info,
    fontSize: fontSize.sm,
    fontWeight: "700",
    marginBottom: spacing[1],
  },
  infoCardBody: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.sm,
  },
  dateButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[5],
  },
  dateButtonLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.md,
  },
  dateButtonValue: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: fontSize.base,
  },
  sectionLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: spacing[3],
    marginTop: spacing[2],
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    padding: spacing[4],
  },
  loadingText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.md,
  },
  routineRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  routineRowSelected: {
    backgroundColor: colors.limeGlow,
    borderColor: colors.lime,
    borderWidth: 1.5,
  },
  routineRowInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  routineRowInfo: {
    flex: 1,
  },
  routineRowText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
  },
  routineRowTextSelected: {
    color: colors.lime,
    fontWeight: "600",
  },
  routineRowCount: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  routineRowChevron: {
    color: colors.muted,
    fontSize: 20,
  },
  primaryButton: {
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  primaryButtonText: {
    fontFamily: typography.heading,
    color: colors.bg,
    fontSize: fontSize["2xl"],
    letterSpacing: 1,
  },
  marginTop: {
    marginTop: spacing[5],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  backButton: {
    marginBottom: spacing[3],
  },
  backButtonText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.base,
  },
  exerciseCard: {
    marginBottom: spacing[4],
    padding: spacing[4],
  },
  exerciseSectionLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: spacing[2],
  },
  exerciseNameInput: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing[2],
    marginBottom: spacing[3],
  },
  exerciseName: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: "600",
    marginBottom: spacing[3],
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  setLabel: {
    fontFamily: typography.mono,
    color: colors.muted,
    fontSize: fontSize.sm,
    width: 24,
    textAlign: "right",
  },
  setInput: {
    flex: 1,
    backgroundColor: colors.surface3,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[2],
    color: colors.text,
    fontFamily: typography.mono,
    fontSize: fontSize.base,
    textAlign: "center",
    minHeight: 40,
  },
  addSetButton: {
    marginTop: spacing[2],
    alignSelf: "flex-start",
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lime,
  },
  addSetButtonText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  feelingRow: {
    flexDirection: "row",
    gap: spacing[2],
    marginBottom: spacing[5],
  },
  feelingBtn: {
    flex: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[1],
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  feelingBtnSelected: {
    backgroundColor: colors.limeGlow,
    borderColor: colors.lime,
  },
  feelingEmoji: {
    fontSize: 20,
    marginBottom: spacing[1],
    textAlign: "center",
  },
  feelingLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    textAlign: "center",
    fontWeight: "600",
  },
  feelingLabelSelected: {
    color: colors.lime,
  },
  notesInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    color: colors.text,
    fontFamily: typography.body,
    fontSize: fontSize.base,
    minHeight: 88,
    textAlignVertical: "top",
    marginBottom: spacing[5],
  },
  saveButton: {
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing[4],
  },
  saveButtonText: {
    fontFamily: typography.heading,
    color: colors.bg,
    fontSize: fontSize["2xl"],
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  // Saved state
  savedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[6],
  },
  savedEmoji: {
    fontSize: 56,
    textAlign: "center",
    marginBottom: spacing[4],
  },
  savedTitle: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: 40,
    letterSpacing: -1,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: spacing[2],
  },
  savedSubtitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    textAlign: "center",
    marginBottom: spacing[6],
  },
  registerAnotherBtn: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    marginBottom: spacing[3],
    width: "100%",
  },
  registerAnotherBtnText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: "700",
    textAlign: "center",
  },
});
