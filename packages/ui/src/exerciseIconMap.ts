// =============================================================================
// FORZZA — Mapeo determinístico movimiento+equipo+grupo → svg_icon key
// Función pura, sin dependencias de UI (usable en packages/core también).
//
// Reglas de resolución (orden de prioridad decreciente):
//   1. movement_pattern exacto → key específica
//   2. Prefijo de movement_pattern → key por categoría
//   3. equipment hint → key por equipo
//   4. Fallback por primary_group → key genérica por grupo muscular
//
// Los valores de movement_pattern provienen de exercise_library.
// Los valores de primary_group son: Chest, Back, Legs, Shoulders, Arms, Core.
// =============================================================================

import type { ExerciseIconKey } from "./exerciseIconTypes";

// ---------------------------------------------------------------------------
// Tablas de mapeo exacto (movement_pattern completo)
// ---------------------------------------------------------------------------

const EXACT_PATTERN_MAP: Record<string, ExerciseIconKey> = {
  // Push horizontal — pecho con banco plano
  "Push – Horizontal": "bench-press",
  "Push – Horizontal (Guided)": "bench-press",

  // Push inclinado — pecho superior
  "Push – Incline": "incline-press",
  "Push – Incline (Guided)": "incline-press",

  // Push declinado — pecho inferior
  "Push – Decline": "decline-press",

  // Press vertical — hombros overhead
  "Push – Vertical": "overhead-press",
  "Push – Vertical (Guided)": "overhead-press",
  "Push – Rotational Vertical": "overhead-press",

  // Fondos / dips
  "Push – Close Grip": "triceps-ext",
  "Push – Standing": "triceps-ext",
  "Push – Lower Body (Horizontal)": "bench-press",
  "Push – Lower Body (Incline)": "incline-press",
  "Push-Ups": "bench-press",

  // Fly — aperturas de pecho
  "Fly – Horizontal": "chest-fly",
  "Fly – Incline": "chest-fly",
  "Fly – Decline": "chest-fly",
  "Fly – Guided": "chest-fly",
  "Fly – High Pulley": "chest-fly",
  "Fly – Low Pulley": "chest-fly",

  // Fly inverso — hombros posteriores
  "Fly – Reverse": "lateral-raise",
  "Fly – Reverse (Guided)": "lateral-raise",

  // Pull vertical — jalones y dominadas
  "Pull – Vertical": "pulldown",
  "Pull – Vertical (Assisted)": "pulldown",
  "Pull – Vertical (Guided)": "pulldown",
  "Pull – Vertical (Narrow)": "pulldown",
  "Pull – Vertical (Reverse)": "pulldown",
  "Pull – Vertical (Wide)": "pulldown",
  "Pull-Ups / Chin-Ups": "pullup",

  // Pull horizontal — remos
  "Pull – Horizontal": "row",
  "Pull – Horizontal (Guided)": "row",
  "Pull – Inclined Horizontal": "row",
  "Pull – Unilateral Horizontal": "row",

  // Pull-over y arco
  "Pull – Arc": "chest-fly",
  "Pull – Straight Arm": "pulldown",
  "Pull – Face": "row",

  // Antirotación / core
  "Pull – Anti-Rotation": "core-plank",
  "Press Pallof con Polea": "core-plank",

  // Bisagra de cadera — peso muerto y variantes
  "Hinge – Full": "deadlift",

  // Empuje tren inferior — sentadillas
  "Squat – Guided": "squat",
  "Squat – Wide": "squat",

  // Zancadas
  "Lunge – Guided": "lunge",
  "Lunge – Reverse": "lunge",
  "Lunge – Unilateral": "lunge",
  "Lunge – Walking": "lunge",
  "Lunges": "lunge",
  "Step-Up": "lunge",
  "Step-Up – Unilateral": "lunge",

  // Extensión de rodilla — cuádriceps en máquina
  "Extension – Knee (Sitting)": "leg-extension",

  // Curl femoral — isquiotibiales
  "Extension – Hip": "leg-curl",
  "Hip Extension – Knee Flexion": "leg-curl",

  // Hip thrust — glúteos
  "Hip Thrust": "hip-thrust",
  "Hip Thrust – Guided": "hip-thrust",
  "Hip Abductor Machine": "hip-thrust",
  "Hip Abductors": "hip-thrust",
  "Hip Adductor Machine": "hip-thrust",
  "Hip Adductors": "hip-thrust",
  "Hip Adductors (Inner Thigh)": "hip-thrust",

  // Abducción / aducción — glúteo medio / aductores
  "Abduction": "hip-thrust",
  "Abduction – Hip": "hip-thrust",
  "Adduction": "hip-thrust",
  "Adduction – Hip": "hip-thrust",

  // Elevación de talones — pantorrillas
  "Calf Raise": "lunge",
  "Calf Raise – Guided": "lunge",
  "Calf Raise – Seated": "lunge",
  "Calf Raise – Standing": "lunge",

  // Encogimiento — trapecios
  "Shrug": "lateral-raise",

  // Sentadilla búlgara / split squat
  "Split Squat – Elevated Rear Foot": "lunge",

  // Flexiones de rodilla (leg curl sentado)
  "Flexion – Knee (Prone)": "leg-curl",
  "Flexion – Knee (Sitting)": "leg-curl",
  "Flexion – Kneeling": "core-plank",
  "Flexion – Spinal (Guided)": "core-plank",

  // Flexión lateral (oblicuos)
  "Lateral Flexion": "core-plank",

  // Golpe diagonal / rotación — core
  "Diagonal Chop": "core-plank",
  "Anti-Rotation – Press": "core-plank",

  // Curl de bíceps
  "Curl – Braced": "biceps-curl",
  "Curl – EZ Bar": "biceps-curl",
  "Curl – Guided": "biceps-curl",
  "Curl – Isolation": "biceps-curl",
  "Curl – Neutral Grip": "biceps-curl",
  "Curl – Overhead Stretch": "biceps-curl",
  "Curl – Rotational": "biceps-curl",
  "Curl – Stretch": "biceps-curl",

  // Extensiones de tríceps
  "Extension – Kickback": "triceps-ext",
  "Extension – Overhead": "triceps-ext",
  "Extension – Pushdown": "triceps-ext",
  "Extension – Guided": "triceps-ext",
  "Extension – Supine": "triceps-ext",
  "Dips": "triceps-ext",

  // Elevaciones laterales — deltoides
  "Raise – Lateral": "lateral-raise",
  "Raise – Lateral (Guided)": "lateral-raise",
  "Raise – Frontal": "lateral-raise",
  "Raise – Hanging": "lateral-raise",

  // Rotación / core
  "Rotation – Diagonal": "core-plank",
  "Rotation – Torso (Guided)": "core-plank",
  "Core Stabilizers": "core-plank",

  // Extensiones espinales
  "Extension – Spinal": "deadlift",
};

