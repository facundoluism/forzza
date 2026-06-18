import { describe, it, expect } from "vitest";
import { resolveExerciseIconKey } from "../exerciseIconMap";

// =============================================================================
// Tests para resolveExerciseIconKey
// Cubre: normalización de capitalización, patrones exactos, prefijos,
// equipment hints, group fallback y el fallback final machine-generic.
// =============================================================================

describe("resolveExerciseIconKey — normalización de capitalización", () => {
  it("normaliza movement_pattern uppercase", () => {
    expect(resolveExerciseIconKey("PUSH – HORIZONTAL", [], null)).toBe(
      "bench-press"
    );
  });

  it("normaliza movement_pattern mixed case (título)", () => {
    expect(resolveExerciseIconKey("Push – Horizontal", [], null)).toBe(
      "bench-press"
    );
  });

  it("normaliza primary_group 'Legs' (con mayúscula DB legacy)", () => {
    expect(resolveExerciseIconKey(null, [], "Legs")).toBe("squat");
  });

  it("normaliza primary_group 'LEGS'", () => {
    expect(resolveExerciseIconKey(null, [], "LEGS")).toBe("squat");
  });

  it("normaliza primary_group 'Back' (mayúscula)", () => {
    expect(resolveExerciseIconKey(null, [], "Back")).toBe("row");
  });

  it("normaliza primary_group 'Chest' (mayúscula)", () => {
    expect(resolveExerciseIconKey(null, [], "Chest")).toBe("bench-press");
  });

  it("normaliza primary_group 'Shoulders' (mayúscula)", () => {
    expect(resolveExerciseIconKey(null, [], "Shoulders")).toBe(
      "overhead-press"
    );
  });

  it("normaliza primary_group 'Arms' (mayúscula)", () => {
    expect(resolveExerciseIconKey(null, [], "Arms")).toBe("biceps-curl");
  });

  it("normaliza primary_group 'Core' (mayúscula)", () => {
    expect(resolveExerciseIconKey(null, [], "Core")).toBe("core-plank");
  });

  it("normaliza equipment con mayúsculas 'Cable'", () => {
    expect(resolveExerciseIconKey(null, ["Cable"], null)).toBe("cable");
  });

  it("normaliza equipment con mayúsculas 'BARBELL'", () => {
    expect(resolveExerciseIconKey(null, ["BARBELL"], null)).toBe("bench-press");
  });

  it("trim de espacios en movement_pattern", () => {
    expect(resolveExerciseIconKey("  squat  ", [], null)).toBe("squat");
  });

  it("trim de espacios en primary_group", () => {
    expect(resolveExerciseIconKey(null, [], "  glutes  ")).toBe("hip-thrust");
  });
});

