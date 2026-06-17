/**
 * mp.ts — Lógica pura del dominio Mercado Pago extraída de las Edge Functions.
 *
 * TODO el código aquí es:
 *   - Puro (sin Deno, sin fetch, sin Supabase client)
 *   - Testeable con Vitest en Node.js
 *   - Compartible entre Edge Functions, tests y scripts
 *
 * Las Edge Functions importan estas funciones en lugar de duplicar la lógica.
 * NOTA: Las Edge Functions EXISTENTES no se tocan para no romper comportamiento;
 * este módulo es la fuente de verdad para tests y futuras referencias.
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────

/**
 * Status que Mercado Pago puede devolver para un preapproval.
 */
export type MpPreapprovalStatus =
  | "authorized"
  | "paused"
  | "cancelled"
  | "pending"
  | (string & {}); // pass-through para status desconocidos

/**
 * Status interno de suscripción en Forzza (enum subscription_status en DB).
 */
export type ForzzaSubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "trialing";

// ─── Mapeo de status ──────────────────────────────────────────────────────────

/**
 * Tabla de mapeo MP status → Forzza subscription_status.
 * Fuente de verdad: las Edge Functions replican exactamente este mapa.
 *
 *   authorized → active    (pago confirmado, suscripción vigente)
 *   paused     → past_due  (pago fallido, período de gracia)
 *   cancelled  → canceled  (baja explícita)
 *   pending    → trialing  (en proceso / esperando primer cobro)
 */
export const MP_STATUS_MAP: Record<string, ForzzaSubscriptionStatus> = {
  authorized: "active",
  paused: "past_due",
  cancelled: "canceled",
  pending: "trialing",
};

/**
 * Mapea un status de MP al status interno de Forzza.
 * Si el status es desconocido, devuelve "trialing" como fallback seguro
 * (espejo del comportamiento de las Edge Functions: `?? "trialing"`).
 */
export function mapMpStatus(mpStatus: string): ForzzaSubscriptionStatus {
  return MP_STATUS_MAP[mpStatus] ?? "trialing";
}

// ─── Parseo de firma ──────────────────────────────────────────────────────────

export interface ParsedMpSignature {
  ts: string;
  v1: string;
}

/**
 * Parsea el header `x-signature: ts=TIMESTAMP,v1=HASH` de MP.
 * Devuelve { ts, v1 } o null si el formato es inválido.
 *
 * Formato exacto documentado por Mercado Pago:
 *   x-signature: ts=1704067200,v1=abc123...
 */
export function parseMpSignatureHeader(
  xSignature: string
): ParsedMpSignature | null {
  let ts: string | null = null;
  let v1: string | null = null;

  for (const part of xSignature.split(",")) {
    const eqIdx = part.indexOf("=");
    if (eqIdx === -1) continue;
    const key = part.slice(0, eqIdx).trim();
    const value = part.slice(eqIdx + 1).trim();
    if (key === "ts") ts = value;
    if (key === "v1") v1 = value;
  }

  if (!ts || !v1) return null;
  return { ts, v1 };
}

/**
 * Construye el mensaje firmado exactamente como lo especifica Mercado Pago.
 *
 * Formato oficial (doc: https://www.mercadopago.com.ar/developers/en/docs/your-integrations/notifications/webhooks):
 *   id:[data.id];request-id:[x-request-id];ts:[ts];
 *
 * Reglas:
 *   - `dataId`    viene del QUERY PARAM ?data.id de la URL del webhook (NO del body). Lowercase si alfanumérico.
 *   - `requestId` = header `x-request-id`
 *   - `ts`        = extraído del header `x-signature` (ts=...)
 *   - Orden EXACTO: id, request-id, ts
 *   - Si algún valor no está presente, se OMITE ese segmento del template.
 *
 * @param dataId    Valor del query param ?data.id (null si ausente)
 * @param requestId Valor del header x-request-id (null si ausente)
 * @param ts        Timestamp extraído del header x-signature
 */
export function buildMpSignedMessage(
  dataId: string | null,
  requestId: string | null,
  ts: string
): string {
  let message = "";
  if (dataId != null) {
    // MP requiere lowercase si el valor es alfanumérico
    message += `id:${dataId.toLowerCase()};`;
  }
  if (requestId != null) {
    message += `request-id:${requestId};`;
  }
  message += `ts:${ts};`;
  return message;
}

