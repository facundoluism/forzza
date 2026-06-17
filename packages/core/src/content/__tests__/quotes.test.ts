import { describe, it, expect } from "vitest";
import { QUOTES, quoteOfTheDay, quoteByIndex, quoteText } from "../quotes";

describe("quotes dataset", () => {
  it("tiene >= 28 frases", () => {
    expect(QUOTES.length).toBeGreaterThanOrEqual(28);
  });

  it("toda frase tiene es, en, author y sport no vacíos", () => {
    for (const q of QUOTES) {
      expect(q.text_es.trim().length).toBeGreaterThan(0);
      expect(q.text_en.trim().length).toBeGreaterThan(0);
      expect(q.author.trim().length).toBeGreaterThan(0);
      expect(q.sport.trim().length).toBeGreaterThan(0);
    }
  });

  it("los ids son únicos", () => {
    const ids = QUOTES.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("arrancan sin verificar (HUMAN_REVIEW pendiente)", () => {
    expect(QUOTES.every((q) => q.verified === false)).toBe(true);
  });
});

describe("selectores puros", () => {
  it("quoteOfTheDay es determinístico y cicla", () => {
    expect(quoteOfTheDay(0).id).toBe(QUOTES[0]!.id);
    expect(quoteOfTheDay(QUOTES.length).id).toBe(QUOTES[0]!.id);
    expect(quoteOfTheDay(1).id).toBe(QUOTES[1]!.id);
  });

  it("quoteByIndex maneja negativos y queda en rango", () => {
    expect(QUOTES).toContainEqual(quoteByIndex(-1));
    expect(QUOTES).toContainEqual(quoteByIndex(999));
  });

  it("quoteText devuelve el idioma pedido", () => {
    const q = QUOTES[0]!;
    expect(quoteText(q, "es")).toBe(q.text_es);
    expect(quoteText(q, "en")).toBe(q.text_en);
  });
});