// ---------------------------------------------------------------------------
// Prefijos de movement_pattern → key
// (cubre variantes con texto libre adicional)
// ---------------------------------------------------------------------------

const PREFIX_MAP: Array<[string, ExerciseIconKey]> = [
  ["Push – Horizontal", "bench-press"],
  ["Push – Incline", "incline-press"],
  ["Push – Decline", "decline-press"],
  ["Push – Vertical", "overhead-press"],
  ["Push – Rotational", "overhead-press"],
  ["Push – Close", "triceps-ext"],
  ["Push –", "bench-press"],
  ["Pull – Vertical", "pulldown"],
  ["Pull – Horizontal", "row"],
  ["Pull – Face", "row"],
  ["Pull – Straight", "pulldown"],
  ["Pull – Unilateral", "row"],
  ["Pull – Inclined", "row"],
  ["Pull – Anti", "core-plank"],
  ["Pull – Arc", "chest-fly"],
  ["Pull –", "row"],
  ["Fly – Reverse", "lateral-raise"],
  ["Fly –", "chest-fly"],
  ["Hinge", "deadlift"],
  ["Squat", "squat"],
  ["Lunge", "lunge"],
  ["Step-Up", "lunge"],
  ["Hip Thrust", "hip-thrust"],
  ["Hip Abduct", "hip-thrust"],
  ["Hip Adduct", "hip-thrust"],
  ["Hip Extension", "leg-curl"],
  ["Extension – Knee", "leg-extension"],
  ["Extension – Hip", "leg-curl"],
  ["Extension – Kick", "triceps-ext"],
  ["Extension – Overhead", "triceps-ext"],
  ["Extension – Push", "triceps-ext"],
  ["Extension – Supine", "triceps-ext"],
  ["Extension – Guided", "triceps-ext"],
  ["Extension – Spinal", "deadlift"],
  ["Curl", "biceps-curl"],
  ["Raise –", "lateral-raise"],
  ["Rotation", "core-plank"],
  ["Core", "core-plank"],
  ["Dip", "triceps-ext"],
  ["Push-Up", "bench-press"],
  ["Pull-Up", "pullup"],
  ["Pull over", "chest-fly"],
  ["Pullover", "chest-fly"],
  ["Abduction", "hip-thrust"],
  ["Adduction", "hip-thrust"],
  ["Calf Raise", "lunge"],
  ["Shrug", "lateral-raise"],
  ["Split Squat", "lunge"],
  ["Flexion – Knee", "leg-curl"],
  ["Flexion – Spinal", "core-plank"],
  ["Flexion – Kneeling", "core-plank"],
  ["Lateral Flexion", "core-plank"],
  ["Diagonal Chop", "core-plank"],
  ["Anti-Rotation", "core-plank"],
];

