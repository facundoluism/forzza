import { describe, it, expect } from "vitest";
import { calculateSettlement } from "./index";

describe("calculateSettlement", () => {
  it("calcula comisión 20% en ARS", () => {
    const result = calculateSettlement({
      grossAmount: 10000, // $100 en centavos
      commissionRate: 0.20,
      currency: "ARS",
    });
    expect(result.gross).toBe(10000);
    expect(result.commission).toBe(2000);
    expect(result.net).toBe(8000);
  });

  it("redondea correctamente (no floats)", () => {
    const result = calculateSettlement({
      grossAmount: 333,
      commissionRate: 0.20,
      currency: "ARS",
    });
    expect(result.commission).toBe(67); // Math.round(333 * 0.20) = 67
    expect(result.net).toBe(266);
    expect(Number.isInteger(result.commission)).toBe(true);
    expect(Number.isInteger(result.net)).toBe(true);
  });

  it("gross = commission + net siempre", () => {
    const result = calculateSettlement({
      grossAmount: 9999,
      commissionRate: 0.20,
      currency: "CLP",
    });
    expect(result.commission + result.net).toBe(result.gross);
  });

  it("comisión 0% → net === gross (coach retiene todo)", () => {
    const result = calculateSettlement({
      grossAmount: 50000,
      commissionRate: 0,
      currency: "ARS",
    });
    expect(result.commission).toBe(0);
    expect(result.net).toBe(result.gross);
    expect(result.net).toBe(50000);
  });

  it("comisión 100% → net === 0 (plataforma retiene todo)", () => {
    const result = calculateSettlement({
      grossAmount: 50000,
      commissionRate: 1,
      currency: "ARS",
    });
    expect(result.commission).toBe(50000);
    expect(result.net).toBe(0);
  });
});
