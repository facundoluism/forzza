// =============================================================================
// FORZZA — Mapeo determinístico movimiento+equipo+grupo → svg_icon key
// Función pura, sin dependencias de UI (usable en packages/core también).
//
// Reglas de resolución (orden de prioridad decreciente):
//   1. movement_pattern exacto → key específica  (normalizado a lowercase)
//   2. Prefijo de movement_pattern → key por categoría  (normalizado)
//   3. equipment hint → key por equipo  (normalizado)
//   4. Fallback por primary_group → key genérica por grupo muscular  (normalizado)
//
// Todos los mapas usan KEYS EN LOWERCASE.  Los inputs del resolver
// se normalizan (trim + toLowerCase) antes de comparar, de modo que
// variantes de capitalización de la DB (ej. "Legs" / "legs" / "LEGS")
// funcionen de la misma manera.
// =============================================================================

import type { ExerciseIconKey } from "./exerciseIconTypes";

// ---------------------------------------------------------------------------
// Tablas de mapeo exacto (movement_pattern completo, todas las keys lowercase)
// ---------------------------------------------------------------------------

const EXACT_PATTERN_MAP: Record<string, ExerciseIconKey> = {
  // ── Push horizontal — pecho con banco plano ──────────────────────────────
  "push – horizontal": "bench-press",
  "push – horizontal (guided)": "bench-press",
  "push-ups": "bench-press",
  "push-up": "bench-press",
  "chest press": "bench-press",
  "bench press": "bench-press",

  // ── Push inclinado — pecho superior ──────────────────────────────────────
  "push – incline": "incline-press",
  "push – incline (guided)": "incline-press",
  "incline press": "incline-press",
  "incline bench press": "incline-press",

  // ── Push declinado — pecho inferior ──────────────────────────────────────
  "push – decline": "decline-press",
  "decline press": "decline-press",
  "decline bench press": "decline-press",

  // ── Press vertical — hombros overhead ────────────────────────────────────
  "push – vertical": "overhead-press",
  "push – vertical (guided)": "overhead-press",
  "push – rotational vertical": "overhead-press",
  "overhead press": "overhead-press",
  "shoulder press": "overhead-press",
  "military press": "overhead-press",
  "arnold press": "overhead-press",

  // ── Push close / fondos / tríceps ────────────────────────────────────────
  "push – close grip": "triceps-ext",
  "push – standing": "triceps-ext",
  "push – lower body (horizontal)": "bench-press",
  "push – lower body (incline)": "incline-press",
  "dips": "triceps-ext",
  "tricep dips": "triceps-ext",
  "diamond push-up": "triceps-ext",

  // ── Fly — aperturas de pecho ──────────────────────────────────────────────
  "fly – horizontal": "chest-fly",
  "fly – incline": "chest-fly",
  "fly – decline": "chest-fly",
  "fly – guided": "chest-fly",
  "fly – high pulley": "chest-fly",
  "fly – low pulley": "chest-fly",
  "chest fly": "chest-fly",
  "pec deck": "chest-fly",
  "butterfly": "chest-fly",

  // ── Fly inverso — hombros posteriores ────────────────────────────────────
  "fly – reverse": "lateral-raise",
  "fly – reverse (guided)": "lateral-raise",
  "reverse fly": "lateral-raise",
  "rear delt fly": "lateral-raise",

  // ── Pull vertical — jalones y dominadas ──────────────────────────────────
  "pull – vertical": "pulldown",
  "pull – vertical (assisted)": "pulldown",
  "pull – vertical (guided)": "pulldown",
  "pull – vertical (narrow)": "pulldown",
  "pull – vertical (reverse)": "pulldown",
  "pull – vertical (wide)": "pulldown",
  "lat pulldown": "pulldown",
  "pulldown": "pulldown",

  // ── Dominadas ─────────────────────────────────────────────────────────────
  "pull-ups / chin-ups": "pullup",
  "pull-ups": "pullup",
  "chin-ups": "pullup",
  "pull ups": "pullup",
  "chin ups": "pullup",

  // ── Pull horizontal — remos ───────────────────────────────────────────────
  "pull – horizontal": "row",
  "pull – horizontal (guided)": "row",
  "pull – inclined horizontal": "row",
  "pull – unilateral horizontal": "row",
  "pull – face": "row",
  "row": "row",
  "bent over row": "row",
  "barbell row": "row",
  "dumbbell row": "row",
  "cable row": "row",
  "seated row": "row",
  "machine row": "row",
  "t-bar row": "row",
  "face pull": "row",

  // ── Pull-over / arc ───────────────────────────────────────────────────────
  "pull – arc": "chest-fly",
  "pull – straight arm": "pulldown",
  "pullover": "chest-fly",
  "pull over": "chest-fly",
  "dumbbell pullover": "chest-fly",

  // ── Core antirotación / pallof ────────────────────────────────────────────
  "pull – anti-rotation": "core-plank",
  "press pallof con polea": "core-plank",
  "pallof press": "core-plank",
  "anti-rotation – press": "core-plank",

  // ── Bisagra de cadera — peso muerto ───────────────────────────────────────
  "hinge – full": "deadlift",
  "deadlift": "deadlift",
  "romanian deadlift": "deadlift",
  "rdl": "deadlift",
  "sumo deadlift": "deadlift",
  "trap bar deadlift": "deadlift",
  "good morning": "deadlift",

  // ── Sentadilla ────────────────────────────────────────────────────────────
  "squat – guided": "squat",
  "squat – wide": "squat",
  "squat": "squat",
  "back squat": "squat",
  "front squat": "squat",
  "goblet squat": "squat",
  "hack squat": "squat",
  "box squat": "squat",
  "leg press": "squat",
  "smith machine squat": "squat",

  // ── Zancadas / estocadas ──────────────────────────────────────────────────
  "lunge – guided": "lunge",
  "lunge – reverse": "lunge",
  "lunge – unilateral": "lunge",
  "lunge – walking": "lunge",
  "lunges": "lunge",
  "lunge": "lunge",
  "step-up": "lunge",
  "step-up – unilateral": "lunge",
  "split squat – elevated rear foot": "lunge",
  "walking lunge": "lunge",
  "reverse lunge": "lunge",

  // ── Calf raises — pantorrillas ────────────────────────────────────────────
  "calf raise": "lunge",
  "calf raise – guided": "lunge",
  "calf raise – seated": "lunge",
  "calf raise – standing": "lunge",
  "standing calf raise": "lunge",
  "seated calf raise": "lunge",

  // ── Extensión de rodilla — cuádriceps en máquina ──────────────────────────
  "extension – knee (sitting)": "leg-extension",
  "leg extension": "leg-extension",

  // ── Curl femoral — isquiotibiales ─────────────────────────────────────────
  "extension – hip": "leg-curl",
  "hip extension – knee flexion": "leg-curl",
  "flexion – knee (prone)": "leg-curl",
  "flexion – knee (sitting)": "leg-curl",
  "leg curl": "leg-curl",
  "lying leg curl": "leg-curl",
  "seated leg curl": "leg-curl",
  "hamstring curl": "leg-curl",
  "nordic curl": "leg-curl",

  // ── Hip thrust — glúteos ──────────────────────────────────────────────────
  "hip thrust": "hip-thrust",
  "hip thrust – guided": "hip-thrust",
  "hip abductor machine": "hip-thrust",
  "hip abductors": "hip-thrust",
  "hip adductor machine": "hip-thrust",
  "hip adductors": "hip-thrust",
  "hip adductors (inner thigh)": "hip-thrust",
  "abduction": "hip-thrust",
  "abduction – hip": "hip-thrust",
  "adduction": "hip-thrust",
  "adduction – hip": "hip-thrust",
  "glute bridge": "hip-thrust",
  "barbell hip thrust": "hip-thrust",
  "donkey kick": "hip-thrust",
  "cable kickback": "hip-thrust",

  // ── Encogimiento — trapecios ──────────────────────────────────────────────
  "shrug": "lateral-raise",
  "barbell shrug": "lateral-raise",
  "dumbbell shrug": "lateral-raise",

  // ── Elevaciones laterales — deltoides ─────────────────────────────────────
  "raise – lateral": "lateral-raise",
  "raise – lateral (guided)": "lateral-raise",
  "raise – frontal": "lateral-raise",
  "raise – hanging": "lateral-raise",
  "lateral raise": "lateral-raise",
  "front raise": "lateral-raise",
  "upright row": "lateral-raise",

  // ── Curl de bíceps ────────────────────────────────────────────────────────
  "curl – braced": "biceps-curl",
  "curl – ez bar": "biceps-curl",
  "curl – guided": "biceps-curl",
  "curl – isolation": "biceps-curl",
  "curl – neutral grip": "biceps-curl",
  "curl – overhead stretch": "biceps-curl",
  "curl – rotational": "biceps-curl",
  "curl – stretch": "biceps-curl",
  "biceps curl": "biceps-curl",
  "barbell curl": "biceps-curl",
  "dumbbell curl": "biceps-curl",
  "hammer curl": "biceps-curl",
  "concentration curl": "biceps-curl",
  "preacher curl": "biceps-curl",
  "cable curl": "biceps-curl",
  "ez bar curl": "biceps-curl",

  // ── Extensiones de tríceps ────────────────────────────────────────────────
  "extension – kickback": "triceps-ext",
  "extension – overhead": "triceps-ext",
  "extension – pushdown": "triceps-ext",
  "extension – guided": "triceps-ext",
  "extension – supine": "triceps-ext",
  "triceps extension": "triceps-ext",
  "skull crusher": "triceps-ext",
  "close grip bench press": "triceps-ext",
  "triceps pushdown": "triceps-ext",
  "rope pushdown": "triceps-ext",
  "overhead triceps extension": "triceps-ext",

  // ── Core — plancha / abdominales ──────────────────────────────────────────
  "flexion – kneeling": "core-plank",
  "flexion – spinal (guided)": "core-plank",
  "lateral flexion": "core-plank",
  "diagonal chop": "core-plank",
  "rotation – diagonal": "core-plank",
  "rotation – torso (guided)": "core-plank",
  "core stabilizers": "core-plank",
  "plank": "core-plank",
  "plank – standard": "core-plank",
  "plank – side": "core-plank",
  "side plank": "core-plank",
  "crunch": "core-plank",
  "sit-up": "core-plank",
  "sit up": "core-plank",
  "ab crunch": "core-plank",
  "cable crunch": "core-plank",
  "russian twist": "core-plank",
  "leg raise": "core-plank",
  "hanging leg raise": "core-plank",
  "mountain climber": "core-plank",
  "dead bug": "core-plank",
  "hollow body": "core-plank",
  "ab wheel rollout": "core-plank",
  "woodchop": "core-plank",
  "wood chop": "core-plank",

  // ── Extensiones espinales ─────────────────────────────────────────────────
  "extension – spinal": "deadlift",
  "hyperextension": "deadlift",
  "back extension": "deadlift",

  // ── Cable genérico ────────────────────────────────────────────────────────
  "cable fly": "cable",
  "cable crossover": "cable",
  "cable pull-through": "cable",
  "cable pull through": "cable",

  // ── Cardio ────────────────────────────────────────────────────────────────
  "run": "cardio",
  "running": "cardio",
  "treadmill": "cardio",
  "bike": "cardio",
  "cycling": "cardio",
  "stationary bike": "cardio",
  "rowing machine": "cardio",
  "elliptical": "cardio",
  "jump rope": "cardio",
  "skipping": "cardio",
  "burpees": "cardio",
  "burpee": "cardio",
  "jumping jacks": "cardio",
  "box jump": "cardio",
  "stair climber": "cardio",
  "sprint": "cardio",
};

