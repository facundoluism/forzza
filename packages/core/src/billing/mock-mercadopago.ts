/**
 * mock-mercadopago.ts — Test double para el API de Mercado Pago.
 *
 * Reemplaza las llamadas salientes a api.mercadopago.com en tests y dev local.
 * NUNCA usar en producción.
 *
 * Implementa la interfaz mínima que usan las Edge Functions de Forzza:
 *   - POST /preapproval_plan      → crea un plan de pago recurrente
 *   - GET  /preapproval/{id}      → consulta estado de un preapproval
 *
 * También provee helpers para generar firmas HMAC-SHA256 válidas,
 * necesarias para testear el webhook sin la API real de MP.
 *
 * HUMAN_REQUIRED para integración real:
 *   Obtener MP_ACCESS_TOKEN y MP_WEBHOOK_SECRET desde
 *   mercadopago.com → Mi negocio → Credenciales (modo test primero).
 */

import {
  generateMpSignatureHeader,
  type MpPreapprovalPlanRequest,
  type MpPreapprovalPlanResponse,
  type MpPreapprovalResponse,
  type MpPreapprovalStatus,
} from "./mp.js";

// ─── Almacén en memoria ───────────────────────────────────────────────────────

interface MockPreapproval {
  id: string;
  status: MpPreapprovalStatus;
  date_created: string;
  next_payment_date: string;
  plan_id: string;
  reason: string;
  transaction_amount: number;
  currency_id: string;
  payer_email: string;
}

let mockPreapprovals: Map<string, MockPreapproval> = new Map();
let idCounter = 1;

// ─── Clase principal ──────────────────────────────────────────────────────────

/**
 * MockMercadoPago — adaptador que simula el API de MP sin credenciales reales.
 *
 * Uso en tests:
 * ```ts
 * const mp = new MockMercadoPago("test-webhook-secret");
 * const plan = await mp.createPreapprovalPlan({ ... });
 * // plan.id, plan.init_point disponibles
 * const preapproval = await mp.getPreapproval(plan.id);
 * const { xSignature, xRequestId } = await mp.generateWebhookHeaders(eventId, ts);
 * ```
 */
export class MockMercadoPago {
  private readonly webhookSecret: string;

  constructor(webhookSecret = "mock-webhook-secret-for-tests") {
    this.webhookSecret = webhookSecret;
  }

  // ─── POST /preapproval_plan ─────────────────────────────────────────────────

  /**
   * Crea un preapproval plan simulado.
   * Devuelve { id, init_point } igual que la API real de MP.
   *
   * El id generado tiene el prefijo "mock_plan_" para distinguirlo fácilmente.
   * El init_point apunta a una URL local de prueba.
   */
  createPreapprovalPlan(
    request: MpPreapprovalPlanRequest
  ): MpPreapprovalPlanResponse {
    const planId = `mock_plan_${idCounter++}`;
    const preapprovalId = `mock_preapproval_${idCounter++}`;

    const now = new Date();
    const nextPayment = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const preapproval: MockPreapproval = {
      id: preapprovalId,
      status: "pending",
      date_created: now.toISOString(),
      next_payment_date: nextPayment.toISOString(),
      plan_id: planId,
      reason: request.reason,
      transaction_amount: request.auto_recurring.transaction_amount,
      currency_id: request.auto_recurring.currency_id,
      payer_email: request.payer_email,
    };

    mockPreapprovals.set(preapprovalId, preapproval);

    return {
      id: preapprovalId,
      init_point: `https://mock.mercadopago.com/checkout/v1/redirect?pref_id=${preapprovalId}`,
    };
  }

  // ─── GET /preapproval/{id} ──────────────────────────────────────────────────

  /**
   * Consulta el estado de un preapproval simulado.
   * Devuelve el objeto con { id, status, date_created, next_payment_date, preapproval_plan_id }.
   *
   * El campo preapproval_plan_id refleja la estructura real de MP:
   *   - Al crear el preapproval, el mock guarda el plan_id interno del preapproval.
   *   - Este campo se incluye en la respuesta de GET /preapproval/{id}.
   *
   * Si el id no existe, devuelve un objeto con status "pending" (como haría MP
   * para un preapproval desconocido, aunque en la práctica devolvería 404).
   */
  getPreapproval(preapprovalId: string): MpPreapprovalResponse {
    const stored = mockPreapprovals.get(preapprovalId);
    if (!stored) {
      return {
        id: preapprovalId,
        status: "pending",
        date_created: new Date().toISOString(),
      };
    }

    return {
      id: stored.id,
      status: stored.status,
      date_created: stored.date_created,
      next_payment_date: stored.next_payment_date,
      // Refleja la estructura real de MP: el preapproval conoce su plan padre.
      preapproval_plan_id: stored.plan_id,
    };
  }

