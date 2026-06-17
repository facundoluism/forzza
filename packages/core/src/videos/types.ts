// videos/types — tipos puros para el ranking de videos demostrativos de ejercicios
// (Paso B del sistema de demos, §4.3). Sin red, sin Supabase, sin React.
// Estos tipos son PROPIOS de esta subcarpeta y no dependen de youtube/.

/** Metadata mínima que el scoring necesita de un video candidato. */
export interface ScorableVideo {
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  durationSeconds: number;
  /** Si false → no se puede reproducir embebido in-app → descartado. */
  embeddable: boolean;
  /** Código de idioma del audio por defecto (ej: "es", "en-US") o null. */
  defaultAudioLanguage: string | null;
  hasCaptions: boolean;
}

/** Descripción del ejercicio contra el cual matchear los candidatos. */
export interface ExerciseContext {
  name: string;
  nameEn: string | null;
  description: string | null;
  equipment: string[];
  lang: "es" | "en";
}

/** Desglose por señal del score, cada componente normalizado a [0, 1]. */
export interface ScoreBreakdown {
  text: number;
  channel: number;
  engagement: number;
  duration: number;
  language: number;
  captionsRecency: number;
}

/** Pesos por señal (mismas claves que ScoreBreakdown). Deben sumar 1. */
export type ScoreWeights = ScoreBreakdown;

/** Resultado del scoring de un candidato. */
export interface ScoredCandidate {
  /** Score final ponderado en [0, 1], redondeado a 4 decimales. */
  score: number;
  breakdown: ScoreBreakdown;
  /** true si el candidato fue descartado (no entra al ranking). */
  discarded: boolean;
  /** Motivo de descarte, o null si no fue descartado. */
  discardReason: string | null;
}
