// billing — core financial rules (pure, testeable, no floats)

// Re-export Mercado Pago pure logic and mock (for use in tests and adapters)
export * from "./mp";
export * from "./mock-mercadopago";
export * from "./mp-webhook-handler";
export type CommissionRate = number; // 0.20 para AR/CL — siempre leído de country_config

export interface SettlementInput {
  grossAmount: number; // en centavos/enteros
  commissionRate: CommissionRate;
  currency: "ARS" | "CLP";
}

export interface SettlementResult {
  gross: number;
  commission: number;
  net: number;
}

/**
 * Calcula el settlement para una transacción.
 * IMPORTANTE: trabaja en enteros (centavos). No usa floats para dinero.
 */
export function calculateSettlement(input: SettlementInput): SettlementResult {
  const commission = Math.round(input.grossAmount * input.commissionRate);
  const net = input.grossAmount - commission;
  return {
    gross: input.grossAmount,
    commission,
    net,
  };
}

// ─── Phase 13: cents-named variant used by Edge Functions and tests ───────────

export interface SettlementInputCents {
  grossCents: number;
  commissionRate: CommissionRate;
}

export interface SettlementResultCents {
  grossCents: number;
  commissionCents: number;
  netCents: number;
}

/**
 * Calculates settlement amounts using explicit cents naming.
 * All arithmetic is integer-based (Math.round). Commission rate comes from
 * country_config.commission_rate — never hardcoded.
 */
export function calculateSettlementCents(
  input: SettlementInputCents
): SettlementResultCents {
  const commissionCents = Math.round(input.grossCents * input.commissionRate);
  const netCents = input.grossCents - commissionCents;
  return {
    grossCents: input.grossCents,
    commissionCents,
    netCents,
  };
}

// ─── Gross-up helpers: coach inputs net, system stores gross ─────────────────

/**
 * Convierte el neto que el coach quiere cobrar al precio que pagará el alumno (gross-up).
 * Fórmula: gross = round(net / (1 - rate))
 * Ejemplo: netCents=2000000 (ARS 20.000), rate=0.20 → grossCents=2500000 (ARS 25.000)
 *
 * IMPORTANTE: el redondeo vive SOLO aquí (regla core/billing).
 * commissionRate viene de country_config.commission_rate — jamás hardcodeado.
 */
export function studentPriceFromCoachNet(
  netCents: number,
  commissionRate: CommissionRate
): number {
  if (commissionRate >= 1) throw new Error("commissionRate must be < 1");
  return Math.round(netCents / (1 - commissionRate));
}

/**
 * Convierte el precio del alumno (gross) al neto que recibe el coach.
 * Fórmula: net = round(gross * (1 - rate))
 * Usar al cargar paquetes existentes para mostrar el neto en el input del form.
 *
 * commissionRate viene de country_config.commission_rate — jamás hardcodeado.
 */
export function coachNetFromStudentPrice(
  grossCents: number,
  commissionRate: CommissionRate
): number {
  return Math.round(grossCents * (1 - commissionRate));
}

// ─── Business rule: coach billing model ───────────────────────────────────────

/**
 * Regla: sub fija → comisión al 4° alumno ACTIVO, NUNCA revierte.
 * Esta función es la fuente de verdad en core; el trigger SQL la replica en DB.
 */
export function isEligibleForCommissionModel(activeStudentCount: number): boolean {
  return activeStudentCount >= 4;
}

// ─── Business rule: settlement transfer ───────────────────────────────────────

export interface SettlementTransferCheck {
  status: string;
  invoiceNumber: string | null;
  invoicePath: string | null;
}

/**
 * Regla: sin factura aprobada NO existe estado "transferido".
 * Debe estar aprobada por owner y tener invoice_number + invoice_path.
 */
export function canTransferSettlement(settlement: SettlementTransferCheck): boolean {
  return (
    settlement.status === "approved" &&
    settlement.invoiceNumber !== null &&
    settlement.invoiceNumber.trim().length > 0 &&
    settlement.invoicePath !== null &&
    settlement.invoicePath.trim().length > 0
  );
}
