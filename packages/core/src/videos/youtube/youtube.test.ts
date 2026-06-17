/**
 * youtube.test.ts — Tests del adapter de YouTube Data API v3 (Paso C).
 *
 * NO hace llamadas reales a la API: el RealYouTubeClient se testea con un
 * fetchImpl mockeado que devuelve los fixtures crudos.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  MockYouTubeClient,
  RealYouTubeClient,
  parseIso8601Duration,
  pickFixtureFile,
} from "./index";
import type { FetchLike, FetchResponseLike } from "./types";

const FIXTURES_DIR = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

function loadRawFixture(file: string): {
  search: unknown;
  videos: unknown;
} {
  const raw = readFileSync(join(FIXTURES_DIR, file), "utf-8");
  return JSON.parse(raw) as { search: unknown; videos: unknown };
}

/**
 * Construye un fetchImpl mockeado que enruta por endpoint:
 *   - /search  → devuelve el bloque `search` del fixture
 *   - /videos  → devuelve el bloque `videos` del fixture
 */
function makeFixtureFetch(file: string): FetchLike {
  const fixture = loadRawFixture(file);
  return (url: string): Promise<FetchResponseLike> => {
    const body = url.includes("/youtube/v3/search")
      ? fixture.search
      : fixture.videos;
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(body),
    });
  };
}

// ─── parseIso8601Duration ─────────────────────────────────────────────────────

describe("parseIso8601Duration", () => {
  it("parsea solo segundos", () => {
    expect(parseIso8601Duration("PT30S")).toBe(30);
  });

  it("parsea solo minutos", () => {
    expect(parseIso8601Duration("PT5M")).toBe(300);
  });

  it("parsea horas + minutos + segundos", () => {
    expect(parseIso8601Duration("PT1H2M3S")).toBe(3723);
  });

  it("parsea cero segundos", () => {
    expect(parseIso8601Duration("PT0S")).toBe(0);
  });

  it("parsea minutos + segundos", () => {
    expect(parseIso8601Duration("PT5M30S")).toBe(330);
  });

  it("parsea una hora exacta", () => {
    expect(parseIso8601Duration("PT1H")).toBe(3600);
  });

  it("lanza ante una cadena inválida", () => {
    expect(() => parseIso8601Duration("5m30s")).toThrow();
    expect(() => parseIso8601Duration("PT")).toThrow();
    expect(() => parseIso8601Duration("")).toThrow();
  });
});

// ─── RealYouTubeClient (fetch mockeado, sin red) ──────────────────────────────

