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
  // --- comportamiento base ---

  it("ES: usa name + sufijo en español", () => {
    expect(buildSearchQuery(ctx({ name: "Sentadilla", equipment: [] }))).toBe(
      "Sentadilla cómo hacer técnica correcta"
    );
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

  it("normaliza espacios múltiples en el name", () => {
    expect(
      buildSearchQuery(ctx({ name: "  Remo   con barra  ", equipment: [] }))
    ).toBe("Remo con barra cómo hacer técnica correcta");
  });

  // --- equipment ignorado ---

  it("equipment NO aparece en la query aunque venga poblado (ES)", () => {
    const query = buildSearchQuery(
      ctx({ name: "Press banca", equipment: ["barra", "banco"] })
    );
    expect(query).toBe("Press banca cómo hacer técnica correcta");
    expect(query).not.toContain("barra");
    expect(query).not.toContain("banco");
  });

  it("equipment NO aparece en la query aunque venga poblado (EN)", () => {
    const query = buildSearchQuery(
      ctx({ lang: "en", name: "Dominadas", nameEn: "Pull up", equipment: ["bar"] })
    );
    expect(query).toBe("Pull up how to proper form");
    expect(query).not.toContain("bar");
  });

  it("equipment con entradas en blanco: tampoco aparece en la query", () => {
    const query = buildSearchQuery(
      ctx({ name: "Curl", equipment: ["", "   ", "mancuerna"] })
    );
    expect(query).toBe("Curl cómo hacer técnica correcta");
    expect(query).not.toContain("mancuerna");
  });

  // --- limpieza de paréntesis ---

  it("nombre con paréntesis: se elimina el fragmento entre paréntesis (ES)", () => {
    expect(
      buildSearchQuery(
        ctx({
          name: "Fondos en paralelas asistidos (polea)",
          equipment: ["Polea / Cable", "Máquina de Poleas / Cable Machine"],
        })
      )
    ).toBe("Fondos en paralelas asistidos cómo hacer técnica correcta");
  });

  it("nombre con paréntesis: se elimina el fragmento entre paréntesis (EN)", () => {
    expect(
      buildSearchQuery(
        ctx({
          lang: "en",
          name: "Assisted dips (cable)",
          nameEn: "Assisted dips (cable)",
          equipment: ["Cable machine"],
        })
      )
    ).toBe("Assisted dips how to proper form");
  });

  it("nombre con múltiples paréntesis: se eliminan todos", () => {
    expect(
      buildSearchQuery(ctx({ name: "Ejercicio (variante A) (con máquina)", equipment: [] }))
    ).toBe("Ejercicio how to proper form".replace("how to proper form", "cómo hacer técnica correcta"));
    // reescribimos en forma directa para evitar confusión:
    expect(
      buildSearchQuery(ctx({ name: "Ejercicio (variante A) (con máquina)", equipment: [] }))
    ).toBe("Ejercicio cómo hacer técnica correcta");
  });

  // --- casos reales de la tarea ---

  it("deadlift ES: equipment bilingüe ignorado, sin paréntesis en nombre", () => {
    expect(
      buildSearchQuery(
        ctx({
          name: "Peso muerto",
          nameEn: "Deadlift",
          equipment: ["Peso Libre - Mancuerna", "Mancuerna (Dumbbell)"],
          lang: "es",
        })
      )
    ).toBe("Peso muerto cómo hacer técnica correcta");
  });

  it("deadlift EN: equipment bilingüe ignorado", () => {
    expect(
      buildSearchQuery(
        ctx({
          name: "Peso muerto",
          nameEn: "Deadlift",
          equipment: ["Peso Libre - Mancuerna", "Mancuerna (Dumbbell)"],
          lang: "en",
        })
      )
    ).toBe("Deadlift how to proper form");
  });

  it("assisted-dips-cable ES: nombre con paréntesis limpiado, equipment ignorado", () => {
    expect(
      buildSearchQuery(
        ctx({
          name: "Fondos en paralelas asistidos (polea)",
          nameEn: null,
          equipment: ["Polea / Cable", "Máquina de Poleas / Cable Machine"],
          lang: "es",
        })
      )
    ).toBe("Fondos en paralelas asistidos cómo hacer técnica correcta");
  });
});
