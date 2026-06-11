import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useWorkoutStore } from "@/stores/workoutStore";
import { syncPendingItems } from "@/services/sync";
import { supabase } from "@/lib/supabase";
import { useEntitlements } from "@/hooks/useEntitlements";
import { TRACKED_EVENTS } from "@forzza/core";
import { track } from "@/lib/analytics";
import { Button, Card, AutopromoOverlay } from "@forzza/ui/native";
import { colors, spacing, radius, typography } from "@forzza/ui/tokens";

const AUTOPROMO_SECONDS = 10;

interface NumberInputProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
}

function NumberInput({ label, value, onChangeText, placeholder = "0" }: NumberInputProps): React.JSX.Element {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        placeholder={placeholder}
        placeholderTextColor={colors.gray600}
        returnKeyType="done"
      />
    </View>
  );
}

function RestTimer({ seconds, onDone }: { seconds: number; onDone: () => void }): React.JSX.Element {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onDone();
      return;
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, onDone]);

  return (
    <Card style={styles.restTimerCard}>
      <Text style={styles.restTimerTitle}>Descansando</Text>
      <Text style={styles.restTimerCount}>{remaining}s</Text>
      <TouchableOpacity style={styles.restSkipBtn} onPress={onDone}>
        <Text style={styles.restSkipText}>Saltar descanso</Text>
      </TouchableOpacity>
    </Card>
  );
}

