/**
 * mock-mp-split.ts — Test double para el flujo de Split Payments de Mercado Pago.
 *
 * Simula las llamadas a la API de MP Marketplace (split) sin credenciales reales.
 * Implementa la misma interfaz que usará el coach-checkout cuando llame a MP real.
 *
 * HUMAN_REQUIRED:
 *   Para el flujo real necesitás:
 *   1. MP_OAUTH_CLIENT_ID y MP_OAUTH_CLIENT_SECRET → ver mp-oauth-connect/index.ts
 *   2. El access_token del coach (almacenado en coach_mp_accounts tras OAuth)
 *   3. La app MP debe ser de tipo "Marketplace" con permisos de split payments.
 *   Documentación: https://www.mercadopago.com.ar/developers/es/docs/marketplace
 *
 * Uso en tests de coach-checkout:
 * ```ts
 * const adapter = new MockMpSplitAdapter();
 * const result = await adapter.createPaymentPreference({ ... });
 * // result.init_point disponible para redirect
 * ```
 *
 * JAMÁS usar en producción. El adaptador real usa fetch con el token del coach.
 */

/** Parámetros para crear un pago split en MP Marketplace. */
export interface MpSplitPaymentParams {
  /** Descripción del pago (ej: "Forzza Coach: Starter 1 mes") */
  reason: string;
  /** Monto TOTAL que paga el alumno, en ENTEROS (unidad mínima de la moneda) */
  transactionAmount: number;
  /** Código ISO de la moneda (ej: "ARS") */
  currencyId: string;
  /** Email del pagador (alumno) */
  payerEmail: string;
  /** URL de redirección tras el pago */
  backUrl: string;
  /**
   * Monto que Forzza retiene como marketplace fee (en ENTEROS, unidad mínima).
   * Este es el campo `application_fee` / `marketplace_fee` de la API real de MP.
   * Calculado con calculateSplitBreakdown().marketplaceFee en core/billing.
   */
  marketplaceFee: number;
  /**
   * access_token del COACH (no de Forzza).
   * Obtenido de coach_mp_accounts vía service-role.
   * En el mock se ignora el valor concreto pero se verifica que no esté vacío.
   */
  coachAccessToken: string;
}

/** Respuesta del adaptador al crear la preferencia de pago. */
export interface MpSplitPaymentResult {
  /** ID del pago/preferencia en MP (o el ID mock) */
  id: string;
  /** URL de checkout de MP a donde redirigir al alumno */
  init_point: string;
  /** true si fue generado por el mock, false en producción */
  isMock: boolean;
}

/** Interfaz del adaptador — la Edge Function depende de esta interfaz, no de la implementación. */
export interface IMpSplitAdapter {
  createPaymentPreference(params: MpSplitPaymentParams): Promise<MpSplitPaymentResult>;
}

// ─── Mock adapter ─────────────────────────────────────────────────────────────

let mockIdCounter = 1;

/**
 * MockMpSplitAdapter — simula el API de Split Payment de MP Marketplace.
 *
 * Comportamiento:
 *   - Valida que coachAccessToken no esté vacío (condición mínima de seguridad).
 *   - Devuelve un id y un init_point ficticios con prefijo "mock_split_".
 *   - No hace ninguna llamada de red.
 *
 * Uso:
 * ```ts
 * const adapter = new MockMpSplitAdapter();
 * const { id, init_point } = await adapter.createPaymentPreference({ ... });
 * ```
 */
export class MockMpSplitAdapter implements IMpSplitAdapter {
  reset(): void {
    mockIdCounter = 1;
  }

  async createPaymentPreference(
    params: MpSplitPaymentParams
  ): Promise<MpSplitPaymentResult> {
    // Mock sin I/O: await trivial para conservar semántica async (throws → rejections)
    await Promise.resolve();
    if (!params.coachAccessToken || params.coachAccessToken.trim() === "") {
      throw new Error("MockMpSplitAdapter: coachAccessToken is required");
    }
    if (params.transactionAmount <= 0) {
      throw new Error("MockMpSplitAdapter: transactionAmount must be > 0");
    }
    if (params.marketplaceFee < 0) {
      throw new Error("MockMpSplitAdapter: marketplaceFee must be >= 0");
    }

    const id = `mock_split_${mockIdCounter++}`;
    return {
      id,
      init_point: `https://mock.mercadopago.com/split/checkout?id=${id}`,
      isMock: true,
    };
  }
}

/**
 * Instancia singleton del mock para tests.
 * Llamar .reset() en beforeEach para aislar tests.
 */
export const mockMpSplitAdapter = new MockMpSplitAdapter();
