import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface MpPreapproval {
  id: string;
  status: string;
  date_created: string;
  next_payment_date?: string;
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
 *
 * The signed message is exactly: `id:REQUEST_ID;ts:TIMESTAMP;`
 * The key is the raw MP_WEBHOOK_SECRET string.
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

  if (!xSignature || !xRequestId) {
    return false;
  }

  // Parse ts and v1 from the header value `ts=...,v1=...`
  let ts: string | null = null;
  let v1: string | null = null;
  for (const part of xSignature.split(",")) {
    const [key, value] = part.split("=");
    if (key === "ts") ts = value ?? null;
    if (key === "v1") v1 = value ?? null;
  }

  if (!ts || !v1) {
    return false;
  }

  // Build the signed message exactly as MP specifies it
  const signedMessage = `id:${xRequestId};ts:${ts};`;

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
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    SUPABASE_SERVICE_KEY
  );

  const { data: existing } = await supabase
    .from("processed_events")
    .select("id")
    .eq("event_id", eventId)
    .eq("provider", "mercadopago")
    .single();

  if (existing) return new Response("ok", { status: 200 }); // already processed

  // Mark as processing (idempotency record first)
  await supabase.from("processed_events").insert({
    event_id: eventId,
    provider: "mercadopago",
    event_type: body.type ?? body.action ?? null,
    payload: body as Record<string, unknown>,
  });

  // Handle preapproval events
  if (
    body.type === "preapproval" ||
    body.action?.startsWith("preapproval")
  ) {
    const preapprovalId = body.data?.id;
    if (!preapprovalId) return new Response("ok", { status: 200 });

    // Fetch preapproval from MP
    const mpRes = await fetch(
      `https://api.mercadopago.com/preapproval/${preapprovalId}`,
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("MP_ACCESS_TOKEN")}`,
        },
      }
    );
    const preapproval = (await mpRes.json()) as MpPreapproval;

    // Map MP status to our status
    const statusMap: Record<string, string> = {
      authorized: "active",
      paused: "suspended",
      cancelled: "cancelled",
      pending: "pending",
    };
    const newStatus = statusMap[preapproval.status] ?? "pending";

    // Update subscription
    await supabase
      .from("subscriptions")
      .update({
        status: newStatus,
        started_at: preapproval.date_created,
        expires_at:
          preapproval.next_payment_date ??
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("provider_subscription_id", preapprovalId);

    // Audit log
    await supabase.from("audit_log").insert({
      actor_id: null,
      action: `mp_preapproval_${preapproval.status}`,
      entity_type: "subscription",
      entity_id: preapprovalId,
      metadata: { event_id: eventId, mp_status: preapproval.status },
    });
  }

  return new Response("ok", { status: 200 });
});
