import { describe, it, expect } from "vitest";
import {
  calculateSettlement,
  isEligibleForCommissionModel,
  canTransferSettlement,
  studentPriceFromCoachNet,
  coachNetFromStudentPrice,
} from "./index";

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

describe("studentPriceFromCoachNet", () => {
  it("caso exacto: neto 20000, rate 0.20 → gross 25000", () => {
    expect(studentPriceFromCoachNet(2000000, 0.20)).toBe(2500000);
  });

  it("caso exacto en unidades: neto 20_000_00 centavos ARS → 25_000_00", () => {
    // Mismo caso, notación centavos explícita
    expect(studentPriceFromCoachNet(2000000, 0.20)).toBe(2500000);
  });

  it("redondeo cuando el resultado no es entero exacto", () => {
    // neto = 100, rate = 0.30 → gross = 100/0.70 = 142.857... → 143
    expect(studentPriceFromCoachNet(100, 0.30)).toBe(143);
  });

  it("rate desde parámetro — rate 0.15 produce gross correcto", () => {
    // neto = 8500, rate = 0.15 → gross = 8500/0.85 = 10000
    expect(studentPriceFromCoachNet(8500, 0.15)).toBe(10000);
  });

  it("neto 0 → gross 0", () => {
    expect(studentPriceFromCoachNet(0, 0.20)).toBe(0);
  });

  it("lanza error si rate >= 1", () => {
    expect(() => studentPriceFromCoachNet(1000, 1)).toThrow();
  });

  it("round-trip aproximado: gross→net→gross ≈ gross original", () => {
    const originalGross = 2500000;
    const net = coachNetFromStudentPrice(originalGross, 0.20);
    const recoveredGross = studentPriceFromCoachNet(net, 0.20);
    // El round-trip es exacto cuando gross * (1-rate) es entero
    expect(recoveredGross).toBe(originalGross);
  });
});

describe("coachNetFromStudentPrice", () => {
  it("caso exacto: gross 25000 centavos, rate 0.20 → neto 20000", () => {
    expect(coachNetFromStudentPrice(2500000, 0.20)).toBe(2000000);
  });

  it("redondeo: gross 333, rate 0.20 → net 267 (Math.round(333*0.8)=266→266)", () => {
    // 333 * 0.80 = 266.4 → Math.round = 266
    expect(coachNetFromStudentPrice(333, 0.20)).toBe(266);
  });

  it("rate desde parámetro — rate 0.15", () => {
    // gross = 10000, rate = 0.15 → net = 10000 * 0.85 = 8500
    expect(coachNetFromStudentPrice(10000, 0.15)).toBe(8500);
  });

  it("gross 0 → net 0", () => {
    expect(coachNetFromStudentPrice(0, 0.20)).toBe(0);
  });

  it("gross = commission + net siempre se cumple a nivel de round", () => {
    const gross = 9999;
    const rate = 0.20;
    const net = coachNetFromStudentPrice(gross, rate);
    const commission = Math.round(gross * rate);
    // Puede haber diferencia de ±1 centavo por redondeo independiente; toleramos 1
    expect(Math.abs(net + commission - gross)).toBeLessThanOrEqual(1);
  });
});

describe("isEligibleForCommissionModel", () => {
  it("3 alumnos activos → sigue en fixed (no llega al umbral)", () => {
    expect(isEligibleForCommissionModel(3)).toBe(false);
  });

  it("4 alumnos activos → pasa a comisión (umbral exacto)", () => {
    expect(isEligibleForCommissionModel(4)).toBe(true);
  });

  it("5+ alumnos activos → sigue en comisión (nunca revierte)", () => {
    expect(isEligibleForCommissionModel(5)).toBe(true);
    expect(isEligibleForCommissionModel(100)).toBe(true);
  });

  it("0 alumnos activos → fixed", () => {
    expect(isEligibleForCommissionModel(0)).toBe(false);
  });
});

describe("canTransferSettlement", () => {
  it("sin invoice_number → no se puede transferir", () => {
    expect(canTransferSettlement({
      status: "approved",
      invoiceNumber: null,
      invoicePath: "/invoices/coach/inv-001.pdf",
    })).toBe(false);
  });

  it("sin invoice_path → no se puede transferir", () => {
    expect(canTransferSettlement({
      status: "approved",
      invoiceNumber: "INV-001",
      invoicePath: null,
    })).toBe(false);
  });

  it("con invoice_number, invoice_path y estado approved → puede transferirse", () => {
    expect(canTransferSettlement({
      status: "approved",
      invoiceNumber: "INV-001",
      invoicePath: "/invoices/coach/inv-001.pdf",
    })).toBe(true);
  });

  it("con factura cargada pero no aprobada → no se puede transferir", () => {
    expect(canTransferSettlement({
      status: "invoiced",
      invoiceNumber: "INV-001",
      invoicePath: "/invoices/coach/inv-001.pdf",
    })).toBe(false);
  });

  it("invoice_number vacío → no se puede transferir", () => {
    expect(canTransferSettlement({
      status: "approved",
      invoiceNumber: "  ",
      invoicePath: "/invoices/coach/inv-001.pdf",
    })).toBe(false);
  });

  it("invoice_path vacío → no se puede transferir", () => {
    expect(canTransferSettlement({
      status: "approved",
      invoiceNumber: "INV-001",
      invoicePath: "",
    })).toBe(false);
  });
});