describe("resolveExerciseIconKey — coincidencias exactas", () => {
  it("bench-press exacto", () => {
    expect(resolveExerciseIconKey("bench press", [], null)).toBe("bench-press");
  });

  it("squat exacto", () => {
    expect(resolveExerciseIconKey("squat", [], null)).toBe("squat");
  });

  it("deadlift exacto", () => {
    expect(resolveExerciseIconKey("deadlift", [], null)).toBe("deadlift");
  });

  it("romanian deadlift exacto", () => {
    expect(resolveExerciseIconKey("romanian deadlift", [], null)).toBe(
      "deadlift"
    );
  });

  it("hip thrust exacto", () => {
    expect(resolveExerciseIconKey("hip thrust", [], null)).toBe("hip-thrust");
  });

  it("plank exacto", () => {
    expect(resolveExerciseIconKey("plank", [], null)).toBe("core-plank");
  });

  it("crunch exacto", () => {
    expect(resolveExerciseIconKey("crunch", [], null)).toBe("core-plank");
  });

  it("lat pulldown exacto", () => {
    expect(resolveExerciseIconKey("lat pulldown", [], null)).toBe("pulldown");
  });

  it("pull-ups / chin-ups exacto (formato DB original)", () => {
    expect(resolveExerciseIconKey("Pull-Ups / Chin-Ups", [], null)).toBe(
      "pullup"
    );
  });

  it("leg extension exacto", () => {
    expect(resolveExerciseIconKey("leg extension", [], null)).toBe(
      "leg-extension"
    );
  });

  it("leg curl exacto", () => {
    expect(resolveExerciseIconKey("leg curl", [], null)).toBe("leg-curl");
  });

  it("overhead press exacto", () => {
    expect(resolveExerciseIconKey("overhead press", [], null)).toBe(
      "overhead-press"
    );
  });

  it("biceps curl exacto", () => {
    expect(resolveExerciseIconKey("biceps curl", [], null)).toBe("biceps-curl");
  });

  it("hammer curl exacto", () => {
    expect(resolveExerciseIconKey("hammer curl", [], null)).toBe("biceps-curl");
  });

  it("skull crusher exacto", () => {
    expect(resolveExerciseIconKey("skull crusher", [], null)).toBe(
      "triceps-ext"
    );
  });

  it("lateral raise exacto", () => {
    expect(resolveExerciseIconKey("lateral raise", [], null)).toBe(
      "lateral-raise"
    );
  });

  it("chest fly exacto", () => {
    expect(resolveExerciseIconKey("chest fly", [], null)).toBe("chest-fly");
  });

  it("cable crossover exacto", () => {
    expect(resolveExerciseIconKey("cable crossover", [], null)).toBe("cable");
  });

  it("burpees exacto → cardio", () => {
    expect(resolveExerciseIconKey("burpees", [], null)).toBe("cardio");
  });

  it("treadmill exacto → cardio", () => {
    expect(resolveExerciseIconKey("treadmill", [], null)).toBe("cardio");
  });

  it("glute bridge exacto", () => {
    expect(resolveExerciseIconKey("glute bridge", [], null)).toBe("hip-thrust");
  });
});

describe("resolveExerciseIconKey — patrones del mapa original (casing original)", () => {
  it("Push – Horizontal (capitalización original DB)", () => {
    expect(resolveExerciseIconKey("Push – Horizontal", [], null)).toBe(
      "bench-press"
    );
  });

  it("Push – Vertical (guided) (capitalización original DB)", () => {
    expect(resolveExerciseIconKey("Push – Vertical (Guided)", [], null)).toBe(
      "overhead-press"
    );
  });

  it("Fly – Horizontal (capitalización original DB)", () => {
    expect(resolveExerciseIconKey("Fly – Horizontal", [], null)).toBe(
      "chest-fly"
    );
  });

  it("Pull – Vertical (Wide) (capitalización original DB)", () => {
    expect(resolveExerciseIconKey("Pull – Vertical (Wide)", [], null)).toBe(
      "pulldown"
    );
  });

  it("Hinge – Full (capitalización original DB)", () => {
    expect(resolveExerciseIconKey("Hinge – Full", [], null)).toBe("deadlift");
  });

  it("Squat – Guided (capitalización original DB)", () => {
    expect(resolveExerciseIconKey("Squat – Guided", [], null)).toBe("squat");
  });

  it("Lunge – Walking (capitalización original DB)", () => {
    expect(resolveExerciseIconKey("Lunge – Walking", [], null)).toBe("lunge");
  });

  it("Extension – Knee (Sitting) (capitalización original DB)", () => {
    expect(
      resolveExerciseIconKey("Extension – Knee (Sitting)", [], null)
    ).toBe("leg-extension");
  });

  it("Curl – EZ Bar (capitalización original DB)", () => {
    expect(resolveExerciseIconKey("Curl – EZ Bar", [], null)).toBe(
      "biceps-curl"
    );
  });

  it("Hip Thrust – Guided (capitalización original DB)", () => {
    expect(resolveExerciseIconKey("Hip Thrust – Guided", [], null)).toBe(
      "hip-thrust"
    );
  });

  it("Raise – Lateral (Guided) (capitalización original DB)", () => {
    expect(resolveExerciseIconKey("Raise – Lateral (Guided)", [], null)).toBe(
      "lateral-raise"
    );
  });

  it("Extension – Pushdown (capitalización original DB)", () => {
    expect(resolveExerciseIconKey("Extension – Pushdown", [], null)).toBe(
      "triceps-ext"
    );
  });

  it("Core Stabilizers (capitalización original DB)", () => {
    expect(resolveExerciseIconKey("Core Stabilizers", [], null)).toBe(
      "core-plank"
    );
  });

  it("Rotation – Torso (Guided) (capitalización original DB)", () => {
    expect(
      resolveExerciseIconKey("Rotation – Torso (Guided)", [], null)
    ).toBe("core-plank");
  });
});

