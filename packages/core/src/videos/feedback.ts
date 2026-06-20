// videos/feedback — directivas de curación del owner sobre videos de ejercicios.
//
// Puro y testeable: sin red, sin Supabase, sin React. El script de pipeline
// trae las filas de `exercise_video_feedback` y este módulo las consolida en
// reglas accionables por (ejercicio, idioma), y filtra candidatos en base a ellas.
//
// La normalización de canal reusa EXACTAMENTE la del scoring (normalizeChannel),
// para que un block_channel matchee con el mismo criterio que el allowlist.

import { normalizeChannel, stripAccents } from "./scoring";
import type { ScorableVideo } from "./types";

/** Acciones soportadas por una fila de feedback. */
export type VideoFeedbackAction =
  | "block_video"
  | "block_channel"
  | "pin_video"
  | "adjust_query"
  | "set_filter";

/** Filtros que el owner puede forzar sobre los candidatos. */
export interface VideoFeedbackFilters {
  /** Duración mínima en segundos; descarta candidatos por debajo. */
  minDuration?: number;
  /** Si true, descarta candidatos cortos (heurística de Shorts). */
  excludeShorts?: boolean;
  /** Si true, endurece el match de idioma (ver filterCandidates). */
  strictLang?: boolean;
}

/**
 * Una fila de `exercise_video_feedback` (columnas relevantes para el pipeline).
 * Refleja el schema: exercise_id/lang NULL = regla más amplia.
 */
export interface VideoFeedback {
  /** UUID del ejercicio, o null para regla global (no atada a un ejercicio). */
  exercise_id: string | null;
  /** "es" | "en", o null = aplica a ambos idiomas. */
  lang: "es" | "en" | null;
  action: VideoFeedbackAction;
  /** youtube_id para block_video / pin_video. */
  youtube_id: string | null;
  /** channel_title para block_channel. */
  channel_title: string | null;
  /** Términos a sumar a la query (adjust_query). */
  query_add: string[] | null;
  /** Términos a quitar de la query (adjust_query). */
  query_remove: string[] | null;
  /** Filtros forzados (set_filter). */
  filters: VideoFeedbackFilters | null;
  note: string | null;
  created_by: string | null;
  /** ISO timestamp. Se usa para resolver el pin ganador (más reciente). */
  created_at: string;
}

/** Directivas consolidadas que aplican a un (ejercicio, idioma) concreto. */
export interface ExerciseFeedbackRules {
  /** youtube_id a fijar; si está, el pipeline saltea search y usa solo este. */
  pinnedYoutubeId?: string;
  /** youtube_ids a descartar siempre. */
  blockedYoutubeIds: Set<string>;
  /** Canales a descartar (normalizados con normalizeChannel). */
  blockedChannels: string[];
  /** Términos a sumar a la query. */
  queryAdd: string[];
  /** Términos a quitar de la query. */
  queryRemove: string[];
  /** Filtros forzados consolidados. */
  filters: VideoFeedbackFilters;
}

/**
 * ¿Aplica esta fila al (ejercicio, lang) pedido?
 *
 * - exercise_id NULL → regla global: aplica a cualquier ejercicio.
 * - exercise_id seteado → aplica solo si matchea el ejercicio. Aceptamos match
 *   por UUID exacto (cuando se pasa exerciseId) o por slug (cuando lo que se pasa
 *   es el slug). El llamador pasa el identificador que tenga a mano.
 * - lang NULL → aplica a ambos idiomas; si no, debe coincidir con lang.
 */
function rowApplies(
  row: VideoFeedback,
  slugOrExerciseId: string,
  lang: "es" | "en"
): boolean {
  if (row.lang !== null && row.lang !== lang) return false;
  if (row.exercise_id !== null && row.exercise_id !== slugOrExerciseId) {
    return false;
  }
  return true;
}

