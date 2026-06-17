// Mapa de icon_id → emoji + label en español.
// Compatibilidad hacia atrás: getExerciseIcon() devuelve emoji para pantallas
// que aún no migraron al componente ExerciseIcon SVG.
//
// NUEVA función: getExerciseIconKey() devuelve la key SVG del design system
// para usar con <ExerciseIcon icon={key} /> de @forzza/ui/native.
// La key SVG viene de exercise_library.svg_icon; si es null, usa el mapeo
// icon_id → key como fallback.

import { resolveExerciseIconKey } from "@forzza/ui";
import type { ExerciseIconKey } from "@forzza/ui";

export type ExerciseIconId =
  | "chest"
  | "back"
  | "legs"
  | "shoulders"
  | "arms"
  | "core"
  | "glutes"
  | "cardio"
  | "full_body";

interface ExerciseIconEntry {
  emoji: string;
  label: string;
}

const EXERCISE_ICON_MAP: Record<ExerciseIconId, ExerciseIconEntry> = {
  chest:     { emoji: "🫁", label: "Pecho" },
  back:      { emoji: "🦾", label: "Espalda" },
  legs:      { emoji: "🦵", label: "Piernas" },
  shoulders: { emoji: "🏋️", label: "Hombros" },
  arms:      { emoji: "💪", label: "Brazos" },
  core:      { emoji: "🔥", label: "Core" },
  glutes:    { emoji: "🍑", label: "Glúteos" },
  cardio:    { emoji: "❤️", label: "Cardio" },
  full_body: { emoji: "⚡", label: "Cuerpo completo" },
};

const FALLBACK_ICON: ExerciseIconEntry = { emoji: "⚡", label: "Ejercicio" };

/** Devuelve la entrada emoji+label para compatibilidad con pantallas legadas. */
export function getExerciseIcon(icon_id: string | null): ExerciseIconEntry {
  if (!icon_id) return FALLBACK_ICON;
  const entry = EXERCISE_ICON_MAP[icon_id as ExerciseIconId];
  return entry ?? FALLBACK_ICON;
}

/**
 * Mapeo icon_id (primary_group) → svg_icon key como fallback cuando
 * exercise_library.svg_icon es NULL (ejercicios sin backfill aún).
 */
const ICON_ID_TO_SVG_KEY: Record<string, ExerciseIconKey> = {
  chest:     "bench-press",
  back:      "row",
  legs:      "squat",
  shoulders: "overhead-press",
  arms:      "biceps-curl",
  core:      "core-plank",
  glutes:    "hip-thrust",
  cardio:    "cardio",
  full_body: "machine-generic",
};

/**
 * Devuelve la key de ícono SVG para el componente <ExerciseIcon />.
 * Prioridad:
 *  1. svg_icon de la DB (ya resuelto por la migración de backfill)
 *  2. Resolución dinámica por movement_pattern + equipment + primary_group
 *  3. Fallback por icon_id (primary_group)
 *  4. "machine-generic"
 */
export function getExerciseIconKey(
  svgIcon:         string | null | undefined,
  movementPattern: string | null | undefined,
  equipment:       string[] | null | undefined,
  primaryGroup:    string | null | undefined,
  iconId:          string | null | undefined,
): ExerciseIconKey {
  // 1. svg_icon de DB
  if (svgIcon) return svgIcon as ExerciseIconKey;

  // 2. resolución dinámica
  const resolved = resolveExerciseIconKey(movementPattern, equipment, primaryGroup);
  if (resolved !== "machine-generic") return resolved;

  // 3. fallback por icon_id
  if (iconId) {
    const key = ICON_ID_TO_SVG_KEY[iconId];
    if (key) return key;
  }

  return "machine-generic";
}

export { EXERCISE_ICON_MAP };
