import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWorkoutStore } from "@/stores/workoutStore";
import { syncPendingItems } from "@/services/sync";
import { supabase } from "@/lib/supabase";
import { useEntitlements } from "@/hooks/useEntitlements";
import { TRACKED_EVENTS } from "@forzza/core";
import { track } from "@/lib/analytics";
import { ExercisePreviewSheet } from "@/components/ExercisePreviewSheet";
import { Button, Card, AutopromoOverlay, RestTimer } from "@forzza/ui/native";
import { colors, spacing, radius, typography } from "@forzza/ui/tokens";

const AUTOPROMO_SECONDS = 10;

interface NumberInputProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  testID?: string;
}

function NumberInput({ label, value, onChangeText, placeholder = "0", testID }: NumberInputProps): React.JSX.Element {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        testID={testID}
        accessibilityLabel={label}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        placeholder={placeholder}
        placeholderTextColor={colors.gray600}
        returnKeyType="done"
        textAlign="center"
      />
    </View>
  );
}


function LogSetButton({ onPress, label }: { onPress: () => void; label: string }): React.JSX.Element {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();

  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 2 }).start();

  return (
    <Pressable
      testID="log-set-button"
      accessibilityLabel={label}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      style={{ width: "100%" }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Animated.View style={[styles.logSetBtn, { transform: [{ scale }] }]}>
        <Text style={styles.logSetBtnText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function SessionScreen(): React.JSX.Element | null {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    activeSession,
    logSet,
    pauseSession,
    resumeSession,
    finishSession,
  } = useWorkoutStore();
  const insets = useSafeAreaInsets();

  const { isPro, hasCoach, isLoading: entitlementsLoading } = useEntitlements();

  const workoutFinishedRef = useRef(false);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [reps, setReps] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("");
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showExerciseSheet, setShowExerciseSheet] = useState(false);

  // Autopromo state
  const [showAutopromo, setShowAutopromo] = useState(false);
  const [autopromoSeconds, setAutopromoSeconds] = useState(AUTOPROMO_SECONDS);

  // Show autopromo on mount for free users without a coach
  useEffect(() => {
    if (!entitlementsLoading && !isPro && !hasCoach) {
      setShowAutopromo(true);
      setAutopromoSeconds(AUTOPROMO_SECONDS);
    }
  }, [entitlementsLoading, isPro, hasCoach]);

  // Countdown tick while autopromo is visible
  useEffect(() => {
    if (!showAutopromo) return;
    if (autopromoSeconds <= 0) {
      setShowAutopromo(false);
      return;
    }
    const timer = setTimeout(() => setAutopromoSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [showAutopromo, autopromoSeconds]);

  const handleAutopromoDismiss = useCallback((): void => {
    setShowAutopromo(false);
  }, []);

  // Track workout started on mount when session is active; abandoned on unmount if not finished
  useEffect(() => {
    if (activeSession) {
      track(TRACKED_EVENTS.WORKOUT_STARTED);
    }
    return () => {
      if (!workoutFinishedRef.current) {
        track(TRACKED_EVENTS.WORKOUT_ABANDONED);
      }
    };
  }, []);

  // Redirect if no active session
  useEffect(() => {
    if (!activeSession) {
      router.replace("/(tabs)");
    }
  }, [activeSession, router]);

  const handleRestDone = useCallback((): void => {
    setShowRestTimer(false);
  }, []);

  if (!activeSession) {
    return null;
  }

  // routineExercises transporta la definición completa de la rutina (nombres, series, descanso).
  // Guard con ?? [] por si se rehidrata una sesión vieja persistida sin este campo.
  const routineExercises = activeSession.routineExercises ?? [];
  const currentRoutineExercise = routineExercises[currentExerciseIndex] ?? null;

  // Para la navegación usamos la longitud de la definición de rutina como referencia
  // y complementamos con los logs reales registrados durante la sesión
  const currentExerciseKey =
    currentRoutineExercise?.exercise_id ?? `exercise_${currentExerciseIndex + 1}`;
  const currentExerciseLog = activeSession.exercises.find(
    (e) => e.exercise_id === currentExerciseKey
  );
  const currentSetsLogged = currentExerciseLog?.sets.length ?? 0;

  // Total: el mayor entre los ejercicios definidos en la rutina y los ya navegados
  const totalExercises = Math.max(
    routineExercises.length,
    routineExercises.length || activeSession.exercises.length,
    currentExerciseIndex + 1
  );
  const progressPercent = totalExercises > 0 ? currentExerciseIndex / totalExercises : 0;

  // Nombre del ejercicio actual: primero el nombre de la rutina, fallback a ID o genérico
  const currentExerciseName =
    currentRoutineExercise?.name ??
    currentExerciseLog?.exercise_id ??
    t('session.exerciseFallback', { n: currentExerciseIndex + 1 });

  // Segundos de descanso: del ejercicio de la rutina o 90s por defecto
  const currentRestSeconds =
    (currentRoutineExercise?.rest_seconds ?? 0) > 0
      ? (currentRoutineExercise?.rest_seconds ?? 90)
      : 90;
  const targetSets = currentRoutineExercise?.sets ?? null;
  const targetReached = targetSets !== null && currentSetsLogged >= targetSets;

  // El botón "Ver ficha" solo aparece si el ejercicio actual tiene exercise_id en la biblioteca
  const currentExerciseLibraryId = currentRoutineExercise?.exercise_id ?? null;

  const handleLogSet = (): void => {
    const parsedReps = reps !== "" ? parseInt(reps, 10) : null;
    const parsedWeight = weightKg !== "" ? parseFloat(weightKg) : null;
    const parsedDuration = durationSeconds !== "" ? parseInt(durationSeconds, 10) : null;

    // Need at least one value
    if (parsedReps === null && parsedDuration === null) {
      Alert.alert(t('session.errorMissingData'), t('session.errorMissingDataDesc'));
      return;
    }

    logSet(currentExerciseKey, {
      reps: parsedReps,
      weight_kg: parsedWeight,
      duration_seconds: parsedDuration,
    });

    // Reset inputs
    setReps("");
    setWeightKg("");
    setDurationSeconds("");
    setShowRestTimer(true);
  };

  const handleFinish = (): void => {
    Alert.alert(
      t('session.finishTitle'),
      t('session.finishConfirm'),
      [
        { text: t('session.cancel'), style: "cancel" },
        {
          text: t('session.finish'),
          style: "default",
          onPress: async () => {
            setIsSyncing(true);
            workoutFinishedRef.current = true;
            track(TRACKED_EVENTS.WORKOUT_COMPLETED);
            finishSession();
            try {
              await syncPendingItems(supabase);
            } catch (err) {
              console.error("[session] Error syncing on finish:", err);
            } finally {
              setIsSyncing(false);
              router.replace("/(tabs)");
            }
          },
        },
      ]
    );
  };

  const isPaused = activeSession.status === "paused";

  return (
    <View style={styles.container}>
      {/* Autopromo overlay — shown before session starts for free users */}
      <AutopromoOverlay
        visible={showAutopromo}
        onDismiss={handleAutopromoDismiss}
        secondsLeft={autopromoSeconds}
      />

      {/* Progress bar */}
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${Math.round(progressPercent * 100)}%` }]} />
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing[2] }]}>
        <View style={styles.headerContent}>
          <Text style={styles.sessionTitle}>{activeSession.routine_name}</Text>
          <Text style={styles.sessionStatus}>
            {isPaused ? t('session.statusPaused') : t('session.statusActive')}
            {" · "}
            <Text style={styles.sessionStatusMono}>
              {activeSession.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)}
            </Text>
            {" "}{t('session.totalSets')}
          </Text>
        </View>
        <Pressable
          style={styles.pauseBtn}
          onPress={isPaused ? resumeSession : pauseSession}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.pauseBtnText}>{isPaused ? t('session.btnResume') : t('session.btnPause')}</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Exercise card */}
        <Card style={styles.exerciseCard} featured>
          <View style={styles.exerciseCardInner}>
            <Text style={styles.exerciseIndexLabel}>
              {t('session.currentExercise')}{" "}
              <Text style={styles.exerciseIndexMono}>{currentExerciseIndex + 1}</Text>
              {" / "}
              <Text style={styles.exerciseIndexMono}>{totalExercises}</Text>
            </Text>

            {/* Nombre del ejercicio + botón Ver ficha */}
            <View style={styles.exerciseNameRow}>
              <Text style={styles.exerciseName}>{currentExerciseName}</Text>
              {currentExerciseLibraryId && (
                <Pressable
                  style={styles.fichaBtn}
                  onPress={() => setShowExerciseSheet(true)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.fichaBtnText}>{t('session.viewCard')}</Text>
                </Pressable>
              )}
            </View>

            <Text style={styles.setsLogged}>
              <Text style={styles.setsLoggedMono}>{currentSetsLogged}</Text>
              {" "}{t('session.setLogged', { count: currentSetsLogged })}
            </Text>

            {currentRoutineExercise && (
              <View style={styles.planBox}>
                <Text style={styles.planBoxLabel}>{t('session.plannedWork')}</Text>
                <Text style={styles.planBoxText}>
                  {t('session.planLine', {
                    sets: currentRoutineExercise.sets,
                    reps: currentRoutineExercise.reps,
                    rest: currentRestSeconds,
                  })}
                </Text>
                {currentRoutineExercise.notes ? (
                  <Text style={styles.planBoxNote}>{currentRoutineExercise.notes}</Text>
                ) : null}
              </View>
            )}

            {targetReached && (
              <View style={styles.targetReachedBox}>
                <Text style={styles.targetReachedText}>
                  {t('session.targetReached')}
                </Text>
              </View>
            )}

            {/* Sets logged */}
            {currentExerciseLog && currentExerciseLog.sets.length > 0 && (
              <View style={styles.setsTable}>
                <View style={styles.setsTableHeader}>
                  <Text style={styles.setsTableHeaderText}>{t('session.set')}</Text>
                  <Text style={styles.setsTableHeaderText}>{t('session.reps')}</Text>
                  <Text style={styles.setsTableHeaderText}>{t('session.weightKg')}</Text>
                </View>
                {currentExerciseLog.sets.map((s) => (
                  <View key={s.set_number} style={styles.setsTableRow}>
                    <Text style={styles.setsTableCell}>{s.set_number}</Text>
                    <Text style={styles.setsTableCell}>{s.reps ?? "—"}</Text>
                    <Text style={styles.setsTableCell}>{s.weight_kg ?? "—"}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Card>

        {/* Rest timer — usa segundos definidos en la rutina, o 90s por defecto */}
        {showRestTimer && (
          <RestTimer
            seconds={currentRestSeconds}
            onComplete={handleRestDone}
            onSkip={handleRestDone}
            skipLabel={t('session.skipRest')}
          />
        )}

        {/* Input section */}
        {!showRestTimer && !isPaused && (
          <Card style={styles.inputCard}>
            <Text style={styles.inputCardTitle}>
              {t('session.set')}{" "}
              <Text style={styles.inputCardTitleMono}>{currentSetsLogged + 1}</Text>
            </Text>
            <View style={styles.inputRow}>
              <View style={styles.inputCell}>
                <NumberInput testID="reps-input" label={t('session.reps')} value={reps} onChangeText={setReps} />
              </View>
              <View style={styles.inputCell}>
                <NumberInput
                  testID="weight-input"
                  label={t('session.weightKg')}
                  value={weightKg}
                  onChangeText={setWeightKg}
                  placeholder="0.0"
                />
              </View>
            </View>
            <NumberInput
              testID="duration-input"
              label={t('session.durationS')}
              value={durationSeconds}
              onChangeText={setDurationSeconds}
            />
            <View style={styles.logBtnWrapper}>
              <LogSetButton onPress={handleLogSet} label={t('session.logSet')} />
            </View>
          </Card>
        )}

        {isPaused && (
          <Card style={styles.pausedCard}>
            <Text style={styles.pausedText}>
              {t('session.pausedHint')}
            </Text>
          </Card>
        )}

        {/* Exercise navigation buttons */}
        <View style={styles.exerciseNav}>
          <Button
            testID="previous-exercise-button"
            label={t('session.prevExercise')}
            variant="secondary"
            onPress={() => setCurrentExerciseIndex((i) => Math.max(0, i - 1))}
            disabled={currentExerciseIndex === 0}
          />
          <Button
            testID="next-exercise-button"
            label={t('session.nextExercise')}
            variant="secondary"
            onPress={() =>
              setCurrentExerciseIndex((i) =>
                Math.min(totalExercises - 1, i + 1)
              )
            }
            disabled={currentExerciseIndex >= totalExercises - 1}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          testID="finish-workout-button"
          label={isSyncing ? t('session.saving') : t('session.finishTitle')}
          variant="danger"
          onPress={handleFinish}
          fullWidth
          loading={isSyncing}
        />
      </View>

      {/* Sheet de ficha del ejercicio actual */}
      <ExercisePreviewSheet
        exerciseId={showExerciseSheet ? currentExerciseLibraryId : null}
        onClose={() => setShowExerciseSheet(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  // Progress bar
  progressBarTrack: {
    height: 3,
    backgroundColor: colors.surface2,
    width: "100%",
  },
  progressBarFill: {
    height: 3,
    backgroundColor: colors.lime,
    shadowColor: colors.lime,
    shadowOpacity: 0.6,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  // Header
  header: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerContent: {
    flex: 1,
  },
  sessionTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
    textTransform: "uppercase",
  },
  sessionStatus: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 13,
    marginTop: spacing[1],
  },
  sessionStatusMono: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: 13,
  },
  pauseBtn: {
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    minHeight: 44,
    justifyContent: "center",
  },
  pauseBtnText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing[4],
    gap: spacing[4],
    paddingBottom: spacing[8],
  },
  // Exercise card
  exerciseCard: {
    paddingTop: spacing[5],
  },
  exerciseCardInner: {
    gap: spacing[2],
  },
  exerciseNameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
  },
  fichaBtn: {
    backgroundColor: colors.surface3,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    alignSelf: "flex-start",
    marginTop: spacing[1],
  },
  fichaBtnText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: 12,
    fontWeight: "600",
  },
  exerciseIndexLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "700",
  },
  exerciseIndexMono: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: 11,
  },
  exerciseName: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.5,
    textTransform: "uppercase",
    flex: 1,
  },
  setsLogged: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: 13,
    fontWeight: "600",
  },
  setsLoggedMono: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: 13,
  },
  planBox: {
    marginTop: spacing[2],
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[3],
    gap: spacing[1],
  },
  planBoxLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "700",
  },
  planBoxText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  planBoxNote: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 13,
    lineHeight: 18,
  },
  targetReachedBox: {
    marginTop: spacing[2],
    backgroundColor: colors.limeGlow,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lime,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  targetReachedText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  setsTable: {
    marginTop: spacing[3],
    borderRadius: radius.sm,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  setsTableHeader: {
    flexDirection: "row",
    backgroundColor: colors.surface2,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
  setsTableHeaderText: {
    flex: 1,
    fontFamily: typography.mono,
    color: colors.muted,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  setsTableRow: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  setsTableCell: {
    flex: 1,
    fontFamily: typography.mono,
    color: colors.text,
    fontSize: 14,
  },
  // Input card
  inputCard: {
    gap: spacing[4],
  },
  inputCardTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  inputCardTitleMono: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: 20,
  },
  inputRow: {
    flexDirection: "row",
    gap: spacing[3],
  },
  inputCell: {
    flex: 1,
  },
  inputGroup: {
    gap: spacing[1],
  },
  inputLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "700",
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[4],
    color: colors.text,
    fontFamily: typography.mono,
    fontSize: 28,
    fontWeight: "700",
    minHeight: 72,
  },
  // Log set button
  logSetBtn: {
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
    width: "100%",
    shadowColor: colors.lime,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
    minHeight: 56,
    justifyContent: "center",
  },
  logSetBtnText: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  logBtnWrapper: {
    marginTop: spacing[2],
    alignItems: "center",
    width: "100%",
  },
  pausedCard: {
    alignItems: "center",
    paddingVertical: spacing[6],
  },
  pausedText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 14,
    textAlign: "center",
  },
  exerciseNav: {
    flexDirection: "row",
    gap: spacing[3],
  },
  footer: {
    padding: spacing[4],
    paddingBottom: spacing[8],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
});