// ---------------------------------------------------------------------------
// Prefijos de movement_pattern → key
// (cubre variantes con texto libre adicional)
// Todas las claves en LOWERCASE para comparar contra el pattern normalizado.
// ---------------------------------------------------------------------------

const PREFIX_MAP: Array<[string, ExerciseIconKey]> = [
  // Push — orden de más específico a más general
  ["push – horizontal", "bench-press"],
  ["push – incline", "incline-press"],
  ["push – decline", "decline-press"],
  ["push – vertical", "overhead-press"],
  ["push – rotational", "overhead-press"],
  ["push – close", "triceps-ext"],
  ["push –", "bench-press"],
  ["push-up", "bench-press"],

  // Pull — orden de más específico a más general
  ["pull – vertical", "pulldown"],
  ["pull – horizontal", "row"],
  ["pull – face", "row"],
  ["pull – straight", "pulldown"],
  ["pull – unilateral", "row"],
  ["pull – inclined", "row"],
  ["pull – anti", "core-plank"],
  ["pull – arc", "chest-fly"],
  ["pull –", "row"],
  ["pull-up", "pullup"],
  ["pull over", "chest-fly"],
  ["pullover", "chest-fly"],
  ["pulldown", "pulldown"],

  // Fly
  ["fly – reverse", "lateral-raise"],
  ["fly –", "chest-fly"],

  // Hinge / bisagra
  ["hinge", "deadlift"],

  // Sentadilla
  ["squat", "squat"],
  ["leg press", "squat"],

  // Zancadas / step
  ["lunge", "lunge"],
  ["step-up", "lunge"],
  ["split squat", "lunge"],
  ["calf raise", "lunge"],

  // Hip
  ["hip thrust", "hip-thrust"],
  ["hip abduct", "hip-thrust"],
  ["hip adduct", "hip-thrust"],
  ["hip extension", "leg-curl"],

  // Extensiones — orden de más específico a más general
  ["extension – knee", "leg-extension"],
  ["extension – hip", "leg-curl"],
  ["extension – kick", "triceps-ext"],
  ["extension – overhead", "triceps-ext"],
  ["extension – push", "triceps-ext"],
  ["extension – supine", "triceps-ext"],
  ["extension – guided", "triceps-ext"],
  ["extension – spinal", "deadlift"],
  ["leg extension", "leg-extension"],
  ["leg curl", "leg-curl"],

  // Curl / bíceps
  ["curl", "biceps-curl"],

  // Elevaciones / encogimiento
  ["raise –", "lateral-raise"],
  ["lateral raise", "lateral-raise"],
  ["front raise", "lateral-raise"],
  ["shrug", "lateral-raise"],
  ["upright row", "lateral-raise"],

  // Tríceps standalone
  ["dip", "triceps-ext"],
  ["tricep", "triceps-ext"],
  ["skull", "triceps-ext"],
  ["pushdown", "triceps-ext"],

  // Flexiones de rodilla / columna
  ["flexion – knee", "leg-curl"],
  ["flexion – spinal", "core-plank"],
  ["flexion – kneeling", "core-plank"],
  ["lateral flexion", "core-plank"],

  // Core
  ["diagonal chop", "core-plank"],
  ["anti-rotation", "core-plank"],
  ["rotation", "core-plank"],
  ["core", "core-plank"],
  ["plank", "core-plank"],
  ["crunch", "core-plank"],
  ["sit-up", "core-plank"],
  ["sit up", "core-plank"],
  ["leg raise", "core-plank"],
  ["ab ", "core-plank"],
  ["russian twist", "core-plank"],
  ["mountain climber", "core-plank"],
  ["dead bug", "core-plank"],
  ["hollow body", "core-plank"],
  ["wood chop", "core-plank"],
  ["woodchop", "core-plank"],

  // Abducción / aducción
  ["abduction", "hip-thrust"],
  ["adduction", "hip-thrust"],

  // Peso muerto / bisagra
  ["deadlift", "deadlift"],
  ["romanian", "deadlift"],
  ["good morning", "deadlift"],
  ["back extension", "deadlift"],
  ["hyperextension", "deadlift"],

  // Press genérico (no identificado por push-*)
  ["bench press", "bench-press"],
  ["chest press", "bench-press"],
  ["incline press", "incline-press"],
  ["overhead press", "overhead-press"],
  ["shoulder press", "overhead-press"],
  ["military press", "overhead-press"],

  // Row genérico
  ["row", "row"],
  ["face pull", "row"],

  // Glute bridge
  ["glute bridge", "hip-thrust"],
  ["hip thrust", "hip-thrust"],
  ["donkey kick", "hip-thrust"],

  // Cardio
  ["run", "cardio"],
  ["treadmill", "cardio"],
  ["bike", "cardio"],
  ["cycl", "cardio"],
  ["elliptical", "cardio"],
  ["jump rope", "cardio"],
  ["skipping", "cardio"],
  ["burpee", "cardio"],
  ["sprint", "cardio"],
  ["stair", "cardio"],
  ["rowing machine", "cardio"],
];

