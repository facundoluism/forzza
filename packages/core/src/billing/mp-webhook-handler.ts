/**
 * mp-webhook-handler.ts — Lógica del handler de webhook de MP extraída para
 * ser testeable en Node.js sin Deno.
 *
 * Las Edge Functions (mp-webhook, mp-assignment-webhook) implementan esta
 * misma lógica con acceso a Deno.env y fetch global.
 * Este módulo permite testear la lógica de negocio con:
 *   - Una conexión pg directa al Postgres local (sin Supabase client de Deno)
 *   - El MockMercadoPago en lugar del API real de MP
 *
 * IMPORTANTE: Este archivo NO modifica las Edge Functions existentes.
 * Es una extracción para tests.
 */

import {
  validateMpSignature,
  mapMpStatus,
  extractMpEventId,
  type MpWebhookBody,
  type MpPreapprovalResponse,
} from "./mp.js";

// ─── Interfaz de dependencias (inversión de control) ─────────────────────────

/**
 * Abstracción del cliente de DB para el handler.
 * En tests: implementado con pg directo al Postgres local.
 * En producción: el Supabase client en las Edge Functions.
 */
export interface WebhookDbClient {
  /**
   * Intenta insertar un evento en processed_events.
   * @returns "ok" si se insertó (primer procesamiento)
   * @returns "duplicate" si ya existía (idempotencia)
   * @returns "error" si hay un error inesperado
   */
  insertProcessedEvent(
    eventId: string,
    gateway: string
  ): Promise<"ok" | "duplicate" | "error">;

  /**
   * Actualiza el estado de una suscripción por gateway_subscription_id.
   * Usado cuando ya tenemos el preapproval id guardado (eventos recurrentes).
   */
  updateSubscription(
    gatewaySubscriptionId: string,
    status: string,
    periodStart: string,
    periodEnd: string
  ): Promise<void>;

  /**
   * Busca una suscripción por preapproval_plan_id (= gateway_subscription_id
   * guardado en el alta inicial) y la actualiza promoviendo el
   * gateway_subscription_id al preapproval id real.
   *
   * Esto resuelve el mismatch: al alta guardamos el plan id, pero MP luego
   * notifica con el preapproval id (distinto). Tras esta llamada, los eventos
   * futuros ya pueden matchear por preapproval id directamente.
   *
   * @returns true si encontró y actualizó la fila; false si no hubo match.
   */
  updateSubscriptionByPlanId(
    preapprovalPlanId: string,
    newGatewaySubscriptionId: string,
    status: string,
    periodStart: string,
    periodEnd: string
  ): Promise<boolean>;

  /**
   * Inserta un registro en audit_log.
   */
  insertAuditLog(entry: {
    actor_id: null;
    action: string;
    entity_type: string;
    entity_id: null;
    payload: Record<string, unknown>;
  }): Promise<void>;
}

/**
 * Resultado del procesamiento del webhook.
 */
export type WebhookHandlerResult =
  | { status: 401; body: "Unauthorized" }
  | { status: 500; body: "Internal configuration error" }
  | { status: 500; body: "Internal error" }
  | { status: 200; body: "ok" };

// ─── Handler principal ────────────────────────────────────────────────────────

export interface WebhookHandlerOptions {
  /** MP_WEBHOOK_SECRET */
  secret: string;
  /** Header x-signature del request */
  xSignature: string | null;
  /** Header x-request-id del request */
  xRequestId: string | null;
  /**
   * Query param ?data.id de la URL del webhook (NO del body).
   * MP lo incluye en la URL como: POST /webhook?data.id=XXX
   * Es el primer segmento del manifest de firma: `id:<data.id>;`
   * null si el query param no está presente en la notificación.
   */
  dataId?: string | null;
  /** Body del webhook ya parseado */
  body: MpWebhookBody;
  /** Función que obtiene los detalles del preapproval (mockeable) */
  fetchPreapproval: (preapprovalId: string) => Promise<MpPreapprovalResponse>;
  /** Cliente de DB */
  db: WebhookDbClient;
  /** Gateway a registrar en processed_events */
  gateway?: string;
}

/**
 * Handler puro del webhook de MP.
 * Replica exactamente la lógica de mp-webhook/index.ts pero con
 * dependencias inyectadas para ser testeable.
 */
