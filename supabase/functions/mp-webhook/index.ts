import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface MpPreapproval {
  id: string;
  status: string;
  date_created: string;
  next_payment_date?: string;
  /**
   * ID del preapproval_plan al que pertenece este preapproval.
   * Presente en GET /preapproval/{id}. Se usa para hacer el matching contra
   * subscriptions.gateway_subscription_id (que al alta guarda el plan id).
   */
  preapproval_plan_id?: string;
}

interface MpWebhookBody {
  id?: string | number;
  type?: string;
  action?: string;
  data?: {
    id?: string;
  };
}

/**
 * Validates the Mercado Pago webhook HMAC-SHA256 signature.
 *
 * MP sends:
 *   x-signature:   ts=TIMESTAMP,v1=HASH
 *   x-request-id:  REQUEST_ID
 *   URL query:     ?data.id=PAYMENT_ID
 *
 * Correct manifest (official MP docs):
 *   id:[data.id];request-id:[x-request-id];ts:[ts];
 * where:
 *   - data.id    = query param ?data.id from the webhook URL (NOT from body). Lowercased.
 *   - request-id = header x-request-id
 *   - ts         = extracted from x-signature header (ts=...)
 *   - Segments with absent values are OMITTED from the template.
 *   - Order is EXACTLY: id, request-id, ts
 *
 * Returns true if the signature is valid, false otherwise.
 * Throws if the secret is missing (caller must return 500).
 */
async function validateMpSignature(req: Request): Promise<boolean> {
  const secret = Deno.env.get("MP_WEBHOOK_SECRET");
  if (!secret) {
    // Fail loudly — missing secret is a configuration error, not a caller error.
    throw new Error("MP_WEBHOOK_SECRET is not configured");
  }

  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id");

  if (!xSignature) {
    return false;
  }

  // Parse ts and v1 from the header value `ts=...,v1=...`
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

  if (!ts || !v1) {
    return false;
  }

  // Extract data.id from the webhook URL query param (NOT from body)
  const dataId = new URL(req.url).searchParams.get("data.id");

  // Build the signed message per MP spec: id, request-id, ts — omit absent segments
  let signedMessage = "";
  if (dataId != null) {
    signedMessage += `id:${dataId.toLowerCase()};`;
  }
  if (xRequestId != null) {
    signedMessage += `request-id:${xRequestId};`;
  }
  signedMessage += `ts:${ts};`;

  // Import the secret as a CryptoKey for HMAC-SHA256
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  // Compute the expected HMAC
  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    keyMaterial,
    encoder.encode(signedMessage),
  );

  // Encode as lowercase hex
  const expectedHash = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison to prevent timing attacks
  if (expectedHash.length !== v1.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < expectedHash.length; i++) {
    diff |= expectedHash.charCodeAt(i) ^ v1.charCodeAt(i);
  }
  return diff === 0;
}