describe("RealYouTubeClient.searchVideos", () => {
  it("mapea correctamente los detalles del primer video", async () => {
    const client = new RealYouTubeClient({
      apiKey: "test-key",
      fetchImpl: makeFixtureFetch("search-bench-press.json"),
    });

    const results = await client.searchVideos("bench press");
    expect(results).toHaveLength(3);

    const first = results[0]!;
    expect(first.youtubeId).toBe("bnchPrsA001");
    expect(first.title).toBe("Press de banca: técnica correcta paso a paso");
    expect(first.channelId).toBe("UCfakeChannelAR01");
    expect(first.channelTitle).toBe("Fuerza Argentina");
    expect(first.viewCount).toBe(1850000);
    expect(first.likeCount).toBe(92000);
    expect(first.commentCount).toBe(3100);
    expect(first.durationSeconds).toBe(330); // PT5M30S
    expect(first.embeddable).toBe(true);
    expect(first.defaultAudioLanguage).toBe("es");
    expect(first.hasCaptions).toBe(true);
  });

  it("deriva embeddable:false y likeCount faltante→0", async () => {
    const client = new RealYouTubeClient({
      apiKey: "test-key",
      fetchImpl: makeFixtureFetch("search-bench-press.json"),
    });

    const results = await client.searchVideos("bench press");
    const second = results[1]!; // bnchPrsB002 — sin likeCount, no embebible

    expect(second.youtubeId).toBe("bnchPrsB002");
    expect(second.embeddable).toBe(false);
    expect(second.likeCount).toBe(0); // statistics.likeCount ausente → 0
    expect(second.commentCount).toBe(8800);
    expect(second.hasCaptions).toBe(false); // caption: "false"
    expect(second.durationSeconds).toBe(723); // PT12M3S
    expect(second.defaultAudioLanguage).toBe("en");
  });

  it("default audio language ausente → null y caption ausente → false", async () => {
    const client = new RealYouTubeClient({
      apiKey: "test-key",
      fetchImpl: makeFixtureFetch("search-bench-press.json"),
    });

    const results = await client.searchVideos("bench press");
    const third = results[2]!; // bnchPrsC003 — sin defaultAudioLanguage

    expect(third.defaultAudioLanguage).toBeNull();
    expect(third.durationSeconds).toBe(58); // PT58S
    expect(third.likeCount).toBe(1200);
  });

  it("respeta relevanceLanguage y maxResults en la query sin romper", async () => {
    const client = new RealYouTubeClient({
      apiKey: "test-key",
      fetchImpl: makeFixtureFetch("search-squat.json"),
    });

    const results = await client.searchVideos("sentadilla", {
      maxResults: 5,
      relevanceLanguage: "es",
    });
    expect(results).toHaveLength(2);
    expect(results[1]!.durationSeconds).toBe(3665); // PT1H1M5S
  });

  it("devuelve [] cuando search.list no trae items", async () => {
    const emptyFetch: FetchLike = () =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ items: [] }),
      });
    const client = new RealYouTubeClient({
      apiKey: "test-key",
      fetchImpl: emptyFetch,
    });

    const results = await client.searchVideos("nada");
    expect(results).toEqual([]);
  });

  it("lanza Error con status y mensaje de la API cuando la respuesta no es ok", async () => {
    const errorFetch: FetchLike = () =>
      Promise.resolve({
        ok: false,
        status: 403,
        json: () =>
          Promise.resolve({ error: { code: 403, message: "quotaExceeded" } }),
      });
    const client = new RealYouTubeClient({
      apiKey: "test-key",
      fetchImpl: errorFetch,
    });

    await expect(client.searchVideos("bench press")).rejects.toThrow(
      /403.*quotaExceeded/,
    );
  });

  it("rechaza apiKey vacía", () => {
    expect(
      () =>
        new RealYouTubeClient({
          apiKey: "",
          fetchImpl: makeFixtureFetch("search-bench-press.json"),
        }),
    ).toThrow();
  });
});

// ─── MockYouTubeClient (sin red, lee fixtures) ────────────────────────────────

describe("MockYouTubeClient", () => {
  it("devuelve el fixture de bench press por keyword", async () => {
    const mock = new MockYouTubeClient();
    const results = await mock.searchVideos("bench press technique");
    expect(results).toHaveLength(3);
    expect(results[0]!.youtubeId).toBe("bnchPrsA001");
  });

  it("devuelve el fixture de sentadilla por keyword", async () => {
    const mock = new MockYouTubeClient();
    const results = await mock.searchVideos("sentadilla con barra");
    expect(results[0]!.youtubeId).toBe("sqtBackS101");
  });

  it("cae al fixture default cuando ninguna keyword matchea", async () => {
    const mock = new MockYouTubeClient();
    const results = await mock.searchVideos("algo random sin keyword");
    expect(results).toHaveLength(3); // default = bench-press
  });

  it("respeta maxResults", async () => {
    const mock = new MockYouTubeClient();
    const results = await mock.searchVideos("squat", { maxResults: 1 });
    expect(results).toHaveLength(1);
  });

  it("incluye al menos un video no embebible en los fixtures", async () => {
    const mock = new MockYouTubeClient();
    const results = await mock.searchVideos("bench press");
    expect(results.some((v) => !v.embeddable)).toBe(true);
  });

  it("respeta fixtureOverrides y defaultFixture custom", async () => {
    const mock = new MockYouTubeClient({
      fixtureOverrides: [{ keyword: "pierna", file: "search-squat.json" }],
      defaultFixture: "search-squat.json",
    });
    // matchea el override
    const matched = await mock.searchVideos("dia de pierna");
    expect(matched[0]!.youtubeId).toBe("sqtBackS101");
    // ninguna keyword del override matchea → cae al default custom (squat)
    const fallback = await mock.searchVideos("bench press");
    expect(fallback[0]!.youtubeId).toBe("sqtBackS101");
  });
});

describe("pickFixtureFile", () => {
  it("mapea keywords conocidas al fixture correcto", () => {
    expect(pickFixtureFile("Bench Press tutorial")).toBe(
      "search-bench-press.json",
    );
    expect(pickFixtureFile("sentadilla profunda")).toBe("search-squat.json");
    expect(pickFixtureFile("squat depth")).toBe("search-squat.json");
  });

  it("cae al fixture default ante una query desconocida", () => {
    expect(pickFixtureFile("xyz desconocido")).toBe("search-bench-press.json");
  });
});
