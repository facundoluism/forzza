/**
 * youtube/client.ts — Cliente real (fetch-based) de YouTube Data API v3.
 *
 * Paso C del sistema de videos demostrativos de ejercicios.
 *
 * Agnóstico de runtime: recibe `fetchImpl` por constructor (default: el `fetch`
 * global, que existe en Node 18+ y Deno). La API key se INYECTA — el core puro
 * nunca lee process.env. Esto permite testear sin red ni credenciales reales.
 *
 * Costo de cuota (YouTube Data API v3, presupuesto diario 10.000 unidades):
 *   - search.list   = 100 unidades por llamada
 *   - videos.list   =   1 unidad   por llamada
 * Cada searchVideos() consume 101 unidades (1 search + 1 videos batch).
 */

import type {
  FetchLike,
  YouTubeSearchClient,
  YouTubeSearchListResponseRaw,
  YouTubeSearchOptions,
  YouTubeVideoDetails,
  YouTubeVideoItemRaw,
  YouTubeVideosListResponseRaw,
} from "./types";

const SEARCH_ENDPOINT = "https://www.googleapis.com/youtube/v3/search";
const VIDEOS_ENDPOINT = "https://www.googleapis.com/youtube/v3/videos";
const DEFAULT_MAX_RESULTS = 10;

// ─── Parser de duración ISO 8601 ──────────────────────────────────────────────

/**
 * Convierte una duración ISO 8601 (formato YouTube, ej. "PT1H2M3S") a segundos.
 *
 * Solo soporta el subset que YouTube emite para videos: horas, minutos, segundos
 * (los componentes de fecha PnYnMnD no aparecen en duraciones de video).
 *
 * Ejemplos: "PT30S" → 30 · "PT5M" → 300 · "PT1H2M3S" → 3723 · "PT0S" → 0.
 *
 * @throws Error si la cadena no es una duración ISO 8601 válida.
 */
export function parseIso8601Duration(d: string): number {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(d);
  if (!match || (match[1] === undefined && match[2] === undefined && match[3] === undefined)) {
    throw new Error(`Duración ISO 8601 inválida: "${d}"`);
  }
  const hours = match[1] ? Number(match[1]) : 0;
  const minutes = match[2] ? Number(match[2]) : 0;
  const seconds = match[3] ? Number(match[3]) : 0;
  return hours * 3600 + minutes * 60 + seconds;
}

// ─── Helpers de parseo defensivo ──────────────────────────────────────────────

/** Parsea un contador de string a number; ausente o inválido → 0. */
function parseCount(value: string | undefined): number {
  if (value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Mapea un item crudo de videos.list al shape normalizado.
 * Exportado para que el MockYouTubeClient produzca exactamente el mismo
 * resultado que el cliente real a partir de fixtures crudos.
 */
export function mapVideoItem(item: YouTubeVideoItemRaw): YouTubeVideoDetails {
  const snippet = item.snippet ?? {};
  const statistics = item.statistics ?? {};
  const contentDetails = item.contentDetails ?? {};
  const status = item.status ?? {};

  const duration = contentDetails.duration;

  return {
    youtubeId: item.id ?? "",
    title: snippet.title ?? "",
    description: snippet.description ?? "",
    channelId: snippet.channelId ?? "",
    channelTitle: snippet.channelTitle ?? "",
    viewCount: parseCount(statistics.viewCount),
    likeCount: parseCount(statistics.likeCount),
    commentCount: parseCount(statistics.commentCount),
    durationSeconds: duration ? parseIso8601Duration(duration) : 0,
    // `embeddable` es opcional en status; si no viene asumimos no embebible.
    embeddable: status.embeddable === true,
    defaultAudioLanguage: snippet.defaultAudioLanguage ?? null,
    hasCaptions: contentDetails.caption === "true",
  };
}

// ─── Cliente real ─────────────────────────────────────────────────────────────

export interface RealYouTubeClientConfig {
  apiKey: string;
  /** Implementación de fetch a usar. Default: el `fetch` global del runtime. */
  fetchImpl?: FetchLike;
}

export class RealYouTubeClient implements YouTubeSearchClient {
  private readonly apiKey: string;
  private readonly fetchImpl: FetchLike;

  constructor(config: RealYouTubeClientConfig) {
    if (!config.apiKey) {
      throw new Error("RealYouTubeClient requiere una apiKey no vacía.");
    }
    this.apiKey = config.apiKey;
    // El `fetch` global de Node 18+/Deno es compatible estructuralmente con
    // FetchLike (solo usamos ok/status/json()), así que no requiere cast.
    this.fetchImpl = config.fetchImpl ?? globalThis.fetch;
    if (typeof this.fetchImpl !== "function") {
      throw new Error(
        "RealYouTubeClient: no hay fetch disponible. Pasá fetchImpl en runtimes sin fetch global.",
      );
    }
  }

  async searchVideos(
    query: string,
    opts?: YouTubeSearchOptions,
  ): Promise<YouTubeVideoDetails[]> {
    const maxResults = opts?.maxResults ?? DEFAULT_MAX_RESULTS;

    // 1) search.list (cuota: 100) → obtener IDs de video.
    const ids = await this.searchVideoIds(query, maxResults, opts?.relevanceLanguage);
    if (ids.length === 0) return [];

    // 2) videos.list (cuota: 1) → obtener detalles de esos IDs en un batch.
    return this.fetchVideosByIds(ids);
  }

  private async searchVideoIds(
    query: string,
    maxResults: number,
    relevanceLanguage: string | undefined,
  ): Promise<string[]> {
    const params = new URLSearchParams({
      part: "snippet",
      type: "video",
      q: query,
      maxResults: String(maxResults),
      key: this.apiKey,
    });
    if (relevanceLanguage) {
      params.set("relevanceLanguage", relevanceLanguage);
    }

    const url = `${SEARCH_ENDPOINT}?${params.toString()}`;
    const body = await this.getJson<YouTubeSearchListResponseRaw>(url, "search.list");

    const items = body.items ?? [];
    const ids: string[] = [];
    for (const item of items) {
      const videoId = item.id?.videoId;
      if (videoId) ids.push(videoId);
    }
    return ids;
  }

  /**
   * videos.list (cuota: 1) → detalles normalizados de los IDs dados en un batch.
   * Público para la rama de PIN del pipeline (resuelve un video fijado sin search).
   * Lista vacía → no hace request y devuelve [].
   */
  async fetchVideosByIds(ids: string[]): Promise<YouTubeVideoDetails[]> {
    if (ids.length === 0) return [];
    const params = new URLSearchParams({
      part: "snippet,statistics,contentDetails,status",
      id: ids.join(","),
      key: this.apiKey,
    });

    const url = `${VIDEOS_ENDPOINT}?${params.toString()}`;
    const body = await this.getJson<YouTubeVideosListResponseRaw>(url, "videos.list");

    const items = body.items ?? [];
    return items.map(mapVideoItem);
  }

  /**
   * Hace GET + parsea JSON. Si la respuesta no es ok, lanza Error con el status
   * y el `error.message` de la API si está presente.
   */
  private async getJson<T extends { error?: { message?: string } }>(
    url: string,
    label: string,
  ): Promise<T> {
    const res = await this.fetchImpl(url);
    const body = (await res.json()) as T;

    if (!res.ok) {
      const apiMessage = body.error?.message;
      throw new Error(
        `YouTube ${label} falló (HTTP ${res.status})${apiMessage ? `: ${apiMessage}` : ""}`,
      );
    }
    return body;
  }
}
