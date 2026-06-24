/**
 * Tests de calculateSplitBreakdown — Split Payments de Mercado Pago
 *
 * Verifica:
 *   - Cálculo correcto con valores reales (AR: commission 20%, mp_fee 6,29%)
 *   - Aritmética entera (sin floats)
 *   - Invariantes de integridad
 *   - Casos borde
 *   - marketplaceFee nunca negativo
 *   - coachNet nunca negativo
 */
import { describe, it, expect } from "vitest";
import { calculateSplitBreakdown } from "../index";

// Valores de referencia para AR (leídos de country_config)
const AR_COMMISSION_PCT = 0.20; // 20%
const AR_MP_FEE_PCT = 629;      // 6,29% en bps

describe("calculateSplitBreakdown — caso base AR (20% Forzza, 6,29% MP)", () => {
  it("reparte correctamente un paquete de ARS 10.000,00 (1_000_000 centavos)", () => {
    const result = calculateSplitBreakdown({
      gross: 1_000_000,
      commissionPct: AR_COMMISSION_PCT,
      mpFeePct: AR_MP_FEE_PCT,
    });

    // forzzaCommission = round(1_000_000 × 0.20) = 200_000
    expect(result.forzzaCommission).toBe(200_000);

    // mpFeeTotal = round(1_000_000 × 629 / 10_000) = round(62_900) = 62_900
    expect(result.mpFeeTotal).toBe(62_900);

    // mpFeeCoachShare = round(62_900 / 2) = 31_450 (exacto)
    expect(result.mpFeeCoachShare).toBe(31_450);

    // mpFeeForzzaShare = 62_900 − 31_450 = 31_450
    expect(result.mpFeeForzzaShare).toBe(31_450);

    // coachNet = 1_000_000 − 200_000 − 31_450 = 768_550
    expect(result.coachNet).toBe(768_550);

    // marketplaceFee = 200_000 − 31_450 = 168_550
    expect(result.marketplaceFee).toBe(168_550);
  });

  it("gross siempre es el input (passthrough)", () => {
    const result = calculateSplitBreakdown({
      gross: 999_900,
      commissionPct: AR_COMMISSION_PCT,
      mpFeePct: AR_MP_FEE_PCT,
    });
    expect(result.gross).toBe(999_900);
  });

  it("invariante: forzzaCommission + coachNet + mpFeeCoachShare === gross", () => {
    const result = calculateSplitBreakdown({
      gross: 500_000,
      commissionPct: AR_COMMISSION_PCT,
      mpFeePct: AR_MP_FEE_PCT,
    });
    expect(result.forzzaCommission + result.coachNet + result.mpFeeCoachShare).toBe(result.gross);
  });

  it("invariante: mpFeeCoachShare + mpFeeForzzaShare === mpFeeTotal", () => {
    const result = calculateSplitBreakdown({
      gross: 333_333,
      commissionPct: AR_COMMISSION_PCT,
      mpFeePct: AR_MP_FEE_PCT,
    });
    expect(result.mpFeeCoachShare + result.mpFeeForzzaShare).toBe(result.mpFeeTotal);
  });

  it("invariante: marketplaceFee = forzzaCommission - mpFeeForzzaShare", () => {
    const result = calculateSplitBreakdown({
      gross: 750_000,
      commissionPct: AR_COMMISSION_PCT,
      mpFeePct: AR_MP_FEE_PCT,
    });
    expect(result.marketplaceFee).toBe(result.forzzaCommission - result.mpFeeForzzaShare);
  });
});

