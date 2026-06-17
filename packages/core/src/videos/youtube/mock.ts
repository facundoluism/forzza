/**
 * youtube/mock.ts — Test double determinístico de YouTubeSearchClient.
 *
 * Devuelve resultados a partir de fixtures crudos (mismo shape que la API real)
 * SIN tocar la red. Lo consumen los tests del Paso D y permite correr el sistema
 * en dev local sin `YOUTUBE_API_KEY`.
 *
 * NUNCA usar en producción.
 *
 * Los fixtures se cargan desde ./fixtures/*.json vía node:fs (disponible en
 * Node 18+ y Deno), evitando depender de `resolveJsonModule` en el tsconfig.
 *
 * HUMAN_REQUIRED para integración real:
 *   Crear una API key de YouTube Data API v3 en Google Cloud Console
 *   (console.cloud.google.com → APIs & Services → Credentials) y setearla en
 *   YOUTUBE_API_KEY (.env real / supabase secrets). Nunca commitear el valor.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { mapVideoItem } from "./client";
import type {
  YouTubeSearchClient,
  YouTubeSearchOptions,
  YouTubeVideoDetails,
  YouTubeVideoItemRaw,
} from "./types";

/** Estructura de un archivo de fixture (respuestas crudas search + videos). */
interface YouTubeFixtureFile {
  search: { items?: unknown[] };
  videos: { items?: YouTubeVideoItemRaw[] };
}

const FIXTURES_DIR = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

/**
 * Mapa query (lowercase) → archivo de fixture.
 * Cualquier query que contenga una de estas claves usa ese fixture; si ninguna
 * matchea, se usa el fixture default.
 */
const QUERY_FIXTURES: ReadonlyArray<{ keyword: string; file: string }> = [
  { keyword: "bench", file: "search-bench-press.json" },
  { keyword: "press de banca", file: "search-bench-press.json" },
  { keyword: "press banca", file: "search-bench-press.json" },
  { keyword: "squat", file: "search-squat.json" },
  { keyword: "sentadilla", file: "search-squat.json" },
];

const DEFAULT_FIXTURE = "search-bench-press.json";

function loadFixture(file: string): YouTubeVideoDetails[] {
  const raw = readFileSync(join(FIXTURES_DIR, file), "utf-8");
  const parsed = JSON.parse(raw) as YouTubeFixtureFile;
  const items = parsed.videos.items ?? [];
  return items.map(mapVideoItem);
}

function pickFixtureFile(query: string): string {
  const q = query.toLowerCase();
  for (const entry of QUERY_FIXTURES) {
    if (q.includes(entry.keyword)) return entry.file;
  }
  return DEFAULT_FIXTURE;
}

export interface MockYouTubeClientConfig {
  /** Sobreescribe el mapeo query→fixture (para tests específicos). */
  fixtureOverrides?: ReadonlyArray<{ keyword: string; file: string }>;
  /** Fixture por defecto cuando ninguna query matchea. */
  defaultFixture?: string;
}

export class MockYouTubeClient implements YouTubeSearchClient {
  private readonly overrides: ReadonlyArray<{ keyword: string; file: string }>;
  private readonly defaultFixture: string;

  constructor(config: MockYouTubeClientConfig = {}) {
    this.overrides = config.fixtureOverrides ?? QUERY_FIXTURES;
    this.defaultFixture = config.defaultFixture ?? DEFAULT_FIXTURE;
  }

  searchVideos(
    query: string,
    opts?: YouTubeSearchOptions,
  ): Promise<YouTubeVideoDetails[]> {
    const q = query.toLowerCase();
    let file = this.defaultFixture;
    for (const entry of this.overrides) {
      if (q.includes(entry.keyword)) {
        file = entry.file;
        break;
      }
    }

    const results = loadFixture(file);
    const maxResults = opts?.maxResults;
    const sliced =
      maxResults !== undefined ? results.slice(0, maxResults) : results;
    return Promise.resolve(sliced);
  }
}

/** Export del helper de selección, útil para tests del Paso D. */
export { pickFixtureFile };