// ---------------------------------------------------------------------------
// Hints de equipment → key
// (se aplica cuando movement_pattern no resuelve)
// ---------------------------------------------------------------------------

const EQUIPMENT_HINT_MAP: Array<[string, ExerciseIconKey]> = [
  ["Cable", "cable"],
  ["Pulley", "cable"],
  ["Polea", "cable"],
  ["Machine", "machine-generic"],
  ["Máquina", "machine-generic"],
  ["Maquina", "machine-generic"],
  ["Smith", "machine-generic"],
];

// ---------------------------------------------------------------------------
// Fallback por primary_group
// ---------------------------------------------------------------------------

const GROUP_FALLBACK_MAP: Record<string, ExerciseIconKey> = {
  Chest: "bench-press",
  Back: "row",
  Legs: "squat",
  Shoulders: "overhead-press",
  Arms: "biceps-curl",
  Core: "core-plank",
};

// ---------------------------------------------------------------------------
// Función pública
// ---------------------------------------------------------------------------

/**
 * Resuelve la key del ícono SVG a partir de los metadatos de un ejercicio.
 * Función pura — sin efectos secundarios, sin dependencias de runtime UI.
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
  // 1. Coincidencia exacta de movement_pattern
  if (movementPattern) {
    const exactMatch = EXACT_PATTERN_MAP[movementPattern];
    if (exactMatch) return exactMatch;

    // 2. Prefijo de movement_pattern
    for (const [prefix, key] of PREFIX_MAP) {
      if (movementPattern.startsWith(prefix)) return key;
    }
  }

  // 3. Hint por equipment
  if (equipment && equipment.length > 0) {
    const equipStr = equipment.join(" ");
    for (const [hint, key] of EQUIPMENT_HINT_MAP) {
      if (equipStr.includes(hint)) return key;
    }
  }

  // 4. Fallback por primary_group
  if (primaryGroup) {
    const groupKey = GROUP_FALLBACK_MAP[primaryGroup];
    if (groupKey) return groupKey;
  }

  return "machine-generic";
}
