// Tabata — motor puro del "Tabata inteligente".
// Sin React, sin UI, sin Date.now()/Math.random(): 100% determinista y testeable.
// La UI consume computeRuntimeState(plan, elapsedMs) en cada tick y pinta según visualState.

export type TabataMode = "simple" | "advanced";
export type SegmentKind = "work" | "rest";

export interface TabataSegment {
  id: string;
  kind: SegmentKind;
  label?: string; // nombre opcional del ejercicio
  durationMs: number;
}

export interface SimpleConfig {
  workSecs: number;
  restSecs: number;
  rounds: number;
  prepSecs: number; // preparación inicial antes del 1er trabajo
}

export interface TabataPlan {
  mode: TabataMode;
  name?: string;
  prepMs: number; // preparación inicial (cuenta regresiva "preparate")
  segments: TabataSegment[];
}

export type VisualState =
  | "prep"
  | "prep-ending"
  | "work"
  | "work-ending"
  | "rest"
  | "rest-ending"
  | "finished";

export type PhaseKind = "prep" | "work" | "rest" | "finished";

export interface RuntimeState {
  visualState: VisualState;
  phaseKind: PhaseKind;
  segmentIndex: number; // índice en plan.segments; -1 durante prep; último índice cuando finished
  currentSegment: TabataSegment | null; // null en prep y finished
  nextSegment: TabataSegment | null; // próximo segmento o null si no hay
  remainingMs: number; // restante de la FASE actual (0 si finished)
  phaseDurationMs: number; // duración total de la fase actual
  phaseProgress: number; // 0..1 consumido de la fase actual
  overallProgress: number; // 0..1 del plan completo (incluye prep)
  totalRemainingMs: number; // restante de TODO el plan
}

/**
 * Umbral (en ms) para los estados visuales `*-ending`: en los últimos 5s de
 * cada fase la UI dispara audio/vibración y cambia de color.
 */
export const WARNING_MS = 5000;

/**
 * Límites razonables para validar un plan. Pensados para evitar configuraciones
 * absurdas (segmentos de 1s, planes infinitos) sin ser restrictivos:
 * - minSegmentMs (3s): un segmento más corto no es entrenable.
 * - maxSegmentMs (10min): tope superior por segmento.
 * - maxSegments (60): tope de segmentos concatenados (modo avanzado).
 * - minPrepMs (0): se permite arrancar sin preparación.
 * - maxPrepMs (60s): preparación inicial máxima.
 */
export const TABATA_LIMITS = {
  minSegmentMs: 3000,
  maxSegmentMs: 600000,
  maxSegments: 60,
  minPrepMs: 0,
  maxPrepMs: 60000,
} as const;

/**
 * Expande una configuración SIMPLE a segmentos work/rest alternados × rounds.
 * Patrón: work, rest, work, rest, ..., work (sin rest final innecesario), porque
 * el descanso tras el último trabajo no aporta dentro de la sesión.
 * Ids deterministas: `w-1`, `r-1`, `w-2`, ... (1-based por número de ronda).
 */
export function buildSimplePlan(cfg: SimpleConfig): TabataPlan {
  const segments: TabataSegment[] = [];
  const rounds = Math.max(0, Math.trunc(cfg.rounds));

  for (let round = 1; round <= rounds; round += 1) {
    segments.push({
      id: `w-${round}`,
      kind: "work",
      durationMs: cfg.workSecs * 1000,
    });

    // El último round no incluye rest final.
    if (round < rounds) {
      segments.push({
        id: `r-${round}`,
        kind: "rest",
        durationMs: cfg.restSecs * 1000,
      });
    }
  }

  return {
    mode: "simple",
    prepMs: cfg.prepSecs * 1000,
    segments,
  };
}

/**
 * Valida un plan contra TABATA_LIMITS. Devuelve todos los errores encontrados
 * (no corta en el primero) para que la UI los muestre juntos.
 */
