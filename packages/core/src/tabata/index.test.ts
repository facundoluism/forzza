import { describe, expect, it } from "vitest";
import {
  TABATA_LIMITS,
  WARNING_MS,
  buildSimplePlan,
  computeRuntimeState,
  formatTabataTime,
  planTotals,
  validatePlan,
  type SimpleConfig,
  type TabataPlan,
} from "./index";

const baseSimple: SimpleConfig = {
  workSecs: 20,
  restSecs: 10,
  rounds: 4,
  prepSecs: 5,
};

describe("buildSimplePlan", () => {
  it("expande a work/rest alternados sin rest final", () => {
    const plan = buildSimplePlan(baseSimple);
    // 4 rounds → 4 work + 3 rest = 7 segmentos
    expect(plan.segments).toHaveLength(7);
    expect(plan.mode).toBe("simple");
    expect(plan.segments.map((s) => s.kind)).toEqual([
      "work",
      "rest",
      "work",
      "rest",
      "work",
      "rest",
      "work",
    ]);
  });

  it("calcula prepMs y durationMs en ms", () => {
    const plan = buildSimplePlan(baseSimple);
    expect(plan.prepMs).toBe(5000);
    expect(plan.segments[0]!.durationMs).toBe(20000);
    expect(plan.segments[1]!.durationMs).toBe(10000);
  });

  it("genera ids deterministas w-n / r-n", () => {
    const plan = buildSimplePlan(baseSimple);
    expect(plan.segments.map((s) => s.id)).toEqual([
      "w-1",
      "r-1",
      "w-2",
      "r-2",
      "w-3",
      "r-3",
      "w-4",
    ]);
    // determinista: dos builds idénticos producen lo mismo
    expect(buildSimplePlan(baseSimple)).toEqual(plan);
  });

  it("1 round produce un único work sin rest", () => {
    const plan = buildSimplePlan({ ...baseSimple, rounds: 1 });
    expect(plan.segments).toHaveLength(1);
    expect(plan.segments[0]!.kind).toBe("work");
  });

  it("0 rounds produce plan vacío", () => {
    const plan = buildSimplePlan({ ...baseSimple, rounds: 0 });
    expect(plan.segments).toHaveLength(0);
  });
});

describe("validatePlan", () => {
  it("acepta un plan válido", () => {
    const plan = buildSimplePlan(baseSimple);
    const result = validatePlan(plan);
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rechaza plan sin segmentos", () => {
    const plan: TabataPlan = { mode: "advanced", prepMs: 0, segments: [] };
    const result = validatePlan(plan);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("al menos 1 segmento"))).toBe(true);
  });

  it("rechaza plan sin segmento de trabajo", () => {
    const plan: TabataPlan = {
      mode: "advanced",
      prepMs: 0,
      segments: [{ id: "r-1", kind: "rest", durationMs: 10000 }],
    };
    const result = validatePlan(plan);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("trabajo"))).toBe(true);
  });

  it("rechaza segmento demasiado corto", () => {
    const plan: TabataPlan = {
      mode: "advanced",
      prepMs: 0,
      segments: [{ id: "w-1", kind: "work", durationMs: TABATA_LIMITS.minSegmentMs - 1 }],
    };
    const result = validatePlan(plan);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("w-1"))).toBe(true);
  });

  it("rechaza segmento demasiado largo", () => {
    const plan: TabataPlan = {
      mode: "advanced",
      prepMs: 0,
      segments: [{ id: "w-1", kind: "work", durationMs: TABATA_LIMITS.maxSegmentMs + 1 }],
    };
    const result = validatePlan(plan);
    expect(result.ok).toBe(false);
  });

  it("rechaza prep fuera de rango", () => {
    const tooLong: TabataPlan = {
      mode: "simple",
      prepMs: TABATA_LIMITS.maxPrepMs + 1,
      segments: [{ id: "w-1", kind: "work", durationMs: 20000 }],
    };
    expect(validatePlan(tooLong).ok).toBe(false);

    const negative: TabataPlan = {
      mode: "simple",
      prepMs: -1,
      segments: [{ id: "w-1", kind: "work", durationMs: 20000 }],
    };
    expect(validatePlan(negative).ok).toBe(false);
  });

  it("rechaza exceso de segmentos", () => {
    const segments = Array.from({ length: TABATA_LIMITS.maxSegments + 1 }, (_, i) => ({
      id: `w-${i}`,
      kind: "work" as const,
      durationMs: 5000,
    }));
    const plan: TabataPlan = { mode: "advanced", prepMs: 0, segments };
    expect(validatePlan(plan).ok).toBe(false);
  });
});

