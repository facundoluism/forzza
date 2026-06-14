import { describe, it, expect } from "vitest";
import {
  canAddRoutine,
  canViewWorkoutHistory,
  shouldShowAutopromo,
  isMinorWithoutConsent,
  FREE_MAX_ROUTINES,
  FREE_HISTORY_DAYS,
} from "./index";

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

  it("FREE_MAX_ROUTINES es 3 (constante exportada)", () => {
    expect(FREE_MAX_ROUTINES).toBe(3);
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

describe("canViewWorkoutHistory", () => {
  it("FREE_HISTORY_DAYS es 10 (constante exportada)", () => {
    expect(FREE_HISTORY_DAYS).toBe(10);
  });
});

describe("isMinorWithoutConsent", () => {
  it("menor de 18 sin consentimiento → debe bloquear (true)", () => {
    const today = new Date();
    const birth = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    expect(isMinorWithoutConsent({
      birthDate: birth.toISOString().slice(0, 10),
      parentalConsentAt: null,
    })).toBe(true);
  });

  it("menor de 18 CON consentimiento → no bloquear (false)", () => {
    const today = new Date();
    const birth = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    expect(isMinorWithoutConsent({
      birthDate: birth.toISOString().slice(0, 10),
      parentalConsentAt: "2025-01-01T00:00:00Z",
    })).toBe(false);
  });

  it("mayor de 18 sin consentimiento → no bloquear (false)", () => {
    const today = new Date();
    const birth = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    expect(isMinorWithoutConsent({
      birthDate: birth.toISOString().slice(0, 10),
      parentalConsentAt: null,
    })).toBe(false);
  });

  it("exactamente 18 años NO es menor → no bloquear", () => {
    const today = new Date();
    const birth = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    expect(isMinorWithoutConsent({
      birthDate: birth.toISOString().slice(0, 10),
      parentalConsentAt: null,
    })).toBe(false);
  });

  it("sin fecha de nacimiento → no bloquear (no se puede determinar)", () => {
    expect(isMinorWithoutConsent({ birthDate: null, parentalConsentAt: null })).toBe(false);
    expect(isMinorWithoutConsent({ birthDate: undefined, parentalConsentAt: null })).toBe(false);
  });

  it("menor cuyo cumpleaños es el mes siguiente → todavía es menor", () => {
    const today = new Date();
    // Nacido el mes que viene hace 18 años → aún 17
    let birthMonth = today.getMonth() + 1;
    let birthYear = today.getFullYear() - 18;
    if (birthMonth > 11) { birthMonth = 0; birthYear += 1; }
    const birth = new Date(birthYear, birthMonth, 1);
    expect(isMinorWithoutConsent({
      birthDate: birth.toISOString().slice(0, 10),
      parentalConsentAt: null,
    })).toBe(true);
  });
});