/**
 * Consolida las filas de feedback que aplican a un (ejercicio, idioma) dado.
 *
 * Resolución:
 *   - lang NULL = ambos idiomas; exercise_id NULL = regla global de canal/query/filtro.
 *   - pin_video: si hay varios, gana el de created_at más reciente.
 *   - block_video / block_channel: se acumulan (union).
 *   - adjust_query: query_add/query_remove se acumulan en orden de aparición.
 *   - set_filter: los filters se mergean; la fila más reciente pisa claves repetidas.
 *
 * Determinístico: las filas se ordenan por created_at ascendente antes de
 * consolidar, así "más reciente gana" es estable sin importar el orden de entrada.
 */
export function resolveFeedbackRules(
  rows: VideoFeedback[],
  slugOrExerciseId: string,
  lang: "es" | "en"
): ExerciseFeedbackRules {
  const applicable = rows
    .filter((row) => rowApplies(row, slugOrExerciseId, lang))
    .slice()
    .sort((a, b) => a.created_at.localeCompare(b.created_at));

  const rules: ExerciseFeedbackRules = {
    blockedYoutubeIds: new Set<string>(),
    blockedChannels: [],
    queryAdd: [],
    queryRemove: [],
    filters: {},
  };

  let pinnedAt: string | null = null;
  const blockedChannelsSet = new Set<string>();

  for (const row of applicable) {
    switch (row.action) {
      case "pin_video": {
        if (row.youtube_id) {
          // applicable está ordenado ascendente por created_at → el último gana.
          rules.pinnedYoutubeId = row.youtube_id;
          pinnedAt = row.created_at;
        }
        break;
      }
      case "block_video": {
        if (row.youtube_id) rules.blockedYoutubeIds.add(row.youtube_id);
        break;
      }
      case "block_channel": {
        if (row.channel_title) {
          const normalized = normalizeChannel(row.channel_title);
          if (normalized.length > 0 && !blockedChannelsSet.has(normalized)) {
            blockedChannelsSet.add(normalized);
            rules.blockedChannels.push(normalized);
          }
        }
        break;
      }
      case "adjust_query": {
        if (row.query_add) {
          for (const term of row.query_add) {
            if (term.trim().length > 0) rules.queryAdd.push(term);
          }
        }
        if (row.query_remove) {
          for (const term of row.query_remove) {
            if (term.trim().length > 0) rules.queryRemove.push(term);
          }
        }
        break;
      }
      case "set_filter": {
        if (row.filters) {
          // Merge: la fila más reciente pisa claves repetidas (orden ascendente).
          if (row.filters.minDuration !== undefined) {
            rules.filters.minDuration = row.filters.minDuration;
          }
          if (row.filters.excludeShorts !== undefined) {
            rules.filters.excludeShorts = row.filters.excludeShorts;
          }
          if (row.filters.strictLang !== undefined) {
            rules.filters.strictLang = row.filters.strictLang;
          }
        }
        break;
      }
    }
  }

  // pinnedAt se usa solo para documentar la intención; el último en orden ya ganó.
  void pinnedAt;

  return rules;
}

// ─── Filtrado de candidatos ───────────────────────────────────────────────────

/**
 * Umbral heurístico de "Short" en segundos. YouTube define Shorts como ≤ 60s;
 * usamos 60 como corte para excludeShorts.
 */
export const SHORT_MAX_SECONDS = 60;

/** Razón por la que un candidato fue descartado por feedback. */
export type FeedbackDiscardReason =
  | "blocked_video"
  | "blocked_channel"
  | "below_min_duration"
  | "is_short"
  | "lang_mismatch_strict";

/** Item devuelto por filterCandidates con su razón de descarte (o null). */
export interface FilteredCandidate<T> {
  video: T;
  kept: boolean;
  reason: FeedbackDiscardReason | null;
}

