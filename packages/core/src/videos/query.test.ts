import { describe, it, expect } from "vitest";
import { buildSearchQuery } from "./query";
import type { ExerciseContext } from "./types";

function ctx(overrides: Partial<ExerciseContext> = {}): ExerciseContext {
  return {
    name: "Sentadilla",
    nameEn: "Squat",
    description: null,
    equipment: [],
    lang: "es",
    ...overrides,
  };
}

describe("buildSearchQuery", () => {
  it("ES: usa name + sufijo en español", () => {
    expect(buildSearchQuery(ctx({ name: "Sentadilla", equipment: [] }))).toBe(
      "Sentadilla cómo hacer técnica correcta"
    );
  });

  it("ES: incluye equipment entre name y sufijo", () => {
    expect(
      buildSearchQuery(ctx({ name: "Press banca", equipment: ["barra", "banco"] }))
    ).toBe("Press banca barra banco cómo hacer técnica correcta");
  });

  it("EN: usa nameEn y sufijo en inglés", () => {
    expect(
      buildSearchQuery(ctx({ lang: "en", name: "Sentadilla", nameEn: "Squat" }))
    ).toBe("Squat how to proper form");
  });

  it("EN: cae a name si nameEn es null", () => {
    expect(
      buildSearchQuery(ctx({ lang: "en", name: "Peso muerto", nameEn: null }))
    ).toBe("Peso muerto how to proper form");
  });

  it("omite equipment vacío o en blanco", () => {
    expect(
      buildSearchQuery(ctx({ name: "Curl", equipment: ["", "   ", "mancuerna"] }))
    ).toBe("Curl mancuerna cómo hacer técnica correcta");
  });

  it("normaliza espacios múltiples", () => {
    expect(
      buildSearchQuery(ctx({ name: "  Remo   con barra  ", equipment: ["  barra  "] }))
    ).toBe("Remo con barra barra cómo hacer técnica correcta");
  });

  it("EN con equipment", () => {
    expect(
      buildSearchQuery(
        ctx({ lang: "en", name: "Dominadas", nameEn: "Pull up", equipment: ["bar"] })
      )
    ).toBe("Pull up bar how to proper form");
  });
});