export function validatePlan(plan: TabataPlan): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  if (plan.prepMs < TABATA_LIMITS.minPrepMs) {
    errors.push(`prepMs no puede ser menor a ${TABATA_LIMITS.minPrepMs}`);
  }
  if (plan.prepMs > TABATA_LIMITS.maxPrepMs) {
    errors.push(`prepMs no puede superar ${TABATA_LIMITS.maxPrepMs}`);
  }

  if (plan.segments.length === 0) {
    errors.push("el plan debe tener al menos 1 segmento");
  }
  if (plan.segments.length > TABATA_LIMITS.maxSegments) {
    errors.push(`el plan no puede tener más de ${TABATA_LIMITS.maxSegments} segmentos`);
  }

  const hasWork = plan.segments.some((segment) => segment.kind === "work");
  if (!hasWork) {
    errors.push("el plan debe tener al menos 1 segmento de trabajo");
  }

  for (const segment of plan.segments) {
    if (segment.durationMs < TABATA_LIMITS.minSegmentMs) {
      errors.push(
        `el segmento ${segment.id} dura menos de ${TABATA_LIMITS.minSegmentMs}ms`
      );
    }
    if (segment.durationMs > TABATA_LIMITS.maxSegmentMs) {
      errors.push(
        `el segmento ${segment.id} dura más de ${TABATA_LIMITS.maxSegmentMs}ms`
      );
    }
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Totales del plan. `totalMs` incluye la preparación inicial (prepMs).
 */
export function planTotals(plan: TabataPlan): {
  totalMs: number;
  workMs: number;
  restMs: number;
  segmentCount: number;
} {
  let workMs = 0;
  let restMs = 0;

  for (const segment of plan.segments) {
    if (segment.kind === "work") {
      workMs += segment.durationMs;
    } else {
      restMs += segment.durationMs;
    }
  }

  return {
    totalMs: plan.prepMs + workMs + restMs,
    workMs,
    restMs,
    segmentCount: plan.segments.length,
  };
}

/**
 * Deriva el estado runtime a partir del tiempo transcurrido (ya descontadas las
 * pausas). Semántica de fase: [inicio, fin) — el instante exacto de fin pertenece
 * a la fase siguiente. El umbral `*-ending` aplica cuando remainingMs <= WARNING_MS
 * (acotado a la duración de la fase si esta es más corta que WARNING_MS).
 */
export function computeRuntimeState(plan: TabataPlan, elapsedMs: number): RuntimeState {
  const totals = planTotals(plan);
  const totalMs = totals.totalMs;
  const elapsed = Math.max(0, elapsedMs);

  // Plan completo consumido → finished.
  if (elapsed >= totalMs) {
    const lastIndex = plan.segments.length - 1;
    return {
      visualState: "finished",
      phaseKind: "finished",
      segmentIndex: lastIndex,
      currentSegment: null,
      nextSegment: null,
      remainingMs: 0,
      phaseDurationMs: 0,
      phaseProgress: 1,
      overallProgress: 1,
      totalRemainingMs: 0,
    };
  }

  // Fase de preparación inicial.
  if (elapsed < plan.prepMs) {
    const remainingMs = plan.prepMs - elapsed;
    const isEnding = remainingMs <= warningThreshold(plan.prepMs);
    return {
      visualState: isEnding ? "prep-ending" : "prep",
      phaseKind: "prep",
      segmentIndex: -1,
      currentSegment: null,
      nextSegment: plan.segments[0] ?? null,
      remainingMs,
      phaseDurationMs: plan.prepMs,
      phaseProgress: plan.prepMs === 0 ? 1 : elapsed / plan.prepMs,
      overallProgress: totalMs === 0 ? 1 : elapsed / totalMs,
      totalRemainingMs: totalMs - elapsed,
    };
  }

  // Recorre los segmentos en orden hasta ubicar el activo.
  let cursor = plan.prepMs;
  for (let index = 0; index < plan.segments.length; index += 1) {
    const segment = plan.segments[index]!;
    const segmentEnd = cursor + segment.durationMs;

    if (elapsed < segmentEnd) {
      const intoSegment = elapsed - cursor;
      const remainingMs = segmentEnd - elapsed;
      const isEnding = remainingMs <= warningThreshold(segment.durationMs);
      const base: VisualState = segment.kind === "work" ? "work" : "rest";
      const visualState: VisualState = isEnding
        ? `${base}-ending`
        : base;

      return {
        visualState,
        phaseKind: segment.kind,
        segmentIndex: index,
        currentSegment: segment,
        nextSegment: plan.segments[index + 1] ?? null,
        remainingMs,
        phaseDurationMs: segment.durationMs,
        phaseProgress: segment.durationMs === 0 ? 1 : intoSegment / segment.durationMs,
        overallProgress: totalMs === 0 ? 1 : elapsed / totalMs,
        totalRemainingMs: totalMs - elapsed,
      };
    }

    cursor = segmentEnd;
  }

  // Inalcanzable salvo redondeos: el guard de finished ya cubre elapsed >= totalMs.
  const lastIndex = plan.segments.length - 1;
  return {
    visualState: "finished",
    phaseKind: "finished",
    segmentIndex: lastIndex,
    currentSegment: null,
    nextSegment: null,
    remainingMs: 0,
    phaseDurationMs: 0,
    phaseProgress: 1,
    overallProgress: 1,
    totalRemainingMs: 0,
  };
}

/**
 * El umbral de aviso es WARNING_MS, pero acotado a la duración de la fase: si una
 * fase dura menos de 5s, todo su transcurso es "ending".
 */
function warningThreshold(phaseDurationMs: number): number {
  return Math.min(WARNING_MS, phaseDurationMs);
}

/**
 * Formato ADAPTATIVO del tiempo restante. Reglas deterministas:
 * - últimos 5s (ms <= WARNING_MS): `s.d` (segundos con 1 décima), ej "4.3" — máxima precisión visual.
 * - tiempo > 60s: `m:ss` (con segundos a 2 dígitos), ej "1:05".
 * - tiempo <= 60s: `ss` (segundos enteros), ej "45".
 * `forceMmss` fuerza siempre `m:ss` (útil para totales en la UI).
 * Redondeo: ceil para el restante, así nunca muestra 0 mientras la fase corre.
 * (En los últimos 5s se redondea a la décima superior por la misma razón.)
 */
export function formatTabataTime(ms: number, opts?: { forceMmss?: boolean }): string {
  const clamped = Math.max(0, ms);

  if (opts?.forceMmss) {
    return mmss(Math.ceil(clamped / 1000));
  }

  if (clamped > 0 && clamped <= WARNING_MS) {
    const tenths = Math.ceil(clamped / 100) / 10;
    return tenths.toFixed(1);
  }

  const totalSecs = Math.ceil(clamped / 1000);
  if (totalSecs > 60) {
    return mmss(totalSecs);
  }

  return String(totalSecs);
}

function mmss(totalSecs: number): string {
  const minutes = Math.floor(totalSecs / 60);
  const seconds = totalSecs % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
