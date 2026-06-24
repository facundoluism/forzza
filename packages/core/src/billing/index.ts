// billing — core financial rules (pure, testeable, no floats)
// Exported split-payment logic: calculateSplitBreakdown

// Re-export Mercado Pago pure logic and mock (for use in tests and adapters)
export * from "./mp";
export * from "./mock-mercadopago";
export * from "./mp-webhook-handler";
export * from "./mock-mp-split";
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

// ─── Split Payments: desglose para Mercado Pago Marketplace ─────────────────

/**
 * Input para el cálculo del desglose de Split Payment de MP.
 *
 * Unidades: todas en ENTEROS (centavos / unidad mínima de la moneda).
 *
 * - gross: lo que paga el alumno (precio del paquete del coach)
 * - commissionPct: comisión de Forzza como marketplace (leída de country_config.commission_rate)
 *   Ejemplo: 0.20 para 20%
 * - mpFeePct: comisión de procesamiento de MP en basis points (leída de country_config.mp_fee_pct)
 *   Ejemplo: 629 para 6,29%
 *   Para convertir a tasa decimal: mpFeePct / 10000
 */
export interface SplitBreakdownInput {
  gross: number;         // entero — lo que paga el alumno
  commissionPct: number; // decimal — ej. 0.20 (leído de country_config.commission_rate)
  mpFeePct: number;      // basis points INTEGER — ej. 629 (leído de country_config.mp_fee_pct)
}

/**
 * Resultado del desglose de Split Payment.
 *
 * Todos los campos son ENTEROS (centavos / unidad mínima).
 *
 * Campos para la UI del coach (mostrar al setear precio):
 *   - gross: precio que paga el alumno
 *   - forzzaCommission: la parte que retiene Forzza como marketplace fee
 *   - mpFeeTotal: la fee total de MP sobre el gross
 *   - mpFeeCoachShare: mitad de la fee MP que absorbe el coach (50%)
 *   - mpFeeForzzaShare: mitad de la fee MP que absorbe Forzza (50%)
 *   - coachNet: lo que recibe el coach (neto después de comisión Forzza y su parte de la fee MP)
 *   - marketplaceFee: el `application_fee` / `marketplace_fee` que Forzza declara en el pago MP
 *     = forzzaCommission − mpFeeForzzaShare
 *     (Forzza declara esta cifra y MP le retiene a Forzza exactamente este monto del total)
 *
 * SUPUESTO SOBRE CÓMO MP DESCUENTA SU FEE (TO-CONFIRM con ejecutivo MP):
 *   La documentación pública de MP Marketplace indica que la fee de procesamiento
 *   se descuenta de los fondos del VENDEDOR (coach) y el marketplace_fee se cobra
 *   SOBRE EL MONTO TOTAL (gross). En la práctica:
 *     - MP descuenta mpFeeTotal del gross del vendedor.
 *     - Forzza declara marketplaceFee (su comisión neta de su parte de la fee MP).
 *     - El coach recibe: gross − mpFeeTotal − forzzaCommission + mpFeeForzzaShare
 *       = gross − mpFeeCoachShare − forzzaCommission
 *   Este supuesto puede cambiar según el acuerdo comercial con MP. El punto de
 *   ajuste es SOLO esta función: el resto del código la consume.
 */
export interface SplitBreakdownResult {
  gross: number;
  forzzaCommission: number;     // gross × commissionPct (redondeado)
  mpFeeTotal: number;           // gross × (mpFeePct / 10_000) (redondeado)
  mpFeeCoachShare: number;      // mpFeeTotal / 2 (redondeado — coach absorbe 50%)
  mpFeeForzzaShare: number;     // mpFeeTotal − mpFeeCoachShare (Forzza absorbe el resto)
  coachNet: number;             // lo que recibe el coach
  marketplaceFee: number;       // forzzaCommission − mpFeeForzzaShare (se declara en MP)
}

/**
 * Calcula el desglose completo de un pago con Split Payments de Mercado Pago.
 *
 * FÓRMULA (decisión del dueño 2026-06-23: fee MP partida 50/50):
 *   forzzaCommission  = round(gross × commissionPct)
 *   mpFeeTotal        = round(gross × mpFeePct / 10_000)
 *   mpFeeCoachShare   = round(mpFeeTotal / 2)
 *   mpFeeForzzaShare  = mpFeeTotal − mpFeeCoachShare
 *   coachNet          = gross − forzzaCommission − mpFeeCoachShare
 *   marketplaceFee    = forzzaCommission − mpFeeForzzaShare
 *
 * PUNTO ÚNICO DE AJUSTE: toda la lógica de reparto vive aquí. Si el acuerdo con
 * MP cambia (ej: fee descuenta sobre neto del coach, no sobre gross) solo se
 * modifica esta función y sus tests.
 *
 * REGLAS:
 *   - Dinero en ENTEROS. Math.round solo aquí. Sin floats en ningún otro lugar.
 *   - commissionPct viene de country_config.commission_rate (NUNCA hardcodeado).
 *   - mpFeePct viene de country_config.mp_fee_pct (NUNCA hardcodeado).
 *
 * @throws Error si gross < 0, commissionPct < 0, mpFeePct < 0
 */
export function calculateSplitBreakdown(
  input: SplitBreakdownInput
): SplitBreakdownResult {
  const { gross, commissionPct, mpFeePct } = input;

  if (gross < 0) throw new Error("gross must be >= 0");
  if (commissionPct < 0) throw new Error("commissionPct must be >= 0");
  if (mpFeePct < 0) throw new Error("mpFeePct must be >= 0");

  // Comisión de Forzza como marketplace
  const forzzaCommission = Math.round(gross * commissionPct);

  // Fee total de MP sobre el gross del pago
  // mpFeePct está en bps (basis points): dividimos por 10_000
  const mpFeeTotal = Math.round((gross * mpFeePct) / 10_000);

  // Reparto 50/50 de la fee de MP (decisión del dueño 2026-06-23)
  // El coach absorbe 50%, Forzza absorbe 50%.
  // Si mpFeeTotal es impar, el coach absorbe la mitad redondeada arriba
  // (Math.round) y Forzza obtiene el complemento exacto (sin doble redondeo).
  const mpFeeCoachShare = Math.round(mpFeeTotal / 2);
  const mpFeeForzzaShare = mpFeeTotal - mpFeeCoachShare;

  // Neto del coach: lo que recibirá en su cuenta MP
  const coachNet = gross - forzzaCommission - mpFeeCoachShare;

  // marketplace_fee que Forzza declara al crear el pago en MP.
  // Es la comisión bruta de Forzza menos la parte de la fee MP que Forzza absorbe.
  // (Forzza declara este monto y MP lo retiene automáticamente de los fondos totales.)
  const marketplaceFee = forzzaCommission - mpFeeForzzaShare;

  return {
    gross,
    forzzaCommission,
    mpFeeTotal,
    mpFeeCoachShare,
    mpFeeForzzaShare,
    coachNet,
    marketplaceFee,
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