  // ─── Mutations del estado (para simular eventos de pago) ────────────────────

  /**
   * Cambia el status de un preapproval simulado.
   * Útil para simular transiciones: pending → authorized → paused → cancelled.
   */
  setPreapprovalStatus(
    preapprovalId: string,
    status: MpPreapprovalStatus
  ): void {
    const stored = mockPreapprovals.get(preapprovalId);
    if (stored) {
      stored.status = status;
    }
  }

  /**
   * Simula el flujo real de MP: dado un planId ya existente (guardado en DB al alta),
   * crea el preapproval real que MP genera cuando el alumno paga por primera vez.
   *
   * Devuelve el preapprovalId (distinto del planId), que es lo que MP envía
   * en la notificación webhook (data.id) y en GET /preapproval/{id} como `id`.
   * El objeto también incluye preapproval_plan_id = planId.
   *
   * Usar en tests que verifican el matching plan_id → preapproval_id.
   */
  createPreapprovalForPlan(
    planId: string,
    status: MpPreapprovalStatus = "authorized"
  ): string {
    const preapprovalId = `mock_preapproval_${idCounter++}`;
    const now = new Date();
    const nextPayment = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const preapproval: MockPreapproval = {
      id: preapprovalId,
      status,
      date_created: now.toISOString(),
      next_payment_date: nextPayment.toISOString(),
      plan_id: planId,
      reason: "mock preapproval for plan",
      transaction_amount: 0,
      currency_id: "ARS",
      payer_email: "mock@forzza.app",
    };

    mockPreapprovals.set(preapprovalId, preapproval);
    return preapprovalId;
  }

  // ─── Generación de firmas webhook ──────────────────────────────────────────

  /**
   * Genera los headers `x-signature` y `x-request-id` válidos para un
   * evento webhook simulado, más el dataId que simula el query param ?data.id.
   *
   * Usa el mismo algoritmo HMAC-SHA256 con el manifest correcto de MP:
   *   id:[data.id];request-id:[x-request-id];ts:[ts];
   * El webhook handler los aceptará como válidos.
   *
   * @param dataId    Valor del query param ?data.id (simula lo que MP envía en la URL)
   * @param requestId Valor del header x-request-id (si se omite, usa un UUID aleatorio)
   * @param ts        Timestamp Unix en string. Por defecto: now en segundos.
   */
  async generateWebhookHeaders(
    dataId: string,
    requestId?: string,
    ts?: string
  ): Promise<{ xSignature: string; xRequestId: string; dataId: string }> {
    const timestamp = ts ?? String(Math.floor(Date.now() / 1000));
    const xRequestId = requestId ?? `req-${dataId}`;
    const xSignature = await generateMpSignatureHeader(
      this.webhookSecret,
      dataId,
      xRequestId,
      timestamp
    );

    return { xSignature, xRequestId, dataId };
  }

  /**
   * Devuelve el webhook secret configurado en esta instancia.
   * Útil para pasarlo al handler bajo test.
   */
  getWebhookSecret(): string {
    return this.webhookSecret;
  }

  // ─── Reset (para aislar tests) ──────────────────────────────────────────────

  /**
   * Limpia el almacén en memoria.
   * Llamar en beforeEach para aislar los tests entre sí.
   */
  reset(): void {
    mockPreapprovals = new Map();
    idCounter = 1;
  }
}

// ─── Singleton de conveniencia ────────────────────────────────────────────────

/**
 * Instancia singleton para usar en tests sin pasar el secret manualmente.
 * El secret puede sobreescribirse con MOCK_MP_WEBHOOK_SECRET en .env de test.
 */
export const mockMercadoPago = new MockMercadoPago(
  process.env["MOCK_MP_WEBHOOK_SECRET"] ?? "mock-webhook-secret-for-tests"
);
