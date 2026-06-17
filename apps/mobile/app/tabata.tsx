import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEntitlements } from "@/hooks/useEntitlements";
import { track } from "@/lib/analytics";
import { TRACKED_EVENTS } from "@forzza/core";
import { AutopromoOverlay, Confetti, Card } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

const AUTOPROMO_SECONDS = 10;

type Phase = "config" | "running" | "done";
type IntervalPhase = "work" | "rest";

export default function TabataScreen(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { isPro, hasCoach, isLoading: entitlementsLoading } = useEntitlements();

  // Config state
  const [workSecs, setWorkSecs] = useState(20);
  const [restSecs, setRestSecs] = useState(10);
  const [totalRounds, setTotalRounds] = useState(8);

  // Phase state
  const [phase, setPhase] = useState<Phase>("config");
  const [intervalPhase, setIntervalPhase] = useState<IntervalPhase>("work");
  const [currentRound, setCurrentRound] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [paused, setPaused] = useState(false);

  // Autopromo
  const [showAutopromo, setShowAutopromo] = useState(false);
  const [autopromoSeconds, setAutopromoSeconds] = useState(AUTOPROMO_SECONDS);
  const [pendingStart, setPendingStart] = useState(false);

  // Timer ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Track done state for confetti
  const [showConfetti, setShowConfetti] = useState(false);

  // ── Timer logic ─────────────────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRunning = useCallback(() => {
    setPhase("running");
    setIntervalPhase("work");
    setCurrentRound(1);
    setSecondsLeft(workSecs);
    setPaused(false);

    track(TRACKED_EVENTS.WORKOUT_STARTED, {});
  }, [workSecs]);

  // ── Autopromo logic ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!pendingStart) return;
    if (entitlementsLoading) return;
    if (!isPro && !hasCoach) {
      setShowAutopromo(true);
      setAutopromoSeconds(AUTOPROMO_SECONDS);
    } else {
      setPendingStart(false);
      startRunning();
    }
  }, [pendingStart, entitlementsLoading, isPro, hasCoach, startRunning]);

  useEffect(() => {
    if (!showAutopromo) return;
    if (autopromoSeconds <= 0) {
      setShowAutopromo(false);
      setPendingStart(false);
      startRunning();
      return;
    }
    const timer = setTimeout(() => setAutopromoSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [showAutopromo, autopromoSeconds, startRunning]);

  // Tick effect — runs when phase=running and not paused
  useEffect(() => {
    if (phase !== "running") return;
    if (paused) {
      stopTimer();
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Transition to next phase/round
        setIntervalPhase((currentIntervalPhase) => {
          setCurrentRound((currentRoundVal) => {
            if (currentIntervalPhase === "work") {
              // work → rest
              setTimeout(() => setSecondsLeft(restSecs), 0);
              return currentRoundVal;
            } else {
              // rest → next round or done
              const nextRound = currentRoundVal + 1;
              if (nextRound > totalRounds) {
                // Done!
                stopTimer();
                setPhase("done");
                setShowConfetti(true);
                track(TRACKED_EVENTS.WORKOUT_COMPLETED, {});
                return currentRoundVal;
              }
              setTimeout(() => setSecondsLeft(workSecs), 0);
              return nextRound;
            }
          });
          return currentIntervalPhase === "work" ? "rest" : "work";
        });

        return 0;
      });
    }, 1000);

    return () => stopTimer();
  }, [phase, paused, stopTimer, workSecs, restSecs, totalRounds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  function handleStart() {
    if (entitlementsLoading) return;
    if (!isPro && !hasCoach) {
      setPendingStart(true);
    } else {
      startRunning();
    }
  }

  function handlePauseResume() {
    setPaused((p) => !p);
  }

  function handleExit() {
    Alert.alert(
      t("tabata.exit_confirm_title"),
      t("tabata.exit_confirm_msg"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("tabata.exit_confirm_btn"),
          style: "destructive",
          onPress: () => {
            stopTimer();
            track(TRACKED_EVENTS.WORKOUT_ABANDONED, {});
            router.replace("/(tabs)");
          },
        },
      ]
    );
  }

  // Derived progress
  const currentPhaseDuration = intervalPhase === "work" ? workSecs : restSecs;
  const progressFraction =
    currentPhaseDuration > 0
      ? (currentPhaseDuration - secondsLeft) / currentPhaseDuration
      : 0;
  const roundProgress = totalRounds > 0 ? (currentRound - 1) / totalRounds : 0;

  const totalWorkTime = workSecs * totalRounds;
  const totalRestTime = restSecs * totalRounds;

  // ── Config phase ─────────────────────────────────────────────────────────────
  if (phase === "config") {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
        <AutopromoOverlay
          visible={showAutopromo}
          onDismiss={() => {
            setShowAutopromo(false);
            setPendingStart(false);
            track(TRACKED_EVENTS.AUTOPROMO_SKIPPED, {});
          }}
          secondsLeft={autopromoSeconds}
        />

        <ScrollView contentContainerStyle={styles.configContent}>
          <Text style={styles.screenTitle}>{t("tabata.screenTitle")}</Text>

          <ConfigRow
            label={t("tabata.config_workSec")}
            value={workSecs}
            onDecrement={() => setWorkSecs((v) => Math.max(5, v - 5))}
            onIncrement={() => setWorkSecs((v) => Math.min(120, v + 5))}
          />
          <ConfigRow
            label={t("tabata.config_restSec")}
            value={restSecs}
            onDecrement={() => setRestSecs((v) => Math.max(5, v - 5))}
            onIncrement={() => setRestSecs((v) => Math.min(60, v + 5))}
          />
          <ConfigRow
            label={t("tabata.config_rounds")}
            value={totalRounds}
            onDecrement={() => setTotalRounds((v) => Math.max(1, v - 1))}
            onIncrement={() => setTotalRounds((v) => Math.min(30, v + 1))}
          />

          <TouchableOpacity
            style={[styles.startButton, entitlementsLoading && styles.buttonDisabled]}
            onPress={handleStart}
            disabled={entitlementsLoading}
            testID="tabata-start-btn"
            accessibilityLabel={t("tabata.config_start")}
          >
            {entitlementsLoading
              ? <ActivityIndicator color={colors.bg} />
              : <Text style={styles.startButtonText}>{t("tabata.config_start")}</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ── Done phase ────────────────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
        <Confetti active={showConfetti} duration={3000} />
        <ScrollView contentContainerStyle={styles.doneContent}>
          <Text style={styles.doneTitle}>{t("tabata.done_title")}</Text>

          <Card style={styles.summaryCard}>
            <SummaryRow label={t("tabata.done_rounds")} value={String(totalRounds)} />
            <SummaryRow
              label={t("tabata.done_workTime")}
              value={`${totalWorkTime} ${t("tabata.done_seconds")}`}
            />
            <SummaryRow
              label={t("tabata.done_restTime")}
              value={`${totalRestTime} ${t("tabata.done_seconds")}`}
            />
          </Card>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.replace("/(tabs)")}
            testID="tabata-done-back-btn"
          >
            <Text style={styles.startButtonText}>{t("tabata.done_back")}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ── Running phase ─────────────────────────────────────────────────────────────
  const isWork = intervalPhase === "work";

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
      <View style={styles.runningContent}>
        {/* Phase label */}
        <Text style={[styles.phaseLabel, isWork ? styles.phaseLabelWork : styles.phaseLabelRest]}>
          {isWork ? t("tabata.phase_work") : t("tabata.phase_rest")}
        </Text>

        {/* Big countdown */}
        <Text style={[styles.countdown, isWork ? styles.countdownWork : styles.countdownRest]}>
          {secondsLeft}
        </Text>

        {/* Round indicator */}
        <Text style={styles.roundText}>
          {t("tabata.round")} {currentRound} {t("tabata.roundOf")} {totalRounds}
        </Text>

        {/* Interval progress bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${Math.round(progressFraction * 100)}%` as `${number}%` }]} />
        </View>

        {/* Overall rounds progress bar */}
        <View style={styles.progressBarContainerSmall}>
          <View style={[styles.progressBarFillRound, { width: `${Math.round(roundProgress * 100)}%` as `${number}%` }]} />
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.pauseButton}
            onPress={handlePauseResume}
            testID="tabata-pause-btn"
            accessibilityLabel={paused ? t("tabata.resume") : t("tabata.pause")}
          >
            <Text style={styles.pauseButtonText}>
              {paused ? t("tabata.resume") : t("tabata.pause")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exitButton}
            onPress={handleExit}
            testID="tabata-exit-btn"
            accessibilityLabel={t("tabata.exit")}
          >
            <Text style={styles.exitButtonText}>{t("tabata.exit")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function ConfigRow({
  label,
  value,
  onDecrement,
  onIncrement,
}: {
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}): React.JSX.Element {
  return (
    <Card style={styles.configRow}>
      <Text style={styles.configLabel}>{label}</Text>
      <View style={styles.configControls}>
        <TouchableOpacity style={styles.configBtn} onPress={onDecrement} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.configBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.configValue}>{value}</Text>
        <TouchableOpacity style={styles.configBtn} onPress={onIncrement} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.configBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  configContent: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  screenTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize.screenTitle,
    fontWeight: "900",
    letterSpacing: -1,
    textTransform: "uppercase",
    marginBottom: spacing[6],
  },
  configRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing[3],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },
  configLabel: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: "600",
    flex: 1,
  },
  configControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
  },
  configBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surface3,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  configBtnText: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: 20,
    lineHeight: 24,
  },
  configValue: {
    fontFamily: typography.mono,
    color: colors.text,
    fontSize: fontSize["2xl"],
    minWidth: 48,
    textAlign: "center",
  },
  startButton: {
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
    marginTop: spacing[6],
    minHeight: 52,
    justifyContent: "center",
  },
  startButtonText: {
    fontFamily: typography.heading,
    color: colors.bg,
    fontSize: fontSize["2xl"],
    letterSpacing: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  // Running phase
  runningContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[6],
  },
  phaseLabel: {
    fontFamily: typography.heading,
    fontSize: 36,
    letterSpacing: 4,
    textTransform: "uppercase",
    marginBottom: spacing[4],
  },
  phaseLabelWork: {
    color: colors.lime,
  },
  phaseLabelRest: {
    color: colors.muted,
  },
  countdown: {
    fontFamily: typography.mono,
    fontSize: 88,
    letterSpacing: -2,
    marginBottom: spacing[4],
  },
  countdownWork: {
    color: colors.lime,
  },
  countdownRest: {
    color: colors.muted,
  },
  roundText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.lg,
    marginBottom: spacing[6],
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: colors.surface3,
    borderRadius: radius.full,
    overflow: "hidden",
    marginBottom: spacing[3],
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.lime,
    borderRadius: radius.full,
  },
  progressBarContainerSmall: {
    width: "100%",
    height: 4,
    backgroundColor: colors.surface3,
    borderRadius: radius.full,
    overflow: "hidden",
    marginBottom: spacing[8],
  },
  progressBarFillRound: {
    height: "100%",
    backgroundColor: colors.purple,
    borderRadius: radius.full,
  },
  controlsRow: {
    flexDirection: "row",
    gap: spacing[3],
    width: "100%",
  },
  pauseButton: {
    flex: 1,
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  pauseButtonText: {
    fontFamily: typography.heading,
    color: colors.bg,
    fontSize: fontSize.xl,
    letterSpacing: 1,
  },
  exitButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  exitButtonText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  // Done phase
  doneContent: {
    padding: spacing[4],
    paddingBottom: spacing[8],
    alignItems: "center",
  },
  doneTitle: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: 40,
    letterSpacing: -1,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: spacing[6],
    marginTop: spacing[4],
  },
  summaryCard: {
    width: "100%",
    marginBottom: spacing[6],
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
  },
  summaryValue: {
    fontFamily: typography.mono,
    color: colors.text,
    fontSize: fontSize.lg,
  },
});