/**
 * Aplica las reglas de feedback a la lista de candidatos ANTES del scoring.
 *
 * Descarta:
 *   - youtube_id en blockedYoutubeIds (requiere que el candidato exponga youtubeId).
 *   - channel (normalizado) que matchee algún blockedChannels, con el MISMO criterio
 *     que el allowlist del scoring: igualdad o includes sobre channelId/channelTitle.
 *   - filters.excludeShorts → durationSeconds <= SHORT_MAX_SECONDS.
 *   - filters.minDuration   → durationSeconds < minDuration.
 *   - filters.strictLang    → si defaultAudioLanguage existe y NO empieza con el lang
 *     esperado, se descarta. DECISIÓN: cuando defaultAudioLanguage es null/vacío NO
 *     se descarta (no hay señal dura de idioma; el scoring ya aplica su heurística
 *     blanda). strictLang solo endurece el caso donde el audio declarado contradice
 *     el idioma pedido, evitando publicar un video en el idioma equivocado.
 *
 * Devuelve solo los candidatos conservados. Para trazabilidad usar
 * `filterCandidatesDetailed`.
 */
export function filterCandidates<
  T extends ScorableVideo & { youtubeId?: string }
>(
  candidates: T[],
  rules: ExerciseFeedbackRules,
  lang: "es" | "en"
): T[] {
  return filterCandidatesDetailed(candidates, rules, lang)
    .filter((c) => c.kept)
    .map((c) => c.video);
}

/** Igual que filterCandidates pero conserva todos los items con su razón. */
export function filterCandidatesDetailed<
  T extends ScorableVideo & { youtubeId?: string }
>(
  candidates: T[],
  rules: ExerciseFeedbackRules,
  lang: "es" | "en"
): Array<FilteredCandidate<T>> {
  const blockedChannels = rules.blockedChannels; // ya normalizados

  return candidates.map((video) => {
    const reason = discardReasonFor(
      video,
      rules.blockedYoutubeIds,
      blockedChannels,
      rules.filters,
      lang
    );
    return { video, kept: reason === null, reason };
  });
}

function discardReasonFor(
  video: ScorableVideo & { youtubeId?: string },
  blockedYoutubeIds: Set<string>,
  blockedChannels: string[],
  filters: VideoFeedbackFilters,
  lang: "es" | "en"
): FeedbackDiscardReason | null {
  if (video.youtubeId && blockedYoutubeIds.has(video.youtubeId)) {
    return "blocked_video";
  }

  if (blockedChannels.length > 0 && channelBlocked(video, blockedChannels)) {
    return "blocked_channel";
  }

  if (filters.excludeShorts && video.durationSeconds <= SHORT_MAX_SECONDS) {
    return "is_short";
  }

  if (
    filters.minDuration !== undefined &&
    video.durationSeconds < filters.minDuration
  ) {
    return "below_min_duration";
  }

  if (filters.strictLang) {
    const declared = video.defaultAudioLanguage;
    if (declared !== null && declared.trim().length > 0) {
      if (!stripAccents(declared).startsWith(lang)) {
        return "lang_mismatch_strict";
      }
    }
  }

  return null;
}

/**
 * ¿Hay un pin activo en estas reglas? Helper de legibilidad para el pipeline.
 */
export function hasPin(rules: ExerciseFeedbackRules): boolean {
  return typeof rules.pinnedYoutubeId === "string" && rules.pinnedYoutubeId.length > 0;
}

/**
 * Mismo criterio que scoreChannel: igualdad o includes sobre channelId/channelTitle
 * (normalizados). blockedChannels ya viene normalizado.
 */
function channelBlocked(
  video: ScorableVideo,
  blockedChannels: string[]
): boolean {
  const normalizedId = normalizeChannel(video.channelId);
  const normalizedTitle = normalizeChannel(video.channelTitle);
  for (const entry of blockedChannels) {
    if (entry.length === 0) continue;
    if (normalizedId === entry || normalizedId.includes(entry)) return true;
    if (normalizedTitle === entry || normalizedTitle.includes(entry)) return true;
  }
  return false;
}
