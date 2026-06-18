import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  AppState,
  type AppStateStatus,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import AUDIO_TICK from "../assets/audio/tick.wav";
import AUDIO_START from "../assets/audio/start.wav";
import AUDIO_FINISH from "../assets/audio/finish.wav";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useTabataPlans, type TabataPlanRecord } from "@/hooks/useTabataPlans";
import { track } from "@/lib/analytics";
import {
  TRACKED_EVENTS,
  buildSimplePlan,
  validatePlan,
  planTotals,
  computeRuntimeState,
  formatTabataTime,
  WARNING_MS,
  TABATA_LIMITS,
} from "@forzza/core";
import type {
  TabataMode,
  TabataSegment,
  SimpleConfig,
  TabataPlan,
  VisualState,
} from "@forzza/core";
import { tabataColors } from "@forzza/ui/tokens";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";
import {
  AutopromoOverlay,
  Confetti,
  Card,
  Tabs,
  Input,
  Sheet,
} from "@forzza/ui/native";

// ── Constantes ────────────────────────────────────────────────────────────────

const AUTOPROMO_SECONDS = 10;
const TICK_INTERVAL_MS = 50;

// ── Tipos ─────────────────────────────────────────────────────────────────────

type Phase = "config" | "running" | "done";
type TabMode = "simple" | "advanced";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatMmSs(totalMs: number): string {
  const totalSecs = Math.ceil(totalMs / 1000);
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function generateSegmentId(): string {
  return `seg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function ConfigRow({
  label,
  value,
  subtotal,
  valueColor,
  onDecrement,
  onIncrement,
}: {
  label: string;
  value: number;
  subtotal: string;
  valueColor: string;
  onDecrement: () => void;
  onIncrement: () => void;
}): React.JSX.Element {
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

// ── Pantalla principal ────────────────────────────────────────────────────────

export default function TabataScreen(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { isPro, hasCoach, isLoading: entitlementsLoading } = useEntitlements();
  const { plans, isLoading: plansLoading, isError: plansError, savePlan, isSaving, deletePlan } =
    useTabataPlans();

  // ── Fase general ─────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("config");
  const [tabMode, setTabMode] = useState<TabMode>("simple");

  // ── Config SIMPLE ─────────────────────────────────────────────────────────────
  const [workSecs, setWorkSecs] = useState(20);
  const [restSecs, setRestSecs] = useState(10);
  const [totalRounds, setTotalRounds] = useState(8);
  const [prepSecs, setPrepSecs] = useState(10);

  // ── Config AVANZADO ───────────────────────────────────────────────────────────
  const [advancedSegments, setAdvancedSegments] = useState<TabataSegment[]>([
    { id: generateSegmentId(), kind: "work", durationMs: 20000 },
    { id: generateSegmentId(), kind: "rest", durationMs: 10000 },
  ]);

  // ── Autopromo ─────────────────────────────────────────────────────────────────
  const [showAutopromo, setShowAutopromo] = useState(false);
  const [autopromoSeconds, setAutopromoSeconds] = useState(AUTOPROMO_SECONDS);
  const [pendingStart, setPendingStart] = useState(false);

  // ── Running: plan activo ──────────────────────────────────────────────────────
  const [activePlan, setActivePlan] = useState<TabataPlan | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // deadline-based refs
  const startTsRef = useRef<number>(0);
  const pausedAccumRef = useRef<number>(0);
  const pauseStartRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevVisualStateRef = useRef<VisualState | null>(null);

  // ── Audio players (useAudioPlayer gestiona cleanup automáticamente al desmontar) ──
  const tickPlayer = useAudioPlayer(AUDIO_TICK);
  const startPlayer = useAudioPlayer(AUDIO_START);
  const finishPlayer = useAudioPlayer(AUDIO_FINISH);

  // ── Sheet para guardar preset ─────────────────────────────────────────────────
  const [showSaveSheet, setShowSaveSheet] = useState(false);
  const [presetName, setPresetName] = useState("");

  // ── Validación avanzada ───────────────────────────────────────────────────────
  const advancedPlan: TabataPlan = {
    mode: "advanced",
    prepMs: prepSecs * 1000,
    segments: advancedSegments,
  };
  const validation = validatePlan(advancedPlan);
  const totalsAdvanced = planTotals(advancedPlan);

  // ── Configurar sesión de audio al montar (una sola vez) ───────────────────────
  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: "mixWithOthers",
      shouldPlayInBackground: false,
    }).catch(() => {
      // Fallo silencioso: háptica seguirá funcionando
    });
  }, []);

  // ── Timer helpers ─────────────────────────────────────────────────────────────
  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startInterval = useCallback(() => {
    stopInterval();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTsRef.current - pausedAccumRef.current;
      setElapsedMs(elapsed);
    }, TICK_INTERVAL_MS);
  }, [stopInterval]);

  // ── Háptica + audio en transiciones de estado ─────────────────────────────────
  useEffect(() => {
    if (phase !== "running" || activePlan === null) return;
    const runtime = computeRuntimeState(activePlan, elapsedMs);
    const vs = runtime.visualState;

    if (vs !== prevVisualStateRef.current) {
      prevVisualStateRef.current = vs;

      if (vs === "work" || vs === "rest") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        try {
          void startPlayer.seekTo(0).then(() => { startPlayer.play(); });
        } catch {
          // fallo de audio silencioso
        }
      } else if (vs === "prep-ending" || vs === "work-ending" || vs === "rest-ending") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (vs === "finished") {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        try {
          void finishPlayer.seekTo(0).then(() => { finishPlayer.play(); });
        } catch {
          // fallo de audio silencioso
        }
        stopInterval();
        setPhase("done");
        setShowConfetti(true);
        track(TRACKED_EVENTS.WORKOUT_COMPLETED, {});
        void deactivateKeepAwake();
      }
    }

    // Tick de cuenta regresiva en estados "-ending" (cada ~1s)
    if (
      (vs === "prep-ending" || vs === "work-ending" || vs === "rest-ending") &&
      runtime.remainingMs <= WARNING_MS &&
      runtime.remainingMs > 0 &&
      Math.ceil(runtime.remainingMs / 1000) !==
        Math.ceil((runtime.remainingMs + TICK_INTERVAL_MS) / 1000)
    ) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      try {
        void tickPlayer.seekTo(0).then(() => { tickPlayer.play(); });
      } catch {
        // fallo de audio silencioso
      }
    }
  }, [elapsedMs, activePlan, phase, stopInterval, tickPlayer, startPlayer, finishPlayer]);

  // ── AppState: vuelve del background ──────────────────────────────────────────
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState: AppStateStatus) => {
      if (nextState === "active" && phase === "running" && !paused) {
        // El elapsed se recalcula en el próximo tick naturalmente
        // (startTsRef no cambia, Date.now() es real)
        startInterval();
      } else if (nextState === "background" && phase === "running" && !paused) {
        stopInterval();
      }
    });
    return () => sub.remove();
  }, [phase, paused, startInterval, stopInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopInterval();
      void deactivateKeepAwake();
    };
  }, [stopInterval]);

  // ── Autopromo countdown ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!pendingStart || entitlementsLoading) return;
    if (!isPro && !hasCoach) {
      setShowAutopromo(true);
      setAutopromoSeconds(AUTOPROMO_SECONDS);
      track(TRACKED_EVENTS.AUTOPROMO_SHOWN, {});
    } else {
      setPendingStart(false);
      // startRunning se llama desde el efecto de pendingStart=false → lo manejamos abajo
    }
  }, [pendingStart, entitlementsLoading, isPro, hasCoach]);

  useEffect(() => {
    if (!showAutopromo) return;
    if (autopromoSeconds <= 0) {
      setShowAutopromo(false);
      setPendingStart(false);
      doStartRunning();
      return;
    }
    const timer = setTimeout(() => setAutopromoSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [showAutopromo, autopromoSeconds]);

  // ── Lógica de inicio ──────────────────────────────────────────────────────────
  function buildCurrentPlan(): TabataPlan {
    if (tabMode === "advanced") {
      return advancedPlan;
    }
    const cfg: SimpleConfig = { workSecs, restSecs, rounds: totalRounds, prepSecs };
    return buildSimplePlan(cfg);
  }

  function doStartRunning() {
    const plan = buildCurrentPlan();
    setActivePlan(plan);
    setElapsedMs(0);
    setPaused(false);
    setShowConfetti(false);
    prevVisualStateRef.current = null;
    pausedAccumRef.current = 0;
    pauseStartRef.current = null;
    startTsRef.current = Date.now();
    setPhase("running");
    void activateKeepAwakeAsync();
    startInterval();
    track(TRACKED_EVENTS.WORKOUT_STARTED, {});
  }

  function handleStart() {
    if (entitlementsLoading) return;
    if (tabMode === "advanced" && !validation.ok) return;
    if (!isPro && !hasCoach) {
      setPendingStart(true);
    } else {
      doStartRunning();
    }
  }

  function handlePauseResume() {
    if (paused) {
      // Reanudar
      if (pauseStartRef.current !== null) {
        pausedAccumRef.current += Date.now() - pauseStartRef.current;
        pauseStartRef.current = null;
      }
      setPaused(false);
      startInterval();
      void activateKeepAwakeAsync();
    } else {
      // Pausar
      pauseStartRef.current = Date.now();
      setPaused(true);
      stopInterval();
      void deactivateKeepAwake();
    }
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
            stopInterval();
            void deactivateKeepAwake();
            track(TRACKED_EVENTS.WORKOUT_ABANDONED, {});
            router.replace("/(tabs)");
          },
        },
      ]
    );
  }

  function resetToConfig() {
    stopInterval();
    void deactivateKeepAwake();
    setPhase("config");
    setElapsedMs(0);
    setPaused(false);
    setShowConfetti(false);
    setActivePlan(null);
    prevVisualStateRef.current = null;
    pausedAccumRef.current = 0;
    pauseStartRef.current = null;
  }

  // ── Segmentos avanzados ───────────────────────────────────────────────────────
  function addSegment(kind: "work" | "rest") {
    setAdvancedSegments((prev) => [
      ...prev,
      { id: generateSegmentId(), kind, durationMs: kind === "work" ? 20000 : 10000 },
    ]);
  }

  function removeSegment(id: string) {
    setAdvancedSegments((prev) => prev.filter((s) => s.id !== id));
  }

  function moveSegment(id: string, direction: "up" | "down") {
    setAdvancedSegments((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= next.length) return prev;
      const tmp = next[idx]!;
      next[idx] = next[targetIdx]!;
      next[targetIdx] = tmp;
      return next;
    });
  }

  function duplicateSegment(id: string) {
    setAdvancedSegments((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const original = prev[idx]!;
      const copy: TabataSegment = { ...original, id: generateSegmentId() };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  }

  function updateSegmentKind(id: string, kind: "work" | "rest") {
    setAdvancedSegments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, kind } : s))
    );
  }

  function updateSegmentDuration(id: string, deltaSecs: number) {
    setAdvancedSegments((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newMs = Math.max(
          TABATA_LIMITS.minSegmentMs,
          Math.min(TABATA_LIMITS.maxSegmentMs, s.durationMs + deltaSecs * 1000)
        );
        return { ...s, durationMs: newMs };
      })
    );
  }

  function updateSegmentLabel(id: string, label: string) {
    setAdvancedSegments((prev) =>
      prev.map((s): TabataSegment => {
        if (s.id !== id) return s;
        if (label) {
          return { ...s, label };
        }
        const { label: _dropped, ...rest } = s;
        void _dropped;
        return rest;
      })
    );
  }

  function loadPreset(plan: TabataPlanRecord) {
    if (Array.isArray(plan.config)) {
      setAdvancedSegments(plan.config as TabataSegment[]);
    }
    setTabMode("advanced");
  }

  async function handleSavePreset() {
    if (!presetName.trim()) return;
    try {
      const config: TabataSegment[] | SimpleConfig =
        tabMode === "advanced"
          ? advancedSegments
          : ({ workSecs, restSecs, rounds: totalRounds, prepSecs } satisfies SimpleConfig);
      const mode: TabataMode = tabMode === "advanced" ? "advanced" : "simple";
      await savePlan({ name: presetName.trim(), mode, config });
      setShowSaveSheet(false);
      setPresetName("");
    } catch {
      // La mutation ya gestiona el error — no bloqueamos la UI
    }
  }

  // ── FASE RUNNING ──────────────────────────────────────────────────────────────
  if (phase === "running" && activePlan !== null) {
    const runtime = computeRuntimeState(activePlan, elapsedMs);
    const vs = runtime.visualState;
    const phaseColors = tabataColors[vs];
    const countdownText = formatTabataTime(runtime.remainingMs);
    const totalSegs = activePlan.segments.length;
    const segLabel =
      vs === "prep" || vs === "prep-ending"
        ? t("tabata.phase_prep")
        : vs === "finished"
          ? ""
          : runtime.phaseKind === "work"
            ? t("tabata.phase_work")
            : t("tabata.phase_rest");

    const isEnding =
      vs === "prep-ending" || vs === "work-ending" || vs === "rest-ending";
    const displayPhaseLabel = isEnding ? t("tabata.phase_ending") : segLabel;

    const overallPct = Math.round(runtime.overallProgress * 100);

    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: phaseColors.bg }]}>
        <View style={[styles.runningRoot, { paddingTop: insets.top + spacing[5] }]}>
          {/* Fase actual */}
          <Text style={[styles.phaseLabel, { color: phaseColors.fg }]}>
            {displayPhaseLabel}
          </Text>

          {/* Label del ejercicio */}
          {runtime.currentSegment?.label != null && (
            <Text style={[styles.exerciseLabel, { color: phaseColors.fg }]}>
              {runtime.currentSegment.label}
            </Text>
          )}

          {/* Número gigante */}
          <Text style={[styles.countdown, { color: phaseColors.fg }]}>
            {countdownText}
          </Text>

          {/* Segmento actual / total */}
          {vs !== "prep" && vs !== "prep-ending" && vs !== "finished" && (
            <Text style={[styles.segmentCounter, { color: phaseColors.fg, opacity: 0.7 }]}>
              {runtime.segmentIndex + 1} {t("tabata.segment_of")} {totalSegs}
            </Text>
          )}

          {/* Sigue */}
          {runtime.nextSegment != null && (
            <Text style={[styles.nextLabel, { color: phaseColors.fg, opacity: 0.6 }]}>
              {t("tabata.next_segment")}:{" "}
              {runtime.nextSegment.label ??
                (runtime.nextSegment.kind === "work"
                  ? t("tabata.phase_work")
                  : t("tabata.phase_rest"))}
            </Text>
          )}

          {/* Barra de progreso general */}
          <View style={styles.progressSection}>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${overallPct}%` as `${number}%`,
                    backgroundColor: phaseColors.accent,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressPct, { color: phaseColors.fg, opacity: 0.7 }]}>
              {overallPct}%
            </Text>
          </View>

          {/* Controles */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[
                styles.pauseBtn,
                { borderColor: phaseColors.fg },
                paused && { backgroundColor: phaseColors.fg },
              ]}
              onPress={handlePauseResume}
              testID="tabata-pause-btn"
              accessibilityLabel={paused ? t("tabata.resume") : t("tabata.pause")}
            >
              <Text
                style={[
                  styles.pauseBtnText,
                  { color: paused ? phaseColors.bg : phaseColors.fg },
                ]}
              >
                {paused ? `▶ ${t("tabata.resume")}` : `⏸ ${t("tabata.pause")}`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.exitBtn, { borderColor: `${phaseColors.fg}50` }]}
              onPress={handleExit}
              testID="tabata-exit-btn"
              accessibilityLabel={t("tabata.exit")}
            >
              <Text style={[styles.exitBtnText, { color: phaseColors.fg, opacity: 0.7 }]}>
                {t("tabata.exit")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ── FASE DONE ─────────────────────────────────────────────────────────────────
  if (phase === "done" && activePlan !== null) {
    const totals = planTotals(activePlan);

    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
        <Confetti active={showConfetti} duration={3000} />
        <ScrollView
          contentContainerStyle={styles.doneContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.doneTrophy}>🏆</Text>
          <Text style={styles.doneTitle}>{t("tabata.done_title")}</Text>
          {activePlan.name != null && (
            <Text style={styles.donePresetName}>{activePlan.name}</Text>
          )}
          <Text style={styles.doneSubtitle}>{formatMmSs(totals.totalMs)} min</Text>

          <Card style={styles.summaryCard}>
            <SummaryRow
              label={t("tabata.done_total")}
              value={formatMmSs(totals.totalMs)}
            />
            <SummaryRow
              label={t("tabata.done_work")}
              value={formatMmSs(totals.workMs)}
            />
            <SummaryRow
              label={t("tabata.done_rest")}
              value={formatMmSs(totals.restMs)}
            />
            <SummaryRow
              label={t("tabata.done_segments")}
              value={String(totals.segmentCount)}
            />
          </Card>

          <TouchableOpacity
            style={styles.startButton}
            onPress={resetToConfig}
            testID="tabata-repeat-btn"
            accessibilityLabel={t("tabata.done_repeat")}
          >
            <Text style={styles.startButtonText}>{t("tabata.done_repeat")}</Text>
          </TouchableOpacity>

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

  // ── FASE CONFIG ───────────────────────────────────────────────────────────────
  const simpleTotals = planTotals(buildSimplePlan({ workSecs, restSecs, rounds: totalRounds, prepSecs }));

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

      {/* Sheet guardar preset */}
      <Sheet
        visible={showSaveSheet}
        onClose={() => setShowSaveSheet(false)}
        testID="save-preset-sheet"
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>{t("tabata.save_preset")}</Text>
          <Input
            label={t("tabata.preset_name")}
            value={presetName}
            onChangeText={setPresetName}
            placeholder={t("tabata.preset_name")}
            placeholderTextColor={colors.muted}
            autoFocus
          />
          <TouchableOpacity
            style={[
              styles.startButton,
              { marginTop: spacing[3] },
              (!presetName.trim() || isSaving) && styles.buttonDisabled,
            ]}
            onPress={handleSavePreset}
            disabled={!presetName.trim() || isSaving}
          >
            <Text style={styles.startButtonText}>
              {isSaving ? t("tabata.saving") : t("tabata.save_preset")}
            </Text>
          </TouchableOpacity>
        </View>
      </Sheet>

      <ScrollView contentContainerStyle={styles.configContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="tabata-back"
        >
          <Text style={styles.backButtonText}>{t("tabata.back")}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{t("tabata.screenTitle")}</Text>
        <Text style={styles.screenSubtitle}>{t("tabata.subtitle")}</Text>

        {/* Tabs Simple / Avanzado */}
        <Tabs
          tabs={[
            { key: "simple", label: t("tabata.mode_simple") },
            { key: "advanced", label: t("tabata.mode_advanced") },
          ]}
          activeKey={tabMode}
          onTabChange={(key) => {
            const mode = key as TabMode;
            setTabMode(mode);
            if (mode === "advanced" && isPro) {
              track(TRACKED_EVENTS.TABATA_ADVANCED_USED, {});
            }
          }}
          style={styles.tabsBar}
        />

        {/* ── TAB SIMPLE ── */}
        {tabMode === "simple" && (
          <>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>{t("tabata.info_title")}</Text>
              <Text style={styles.infoCardBody}>{t("tabata.info_body")}</Text>
            </View>

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
              />
              <ConfigRow
                label={t("tabata.config_prep")}
                value={prepSecs}
                subtotal={t("tabata.config_total", { secs: prepSecs })}
                valueColor={colors.warning}
                onDecrement={() => setPrepSecs((v) => Math.max(0, v - 5))}
                onIncrement={() => setPrepSecs((v) => Math.min(60, v + 5))}
              />
            </View>

            <View style={styles.summaryGrid}>
              <SummaryStatCell
                value={formatMmSs(simpleTotals.totalMs)}
                label={t("tabata.summary_totalDuration")}
              />
              <SummaryStatCell
                value={formatMmSs(simpleTotals.workMs)}
                label={t("tabata.summary_totalWork")}
              />
              <SummaryStatCell
                value={String(activePlan?.segments.length ?? totalRounds * 2 - 1)}
                label={t("tabata.done_segments")}
              />
            </View>
          </>
        )}

        {/* ── TAB AVANZADO ── */}
        {tabMode === "advanced" && (
          <>
            {entitlementsLoading ? (
              <View style={styles.gatingLoader}>
                <ActivityIndicator color={colors.lime} size="large" />
              </View>
            ) : !isPro ? (
              // Paywall
              <View style={styles.paywallCard}>
                <Text style={styles.paywallTitle}>{t("tabata.paywall_title")}</Text>
                <Text style={styles.paywallBody}>{t("tabata.paywall_body")}</Text>
                <TouchableOpacity
                  style={styles.paywallCta}
                  onPress={() => router.push("/upgrade")}
                  testID="tabata-upgrade-btn"
                >
                  <Text style={styles.paywallCtaText}>{t("tabata.paywall_cta")}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Editor avanzado
              <>
                {/* Errores de validación */}
                {!validation.ok && (
                  <View style={styles.validationErrors}>
                    <Text style={styles.validationErrorTitle}>
                      {t("tabata.validate_error")}
                    </Text>
                    {validation.errors.map((err) => (
                      <Text key={err} style={styles.validationErrorItem}>
                        • {err}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Stats plan avanzado */}
                <View style={[styles.summaryGrid, { marginTop: spacing[3] }]}>
                  <SummaryStatCell
                    value={formatMmSs(totalsAdvanced.totalMs)}
                    label={t("tabata.summary_totalDuration")}
                  />
                  <SummaryStatCell
                    value={formatMmSs(totalsAdvanced.workMs)}
                    label={t("tabata.summary_totalWork")}
                  />
                  <SummaryStatCell
                    value={formatMmSs(totalsAdvanced.restMs)}
                    label={t("tabata.done_rest")}
                  />
                </View>

                {/* Prep stepper */}
                <View style={[styles.configSection, { marginTop: spacing[3] }]}>
                  <ConfigRow
                    label={t("tabata.config_prep")}
                    value={prepSecs}
                    subtotal={t("tabata.config_total", { secs: prepSecs })}
                    valueColor={colors.warning}
                    onDecrement={() => setPrepSecs((v) => Math.max(0, v - 5))}
                    onIncrement={() => setPrepSecs((v) => Math.min(60, v + 5))}
                  />
                </View>

                {/* Lista de segmentos */}
                <View style={styles.configSection}>
                  {advancedSegments.map((seg, idx) => (
                    <View key={seg.id} style={styles.segmentRow}>
                      {/* Toggle work/rest */}
                      <View style={styles.segmentKindToggle}>
                        <TouchableOpacity
                          style={[
                            styles.kindBtn,
                            seg.kind === "work" && styles.kindBtnWorkActive,
                          ]}
                          onPress={() => updateSegmentKind(seg.id, "work")}
                        >
                          <Text
                            style={[
                              styles.kindBtnText,
                              seg.kind === "work" && styles.kindBtnWorkActiveText,
                            ]}
                          >
                            {t("tabata.segment_work")}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.kindBtn,
                            seg.kind === "rest" && styles.kindBtnRestActive,
                          ]}
                          onPress={() => updateSegmentKind(seg.id, "rest")}
                        >
                          <Text
                            style={[
                              styles.kindBtnText,
                              seg.kind === "rest" && styles.kindBtnRestActiveText,
                            ]}
                          >
                            {t("tabata.segment_rest")}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Label opcional */}
                      <View style={styles.segmentLabelInput}>
                        <Input
                          placeholder={t("tabata.segment_label")}
                          value={seg.label ?? ""}
                          onChangeText={(text) => updateSegmentLabel(seg.id, text)}
                          placeholderTextColor={colors.muted}
                        />
                      </View>

                      {/* Duración */}
                      <View style={styles.segmentDurationRow}>
                        <Text style={styles.segmentDurationLabel}>
                          {t("tabata.segment_duration")}
                        </Text>
                        <View style={styles.configControls}>
                          <TouchableOpacity
                            style={styles.configBtn}
                            onPress={() => updateSegmentDuration(seg.id, -5)}
                          >
                            <Text style={styles.configBtnText}>−</Text>
                          </TouchableOpacity>
                          <Text
                            style={[
                              styles.configValue,
                              {
                                color:
                                  seg.kind === "work" ? colors.lime : colors.info,
                              },
                            ]}
                          >
                            {seg.durationMs / 1000}
                          </Text>
                          <TouchableOpacity
                            style={styles.configBtn}
                            onPress={() => updateSegmentDuration(seg.id, 5)}
                          >
                            <Text style={styles.configBtnText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Acciones del segmento */}
                      <View style={styles.segmentActions}>
                        <TouchableOpacity
                          style={styles.segActBtn}
                          onPress={() => moveSegment(seg.id, "up")}
                          disabled={idx === 0}
                        >
                          <Text
                            style={[styles.segActText, idx === 0 && { opacity: 0.3 }]}
                          >
                            ↑
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.segActBtn}
                          onPress={() => moveSegment(seg.id, "down")}
                          disabled={idx === advancedSegments.length - 1}
                        >
                          <Text
                            style={[
                              styles.segActText,
                              idx === advancedSegments.length - 1 && { opacity: 0.3 },
                            ]}
                          >
                            ↓
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.segActBtn}
                          onPress={() => duplicateSegment(seg.id)}
                        >
                          <Text style={styles.segActText}>⊕</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.segActBtn}
                          onPress={() => removeSegment(seg.id)}
                        >
                          <Text style={[styles.segActText, { color: colors.error }]}>
                            ✕
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}

                  {/* Agregar segmentos */}
                  <View style={styles.addSegmentRow}>
                    <TouchableOpacity
                      style={[styles.addSegBtn, { borderColor: colors.lime }]}
                      onPress={() => addSegment("work")}
                      disabled={advancedSegments.length >= TABATA_LIMITS.maxSegments}
                    >
                      <Text style={[styles.addSegText, { color: colors.lime }]}>
                        {t("tabata.add_work")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.addSegBtn, { borderColor: colors.info }]}
                      onPress={() => addSegment("rest")}
                      disabled={advancedSegments.length >= TABATA_LIMITS.maxSegments}
                    >
                      <Text style={[styles.addSegText, { color: colors.info }]}>
                        {t("tabata.add_rest")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Guardar preset */}
                <TouchableOpacity
                  style={styles.savePresetBtn}
                  onPress={() => setShowSaveSheet(true)}
                >
                  <Text style={styles.savePresetText}>{t("tabata.save_preset")}</Text>
                </TouchableOpacity>

                {/* Mis Tabatas (presets guardados) */}
                <View style={[styles.configSection, { marginTop: spacing[3] }]}>
                  <Text style={styles.configSectionLabel}>{t("tabata.my_tabatas")}</Text>

                  {plansLoading && (
                    <ActivityIndicator color={colors.lime} style={{ marginVertical: spacing[3] }} />
                  )}
                  {plansError && !plansLoading && (
                    <Text style={styles.plansErrorText}>{t("common.error")}</Text>
                  )}
                  {!plansLoading && !plansError && plans.length === 0 && (
                    <Text style={styles.plansEmptyText}>{t("common.comingSoon")}</Text>
                  )}
                  {!plansLoading &&
                    plans.map((plan) => (
                      <View key={plan.id} style={styles.presetRow}>
                        <Text style={styles.presetName} numberOfLines={1}>
                          {plan.name}
                        </Text>
                        <View style={styles.presetActions}>
                          <TouchableOpacity
                            style={styles.presetBtn}
                            onPress={() => loadPreset(plan)}
                          >
                            <Text style={styles.presetBtnText}>
                              {t("tabata.load_preset")}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.presetBtn, styles.presetBtnDelete]}
                            onPress={() => void deletePlan(plan.id)}
                          >
                            <Text style={[styles.presetBtnText, { color: colors.error }]}>
                              {t("tabata.delete_preset")}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                </View>
              </>
            )}
          </>
        )}

        {/* Botón iniciar */}
        {(tabMode === "simple" || isPro) && (
          <TouchableOpacity
            style={[
              styles.startButton,
              (entitlementsLoading ||
                (tabMode === "advanced" && !validation.ok)) &&
                styles.buttonDisabled,
            ]}
            onPress={handleStart}
            disabled={
              entitlementsLoading ||
              (tabMode === "advanced" && !validation.ok)
            }
            testID="tabata-start-btn"
            accessibilityLabel={t("tabata.config_start")}
          >
            {entitlementsLoading ? (
              <ActivityIndicator color={colors.bg} />
            ) : (
              <Text style={styles.startButtonText}>{t("tabata.config_start")}</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
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
  backButton: {
    marginBottom: spacing[3],
  },
  backButtonText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.base,
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
  tabsBar: {
    marginBottom: spacing[4],
  },

  // Info card
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

  // Config section
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

  // Summary grid
  summaryGrid: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[2],
    marginBottom: spacing[3],
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

  // Paywall
  gatingLoader: {
    paddingVertical: spacing[8],
    alignItems: "center",
  },
  paywallCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[5],
    alignItems: "center",
    marginVertical: spacing[4],
    gap: spacing[3],
  },
  paywallTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize["4xl"],
    letterSpacing: 1,
    textAlign: "center",
  },
  paywallBody: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
    textAlign: "center",
    lineHeight: 22,
  },
  paywallCta: {
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
  paywallCtaText: {
    fontFamily: typography.heading,
    color: colors.bg,
    fontSize: fontSize["2xl"],
    letterSpacing: 2,
  },

  // Validación
  validationErrors: {
    backgroundColor: `${colors.error}20`,
    borderWidth: 1,
    borderColor: `${colors.error}60`,
    borderRadius: radius.lg,
    padding: spacing[3],
    marginVertical: spacing[3],
    gap: spacing[1],
  },
  validationErrorTitle: {
    fontFamily: typography.body,
    color: colors.error,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  validationErrorItem: {
    fontFamily: typography.body,
    color: colors.error,
    fontSize: fontSize.sm,
  },

  // Segmentos avanzados
  segmentRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing[3],
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  segmentKindToggle: {
    flexDirection: "row",
    gap: spacing[2],
  },
  kindBtn: {
    flex: 1,
    paddingVertical: spacing[2],
    borderRadius: radius.sm,
    alignItems: "center",
    backgroundColor: colors.surface3,
  },
  kindBtnWorkActive: {
    backgroundColor: colors.lime,
  },
  kindBtnRestActive: {
    backgroundColor: colors.info,
  },
  kindBtnText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  kindBtnWorkActiveText: {
    color: colors.bg,
  },
  kindBtnRestActiveText: {
    color: colors.white,
  },
  segmentLabelInput: {
    marginTop: spacing[1],
  },
  segmentDurationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  segmentDurationLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  segmentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing[3],
    marginTop: spacing[1],
  },
  segActBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  segActText: {
    fontFamily: typography.mono,
    color: colors.muted,
    fontSize: fontSize.lg,
  },
  addSegmentRow: {
    flexDirection: "row",
    gap: spacing[2],
    marginBottom: spacing[3],
    marginTop: spacing[1],
  },
  addSegBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    alignItems: "center",
  },
  addSegText: {
    fontFamily: typography.body,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },

  // Guardar preset
  savePresetBtn: {
    borderWidth: 1,
    borderColor: colors.lime,
    borderRadius: radius.lg,
    paddingVertical: spacing[3],
    alignItems: "center",
    marginBottom: spacing[3],
  },
  savePresetText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.base,
    fontWeight: "700",
  },

  // Mis Tabatas
  plansEmptyText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    textAlign: "center",
    paddingVertical: spacing[4],
  },
  plansErrorText: {
    fontFamily: typography.body,
    color: colors.error,
    fontSize: fontSize.sm,
    textAlign: "center",
    paddingVertical: spacing[4],
  },
  presetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing[2],
  },
  presetName: {
    flex: 1,
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
  },
  presetActions: {
    flexDirection: "row",
    gap: spacing[2],
  },
  presetBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  presetBtnDelete: {
    borderColor: `${colors.error}40`,
  },
  presetBtnText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    fontWeight: "600",
  },

  // Sheet
  sheetContent: {
    padding: spacing[5],
    gap: spacing[3],
  },
  sheetTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize["2xl"],
    letterSpacing: 1,
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
    marginBottom: spacing[1],
  },
  donePresetName: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
    textAlign: "center",
    marginBottom: spacing[1],
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

  // ── Running ──
  runningRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[5],
  },
  phaseLabel: {
    fontFamily: typography.heading,
    fontSize: 40,
    letterSpacing: 4,
    textTransform: "uppercase",
    textAlign: "center",
  },
  exerciseLabel: {
    fontFamily: typography.body,
    fontSize: fontSize.lg,
    fontWeight: "600",
    textAlign: "center",
    opacity: 0.85,
  },
  countdown: {
    fontFamily: typography.mono,
    fontSize: 96,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 100,
  },
  segmentCounter: {
    fontFamily: typography.body,
    fontSize: fontSize.xl,
    fontWeight: "700",
    textAlign: "center",
  },
  nextLabel: {
    fontFamily: typography.body,
    fontSize: fontSize.base,
    textAlign: "center",
  },
  progressSection: {
    width: "100%",
    gap: spacing[2],
    alignItems: "flex-end",
  },
  progressBarTrack: {
    width: "100%",
    height: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: radius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: radius.full,
  },
  progressPct: {
    fontFamily: typography.mono,
    fontSize: fontSize.xs,
  },
  controlsRow: {
    flexDirection: "row",
    gap: spacing[3],
    width: "100%",
  },
  pauseBtn: {
    flex: 1,
    borderWidth: 2,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  pauseBtnText: {
    fontFamily: typography.body,
    fontSize: fontSize.base,
    fontWeight: "700",
  },
  exitBtn: {
    flex: 0.5,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  exitBtnText: {
    fontFamily: typography.body,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
});
