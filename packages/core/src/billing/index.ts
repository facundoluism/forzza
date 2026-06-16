// billing — core financial rules (pure, testeable, no floats)
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
