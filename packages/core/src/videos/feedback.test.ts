import { describe, it, expect } from "vitest";
import {
  resolveFeedbackRules,
  filterCandidates,
  filterCandidatesDetailed,
  hasPin,
  SHORT_MAX_SECONDS,
  type VideoFeedback,
} from "./feedback";
import type { ScorableVideo } from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fb(overrides: Partial<VideoFeedback> = {}): VideoFeedback {
  return {
    exercise_id: null,
    lang: null,
    action: "block_video",
    youtube_id: null,
    channel_title: null,
    query_add: null,
    query_remove: null,
    filters: null,
    note: null,
    created_by: null,
    created_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function video(
  overrides: Partial<ScorableVideo & { youtubeId: string }> = {}
): ScorableVideo & { youtubeId: string } {
  return {
    youtubeId: "vid_default",
    title: "Sentadilla técnica correcta",
    description: "",
    channelId: "UC_random",
    channelTitle: "Random Channel",
    viewCount: 1000,
    likeCount: 50,
    commentCount: 5,
    durationSeconds: 120,
    embeddable: true,
    defaultAudioLanguage: "es",
    hasCaptions: true,
    ...overrides,
  };
}

const EX = "squat-id";

// ─── resolveFeedbackRules ───────────────────────────────────────────────────────

describe("resolveFeedbackRules — applicability", () => {
  it("regla global (exercise_id null) aplica a cualquier ejercicio", () => {
    const rows = [fb({ action: "block_channel", channel_title: "Spam TV" })];
    const rules = resolveFeedbackRules(rows, EX, "es");
    expect(rules.blockedChannels).toContain("spamtv");
  });

  it("regla atada a otro exercise_id NO aplica", () => {
    const rows = [
      fb({ exercise_id: "otro-id", action: "block_video", youtube_id: "x" }),
    ];
    const rules = resolveFeedbackRules(rows, EX, "es");
    expect(rules.blockedYoutubeIds.size).toBe(0);
  });

  it("regla atada al exercise_id pedido SÍ aplica", () => {
    const rows = [
      fb({ exercise_id: EX, action: "block_video", youtube_id: "x" }),
    ];
    const rules = resolveFeedbackRules(rows, EX, "es");
    expect(rules.blockedYoutubeIds.has("x")).toBe(true);
  });

  it("lang null aplica a ambos idiomas", () => {
    const rows = [fb({ lang: null, action: "block_video", youtube_id: "x" })];
    expect(resolveFeedbackRules(rows, EX, "es").blockedYoutubeIds.has("x")).toBe(true);
    expect(resolveFeedbackRules(rows, EX, "en").blockedYoutubeIds.has("x")).toBe(true);
  });

  it("lang específico no aplica al otro idioma", () => {
    const rows = [fb({ lang: "en", action: "block_video", youtube_id: "x" })];
    expect(resolveFeedbackRules(rows, EX, "es").blockedYoutubeIds.has("x")).toBe(false);
    expect(resolveFeedbackRules(rows, EX, "en").blockedYoutubeIds.has("x")).toBe(true);
  });
});

describe("resolveFeedbackRules — pin más reciente gana", () => {
  it("el pin de created_at más reciente gana sin importar el orden de entrada", () => {
    const rows = [
      fb({ action: "pin_video", youtube_id: "viejo", created_at: "2026-01-01T00:00:00Z" }),
      fb({ action: "pin_video", youtube_id: "nuevo", created_at: "2026-03-01T00:00:00Z" }),
      fb({ action: "pin_video", youtube_id: "medio", created_at: "2026-02-01T00:00:00Z" }),
    ];
    const rules = resolveFeedbackRules(rows, EX, "es");
    expect(rules.pinnedYoutubeId).toBe("nuevo");
    expect(hasPin(rules)).toBe(true);
  });

  it("sin pin → pinnedYoutubeId undefined y hasPin false", () => {
    const rules = resolveFeedbackRules([], EX, "es");
    expect(rules.pinnedYoutubeId).toBeUndefined();
    expect(hasPin(rules)).toBe(false);
  });

  it("pin sin youtube_id se ignora", () => {
    const rows = [fb({ action: "pin_video", youtube_id: null })];
    expect(resolveFeedbackRules(rows, EX, "es").pinnedYoutubeId).toBeUndefined();
  });
});

describe("resolveFeedbackRules — acumulación", () => {
  it("acumula varios block_video y block_channel sin duplicar canales", () => {
    const rows = [
      fb({ action: "block_video", youtube_id: "a" }),
      fb({ action: "block_video", youtube_id: "b" }),
      fb({ action: "block_channel", channel_title: "Spam TV" }),
      fb({ action: "block_channel", channel_title: "spamtv" }), // normaliza igual
    ];
    const rules = resolveFeedbackRules(rows, EX, "es");
    expect([...rules.blockedYoutubeIds].sort()).toEqual(["a", "b"]);
    expect(rules.blockedChannels).toEqual(["spamtv"]);
  });

  it("adjust_query acumula add/remove ignorando vacíos", () => {
    const rows = [
      fb({ action: "adjust_query", query_add: ["en español", "  "], query_remove: ["how to"] }),
      fb({ action: "adjust_query", query_add: ["barra"], query_remove: [""] }),
    ];
    const rules = resolveFeedbackRules(rows, EX, "es");
    expect(rules.queryAdd).toEqual(["en español", "barra"]);
    expect(rules.queryRemove).toEqual(["how to"]);
  });

  it("set_filter mergea y la fila más reciente pisa claves repetidas", () => {
    const rows = [
      fb({ action: "set_filter", filters: { minDuration: 30, excludeShorts: false }, created_at: "2026-01-01T00:00:00Z" }),
      fb({ action: "set_filter", filters: { minDuration: 60, strictLang: true }, created_at: "2026-02-01T00:00:00Z" }),
    ];
    const rules = resolveFeedbackRules(rows, EX, "es");
    expect(rules.filters).toEqual({
      minDuration: 60, // pisado por la fila más reciente
      excludeShorts: false, // de la primera
      strictLang: true, // de la segunda
    });
  });
});

// ─── filterCandidates ───────────────────────────────────────────────────────────

describe("filterCandidates", () => {
  it("sin reglas → no descarta nada", () => {
    const rules = resolveFeedbackRules([], EX, "es");
    const vids = [video({ youtubeId: "a" }), video({ youtubeId: "b" })];
    expect(filterCandidates(vids, rules, "es")).toHaveLength(2);
  });

  it("descarta por blocked youtube_id", () => {
    const rules = resolveFeedbackRules(
      [fb({ action: "block_video", youtube_id: "bad" })],
      EX,
      "es"
    );
    const kept = filterCandidates(
      [video({ youtubeId: "bad" }), video({ youtubeId: "good" })],
      rules,
      "es"
    );
    expect(kept.map((v) => v.youtubeId)).toEqual(["good"]);
  });

  it("descarta por canal bloqueado (mismo criterio includes que allowlist)", () => {
    const rules = resolveFeedbackRules(
      [fb({ action: "block_channel", channel_title: "athleanx" })],
      EX,
      "es"
    );
    const kept = filterCandidates(
      [
        video({ youtubeId: "1", channelTitle: "ATHLEAN-X Español" }), // matchea includes
        video({ youtubeId: "2", channelTitle: "Otro Canal" }),
      ],
      rules,
      "es"
    );
    expect(kept.map((v) => v.youtubeId)).toEqual(["2"]);
  });

  it("excludeShorts descarta <= 60s", () => {
    const rules = resolveFeedbackRules(
      [fb({ action: "set_filter", filters: { excludeShorts: true } })],
      EX,
      "es"
    );
    const kept = filterCandidates(
      [
        video({ youtubeId: "short", durationSeconds: SHORT_MAX_SECONDS }),
        video({ youtubeId: "ok", durationSeconds: 120 }),
      ],
      rules,
      "es"
    );
    expect(kept.map((v) => v.youtubeId)).toEqual(["ok"]);
  });

  it("minDuration descarta por debajo del umbral", () => {
    const rules = resolveFeedbackRules(
      [fb({ action: "set_filter", filters: { minDuration: 90 } })],
      EX,
      "es"
    );
    const kept = filterCandidates(
      [
        video({ youtubeId: "corto", durationSeconds: 89 }),
        video({ youtubeId: "justo", durationSeconds: 90 }),
      ],
      rules,
      "es"
    );
    expect(kept.map((v) => v.youtubeId)).toEqual(["justo"]);
  });

  it("strictLang descarta cuando el audio declarado contradice el idioma", () => {
    const rules = resolveFeedbackRules(
      [fb({ action: "set_filter", filters: { strictLang: true } })],
      EX,
      "es"
    );
    const kept = filterCandidates(
      [
        video({ youtubeId: "en", defaultAudioLanguage: "en-US" }),
        video({ youtubeId: "es", defaultAudioLanguage: "es-AR" }),
        video({ youtubeId: "null", defaultAudioLanguage: null }), // sin señal → se conserva
      ],
      rules,
      "es"
    );
    expect(kept.map((v) => v.youtubeId).sort()).toEqual(["es", "null"]);
  });

  it("filterCandidatesDetailed expone la razón de descarte", () => {
    const rules = resolveFeedbackRules(
      [fb({ action: "block_video", youtube_id: "bad" })],
      EX,
      "es"
    );
    const detailed = filterCandidatesDetailed([video({ youtubeId: "bad" })], rules, "es");
    expect(detailed[0]?.kept).toBe(false);
    expect(detailed[0]?.reason).toBe("blocked_video");
  });
});
