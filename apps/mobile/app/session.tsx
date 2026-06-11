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
        textAlign="center"
      />
    </View>
  );
}

function RestTimer({ seconds, onDone }: { seconds: number; onDone: () => void }): React.JSX.Element {
  const [remaining, setRemaining] = useState(seconds);
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse glow animation while resting
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [glowAnim]);

  useEffect(() => {
    if (remaining <= 0) {
      onDone();
      return;
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, onDone]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.08, 0.25],
  });

  return (
    <View style={styles.restTimerWrapper}>
      <Animated.View style={[styles.restGlowBg, { opacity: glowOpacity }]} />
      <Card style={styles.restTimerCard}>
        <Text style={styles.restTimerTitle}>Descansando</Text>
        <Text style={styles.restTimerCount}>{remaining}s</Text>
        <Pressable
          style={styles.restSkipBtn}
          onPress={onDone}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.restSkipText}>Saltar descanso</Text>
        </Pressable>
      </Card>
    </View>
  );
}

function LogSetButton({ onPress }: { onPress: () => void }): React.JSX.Element {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();

  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 2 }).start();

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      style={{ width: "100%" }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Animated.View style={[styles.logSetBtn, { transform: [{ scale }] }]}>
        <Text style={styles.logSetBtnText}>Registrar serie</Text>
      </Animated.View>
    </Pressable>
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
  const totalExercises = Math.max(exerciseIds.length, currentExerciseIndex + 1);
  const progressPercent = totalExercises > 0 ? currentExerciseIndex / totalExercises : 0;

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

      {/* Progress bar */}
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${Math.round(progressPercent * 100)}%` }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.sessionTitle}>{activeSession.routine_name}</Text>
          <Text style={styles.sessionStatus}>
            {isPaused ? "En pausa" : "Activo"}
            {" · "}
            <Text style={styles.sessionStatusMono}>
              {activeSession.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)}
            </Text>
            {" series totales"}
          </Text>
        </View>
        <Pressable
          style={styles.pauseBtn}
          onPress={isPaused ? resumeSession : pauseSession}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.pauseBtnText}>{isPaused ? "Continuar" : "Pausar"}</Text>
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
              EJERCICIO{" "}
              <Text style={styles.exerciseIndexMono}>{currentExerciseIndex + 1}</Text>
              {" / "}
              <Text style={styles.exerciseIndexMono}>{totalExercises}</Text>
            </Text>
            <Text style={styles.exerciseName}>
              {currentExerciseLog?.exercise_id ?? `Ejercicio ${currentExerciseIndex + 1}`}
            </Text>
            <Text style={styles.setsLogged}>
              <Text style={styles.setsLoggedMono}>{currentSetsLogged}</Text>
              {" "}{currentSetsLogged === 1 ? "serie registrada" : "series registradas"}
            </Text>

            {/* Sets logged */}
            {currentExerciseLog && currentExerciseLog.sets.length > 0 && (
              <View style={styles.setsTable}>
                <View style={styles.setsTableHeader}>
                  <Text style={styles.setsTableHeaderText}>SERIE</Text>
                  <Text style={styles.setsTableHeaderText}>REPS</Text>
                  <Text style={styles.setsTableHeaderText}>PESO (kg)</Text>
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

        {/* Rest timer */}
        {showRestTimer && (
          <RestTimer seconds={90} onDone={handleRestDone} />
        )}

        {/* Input section */}
        {!showRestTimer && !isPaused && (
          <Card style={styles.inputCard}>
            <Text style={styles.inputCardTitle}>
              SERIE{" "}
              <Text style={styles.inputCardTitleMono}>{currentSetsLogged + 1}</Text>
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
              <LogSetButton onPress={handleLogSet} />
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
    paddingTop: spacing[12],
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
  // Rest timer
  restTimerWrapper: {
    position: "relative",
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  restGlowBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.limeGlow,
  },
  restTimerCard: {
    alignItems: "center",
    paddingVertical: spacing[8],
    borderColor: colors.lime,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  restTimerTitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "700",
    marginBottom: spacing[2],
  },
  restTimerCount: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: 80,
    fontWeight: "900",
    letterSpacing: -2,
    shadowColor: colors.lime,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  restSkipBtn: {
    marginTop: spacing[4],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    minHeight: 44,
    justifyContent: "center",
  },
  restSkipText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 14,
    textDecorationLine: "underline",
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