export async function handleMpWebhook(
  opts: WebhookHandlerOptions
): Promise<WebhookHandlerResult> {
  const { secret, xSignature, xRequestId, body, fetchPreapproval, db } = opts;
  const gateway = opts.gateway ?? "mercadopago";
  const dataId = opts.dataId ?? null;

  // 1. Validar firma con el manifest correcto de MP:
  //    id:[data.id];request-id:[x-request-id];ts:[ts];
  //    dataId proviene del query param ?data.id de la URL del webhook.
  let signatureValid: boolean;
  try {
    signatureValid = await validateMpSignature(secret, xSignature, xRequestId, dataId);
  } catch {
    return { status: 500, body: "Internal configuration error" };
  }

  if (!signatureValid) {
    return { status: 401, body: "Unauthorized" };
  }

  // 2. Extraer event_id
  const eventId = extractMpEventId(body);
  if (!eventId) {
    return { status: 200, body: "ok" };
  }

  // 3. Idempotencia: INSERT en processed_events
  const insertResult = await db.insertProcessedEvent(eventId, gateway);
  if (insertResult === "duplicate") {
    return { status: 200, body: "ok" };
  }
  if (insertResult === "error") {
    return { status: 500, body: "Internal error" };
  }

  // 4. Procesar evento preapproval / subscription_preapproval
  //
  // MP usa dos nombres de tipo para el ciclo de vida de suscripciones:
  //   - "preapproval"              (legacy / algunos entornos)
  //   - "subscription_preapproval" (actual — ciclo de vida de la suscripción)
  // Ambos deben procesarse con la misma lógica.
  if (
    body.type === "preapproval" ||
    body.type === "subscription_preapproval" ||
    body.action?.startsWith("preapproval")
  ) {
    const preapprovalId = body.data?.id;
    if (!preapprovalId) {
      return { status: 200, body: "ok" };
    }

    // Obtener detalles del preapproval (mockeable).
    // El objeto devuelto por GET /preapproval/{id} incluye preapproval_plan_id,
    // que es el id del plan que guardamos en subscriptions.gateway_subscription_id
    // al momento del alta.
    const preapproval = await fetchPreapproval(preapprovalId);

    // Mapear status
    const newStatus = mapMpStatus(preapproval.status);

    const periodEnd =
      preapproval.next_payment_date ??
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // ── Matching robusto ──────────────────────────────────────────────────────
    //
    // Al crear la suscripción (mp-create-preapproval) guardamos el plan id como
    // gateway_subscription_id. MP luego crea un preapproval (id distinto) y
    // notifica con ese preapproval id. El objeto del preapproval incluye
    // preapproval_plan_id que apunta al plan original.
    //
    // Estrategia:
    //   1. Si el preapproval tiene preapproval_plan_id, buscar por ese campo
    //      (primera notificación: la suscripción sigue con el plan id).
    //      Si hay match, promover gateway_subscription_id al preapproval id
    //      para que las notificaciones futuras ya resuelvan por preapproval id.
    //   2. Si no hubo match por plan id (o el campo no viene), intentar por
    //      el preapproval id directamente (suscripción ya promovida en paso 1,
    //      eventos recurrentes subsiguientes).
    //
    let matched = false;

    if (preapproval.preapproval_plan_id) {
      matched = await db.updateSubscriptionByPlanId(
        preapproval.preapproval_plan_id,
        preapprovalId,
        newStatus,
        preapproval.date_created,
        periodEnd
      );
    }

    if (!matched) {
      // Fallback: la suscripción ya fue promovida al preapproval id en un
      // evento anterior (o el plan id no vino en el payload).
      await db.updateSubscription(
        preapprovalId,
        newStatus,
        preapproval.date_created,
        periodEnd
      );
    }

    // Audit log
    await db.insertAuditLog({
      actor_id: null,
      action: `mp_preapproval_${preapproval.status}`,
      entity_type: "subscription",
      entity_id: null,
      payload: {
        event_id: eventId,
        mp_status: preapproval.status,
        preapproval_id: preapprovalId,
        preapproval_plan_id: preapproval.preapproval_plan_id ?? null,
        matched_by: matched ? "plan_id" : "preapproval_id",
      },
    });
  }

  return { status: 200, body: "ok" };
}
