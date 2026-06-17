import { describe, it, expect } from "vitest";
import {
  scoreCandidate,
  pickBest,
  DEFAULT_SCORE_WEIGHTS,
} from "./scoring";
import type { ScorableVideo, ExerciseContext } from "./types";

function video(overrides: Partial<ScorableVideo> = {}): ScorableVideo {
  return {
    title: "Sentadilla técnica correcta",
    description: "Cómo hacer la sentadilla con barra paso a paso",
    channelId: "UC_random",
    channelTitle: "Random Channel",
    viewCount: 100_000,
    likeCount: 4_000,
    commentCount: 200,
    durationSeconds: 120,
    embeddable: true,
    defaultAudioLanguage: "es",
    hasCaptions: true,
    ...overrides,
  };
}

const exercise: ExerciseContext = {
  name: "Sentadilla",
  nameEn: "Squat",
  description: "Ejercicio de pierna con barra",
  equipment: ["barra"],
  lang: "es",
};

const ALLOWLIST = ["powerexplosive", "athleanx"] as const;

describe("scoreCandidate — descarte", () => {
  it("descarta video no embebible con breakdown en cero", () => {
    const result = scoreCandidate(video({ embeddable: false }), exercise);
    expect(result.discarded).toBe(true);
    expect(result.discardReason).toBe("not_embeddable");
    expect(result.score).toBe(0);
    expect(result.breakdown).toEqual({
      text: 0,
      channel: 0,
      engagement: 0,
      duration: 0,
      language: 0,
      captionsRecency: 0,
    });
  });

  it("video embebible no se descarta", () => {
    const result = scoreCandidate(video(), exercise);
    expect(result.discarded).toBe(false);
    expect(result.discardReason).toBeNull();
  });
});

describe("scoreCandidate — pesos y rango", () => {
  it("DEFAULT_SCORE_WEIGHTS suma 1.0", () => {
    const w = DEFAULT_SCORE_WEIGHTS;
    const sum =
      w.text + w.channel + w.engagement + w.duration + w.language + w.captionsRecency;
    expect(sum).toBeCloseTo(1.0, 10);
  });

  it("score = Σ wᵢ·señalᵢ redondeado a 4 decimales", () => {
    const result = scoreCandidate(video(), exercise, DEFAULT_SCORE_WEIGHTS, {
      channelAllowlist: ALLOWLIST,
    });
    const b = result.breakdown;
    const expected =
      Math.round(
        (DEFAULT_SCORE_WEIGHTS.text * b.text +
          DEFAULT_SCORE_WEIGHTS.channel * b.channel +
          DEFAULT_SCORE_WEIGHTS.engagement * b.engagement +
          DEFAULT_SCORE_WEIGHTS.duration * b.duration +
          DEFAULT_SCORE_WEIGHTS.language * b.language +
          DEFAULT_SCORE_WEIGHTS.captionsRecency * b.captionsRecency) *
          1e4
      ) / 1e4;
    expect(result.score).toBe(expected);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1);
  });

  it("todas las señales en [0,1]", () => {
    const b = scoreCandidate(video(), exercise, DEFAULT_SCORE_WEIGHTS, {
      channelAllowlist: ALLOWLIST,
    }).breakdown;
    for (const value of Object.values(b)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });
});

describe("señal text", () => {
  it("título relacionado puntúa > título irrelevante", () => {
    const related = scoreCandidate(video(), exercise).breakdown.text;
    const unrelated = scoreCandidate(
      video({ title: "Receta de pizza casera", description: "horno y queso" }),
      exercise
    ).breakdown.text;
    expect(related).toBeGreaterThan(unrelated);
  });
});

describe("señal channel", () => {
  it("canal en allowlist por channelTitle → 1", () => {
    const result = scoreCandidate(
      video({ channelTitle: "PowerExplosive" }),
      exercise,
      DEFAULT_SCORE_WEIGHTS,
      { channelAllowlist: ALLOWLIST }
    );
    expect(result.breakdown.channel).toBe(1);
  });

  it("canal en allowlist por channelId → 1", () => {
    const result = scoreCandidate(
      video({ channelId: "athleanx", channelTitle: "x" }),
      exercise,
      DEFAULT_SCORE_WEIGHTS,
      { channelAllowlist: ALLOWLIST }
    );
    expect(result.breakdown.channel).toBe(1);
  });

  it("canal fuera de allowlist → 0", () => {
    const result = scoreCandidate(video(), exercise, DEFAULT_SCORE_WEIGHTS, {
      channelAllowlist: ALLOWLIST,
    });
    expect(result.breakdown.channel).toBe(0);
  });

  it("sin allowlist → 0", () => {
    expect(
      scoreCandidate(video({ channelTitle: "PowerExplosive" }), exercise).breakdown
        .channel
    ).toBe(0);
  });

  it("estar en allowlist sube el score total", () => {
    const withChannel = scoreCandidate(
      video({ channelTitle: "PowerExplosive" }),
      exercise,
      DEFAULT_SCORE_WEIGHTS,
      { channelAllowlist: ALLOWLIST }
    ).score;
    const withoutChannel = scoreCandidate(
      video({ channelTitle: "PowerExplosive" }),
      exercise
    ).score;
    expect(withChannel).toBeGreaterThan(withoutChannel);
  });
});