serve(async (req) => {
  if (req.method !== "POST") return new Response("ok", { status: 200 });

  // --- Signature validation (must happen before body is consumed) ---
  let signatureValid: boolean;
  try {
    signatureValid = await validateMpSignature(req.clone());
  } catch (err) {
    // Missing secret — configuration error, fail loudly
    console.error("[mp-webhook] FATAL: signature validation setup failed:", (err as Error).message);
    return new Response("Internal configuration error", { status: 500 });
  }

  if (!signatureValid) {
    console.warn("[mp-webhook] Rejected request: invalid or missing x-signature");
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await req.json()) as MpWebhookBody;
  const eventId =
    body.id?.toString() ?? body.data?.id?.toString();

  if (!eventId) return new Response("ok", { status: 200 });

  // Idempotency: check if already processed
  // Columnas reales de processed_events: event_id, gateway (no provider/event_type/payload)
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    SUPABASE_SERVICE_KEY
  );

  // Idempotency — INSERT with ON CONFLICT to atomically guard against duplicate events.
  // The unique constraint on processed_events.event_id makes this race-free.
  const { error: insertError } = await supabase
    .from("processed_events")
    .insert({ event_id: eventId, gateway: "mercadopago" });

  if (insertError) {
    // Unique constraint violation means already processed — idempotent skip
    if (insertError.code === "23505") {
      return new Response("ok", { status: 200 });
    }
    console.error("[mp-webhook] processed_events insert error:", insertError);
    return new Response("Internal error", { status: 500 });
  }

  // Handle preapproval / subscription_preapproval events.
  //
  // MP usa dos nombres de tipo para el ciclo de vida de suscripciones:
  //   - "preapproval"              (legacy / algunos entornos)
  //   - "subscription_preapproval" (actual — ciclo de vida de la suscripción)
  // Ambos se procesan con la misma lógica.
  if (
    body.type === "preapproval" ||
    body.type === "subscription_preapproval" ||
    body.action?.startsWith("preapproval")
  ) {
    const preapprovalId = body.data?.id;
    if (!preapprovalId) return new Response("ok", { status: 200 });

    // Fetch preapproval from MP.
    // El objeto incluye preapproval_plan_id → id del plan guardado al alta.
    const mpRes = await fetch(
      `https://api.mercadopago.com/preapproval/${preapprovalId}`,
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("MP_ACCESS_TOKEN")}`,
        },
      }
    );
    const preapproval = (await mpRes.json()) as MpPreapproval;

    // Map MP status to our enum values
    // subscription_status enum: 'active' | 'past_due' | 'canceled' | 'trialing'
    const statusMap: Record<string, string> = {
      authorized: "active",
      paused: "past_due",
      cancelled: "canceled",
      pending: "trialing",
    };
    const newStatus = statusMap[preapproval.status] ?? "trialing";

    const periodEnd =
      preapproval.next_payment_date ??
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // When MP status is 'cancelled', record the cancellation timestamp.
    // The entitlement remains active until current_period_end (access-until-end-of-cycle rule).
    // check-entitlements must check canceled_at + current_period_end, not only status.
    const now = new Date().toISOString();
    const canceledAt = preapproval.status === "cancelled" ? now : null;

    // ── Matching robusto ──────────────────────────────────────────────────────
    //
    // Al crear la suscripción (mp-create-preapproval) guardamos el plan id como
    // gateway_subscription_id. MP luego crea un preapproval (id distinto) y
    // notifica con ese preapproval id. El objeto del preapproval incluye
    // preapproval_plan_id que apunta al plan original.
    //
    // Paso 1: intentar match por plan id. Si hay match, promover
    //   gateway_subscription_id al preapproval id real (futuras notificaciones
    //   ya matchearán por preapproval id directamente).
    // Paso 2: si no hubo match (suscripción ya promovida), actualizar por
    //   preapproval id.
    //
    let matchedByPlanId = false;

    if (preapproval.preapproval_plan_id) {
      const { data: updatedRows } = await supabase
        .from("subscriptions")
        .update({
          status: newStatus,
          current_period_start: preapproval.date_created,
          current_period_end: periodEnd,
          canceled_at: canceledAt,
          // Promover el gateway_subscription_id al preapproval id real
          // para que los eventos futuros ya matcheen sin necesidad del plan id.
          gateway_subscription_id: preapprovalId,
        })
        .eq("gateway_subscription_id", preapproval.preapproval_plan_id)
        .select("id");

      matchedByPlanId = Array.isArray(updatedRows) && updatedRows.length > 0;
    }

    if (!matchedByPlanId) {
      // Fallback: la suscripción ya fue promovida al preapproval id en un
      // evento anterior, o el plan id no vino en el payload.
      await supabase
        .from("subscriptions")
        .update({
          status: newStatus,
          current_period_start: preapproval.date_created,
          current_period_end: periodEnd,
          canceled_at: canceledAt,
        })
        .eq("gateway_subscription_id", preapprovalId);
    }

    // Audit log — columna 'payload' (no metadata)
    await supabase.from("audit_log").insert({
      actor_id: null,
      action: `mp_preapproval_${preapproval.status}`,
      entity_type: "subscription",
      entity_id: null,
      payload: {
        event_id: eventId,
        mp_status: preapproval.status,
        preapproval_id: preapprovalId,
        preapproval_plan_id: preapproval.preapproval_plan_id ?? null,
        matched_by: matchedByPlanId ? "plan_id" : "preapproval_id",
      },
    });
  }

  return new Response("ok", { status: 200 });
});
