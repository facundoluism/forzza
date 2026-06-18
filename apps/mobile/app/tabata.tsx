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

// ── Anillo circular (sin react-native-svg) ───────────────────────────────────
// Implementación con dos mitades rotadas, standard en React Native puro.
const RING_SIZE = 220;
const RING_STROKE = 14;
const RING_INNER = RING_SIZE - RING_STROKE * 2;

interface RingProgressProps {
  /** Fracción 0–1 del progreso (1 = lleno) */
  progress: number;
  /** Color del arco de progreso */
  color: string;
  /** Segundos a mostrar en el centro */
  seconds: number;
}

function RingProgress({ progress, color, seconds }: RingProgressProps): React.JSX.Element {
  // Convertimos progreso (0–1) a grados (0–360).
  // El anillo se dibuja con dos mitades: izquierda y derecha.
  // Cada mitad es un View con borderRadius = RING_SIZE/2 que actúa como
  // una semicircunferencia; se rota para revelar el porcentaje correcto.
  const deg = Math.min(progress, 1) * 360;

  // Rotación de la mitad derecha (progreso 0–180°)
  const rightDeg = Math.min(deg, 180);
  // La mitad izquierda sólo se activa cuando superamos 180°
  const leftDeg = deg > 180 ? deg - 180 : 0;

  return (
    <View style={ringStyles.container}>
      {/* Track (pista vacía) */}
      <View style={[ringStyles.ring, { borderColor: colors.surface3 }]} />

      {/* Progreso: mitad izquierda (>180°) */}
      <View style={[ringStyles.halfBox, ringStyles.halfLeft]}>
        <View
          style={[
            ringStyles.halfRing,
            {
              borderColor: leftDeg > 0 ? color : "transparent",
              transform: [{ rotate: `${leftDeg}deg` }],
            },
          ]}
        />
      </View>

      {/* Progreso: mitad derecha (0–180°) */}
      <View style={[ringStyles.halfBox, ringStyles.halfRight]}>
        <View
          style={[
            ringStyles.halfRing,
            {
              borderColor: rightDeg > 0 ? color : "transparent",
              transform: [{ rotate: `${rightDeg}deg` }],
            },
          ]}
        />
      </View>

      {/* Centro del anillo — número grande */}
      <View style={[ringStyles.center, { width: RING_INNER, height: RING_INNER }]}>
        <Text style={[ringStyles.countdown, { color }]}>{seconds}</Text>
        <Text style={ringStyles.secsLabel}>seg</Text>
      </View>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  container: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  ring: {
    position: "absolute",
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_STROKE,
  },
  halfBox: {
    position: "absolute",
    width: RING_SIZE / 2,
    height: RING_SIZE,
    overflow: "hidden",
  },
  halfLeft: {
    left: 0,
  },
  halfRight: {
    right: 0,
  },
  halfRing: {
    position: "absolute",
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_STROKE,
    // Empezamos con el inicio a las 12 (-90°) pero la rotación base del clip
    // ya posiciona el arco correctamente; partimos desde las 12 restando 90°.
    // La mitad derecha parte de 0°→ arriba-derecha.
    // La mitad izquierda parte de 0° → arriba-izquierda (cuando >180°).
    transform: [{ rotate: "-90deg" }],
  },
  center: {
    position: "absolute",
    borderRadius: RING_INNER / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  countdown: {
    fontFamily: typography.mono,
    fontSize: 56,
    fontWeight: "700",
    lineHeight: 60,
  },
  secsLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatMmSs(totalSecs: number): string {
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ── Tipos ────────────────────────────────────────────────────────────────────

type Phase = "config" | "running" | "done";
type IntervalPhase = "work" | "rest";

// ── Pantalla principal ───────────────────────────────────────────────────────

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

  const resetToConfig = useCallback(() => {
    stopTimer();
    setPhase("config");
    setIntervalPhase("work");
    setCurrentRound(1);
    setSecondsLeft(0);
    setPaused(false);
    setShowConfetti(false);
  }, [stopTimer]);

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
  const totalDurationSecs = totalRounds * (workSecs + restSecs);
  const estimatedKcal = Math.round((totalDurationSecs / 60) * 10);

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

        <ScrollView contentContainerStyle={styles.configContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.screenTitle}>{t("tabata.screenTitle")}</Text>
          <Text style={styles.screenSubtitle}>{t("tabata.subtitle")}</Text>

          {/* Card educativa */}
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>{t("tabata.info_title")}</Text>
            <Text style={styles.infoCardBody}>{t("tabata.info_body")}</Text>
          </View>

          {/* Steppers */}
          <View style={styles.configSection}>
            <Text style={styles.configSectionLabel}>{t("tabata.config_section")}</Text>

            <ConfigRow
              label={t("tabata.config_workSec")}
              value={workSecs}
              subtotal={t("tabata.config_total", { secs: workSecs * totalRounds })}
              valueColor={colors.lime}
              onDecrement={() => setWorkSecs((v) => Math.max(5, v - 5))}
              onIncrement={() => setWorkSecs((v) => Math.min(120, v + 5))}
            />
            <ConfigRow
              label={t("tabata.config_restSec")}
              value={restSecs}
              subtotal={t("tabata.config_total", { secs: restSecs * totalRounds })}
              valueColor={colors.info}
              onDecrement={() => setRestSecs((v) => Math.max(5, v - 5))}
              onIncrement={() => setRestSecs((v) => Math.min(60, v + 5))}
            />
            <ConfigRow
              label={t("tabata.config_rounds")}
              value={totalRounds}
              subtotal={t("tabata.config_total", { secs: totalRounds * (workSecs + restSecs) })}
              valueColor={colors.orange}
              onDecrement={() => setTotalRounds((v) => Math.max(1, v - 1))}
              onIncrement={() => setTotalRounds((v) => Math.min(30, v + 1))}
              step={1}
            />
          </View>

          {/* Card resumen */}
          <View style={styles.summaryGrid}>
            <SummaryStatCell
              value={formatMmSs(totalDurationSecs)}
              label={t("tabata.summary_totalDuration")}
            />
            <SummaryStatCell
              value={`${totalWorkTime}s`}
              label={t("tabata.summary_totalWork")}
            />
            <SummaryStatCell
              value={`~${estimatedKcal} kcal`}
              label={t("tabata.summary_calories")}
            />
          </View>

          <TouchableOpacity
            style={[styles.startButton, entitlementsLoading && styles.buttonDisabled]}
            onPress={handleStart}
            disabled={entitlementsLoading}
            testID="tabata-start-btn"
            accessibilityLabel={t("tabata.config_start")}
          >
            {entitlementsLoading ? (
              <ActivityIndicator color={colors.bg} />
            ) : (
              <Text style={styles.startButtonText}>{t("tabata.config_start")}</Text>
            )}
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
        <ScrollView contentContainerStyle={styles.doneContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.doneTrophy}>🏆</Text>
          <Text style={styles.doneTitle}>{t("tabata.done_title")}</Text>
          <Text style={styles.doneSubtitle}>
            {totalRounds} {t("tabata.done_rounds_label")} · {formatMmSs(totalDurationSecs)} min
          </Text>

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

          {/* Botón primario: repetir */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={resetToConfig}
            testID="tabata-repeat-btn"
            accessibilityLabel={t("tabata.done_repeat")}
          >
            <Text style={styles.startButtonText}>{t("tabata.done_repeat")}</Text>
          </TouchableOpacity>

          {/* Botón secundario: volver al inicio */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.replace("/(tabs)")}
            testID="tabata-done-back-btn"
            accessibilityLabel={t("tabata.done_back")}
          >
            <Text style={styles.secondaryButtonText}>{t("tabata.done_back")}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ── Running phase ─────────────────────────────────────────────────────────────
  const isWork = intervalPhase === "work";
  const ringColor = isWork ? colors.lime : colors.info;

  // Progreso del anillo = fracción consumida de la fase actual
  const ringProgress = progressFraction;

  // Porcentaje general
  const elapsed =
    (currentRound - 1) * (workSecs + restSecs) +
    (isWork ? workSecs - secondsLeft : workSecs + restSecs - secondsLeft);
  const overallPct = totalDurationSecs > 0
    ? Math.min(100, Math.round((elapsed / totalDurationSecs) * 100))
    : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
      <View style={styles.runningContent}>
        {/* Encabezado de fase */}
        <Text style={[styles.phaseLabel, { color: ringColor }]}>
          {isWork ? t("tabata.phase_work") : t("tabata.phase_rest")}
        </Text>
        <Text style={styles.roundText}>
          {t("tabata.round")} {currentRound} {t("tabata.roundOf")} {totalRounds}
        </Text>

        {/* Anillo circular con countdown */}
        <View style={styles.ringWrapper}>
          <RingProgress
            progress={ringProgress}
            color={ringColor}
            seconds={secondsLeft}
          />
        </View>

        {/* Barra de progreso general */}
        <View style={styles.overallProgressSection}>
          <View style={styles.overallProgressRow}>
            <Text style={styles.overallLabel}>{t("tabata.progress_overall")}</Text>
            <Text style={[styles.overallPct, { color: ringColor }]}>{overallPct}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${overallPct}%`,
                  backgroundColor: ringColor,
                },
              ]}
            />
          </View>
          {/* Barras de rondas mini */}
          <View style={styles.progressBarContainerSmall}>
            <View
              style={[
                styles.progressBarFillRound,
                { width: `${Math.round(roundProgress * 100)}%` },
              ]}
            />
          </View>
        </View>

        {/* Controles */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.pauseButton, paused && styles.pauseButtonActive]}
            onPress={handlePauseResume}
            testID="tabata-pause-btn"
            accessibilityLabel={paused ? t("tabata.resume") : t("tabata.pause")}
          >
            <Text style={[styles.pauseButtonText, paused && styles.pauseButtonTextActive]}>
              {paused ? `▶ ${t("tabata.resume")}` : `⏸ ${t("tabata.pause")}`}
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

// ── Sub-componentes ───────────────────────────────────────────────────────────

function ConfigRow({
  label,
  value,
  subtotal,
  valueColor,
  onDecrement,
  onIncrement,
  step = 5,
}: {
  label: string;
  value: number;
  subtotal: string;
  valueColor: string;
  onDecrement: () => void;
  onIncrement: () => void;
  step?: number;
}): React.JSX.Element {
  void step; // usado externamente para decidir incremento; tipado por completitud
  return (
    <View style={styles.configRow}>
      <View style={styles.configLabelWrapper}>
        <Text style={styles.configLabel}>{label}</Text>
        <Text style={styles.configSubtotal}>{subtotal}</Text>
      </View>
      <View style={styles.configControls}>
        <TouchableOpacity
          style={styles.configBtn}
          onPress={onDecrement}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.configBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={[styles.configValue, { color: valueColor }]}>{value}</Text>
        <TouchableOpacity
          style={styles.configBtn}
          onPress={onIncrement}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.configBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SummaryStatCell({ value, label }: { value: string; label: string }): React.JSX.Element {
  return (
    <View style={styles.summaryStatCell}>
      <Text style={styles.summaryStatValue}>{value}</Text>
      <Text style={styles.summaryStatLabel}>{label}</Text>
    </View>
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

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // ── Config ──
  configContent: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  screenTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize.screenTitle,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
    lineHeight: 36,
  },
  screenSubtitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    marginBottom: spacing[4],
    marginTop: spacing[1],
  },

  // Card educativa
  infoCard: {
    backgroundColor: colors.limeGlow,
    borderWidth: 1,
    borderColor: colors.limeDim,
    borderRadius: radius.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  infoCardTitle: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.sm,
    fontWeight: "700",
    marginBottom: spacing[1],
  },
  infoCardBody: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    lineHeight: 18,
  },

  // Sección steppers
  configSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
    marginBottom: spacing[3],
  },
  configSectionLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 0.9,
    textTransform: "uppercase",
    marginBottom: spacing[4],
  },
  configRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing[4],
  },
  configLabelWrapper: {
    flex: 1,
    gap: 2,
  },
  configLabel: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  configSubtotal: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
  },
  configControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface3,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  configBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  configBtnText: {
    fontFamily: typography.mono,
    color: colors.muted,
    fontSize: 20,
    lineHeight: 24,
  },
  configValue: {
    fontFamily: typography.mono,
    fontSize: fontSize["2xl"],
    fontWeight: "700",
    minWidth: 44,
    textAlign: "center",
  },

  // Grid de stats resumen
  summaryGrid: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[2],
    marginBottom: spacing[5],
    gap: spacing[2],
  },
  summaryStatCell: {
    flex: 1,
    alignItems: "center",
    gap: spacing[1],
  },
  summaryStatValue: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: fontSize["2xl"],
    fontWeight: "700",
    textAlign: "center",
  },
  summaryStatLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },

  startButton: {
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
    marginTop: spacing[2],
    minHeight: 52,
    justifyContent: "center",
  },
  startButtonText: {
    fontFamily: typography.heading,
    color: colors.bg,
    fontSize: fontSize["2xl"],
    letterSpacing: 2,
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // ── Running ──
  runningContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    padding: spacing[5],
  },
  phaseLabel: {
    fontFamily: typography.heading,
    fontSize: 36,
    letterSpacing: 4,
    textTransform: "uppercase",
    lineHeight: 40,
  },
  roundText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.lg,
    marginTop: -spacing[2],
  },
  ringWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  // Barra de progreso general
  overallProgressSection: {
    width: "100%",
    gap: spacing[2],
  },
  overallProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overallLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
  },
  overallPct: {
    fontFamily: typography.mono,
    fontSize: fontSize.xs,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: colors.surface3,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: radius.full,
  },
  progressBarContainerSmall: {
    width: "100%",
    height: 4,
    backgroundColor: colors.surface3,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  progressBarFillRound: {
    height: "100%",
    backgroundColor: colors.purple,
    borderRadius: radius.full,
  },

  // Controles running
  controlsRow: {
    flexDirection: "row",
    gap: spacing[3],
    width: "100%",
  },
  pauseButton: {
    flex: 1,
    backgroundColor: colors.surface3,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  pauseButtonActive: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  pauseButtonText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
    fontWeight: "700",
  },
  pauseButtonTextActive: {
    color: colors.bg,
  },
  exitButton: {
    flex: 0.5,
    backgroundColor: "transparent",
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: `${colors.error}40`,
  },
  exitButtonText: {
    fontFamily: typography.body,
    color: colors.error,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },

  // ── Done ──
  doneContent: {
    padding: spacing[4],
    paddingBottom: spacing[8],
    alignItems: "center",
  },
  doneTrophy: {
    fontSize: 64,
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  doneTitle: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: 42,
    letterSpacing: 2,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: spacing[2],
  },
  doneSubtitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
    textAlign: "center",
    marginBottom: spacing[6],
  },
  summaryCard: {
    width: "100%",
    marginBottom: spacing[5],
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
  secondaryButton: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: radius.lg,
    paddingVertical: spacing[3],
    alignItems: "center",
    marginTop: spacing[2],
  },
  secondaryButtonText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
    fontWeight: "600",
  },
});