describe("señal duration", () => {
  it("duración sana (2 min) = 1", () => {
    expect(scoreCandidate(video({ durationSeconds: 120 }), exercise).breakdown.duration).toBe(1);
  });

  it("video muy corto (<15s) = 0", () => {
    expect(scoreCandidate(video({ durationSeconds: 10 }), exercise).breakdown.duration).toBe(0);
  });

  it("video muy largo (>12min) = 0", () => {
    expect(scoreCandidate(video({ durationSeconds: 800 }), exercise).breakdown.duration).toBe(0);
  });

  it("rampa de subida entre 15 y 30s está en (0,1)", () => {
    const d = scoreCandidate(video({ durationSeconds: 22 }), exercise).breakdown.duration;
    expect(d).toBeGreaterThan(0);
    expect(d).toBeLessThan(1);
  });

  it("rampa de bajada entre 6 y 12 min está en (0,1)", () => {
    const d = scoreCandidate(video({ durationSeconds: 500 }), exercise).breakdown.duration;
    expect(d).toBeGreaterThan(0);
    expect(d).toBeLessThan(1);
  });

  it("duración sana puntúa más alto que un short", () => {
    const sane = scoreCandidate(video({ durationSeconds: 120 }), exercise).breakdown.duration;
    const short = scoreCandidate(video({ durationSeconds: 8 }), exercise).breakdown.duration;
    expect(sane).toBeGreaterThan(short);
  });
});

describe("señal engagement", () => {
  it("más views y likes → más engagement", () => {
    const high = scoreCandidate(
      video({ viewCount: 2_000_000, likeCount: 100_000, commentCount: 500 }),
      exercise
    ).breakdown.engagement;
    const low = scoreCandidate(
      video({ viewCount: 10, likeCount: 0, commentCount: 0 }),
      exercise
    ).breakdown.engagement;
    expect(high).toBeGreaterThan(low);
    expect(high).toBeLessThanOrEqual(1);
    expect(low).toBeGreaterThanOrEqual(0);
  });

  it("views en 0 no rompe (engagement definido)", () => {
    const e = scoreCandidate(
      video({ viewCount: 0, likeCount: 0, commentCount: 0 }),
      exercise
    ).breakdown.engagement;
    expect(e).toBe(0);
  });
});

describe("señal language", () => {
  it("audio declarado coincide con lang esperado → 1", () => {
    expect(
      scoreCandidate(video({ defaultAudioLanguage: "es-AR" }), exercise).breakdown.language
    ).toBe(1);
  });

  it("audio declarado distinto → 0", () => {
    expect(
      scoreCandidate(video({ defaultAudioLanguage: "en-US" }), exercise).breakdown.language
    ).toBe(0);
  });

  it("audio null + título en español → 1 (heurística)", () => {
    expect(
      scoreCandidate(
        video({ defaultAudioLanguage: null, title: "Cómo hacer la sentadilla con barra" }),
        exercise
      ).breakdown.language
    ).toBe(1);
  });

  it("audio null + título en inglés con lang es → 0 (heurística)", () => {
    expect(
      scoreCandidate(
        video({ defaultAudioLanguage: null, title: "How to do the squat with a barbell" }),
        exercise
      ).breakdown.language
    ).toBe(0);
  });

  it("audio null + sin stopwords → 0.5 neutro", () => {
    expect(
      scoreCandidate(
        video({ defaultAudioLanguage: null, title: "Sentadilla barra" }),
        exercise
      ).breakdown.language
    ).toBe(0.5);
  });

  it("lang en: audio inglés declarado → 1", () => {
    const ex: ExerciseContext = { ...exercise, lang: "en" };
    expect(
      scoreCandidate(video({ defaultAudioLanguage: "en" }), ex).breakdown.language
    ).toBe(1);
  });

  it("lang en: audio null + título inglés → 1", () => {
    const ex: ExerciseContext = { ...exercise, lang: "en" };
    expect(
      scoreCandidate(
        video({ defaultAudioLanguage: null, title: "How to do the squat for beginners" }),
        ex
      ).breakdown.language
    ).toBe(1);
  });
});

describe("señal captionsRecency", () => {
  it("con captions → 1, sin captions → 0", () => {
    expect(scoreCandidate(video({ hasCaptions: true }), exercise).breakdown.captionsRecency).toBe(1);
    expect(scoreCandidate(video({ hasCaptions: false }), exercise).breakdown.captionsRecency).toBe(0);
  });
});

describe("pickBest", () => {
  it("ordena por score desc y devuelve el mejor", () => {
    const good = video({
      title: "Sentadilla con barra técnica correcta",
      channelTitle: "PowerExplosive",
      durationSeconds: 120,
      viewCount: 1_000_000,
      likeCount: 50_000,
    });
    const meh = video({
      title: "Sentadilla rápida",
      channelTitle: "Don Nadie",
      durationSeconds: 600,
      viewCount: 50,
      likeCount: 0,
      commentCount: 0,
    });
    const { winner, scored } = pickBest([meh, good], exercise, DEFAULT_SCORE_WEIGHTS, {
      channelAllowlist: ALLOWLIST,
    });
    expect(winner).toBe(good);
    expect(scored[0]?.result.score).toBeGreaterThanOrEqual(scored[1]?.result.score ?? 0);
  });

  it("filtra descartados pero los incluye en scored", () => {
    const ok = video({ title: "Sentadilla técnica" });
    const bad = video({ embeddable: false });
    const { winner, scored } = pickBest([bad, ok], exercise);
    expect(winner).toBe(ok);
    expect(scored.length).toBe(2);
    expect(scored.some((s) => s.result.discarded)).toBe(true);
  });

  it("todos descartados → winner null", () => {
    const { winner, scored } = pickBest(
      [video({ embeddable: false }), video({ embeddable: false })],
      exercise
    );
    expect(winner).toBeNull();
    expect(scored.every((s) => s.result.discarded)).toBe(true);
  });

  it("lista vacía → winner null", () => {
    const { winner, scored } = pickBest([], exercise);
    expect(winner).toBeNull();
    expect(scored).toEqual([]);
  });
});