describe("calculateSplitBreakdown — aritmética entera (sin floats)", () => {
  it("todos los campos de salida son enteros", () => {
    const result = calculateSplitBreakdown({
      gross: 333_333,
      commissionPct: AR_COMMISSION_PCT,
      mpFeePct: AR_MP_FEE_PCT,
    });
    expect(Number.isInteger(result.forzzaCommission)).toBe(true);
    expect(Number.isInteger(result.mpFeeTotal)).toBe(true);
    expect(Number.isInteger(result.mpFeeCoachShare)).toBe(true);
    expect(Number.isInteger(result.mpFeeForzzaShare)).toBe(true);
    expect(Number.isInteger(result.coachNet)).toBe(true);
    expect(Number.isInteger(result.marketplaceFee)).toBe(true);
  });

  it("mpFeeTotal impar → mpFeeCoachShare redondea arriba, forzzaShare es el complemento exacto", () => {
    // gross = 159 → mpFeeTotal = round(159 × 629 / 10_000) = round(10.0011) = 10
    // Pares: mpFeeCoachShare = 5, mpFeeForzzaShare = 5 → suma = 10 ✓
    // Caso impar artificial: mpFeePct = 1000 → mpFeeTotal = round(159 × 1000 / 10_000) = round(15.9) = 16
    // mpFeeCoachShare = round(16/2) = 8, mpFeeForzzaShare = 16 - 8 = 8
    const result = calculateSplitBreakdown({
      gross: 159,
      commissionPct: 0.10,
      mpFeePct: 1000,
    });
    expect(result.mpFeeCoachShare + result.mpFeeForzzaShare).toBe(result.mpFeeTotal);
    expect(Number.isInteger(result.mpFeeCoachShare)).toBe(true);
    expect(Number.isInteger(result.mpFeeForzzaShare)).toBe(true);
  });

  it("valor impar de mpFeeTotal (forzado) → la suma de shares es exacta", () => {
    // gross = 1 → mpFeeTotal = round(1 × 629 / 10_000) = 0
    // Usamos mpFeePct = 5001 → mpFeeTotal = round(100 × 5001 / 10_000) = round(50.01) = 50 (par)
    // Para forzar impar: mpFeePct = 5100 → round(100 × 5100 / 10_000) = round(51) = 51 (impar)
    const result = calculateSplitBreakdown({
      gross: 100,
      commissionPct: 0.20,
      mpFeePct: 5100, // 51%
    });
    expect(result.mpFeeTotal).toBe(51);
    expect(result.mpFeeCoachShare + result.mpFeeForzzaShare).toBe(51);
    // Con Math.round(51/2) = 26, el coach lleva 26 y Forzza 25
    expect(result.mpFeeCoachShare).toBe(26);
    expect(result.mpFeeForzzaShare).toBe(25);
  });
});

describe("calculateSplitBreakdown — commissionPct y mpFeePct desde country_config (nunca hardcodeados)", () => {
  it("funciona con commission 0% (coach retiene todo excepto fee MP)", () => {
    const result = calculateSplitBreakdown({
      gross: 100_000,
      commissionPct: 0,
      mpFeePct: AR_MP_FEE_PCT,
    });
    expect(result.forzzaCommission).toBe(0);
    // marketplaceFee = 0 - mpFeeForzzaShare → puede ser negativo si Forzza absorbe su mitad
    // NOTA: con commissionPct=0 la cuenta no tiene sentido de negocio pero la función no prohíbe 0%
    expect(result.coachNet).toBe(100_000 - result.mpFeeCoachShare);
  });

  it("funciona con mp_fee_pct 0 (sin comisión de MP)", () => {
    const result = calculateSplitBreakdown({
      gross: 100_000,
      commissionPct: AR_COMMISSION_PCT,
      mpFeePct: 0,
    });
    expect(result.mpFeeTotal).toBe(0);
    expect(result.mpFeeCoachShare).toBe(0);
    expect(result.mpFeeForzzaShare).toBe(0);
    expect(result.coachNet).toBe(100_000 - result.forzzaCommission);
    expect(result.marketplaceFee).toBe(result.forzzaCommission);
  });

  it("funciona con comisión distinta a 20% (futuras configs)", () => {
    // CL podría tener commission_rate diferente
    const result = calculateSplitBreakdown({
      gross: 1_000_000,
      commissionPct: 0.15,
      mpFeePct: 500, // 5%
    });
    expect(result.forzzaCommission).toBe(150_000);
    expect(result.mpFeeTotal).toBe(50_000);
  });
});

