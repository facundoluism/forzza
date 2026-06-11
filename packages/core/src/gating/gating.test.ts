import { describe, it, expect } from "vitest";
import { canAddRoutine, canViewWorkoutHistory, shouldShowAutopromo } from "./index";

describe("canAddRoutine", () => {
  it("PRO puede agregar rutinas ilimitadas", () => {
    expect(canAddRoutine({ isPro: true, hasActiveCoach: false, routineCount: 100 })).toBe(true);
  });

  it("FREE: puede agregar si tiene menos de 3", () => {
    expect(canAddRoutine({ isPro: false, hasActiveCoach: false, routineCount: 2 })).toBe(true);
  });

  it("FREE: bloqueado al llegar a 3", () => {
    expect(canAddRoutine({ isPro: false, hasActiveCoach: false, routineCount: 3 })).toBe(false);
  });
});

describe("canViewWorkoutHistory", () => {
  it("PRO ve todo el historial", () => {
    expect(canViewWorkoutHistory({ isPro: true, hasActiveCoach: false, routineCount: 0 }, 365)).toBe(true);
  });

  it("FREE: ve hasta 10 días", () => {
    expect(canViewWorkoutHistory({ isPro: false, hasActiveCoach: false, routineCount: 0 }, 10)).toBe(true);
    expect(canViewWorkoutHistory({ isPro: false, hasActiveCoach: false, routineCount: 0 }, 11)).toBe(false);
  });

  it("FREE: sesión de 15 días no es visible (fuera de ventana de 10 días)", () => {
    expect(canViewWorkoutHistory({ isPro: false, hasActiveCoach: false, routineCount: 0 }, 15)).toBe(false);
  });

  it("PRO: sesión de 15 días sí es visible (sin restricción de ventana)", () => {
    expect(canViewWorkoutHistory({ isPro: true, hasActiveCoach: false, routineCount: 0 }, 15)).toBe(true);
  });
});

describe("shouldShowAutopromo", () => {
  it("FREE ve autopromo", () => {
    expect(shouldShowAutopromo({ isPro: false, hasActiveCoach: false, routineCount: 0 })).toBe(true);
  });

  it("PRO NO ve autopromo", () => {
    expect(shouldShowAutopromo({ isPro: true, hasActiveCoach: false, routineCount: 0 })).toBe(false);
  });

  it("alumno con coach activo NO ve autopromo (hasCoach=true → false)", () => {
    expect(shouldShowAutopromo({ isPro: false, hasActiveCoach: true, routineCount: 0 })).toBe(false);
  });

  it("isPro=true con coach también oculta autopromo", () => {
    expect(shouldShowAutopromo({ isPro: true, hasActiveCoach: true, routineCount: 0 })).toBe(false);
  });
});
