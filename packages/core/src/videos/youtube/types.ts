/**
 * youtube/types.ts — Tipos del adapter de YouTube Data API v3.
 *
 * Paso C del sistema de videos demostrativos de ejercicios.
 * Ver docs/architecture/exercise-demo-videos.md (§4.2 adapter, §7 quota).
 *
 * `YouTubeVideoDetails` es el resultado NORMALIZADO que expone el adapter.
 * Es deliberadamente un superset de lo que el scoring necesita: el Paso del
 * scoring define su propio `ScorableVideo` aparte y mapea desde acá.
 */

// ─── Resultado normalizado (lo que consume el resto del sistema) ──────────────

export interface YouTubeVideoDetails {
  youtubeId: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  durationSeconds: number;
  embeddable: boolean;
  defaultAudioLanguage: string | null;
  hasCaptions: boolean;
}

// ─── Interfaz del cliente (la implementan RealYouTubeClient y MockYouTubeClient) ─

export interface YouTubeSearchOptions {
  maxResults?: number;
  relevanceLanguage?: string;
}

export interface YouTubeSearchClient {
  searchVideos(
    query: string,
    opts?: YouTubeSearchOptions,
  ): Promise<YouTubeVideoDetails[]>;
}

// ─── Shapes crudos de la YouTube Data API v3 ──────────────────────────────────
// Documentación: https://developers.google.com/youtube/v3/docs
// Solo modelamos los campos que consumimos; el resto se ignora.

/** Item de la respuesta de search.list (part=snippet, type=video). */
export interface YouTubeSearchItemRaw {
  id?: {
    kind?: string;
    videoId?: string;
  };
}

export interface YouTubeApiError {
  code?: number;
  message?: string;
}

export interface YouTubeApiErrorBody {
  error?: YouTubeApiError;
}

export interface YouTubeSearchListResponseRaw {
  items?: YouTubeSearchItemRaw[];
  error?: YouTubeApiError;
}

/** snippet de un recurso video (videos.list part=snippet). */
export interface YouTubeVideoSnippetRaw {
  title?: string;
  description?: string;
  channelId?: string;
  channelTitle?: string;
  defaultAudioLanguage?: string;
}

/** statistics de un recurso video (videos.list part=statistics). */
export interface YouTubeVideoStatisticsRaw {
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
}

/** contentDetails de un recurso video (videos.list part=contentDetails). */
export interface YouTubeVideoContentDetailsRaw {
  /** Duración en formato ISO 8601, ej. "PT5M30S". */
  duration?: string;
  /** "true" si el video tiene subtítulos. */
  caption?: string;
}

/** status de un recurso video (videos.list part=status). */
export interface YouTubeVideoStatusRaw {
  embeddable?: boolean;
}

/** Item de la respuesta de videos.list. */
export interface YouTubeVideoItemRaw {
  id?: string;
  snippet?: YouTubeVideoSnippetRaw;
  statistics?: YouTubeVideoStatisticsRaw;
  contentDetails?: YouTubeVideoContentDetailsRaw;
  status?: YouTubeVideoStatusRaw;
}

export interface YouTubeVideosListResponseRaw {
  items?: YouTubeVideoItemRaw[];
  error?: YouTubeApiError;
}

// ─── Tipo de fetch agnóstico (no dependemos de la lib DOM) ─────────────────────
// Definimos un fetch mínimo para no acoplar el core a `lib: ["DOM"]`.
// Es compatible estructuralmente con el `fetch` global de Node 18+ y Deno.

export interface FetchResponseLike {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}

export type FetchLike = (url: string) => Promise<FetchResponseLike>;