// ---------------------------------------------------------------------------
// Hints de equipment → key
// (se aplica cuando movement_pattern no resuelve)
// Todas las entradas en LOWERCASE para comparar contra equipment normalizado.
// ---------------------------------------------------------------------------

const EQUIPMENT_HINT_MAP: Array<[string, ExerciseIconKey]> = [
  // Cables — prioridad alta sobre máquina genérica
  ["cable", "cable"],
  ["pulley", "cable"],
  ["polea", "cable"],

  // Barbell → press horizontal si no hay más contexto
  ["barbell", "bench-press"],
  ["barra olímpica", "bench-press"],
  ["barra olimpica", "bench-press"],
  ["ez bar", "biceps-curl"],
  ["ez-bar", "biceps-curl"],

  // Dumbbell → curl si no hay más contexto
  ["dumbbell", "biceps-curl"],
  ["mancuerna", "biceps-curl"],

  // Kettlebell
  ["kettlebell", "deadlift"],
  ["pesa rusa", "deadlift"],

  // Bodyweight
  ["bodyweight", "core-plank"],
  ["body weight", "core-plank"],
  ["no equipment", "core-plank"],

  // Resistance band
  ["band", "cable"],
  ["resistance band", "cable"],
  ["banda elástica", "cable"],
  ["banda elastica", "cable"],
  ["bandas", "cable"],

  // Cardio machines
  ["treadmill", "cardio"],
  ["bike", "cardio"],
  ["bicicleta", "cardio"],
  ["rower", "cardio"],
  ["elliptical", "cardio"],
  ["skierg", "cardio"],

  // Guided / smith / máquina genérica — al final para no sobreescribir cable
  ["smith", "machine-generic"],
  ["machine", "machine-generic"],
  ["máquina", "machine-generic"],
  ["maquina", "machine-generic"],
];