describe("planTotals", () => {
  it("suma work, rest y prep", () => {
    const plan = buildSimplePlan(baseSimple);
    const totals = planTotals(plan);
    // 4 work × 20s = 80s; 3 rest × 10s = 30s; prep 5s
    expect(totals.workMs).toBe(80000);
    expect(totals.restMs).toBe(30000);
    expect(totals.totalMs).toBe(80000 + 30000 + 5000);
    expect(totals.segmentCount).toBe(7);
  });

  it("totalMs incluye prep aunque no haya rest", () => {
    const plan = buildSimplePlan({ ...baseSimple, rounds: 1 });
    const totals = planTotals(plan);
    expect(totals.restMs).toBe(0);
    expect(totals.totalMs).toBe(20000 + 5000);
  });
});

describe("computeRuntimeState", () => {
  const plan = buildSimplePlan(baseSimple); // prep 5s, [w20,r10,w20,r10,w20,r10,w20]

  it("t=0 arranca en prep", () => {
    // prep largo (10s) para distinguir 'prep' de 'prep-ending'
    const longPrep = buildSimplePlan({ ...baseSimple, prepSecs: 10 });
    const s = computeRuntimeState(longPrep, 0);
    expect(s.phaseKind).toBe("prep");
    expect(s.visualState).toBe("prep");
    expect(s.segmentIndex).toBe(-1);
    expect(s.currentSegment).toBeNull();
    expect(s.nextSegment).toBe(longPrep.segments[0]);
    expect(s.remainingMs).toBe(10000);
    expect(s.totalRemainingMs).toBe(planTotals(longPrep).totalMs);
  });

  it("elapsed negativo se trata como inicio", () => {
    const longPrep = buildSimplePlan({ ...baseSimple, prepSecs: 10 });
    const s = computeRuntimeState(longPrep, -500);
    expect(s.phaseKind).toBe("prep");
    expect(s.remainingMs).toBe(10000);
  });

  it("prep-ending cuando faltan <= WARNING_MS", () => {
    // prep dura 5000ms = WARNING_MS, así que desde t=0 ya es ending
    const s = computeRuntimeState(plan, 0);
    expect(s.visualState).toBe("prep-ending");
  });

  it("transición prep → primer work en el límite exacto (semántica [inicio,fin))", () => {
    const s = computeRuntimeState(plan, 5000);
    expect(s.phaseKind).toBe("work");
    expect(s.segmentIndex).toBe(0);
    expect(s.currentSegment).toBe(plan.segments[0]);
    expect(s.remainingMs).toBe(20000);
    expect(s.visualState).toBe("work");
  });

  it("mitad de un work", () => {
    const s = computeRuntimeState(plan, 5000 + 10000); // 10s dentro del primer work
    expect(s.phaseKind).toBe("work");
    expect(s.remainingMs).toBe(10000);
    expect(s.phaseProgress).toBeCloseTo(0.5, 5);
    expect(s.nextSegment).toBe(plan.segments[1]);
  });

  it("work-ending exactamente en el umbral de 5s", () => {
    // primer work: [5000, 25000). remaining = 5000 en t = 20000
    const atThreshold = computeRuntimeState(plan, 20000);
    expect(atThreshold.remainingMs).toBe(5000);
    expect(atThreshold.visualState).toBe("work-ending");

    // justo antes del umbral todavía es "work"
    const beforeThreshold = computeRuntimeState(plan, 20000 - 1);
    expect(beforeThreshold.remainingMs).toBe(5001);
    expect(beforeThreshold.visualState).toBe("work");
  });

  it("rest y rest-ending", () => {
    // primer rest: [25000, 35000)
    const mid = computeRuntimeState(plan, 28000);
    expect(mid.phaseKind).toBe("rest");
    expect(mid.visualState).toBe("rest");

    const ending = computeRuntimeState(plan, 30000); // remaining 5000
    expect(ending.visualState).toBe("rest-ending");
  });

  it("último segmento tiene nextSegment null", () => {
    const totals = planTotals(plan);
    const s = computeRuntimeState(plan, totals.totalMs - 1000);
    expect(s.segmentIndex).toBe(plan.segments.length - 1);
    expect(s.currentSegment).toBe(plan.segments[plan.segments.length - 1]);
    expect(s.nextSegment).toBeNull();
  });

  it("finished al consumir todo", () => {
    const totals = planTotals(plan);
    const s = computeRuntimeState(plan, totals.totalMs);
    expect(s.visualState).toBe("finished");
    expect(s.phaseKind).toBe("finished");
    expect(s.remainingMs).toBe(0);
    expect(s.totalRemainingMs).toBe(0);
    expect(s.overallProgress).toBe(1);
    expect(s.currentSegment).toBeNull();
    expect(s.nextSegment).toBeNull();
    expect(s.segmentIndex).toBe(plan.segments.length - 1);
  });

  it("finished se mantiene pasado el final", () => {
    const totals = planTotals(plan);
    const s = computeRuntimeState(plan, totals.totalMs + 99999);
    expect(s.visualState).toBe("finished");
    expect(s.totalRemainingMs).toBe(0);
  });

  it("plan sin prep arranca directo en el primer segmento", () => {
    const noPrep = buildSimplePlan({ ...baseSimple, prepSecs: 0 });
    const s = computeRuntimeState(noPrep, 0);
    expect(s.phaseKind).toBe("work");
    expect(s.segmentIndex).toBe(0);
  });

  it("overallProgress es monotónico no decreciente", () => {
    const totals = planTotals(plan);
    let prev = -1;
    for (let t = 0; t <= totals.totalMs; t += 1000) {
      const s = computeRuntimeState(plan, t);
      expect(s.overallProgress).toBeGreaterThanOrEqual(prev);
      prev = s.overallProgress;
    }
  });

  it("plan avanzado con segmentos arbitrarios", () => {
    const advanced: TabataPlan = {
      mode: "advanced",
      prepMs: 0,
      segments: [
        { id: "a", kind: "work", durationMs: 60000, label: "Burpees" },
        { id: "b", kind: "rest", durationMs: 15000 },
        { id: "c", kind: "work", durationMs: 45000 },
      ],
    };
    const s1 = computeRuntimeState(advanced, 30000);
    expect(s1.currentSegment?.id).toBe("a");
    expect(s1.remainingMs).toBe(30000);

    const s2 = computeRuntimeState(advanced, 60000);
    expect(s2.currentSegment?.id).toBe("b");

    const s3 = computeRuntimeState(advanced, 80000);
    expect(s3.currentSegment?.id).toBe("c");
    expect(s3.nextSegment).toBeNull();
  });
});

describe("formatTabataTime", () => {
  it("muestra m:ss cuando > 60s", () => {
    expect(formatTabataTime(65000)).toBe("1:05");
    expect(formatTabataTime(120000)).toBe("2:00");
  });

  it("muestra ss cuando <= 60s", () => {
    expect(formatTabataTime(45000)).toBe("45");
    expect(formatTabataTime(60000)).toBe("60");
  });

  it("muestra décimas en los últimos 5s", () => {
    expect(formatTabataTime(4300)).toBe("4.3");
    expect(formatTabataTime(5000)).toBe("5.0");
  });

  it("usa ceil para no mostrar 0 mientras corre", () => {
    expect(formatTabataTime(44001)).toBe("45");
    expect(formatTabataTime(4201)).toBe("4.3");
  });

  it("0ms es '0'", () => {
    expect(formatTabataTime(0)).toBe("0");
  });

  it("forceMmss fuerza m:ss", () => {
    expect(formatTabataTime(45000, { forceMmss: true })).toBe("0:45");
    expect(formatTabataTime(5000, { forceMmss: true })).toBe("0:05");
  });

  it("WARNING_MS es 5000", () => {
    expect(WARNING_MS).toBe(5000);
  });
});