export default function SessionScreen(): React.JSX.Element | null {
  const router = useRouter();
  const {
    activeSession,
    logSet,
    pauseSession,
    resumeSession,
    finishSession,
  } = useWorkoutStore();

  const { isPro, hasCoach, isLoading: entitlementsLoading } = useEntitlements();

  const workoutFinishedRef = useRef(false);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [reps, setReps] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("");
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Build exercise list from routine (we only have what's been logged + we traverse by index)
  // The session doesn't carry the full routine definition, so we work with logged exercises
  const exerciseIds = activeSession.exercises.map((e) => e.exercise_id);
  const currentExerciseLog = activeSession.exercises[currentExerciseIndex];
  const currentSetsLogged = currentExerciseLog?.sets.length ?? 0;

  const handleLogSet = (): void => {
    const parsedReps = reps !== "" ? parseInt(reps, 10) : null;
    const parsedWeight = weightKg !== "" ? parseFloat(weightKg) : null;
    const parsedDuration = durationSeconds !== "" ? parseInt(durationSeconds, 10) : null;

    // Need at least one value
    if (parsedReps === null && parsedDuration === null) {
      Alert.alert("Faltan datos", "Ingresá las reps o la duración del set.");
      return;
    }

    const exerciseId =
      currentExerciseLog?.exercise_id ??
      `exercise_${currentExerciseIndex + 1}`;

    logSet(exerciseId, {
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
      "Finalizar entreno",
      "¿Terminaste el entreno de hoy?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Finalizar",
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

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.sessionTitle}>{activeSession.routine_name}</Text>
          <Text style={styles.sessionStatus}>
            {isPaused ? "En pausa" : "Activo"}
            {" · "}
            {activeSession.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)} series totales
          </Text>
        </View>
        <TouchableOpacity
          style={styles.pauseBtn}
          onPress={isPaused ? resumeSession : pauseSession}
        >
          <Text style={styles.pauseBtnText}>{isPaused ? "Continuar" : "Pausar"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Exercise navigation */}
        <Card style={styles.exerciseCard}>
          <Text style={styles.exerciseIndexLabel}>
            Ejercicio {currentExerciseIndex + 1}
          </Text>
          <Text style={styles.exerciseName}>
            {currentExerciseLog?.exercise_id ?? `Ejercicio ${currentExerciseIndex + 1}`}
          </Text>
          <Text style={styles.setsLogged}>
            {currentSetsLogged} {currentSetsLogged === 1 ? "serie registrada" : "series registradas"}
          </Text>

          {/* Sets logged */}
          {currentExerciseLog && currentExerciseLog.sets.length > 0 && (
            <View style={styles.setsTable}>
              <View style={styles.setsTableHeader}>
                <Text style={styles.setsTableHeaderText}>Serie</Text>
                <Text style={styles.setsTableHeaderText}>Reps</Text>
                <Text style={styles.setsTableHeaderText}>Peso (kg)</Text>
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
        </Card>

        {/* Rest timer */}
        {showRestTimer && (
          <RestTimer seconds={90} onDone={handleRestDone} />
        )}

        {/* Input section */}
        {!showRestTimer && !isPaused && (
          <Card style={styles.inputCard}>
            <Text style={styles.inputCardTitle}>
              Serie {currentSetsLogged + 1}
            </Text>
            <View style={styles.inputRow}>
              <View style={styles.inputCell}>
                <NumberInput label="Reps" value={reps} onChangeText={setReps} />
              </View>
              <View style={styles.inputCell}>
                <NumberInput
                  label="Peso (kg)"
                  value={weightKg}
                  onChangeText={setWeightKg}
                  placeholder="0.0"
                />
              </View>
            </View>
            <NumberInput
              label="Duración (s)"
              value={durationSeconds}
              onChangeText={setDurationSeconds}
            />
            <View style={styles.logBtnWrapper}>
              <Button
                label="Registrar serie"
                onPress={handleLogSet}
                fullWidth
                size="lg"
              />
            </View>
          </Card>
        )}

        {isPaused && (
          <Card style={styles.pausedCard}>
            <Text style={styles.pausedText}>
              El entreno está en pausa. Tocá "Continuar" para seguir.
            </Text>
          </Card>
        )}

        {/* Exercise navigation buttons */}
        <View style={styles.exerciseNav}>
          <Button
            label="‹ Anterior"
            variant="secondary"
            onPress={() => setCurrentExerciseIndex((i) => Math.max(0, i - 1))}
            disabled={currentExerciseIndex === 0}
          />
          <Button
            label="Siguiente ›"
            variant="secondary"
            onPress={() =>
              setCurrentExerciseIndex((i) =>
                Math.min(
                  Math.max(exerciseIds.length - 1, currentExerciseIndex),
                  i + 1
                )
              )
            }
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          label={isSyncing ? "Guardando..." : "Finalizar entreno"}
          variant="danger"
          onPress={handleFinish}
          fullWidth
          loading={isSyncing}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    paddingTop: spacing[12],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray800,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sessionTitle: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: 24,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  sessionStatus: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 13,
    marginTop: spacing[1],
  },
  pauseBtn: {
    backgroundColor: colors.gray800,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  pauseBtnText: {
    fontFamily: typography.body,
    color: colors.white,
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
  exerciseCard: {
    gap: spacing[2],
  },
  exerciseIndexLabel: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  exerciseName: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: 26,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  setsLogged: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: 13,
    fontWeight: "600",
  },
  setsTable: {
    marginTop: spacing[3],
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  setsTableHeader: {
    flexDirection: "row",
    backgroundColor: colors.gray800,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
  setsTableHeaderText: {
    flex: 1,
    fontFamily: typography.mono,
    color: colors.gray400,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  setsTableRow: {
    flexDirection: "row",
    backgroundColor: colors.gray900,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.gray800,
  },
  setsTableCell: {
    flex: 1,
    fontFamily: typography.mono,
    color: colors.white,
    fontSize: 14,
  },
  restTimerCard: {
    alignItems: "center",
    paddingVertical: spacing[6],
    borderColor: colors.lime,
    borderWidth: 1,
  },
  restTimerTitle: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing[2],
  },
  restTimerCount: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: 64,
    fontWeight: "700",
  },
  restSkipBtn: {
    marginTop: spacing[3],
  },
  restSkipText: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 14,
  },
  inputCard: {
    gap: spacing[4],
  },
  inputCardTitle: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: 20,
    letterSpacing: 0.5,
    textTransform: "uppercase",
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
    color: colors.gray400,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.gray900,
    borderWidth: 1,
    borderColor: colors.gray700,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    color: colors.white,
    fontFamily: typography.mono,
    fontSize: 18,
    fontWeight: "700",
  },
  logBtnWrapper: {
    marginTop: spacing[2],
  },
  pausedCard: {
    alignItems: "center",
    paddingVertical: spacing[6],
  },
  pausedText: {
    fontFamily: typography.body,
    color: colors.gray400,
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
    borderTopColor: colors.gray800,
    backgroundColor: colors.black,
  },
});