describe("resolveExerciseIconKey — prefijos (PREFIX_MAP)", () => {
  it("prefijo 'push – ' variante no mapeada exacto → bench-press", () => {
    expect(
      resolveExerciseIconKey("Push – Custom Variant", [], null)
    ).toBe("bench-press");
  });

  it("prefijo 'pull – ' variante no mapeada exacto → row", () => {
    expect(
      resolveExerciseIconKey("Pull – Custom Variant", [], null)
    ).toBe("row");
  });

  it("prefijo 'hinge' variante nueva → deadlift", () => {
    expect(resolveExerciseIconKey("Hinge – Partial", [], null)).toBe(
      "deadlift"
    );
  });

  it("prefijo 'squat' variante nueva → squat", () => {
    expect(resolveExerciseIconKey("Squat – Paused", [], null)).toBe("squat");
  });

  it("prefijo 'lunge' variante nueva → lunge", () => {
    expect(resolveExerciseIconKey("Lunge – Curtsy", [], null)).toBe("lunge");
  });

  it("prefijo 'curl' variante nueva → biceps-curl", () => {
    expect(resolveExerciseIconKey("Curl – Cable", [], null)).toBe("biceps-curl");
  });

  it("prefijo 'plank' variante nueva → core-plank", () => {
    expect(resolveExerciseIconKey("Plank – RKC", [], null)).toBe("core-plank");
  });

  it("prefijo 'deadlift' standalone → deadlift", () => {
    expect(resolveExerciseIconKey("Deadlift – Sumo", [], null)).toBe(
      "deadlift"
    );
  });

  it("prefijo 'row' standalone → row", () => {
    expect(resolveExerciseIconKey("Row – Machine", [], null)).toBe("row");
  });

  it("prefijo 'tricep' → triceps-ext", () => {
    expect(resolveExerciseIconKey("Tricep Kickback", [], null)).toBe(
      "triceps-ext"
    );
  });
});

describe("resolveExerciseIconKey — equipment hints", () => {
  it("equipment cable → cable", () => {
    expect(resolveExerciseIconKey(null, ["cable"], null)).toBe("cable");
  });

  it("equipment 'Cable' (mayúscula) → cable", () => {
    expect(resolveExerciseIconKey(null, ["Cable"], null)).toBe("cable");
  });

  it("equipment barbell → bench-press", () => {
    expect(resolveExerciseIconKey(null, ["barbell"], null)).toBe("bench-press");
  });

  it("equipment dumbbell → biceps-curl", () => {
    expect(resolveExerciseIconKey(null, ["dumbbell"], null)).toBe("biceps-curl");
  });

  it("equipment kettlebell → deadlift", () => {
    expect(resolveExerciseIconKey(null, ["kettlebell"], null)).toBe("deadlift");
  });

  it("equipment bodyweight → core-plank", () => {
    expect(resolveExerciseIconKey(null, ["bodyweight"], null)).toBe(
      "core-plank"
    );
  });

  it("equipment band → cable", () => {
    expect(resolveExerciseIconKey(null, ["resistance band"], null)).toBe(
      "cable"
    );
  });

  it("equipment smith machine → machine-generic", () => {
    expect(resolveExerciseIconKey(null, ["smith machine"], null)).toBe(
      "machine-generic"
    );
  });

  it("equipment machine → machine-generic", () => {
    expect(resolveExerciseIconKey(null, ["machine"], null)).toBe(
      "machine-generic"
    );
  });

  it("equipment treadmill → cardio", () => {
    expect(resolveExerciseIconKey(null, ["treadmill"], null)).toBe("cardio");
  });

  it("equipment bicicleta → cardio", () => {
    expect(resolveExerciseIconKey(null, ["bicicleta"], null)).toBe("cardio");
  });

  it("cable tiene prioridad sobre machine en equipment array mixto", () => {
    // cable aparece antes que machine en EQUIPMENT_HINT_MAP
    expect(
      resolveExerciseIconKey(null, ["cable", "machine"], null)
    ).toBe("cable");
  });
});

