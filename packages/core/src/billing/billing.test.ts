import { describe, it, expect } from "vitest";
import {
  calculateSettlement,
  isEligibleForCommissionModel,
  canTransferSettlement,
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