// ─── HMAC-SHA256 (Web Crypto API — disponible en Node 18+ y Deno) ─────────────

/**
 * Calcula el HMAC-SHA256 de un mensaje con una clave dada.
 * Usa la Web Crypto API (disponible en Node 18+ y Deno).
 * Devuelve el hash en hexadecimal en minúsculas.
 */
export async function computeHmacSha256Hex(
  secret: string,
  message: string
): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    keyMaterial,
    encoder.encode(message)
  );
  return Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Comparación de strings en tiempo constante para prevenir timing attacks.
 * Devuelve true si `a === b`.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Valida la firma HMAC-SHA256 de un webhook de Mercado Pago.
 *
 * Lógica extraída de las Edge Functions (mp-webhook, mp-assignment-webhook)
 * para ser testeable en Node.js sin Deno.
 *
 * Manifest correcto (doc oficial MP):
 *   id:[data.id];request-id:[x-request-id];ts:[ts];
 * donde `dataId` proviene del QUERY PARAM ?data.id de la URL del webhook.
 *
 * @param secret        Valor de MP_WEBHOOK_SECRET
 * @param xSignature    Valor del header `x-signature`
 * @param xRequestId    Valor del header `x-request-id`
 * @param dataId        Valor del query param ?data.id de la URL del webhook (null si ausente)
 * @returns             true si la firma es válida, false si no
 * @throws              Si el secret es vacío (error de configuración)
 */
export async function validateMpSignature(
  secret: string,
  xSignature: string | null,
  xRequestId: string | null,
  dataId?: string | null
): Promise<boolean> {
  if (!secret) {
    throw new Error("MP_WEBHOOK_SECRET is not configured");
  }

  if (!xSignature) {
    return false;
  }

  const parsed = parseMpSignatureHeader(xSignature);
  if (!parsed) {
    return false;
  }

  const signedMessage = buildMpSignedMessage(
    dataId ?? null,
    xRequestId ?? null,
    parsed.ts
  );
  const expectedHash = await computeHmacSha256Hex(secret, signedMessage);

  return constantTimeEqual(expectedHash, parsed.v1);
}

// ─── Generador de firma (para tests / MockMercadoPago) ────────────────────────

/**
 * Genera un header `x-signature` válido para un dataId, requestId y timestamp dados.
 * Usar SOLO en tests y en el MockMercadoPago — NUNCA en producción.
 *
 * Refleja el manifest correcto de MP:
 *   id:[data.id];request-id:[x-request-id];ts:[ts];
 * con omisión condicional de segmentos ausentes.
 *
 * @param secret      El mismo secreto que usará el validador
 * @param dataId      Valor del query param ?data.id (null si ausente)
 * @param requestId   Valor del header `x-request-id` (null si ausente)
 * @param ts          Timestamp Unix en string (ej: "1704067200")
 */
export async function generateMpSignatureHeader(
  secret: string,
  dataId: string | null,
  requestId: string | null,
  ts: string
): Promise<string> {
  const signedMessage = buildMpSignedMessage(dataId, requestId, ts);
  const hash = await computeHmacSha256Hex(secret, signedMessage);
  return `ts=${ts},v1=${hash}`;
}

// ─── Tipos para Mock y tests ──────────────────────────────────────────────────

export interface MpPreapprovalResponse {
  id: string;
  status: MpPreapprovalStatus;
  date_created: string;
  next_payment_date?: string;
}

export interface MpPreapprovalPlanRequest {
  reason: string;
  auto_recurring: {
    frequency: number;
    frequency_type: string;
    transaction_amount: number;
    currency_id: string;
  };
  payer_email: string;
  back_url: string;
}

export interface MpPreapprovalPlanResponse {
  id: string;
  init_point: string;
}

// ─── Extracción del event_id del body del webhook ────────────────────────────

export interface MpWebhookBody {
  id?: string | number;
  type?: string;
  action?: string;
  data?: {
    id?: string;
  };
}

/**
 * Extrae el event_id del body de un webhook de MP.
 * Refleja exactamente la lógica de las Edge Functions:
 *   body.id?.toString() ?? body.data?.id?.toString()
 */
export function extractMpEventId(body: MpWebhookBody): string | null {
  return body.id?.toString() ?? body.data?.id?.toString() ?? null;
}