// ---------------------------------------------------------------------------
// Resolución de patrones en español / mixtos ES-EN
//
// Se aplica SOLO cuando:
//   (a) la resolución por pattern (exacto + prefijo) NO produjo resultado, Y
//   (b) el pattern contiene marcadores de español o formato bilingüe.
//
// Esto replica exactamente la semántica de applySpanishOverride() del script
// backfill-svg-icons.ts, de modo que el resolver de runtime también entienda
// los movement_pattern reales de la DB ("Jalón / Pull", "Empuje / Push", etc.).
// ---------------------------------------------------------------------------

/**
 * Detecta si el movement_pattern (ya normalizado a lowercase) es en español
 * o formato bilingüe ES/EN.  Mismo criterio que isSpanishPattern() del script.
 */
function isSpanishPattern(pattern: string): boolean {
  if (pattern.includes(" / ")) return true;
  const spanishKeywords = [
    "jalón", "empuje", "sentadilla", "bisagra", "extensión",
    "elevación", "apertura", "compuesto", "contracción", "rotación",
    "aducción", "abducción", "flexión", "talones",
  ];
  return spanishKeywords.some((kw) => pattern.includes(kw));
}

// Mapa: keyword española (lowercase) → key base.
// Orden de más específico a más general — igual que SPANISH_PATTERN_OVERRIDES del script.
const SPANISH_PATTERN_OVERRIDES: Array<[string, ExerciseIconKey]> = [
  ["jalón / pull",        "row"],
  ["jalón",               "row"],
  ["bisagra de cadera",   "deadlift"],
  ["bisagra",             "deadlift"],
  ["sentadilla",          "squat"],
  ["empuje / push",       "bench-press"],
  ["empuje",              "bench-press"],
  ["apertura / fly",      "chest-fly"],
  ["apertura",            "chest-fly"],
  ["elevación de talones","lunge"],
  ["elevación / raise",   "lateral-raise"],
  ["elevación",           "lateral-raise"],
  ["contracción / crunch","core-plank"],
  ["contracción",         "core-plank"],
  ["rotación / twist",    "core-plank"],
  ["rotación",            "core-plank"],
  ["extensión de cadera", "leg-curl"],
  ["extensión",           "triceps-ext"],
  ["flexión",             "biceps-curl"],
  ["compuesto / compound","bench-press"],
  ["compuesto",           "bench-press"],
  ["aducción / abducción","hip-thrust"],
  ["aducción",            "hip-thrust"],
  ["abducción",           "hip-thrust"],
];

