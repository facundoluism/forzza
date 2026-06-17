import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface MpPreapproval {
  id: string;
  status: string;
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
    console.error("[mp-assignment-webhook] FATAL: signature validation setup failed:", (err as Error).message);
    return new Response("Internal configuration error", { status: 500 });
  }

  if (!signatureValid) {
    console.warn("[mp-assignment-webhook] Rejected request: invalid or missing x-signature");
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await req.json()) as MpWebhookBody;
  const eventId = body.id?.toString() ?? body.data?.id?.toString();
  if (!eventId) return new Response("ok", { status: 200 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Idempotency — INSERT with ON CONFLICT to atomically guard against duplicate events.
  // If the event_id already exists, the INSERT is a no-op and we return early.
  // This avoids the SELECT+INSERT race condition.
  const { error: insertError } = await supabase
    .from("processed_events")
    .insert({ event_id: eventId, gateway: "mercadopago_assignment" });

  if (insertError) {
    // Unique constraint violation means already processed — idempotent skip
    if (insertError.code === "23505") {
      return new Response("ok", { status: 200 });
    }
    // Unexpected error — log and fail
    console.error("[mp-assignment-webhook] processed_events insert error:", insertError);
    return new Response("Internal error", { status: 500 });
  }

  if (
    body.type !== "preapproval" &&
    !body.action?.startsWith("preapproval")
  ) {
    return new Response("ok", { status: 200 });
  }

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

  if (preapproval.status !== "authorized")
    return new Response("ok", { status: 200 });

  // Find pending payment
  // Columnas reales: user_id (payer), coach_id (payee), gateway_payment_id (no provider_payment_id)
  const { data: payment } = await supabase
    .from("payments")
    .select("id, user_id, coach_id, metadata")
    .eq("gateway_payment_id", preapprovalId)
    .eq("status", "pending")
    .single();

  if (!payment) return new Response("ok", { status: 200 });

  // Mark payment approved
  await supabase
    .from("payments")
    .update({ status: "approved" })
    .eq("id", payment.id);

  const packageId = (payment.metadata as { package_id?: string } | null)?.package_id;

  // package_id is NOT NULL in DB — guard before inserting.
  // If missing, the user paid but we can't create the assignment: log to Sentry and bail.
  if (!packageId) {
    console.error(
      "[mp-assignment-webhook] CRITICAL: payment.metadata.package_id is missing for payment",
      payment.id,
      "— assignment not created. Manual remediation required."
    );
    return new Response("ok", { status: 200 });
  }

  // Create assignment (DB trigger automatically handles billing_model upgrade at 4th active student)
  const { error: assignmentError } = await supabase.from("coach_assignments").insert({
    coach_id: payment.coach_id,
    student_id: payment.user_id,
    package_id: packageId,
    status: "active",
    started_at: new Date().toISOString(),
  });

  if (assignmentError) {
    console.error(
      "[mp-assignment-webhook] coach_assignments insert failed:",
      assignmentError.code,
      assignmentError.message,
      "payment_id:", payment.id
    );
    return new Response("ok", { status: 200 });
  }

  // Notify student — columna 'data' (no metadata) en notifications
  await supabase.from("notifications").insert({
    user_id: payment.user_id,
    type: "coach_assignment_active",
    title: "Tu coach te aceptó",
    body: "Ya podés ver tu rutina y empezar a entrenar.",
    data: { coach_id: payment.coach_id },
  });

  // Audit log — columna 'payload' (no metadata)
  await supabase.from("audit_log").insert({
    actor_id: null,
    action: "coach_assignment_created",
    entity_type: "coach_assignment",
    entity_id: payment.coach_id,
    payload: {
      student_id: payment.user_id,
      package_id: packageId,
      payment_id: payment.id,
    },
  });

  return new Response("ok", { status: 200 });
});