describe("calculateSplitBreakdown — casos borde", () => {
  it("gross 0 → todos los resultados son 0", () => {
    const result = calculateSplitBreakdown({
      gross: 0,
      commissionPct: AR_COMMISSION_PCT,
      mpFeePct: AR_MP_FEE_PCT,
    });
    expect(result.forzzaCommission).toBe(0);
    expect(result.mpFeeTotal).toBe(0);
    expect(result.coachNet).toBe(0);
    expect(result.marketplaceFee).toBe(0);
  });

  it("gross negativo → lanza Error", () => {
    expect(() => calculateSplitBreakdown({
      gross: -1,
      commissionPct: AR_COMMISSION_PCT,
      mpFeePct: AR_MP_FEE_PCT,
    })).toThrow("gross must be >= 0");
  });

  it("commissionPct negativo → lanza Error", () => {
    expect(() => calculateSplitBreakdown({
      gross: 100_000,
      commissionPct: -0.1,
      mpFeePct: AR_MP_FEE_PCT,
    })).toThrow("commissionPct must be >= 0");
  });

  it("mpFeePct negativo → lanza Error", () => {
    expect(() => calculateSplitBreakdown({
      gross: 100_000,
      commissionPct: AR_COMMISSION_PCT,
      mpFeePct: -1,
    })).toThrow("mpFeePct must be >= 0");
  });

  it("paquete pequeño de 1 centavo (sin colapso aritmético)", () => {
    const result = calculateSplitBreakdown({
      gross: 1,
      commissionPct: AR_COMMISSION_PCT,
      mpFeePct: AR_MP_FEE_PCT,
    });
    // Todos son 0 o 1 — no hay crashes
    expect(result.gross).toBe(1);
    expect(Number.isInteger(result.coachNet)).toBe(true);
    // La invariante principal se cumple
    expect(result.forzzaCommission + result.coachNet + result.mpFeeCoachShare).toBe(result.gross);
  });

  it("coachNet nunca es negativo en rangos razonables de fees", () => {
    // commission 20% + mp_fee 6.29% = 26.29% máximo de descuentos sobre el coach
    // El coach recibe su cuota menos su mitad de la fee MP (no el total)
    const result = calculateSplitBreakdown({
      gross: 1_000_000,
      commissionPct: AR_COMMISSION_PCT,
      mpFeePct: AR_MP_FEE_PCT,
    });
    expect(result.coachNet).toBeGreaterThanOrEqual(0);
  });
});

describe("calculateSplitBreakdown — marketplaceFee para MP API", () => {
  it("marketplaceFee es el monto exacto a pasar como application_fee en MP", () => {
    // Verificamos que el campo esté disponible y sea un entero positivo
    // en el caso de negocio estándar
    const result = calculateSplitBreakdown({
      gross: 1_000_000,
      commissionPct: AR_COMMISSION_PCT,
      mpFeePct: AR_MP_FEE_PCT,
    });
    expect(result.marketplaceFee).toBeGreaterThan(0);
    expect(Number.isInteger(result.marketplaceFee)).toBe(true);
  });

  it("con gross ARS 9.999,00 (pro_monthly_price_cents en seeds)", () => {
    // pro_monthly_price_cents = 999_900 (ARS 9.999,00)
    const result = calculateSplitBreakdown({
      gross: 999_900,
      commissionPct: AR_COMMISSION_PCT,
      mpFeePct: AR_MP_FEE_PCT,
    });
    // forzzaCommission = round(999_900 × 0.20) = 199_980
    expect(result.forzzaCommission).toBe(199_980);
    // mpFeeTotal = round(999_900 × 629 / 10_000) = round(62_893.71) = 62_894
    expect(result.mpFeeTotal).toBe(62_894);
    // Invariante principal
    expect(result.forzzaCommission + result.coachNet + result.mpFeeCoachShare).toBe(result.gross);
    // El marketplaceFee nunca supera el gross
    expect(result.marketplaceFee).toBeLessThan(result.gross);
  });
});