// Refinamiento de la key base por primary_group — igual que GROUP_REFINEMENTS del script.
// Se aplica solo cuando la key base es demasiado genérica para el grupo muscular.
const SPANISH_GROUP_REFINEMENTS: Record<string, Partial<Record<ExerciseIconKey, ExerciseIconKey>>> = {
  shoulders: { "bench-press": "overhead-press" },
  arms:      { "bench-press": "triceps-ext" },
  legs:      { "bench-press": "squat", "lateral-raise": "lunge", "triceps-ext": "leg-extension" },
  back:      { "bench-press": "row" },
  core:      { "lateral-raise": "core-plank" },
};

// Keys que el resolver produce cuando "no supo" resolver por patrón y cayó en
// equipment hint — mismo conjunto que GENERIC_RESOLVER_KEYS del script.
const GENERIC_RESOLVER_KEYS = new Set<ExerciseIconKey>([
  "biceps-curl",
  "cable",
  "machine-generic",
  "bench-press",
]);

/**
 * Intenta resolver un movement_pattern en español o bilingüe.
 * Solo actúa cuando el resolver principal devolvió una key "genérica"
 * (cayó en equipment hint en lugar de pattern hint).
 *
 * @returns la key refinada, o null si no hubo match español.
 */
function resolveSpanishPattern(
  pattern: string,
  group: string | null
): ExerciseIconKey | null {
  if (!isSpanishPattern(pattern)) return null;

  for (const [keyword, baseKey] of SPANISH_PATTERN_OVERRIDES) {
    if (pattern.includes(keyword)) {
      const refinement = group ? SPANISH_GROUP_REFINEMENTS[group] : undefined;
      return (refinement?.[baseKey] ?? baseKey);
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Fallback por primary_group (todos los valores posibles, en lowercase)
// ---------------------------------------------------------------------------

const GROUP_FALLBACK_MAP: Record<string, ExerciseIconKey> = {
  chest: "bench-press",
  back: "row",
  legs: "squat",
  shoulders: "overhead-press",
  arms: "biceps-curl",
  core: "core-plank",
  glutes: "hip-thrust",
  cardio: "cardio",
  full_body: "deadlift",
};

// ---------------------------------------------------------------------------
// Función pública
// ---------------------------------------------------------------------------

/**
 * Resuelve la key del ícono SVG a partir de los metadatos de un ejercicio.
 * Función pura — sin efectos secundarios, sin dependencias de runtime UI.
 *
 * Los inputs se normalizan internamente (trim + toLowerCase) antes de
 * comparar, por lo que variantes de capitalización de la DB ("Legs" / "legs",
 * "Push – Horizontal" / "push – horizontal") resultan en el mismo ícono.
 *
 * @param movementPattern  exercise_library.movement_pattern (puede ser null)
 * @param equipment        exercise_library.equipment (array TEXT[], puede ser vacío)
 * @param primaryGroup     exercise_library.primary_group (puede ser null)
 * @returns                ExerciseIconKey siempre definida (con fallback "machine-generic")
 */
export function resolveExerciseIconKey(
  movementPattern: string | null | undefined,
  equipment: string[] | null | undefined,
  primaryGroup: string | null | undefined
): ExerciseIconKey {
  // Normalización de inputs
  const pattern = movementPattern?.trim().toLowerCase() ?? null;
  const equipNorm = equipment?.map((e) => e.trim().toLowerCase()) ?? [];
  const group = primaryGroup?.trim().toLowerCase() ?? null;

  // 1. Coincidencia exacta de movement_pattern
  if (pattern) {
    const exactMatch = EXACT_PATTERN_MAP[pattern];
    if (exactMatch) return exactMatch;

    // 2. Prefijo de movement_pattern
    for (const [prefix, key] of PREFIX_MAP) {
      if (pattern.startsWith(prefix)) return key;
    }
  }

  // 3. Hint por equipment
  let equipKey: ExerciseIconKey | null = null;
  if (equipNorm.length > 0) {
    const equipStr = equipNorm.join(" ");
    for (const [hint, key] of EQUIPMENT_HINT_MAP) {
      if (equipStr.includes(hint)) {
        equipKey = key;
        break;
      }
    }
  }

  // 3b. Override para patrones en español / bilingüe:
  // Si el equipment hint devolvió una key "genérica" (o no hubo equipamento),
  // intentar resolver por keyword española en el movement_pattern.
  // Esto es el equivalente runtime de applySpanishOverride() del script de backfill.
  if (pattern && (equipKey === null || GENERIC_RESOLVER_KEYS.has(equipKey))) {
    const spanishKey = resolveSpanishPattern(pattern, group);
    if (spanishKey !== null) return spanishKey;
  }

  if (equipKey !== null) return equipKey;

  // 4. Fallback por primary_group
  if (group) {
    const groupKey = GROUP_FALLBACK_MAP[group];
    if (groupKey) return groupKey;
  }

  return "machine-generic";
}
