// Mapa de icon_id → emoji + label en español.
// ÚNICA fuente de verdad para íconos de ejercicios en toda la app móvil.

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
  chest: { emoji: "🫁", label: "Pecho" },
  back: { emoji: "🦾", label: "Espalda" },
  legs: { emoji: "🦵", label: "Piernas" },
  shoulders: { emoji: "🏋️", label: "Hombros" },
  arms: { emoji: "💪", label: "Brazos" },
  core: { emoji: "🔥", label: "Core" },
  glutes: { emoji: "🍑", label: "Glúteos" },
  cardio: { emoji: "❤️", label: "Cardio" },
  full_body: { emoji: "⚡", label: "Cuerpo completo" },
};

const FALLBACK_ICON: ExerciseIconEntry = { emoji: "⚡", label: "Ejercicio" };

export function getExerciseIcon(icon_id: string | null): ExerciseIconEntry {
  if (!icon_id) return FALLBACK_ICON;
  const entry = EXERCISE_ICON_MAP[icon_id as ExerciseIconId];
  return entry ?? FALLBACK_ICON;
}

export { EXERCISE_ICON_MAP };
