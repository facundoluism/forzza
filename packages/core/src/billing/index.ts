// billing — TODO: implementar en Fase 9
export type CommissionRate = number; // 0.20 para AR/CL

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