describe("resolveExerciseIconKey — GROUP_FALLBACK_MAP (todos los grupos)", () => {
  it("group chest → bench-press", () => {
    expect(resolveExerciseIconKey(null, [], "chest")).toBe("bench-press");
  });

  it("group back → row", () => {
    expect(resolveExerciseIconKey(null, [], "back")).toBe("row");
  });

  it("group legs → squat", () => {
    expect(resolveExerciseIconKey(null, [], "legs")).toBe("squat");
  });

  it("group shoulders → overhead-press", () => {
    expect(resolveExerciseIconKey(null, [], "shoulders")).toBe("overhead-press");
  });

  it("group arms → biceps-curl", () => {
    expect(resolveExerciseIconKey(null, [], "arms")).toBe("biceps-curl");
  });

  it("group core → core-plank", () => {
    expect(resolveExerciseIconKey(null, [], "core")).toBe("core-plank");
  });

  it("group glutes → hip-thrust (NUEVO grupo antes ausente)", () => {
    expect(resolveExerciseIconKey(null, [], "glutes")).toBe("hip-thrust");
  });

  it("group cardio → cardio (NUEVO grupo antes ausente)", () => {
    expect(resolveExerciseIconKey(null, [], "cardio")).toBe("cardio");
  });

  it("group full_body → deadlift (NUEVO grupo antes ausente)", () => {
    expect(resolveExerciseIconKey(null, [], "full_body")).toBe("deadlift");
  });
});

describe("resolveExerciseIconKey — prioridad de resolución", () => {
  it("movement_pattern exacto tiene prioridad sobre equipment", () => {
    // squat es exacto, aunque equipment sea cable
    expect(resolveExerciseIconKey("squat", ["cable"], "back")).toBe("squat");
  });

  it("equipment tiene prioridad sobre group fallback", () => {
    // sin pattern, barbell resuelve antes que group=legs
    expect(resolveExerciseIconKey(null, ["barbell"], "legs")).toBe("bench-press");
  });

  it("group fallback se aplica cuando no hay pattern ni equipment conocido", () => {
    expect(resolveExerciseIconKey(null, [], "glutes")).toBe("hip-thrust");
  });

  it("fallback final machine-generic cuando todo falla", () => {
    expect(
      resolveExerciseIconKey("unknown pattern xyz", [], "unknown_group")
    ).toBe("machine-generic");
  });

  it("null/undefined/vacío en todo → machine-generic", () => {
    expect(resolveExerciseIconKey(null, null, null)).toBe("machine-generic");
    expect(resolveExerciseIconKey(undefined, undefined, undefined)).toBe(
      "machine-generic"
    );
    expect(resolveExerciseIconKey("", [], "")).toBe("machine-generic");
  });
});

describe("resolveExerciseIconKey — nuevos patrones cardio", () => {
  it("running → cardio", () => {
    expect(resolveExerciseIconKey("running", [], null)).toBe("cardio");
  });

  it("cycling → cardio", () => {
    expect(resolveExerciseIconKey("cycling", [], null)).toBe("cardio");
  });

  it("elliptical → cardio", () => {
    expect(resolveExerciseIconKey("elliptical", [], null)).toBe("cardio");
  });

  it("jump rope → cardio", () => {
    expect(resolveExerciseIconKey("jump rope", [], null)).toBe("cardio");
  });

  it("box jump → cardio (prefijo)", () => {
    expect(resolveExerciseIconKey("box jump", [], null)).toBe("cardio");
  });
});

describe("resolveExerciseIconKey — patrones de core nuevos", () => {
  it("sit-up → core-plank", () => {
    expect(resolveExerciseIconKey("sit-up", [], null)).toBe("core-plank");
  });

  it("russian twist → core-plank", () => {
    expect(resolveExerciseIconKey("russian twist", [], null)).toBe("core-plank");
  });

  it("hanging leg raise → core-plank", () => {
    expect(resolveExerciseIconKey("hanging leg raise", [], null)).toBe(
      "core-plank"
    );
  });

  it("mountain climber → core-plank", () => {
    expect(resolveExerciseIconKey("mountain climber", [], null)).toBe(
      "core-plank"
    );
  });

  it("dead bug → core-plank", () => {
    expect(resolveExerciseIconKey("dead bug", [], null)).toBe("core-plank");
  });
});
