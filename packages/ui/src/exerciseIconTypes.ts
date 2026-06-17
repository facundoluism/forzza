// Tipos compartidos del set de íconos SVG de ejercicios.
// Parte del design system Forzza — única fuente de verdad para las keys.

export type ExerciseIconKey =
  | "bench-press"
  | "incline-press"
  | "decline-press"
  | "overhead-press"
  | "chest-fly"
  | "pulldown"
  | "pullup"
  | "row"
  | "deadlift"
  | "squat"
  | "lunge"
  | "leg-extension"
  | "leg-curl"
  | "hip-thrust"
  | "biceps-curl"
  | "triceps-ext"
  | "lateral-raise"
  | "cable"
  | "core-plank"
  | "cardio"
  | "machine-generic";

export interface ExerciseIconProps {
  /** Key del ícono a renderizar (ExerciseIconKey recomendado; string para interop DB) */
  icon: string;
  /** Dimensión en px (el ícono es cuadrado). Default: 40 */
  size?: number;
  /** Color de acento (el tono primario del ícono). Default: tokens.colors.lime */
  color?: string;
}
