import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---------------------------------------------------------------------------
// RevenueCat webhook handler
//
// RevenueCat sends a Bearer token in the Authorization header.
// Configure REVENUECAT_WEBHOOK_SECRET in Supabase Edge Function secrets.
// See: https://www.revenuecat.com/docs/webhooks
//
// HUMAN_REQUIRED: set REVENUECAT_WEBHOOK_SECRET in Supabase project secrets:
//   supabase secrets set REVENUECAT_WEBHOOK_SECRET=<your-secret>
//   Then configure the same secret in:
//   app.revenuecat.com → Project → Integrations → Webhooks → Authorization header
//
// Events handled:
//   INITIAL_PURCHASE → status='active', clear canceled_at
//   RENEWAL         → status='active', extend current_period_end, clear canceled_at
//   CANCELLATION    → canceled_at=now, status stays active until current_period_end
//   EXPIRATION      → status='canceled'
//   BILLING_ISSUE   → status='past_due'
//   UNCANCELLATION  → clear canceled_at, status='active'
// ---------------------------------------------------------------------------

interface RcEventData {
  // app_user_id is the Supabase user UUID we pass to RevenueCat as the alias.
  // RevenueCat docs: https://www.revenuecat.com/docs/user-ids
  app_user_id: string;
  product_id?: string;
  period_type?: string;
  // epoch seconds (number) or ISO string
  expiration_at_ms?: number;
  original_transaction_id?: string;
}

interface RcWebhookBody {
  event?: {
    id?: string;
    type?: string;
    app_user_id?: string;
    product_id?: string;
    period_type?: string;
    expiration_at_ms?: number;
    original_transaction_id?: string;
  };
}

/**
 * Validates the RevenueCat webhook authorization.
 * RC sends: Authorization: Bearer <REVENUECAT_WEBHOOK_SECRET>
 * Constant-time comparison to prevent timing attacks.
 */
function validateRcAuth(req: Request): void {
  const secret = Deno.env.get("REVENUECAT_WEBHOOK_SECRET");
  if (!secret) {
    // HUMAN_REQUIRED: set REVENUECAT_WEBHOOK_SECRET in Supabase Edge Function secrets.
    throw new Error("REVENUECAT_WEBHOOK_SECRET is not configured");
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const provided = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  // Constant-time comparison
  if (provided.length !== secret.length) {
    throw new AuthError("invalid_auth");
  }
  let diff = 0;
  for (let i = 0; i < secret.length; i++) {
    diff |= provided.charCodeAt(i) ^ secret.charCodeAt(i);
  }
  if (diff !== 0) {
    throw new AuthError("invalid_auth");
  }
}

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

// Map RC event types to our subscription_status enum and whether to set canceled_at
function mapRcEventToStatus(eventType: string): {
  status: string | null;
  setCanceledAt: boolean;
  clearCanceledAt: boolean;
} {
  switch (eventType) {
    case "INITIAL_PURCHASE":
    case "RENEWAL":
    case "UNCANCELLATION":
      return { status: "active", setCanceledAt: false, clearCanceledAt: true };
    case "CANCELLATION":
      // Entitlement remains active until current_period_end.
      // We mark canceled_at now but do NOT change status to 'canceled'.
      // The dunning-cron or expiration event will flip status when period ends.
      return { status: null, setCanceledAt: true, clearCanceledAt: false };
    case "EXPIRATION":
      return { status: "canceled", setCanceledAt: false, clearCanceledAt: false };
    case "BILLING_ISSUE":
      return { status: "past_due", setCanceledAt: false, clearCanceledAt: false };
    default:
      return { status: null, setCanceledAt: false, clearCanceledAt: false };
  }
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("ok", { status: 200 });
  }

  // --- Auth validation ---
  try {
    validateRcAuth(req);
  } catch (err) {
    if (err instanceof AuthError) {
      console.warn("[revenuecat-webhook] Rejected: invalid Authorization header");
      return new Response("Unauthorized", { status: 401 });
    }
    // Missing secret — configuration error
    console.error(
      "[revenuecat-webhook] FATAL: HUMAN_REQUIRED: REVENUECAT_WEBHOOK_SECRET is not set. " +
        "Configure it in Supabase secrets and in RevenueCat dashboard.",
    );
    return new Response("Internal configuration error", { status: 500 });
  }

  let body: RcWebhookBody;
  try {
    body = (await req.json()) as RcWebhookBody;
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const event = body.event;
  if (!event) return new Response("ok", { status: 200 });

  const eventId = event.id;
  const eventType = event.type;

  if (!eventId || !eventType) return new Response("ok", { status: 200 });

  const appUserId = event.app_user_id;
  if (!appUserId) return new Response("ok", { status: 200 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // --- Idempotency: INSERT with ON CONFLICT (unique constraint on event_id) ---
  const { error: insertError } = await supabase
    .from("processed_events")
    .insert({ event_id: eventId, gateway: "revenuecat" });

  if (insertError) {
    if (insertError.code === "23505") {
      // Already processed — idempotent skip
      return new Response("ok", { status: 200 });
    }
    console.error(
      "[revenuecat-webhook] processed_events insert error:",
      insertError,
    );
    return new Response("Internal error", { status: 500 });
  }

  // --- Map event to DB update ---
  const { status, setCanceledAt, clearCanceledAt } =
    mapRcEventToStatus(eventType);

  // Compute new current_period_end from expiration_at_ms (epoch ms)
  const newPeriodEnd =
    event.expiration_at_ms != null
      ? new Date(event.expiration_at_ms).toISOString()
      : null;

  const now = new Date().toISOString();

  // Build the update object dynamically (no nulls for unset fields)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFields: Record<string, any> = { updated_at: now };

  if (status !== null) {
    updateFields.status = status;
  }
  if (setCanceledAt) {
    updateFields.canceled_at = now;
  }
  if (clearCanceledAt) {
    updateFields.canceled_at = null;
  }
  if (newPeriodEnd !== null) {
    updateFields.current_period_end = newPeriodEnd;
    updateFields.current_period_start = now;
  }

  // Only update if there's something meaningful to change
  const hasUpdate = Object.keys(updateFields).length > 1; // more than just updated_at
  if (hasUpdate) {
    await supabase
      .from("subscriptions")
      .update(updateFields)
      .eq("user_id", appUserId)
      .in("gateway", ["revenuecat"]);
  }

  // --- Audit log ---
  await supabase.from("audit_log").insert({
    actor_id: null,
    action: `rc_${eventType.toLowerCase()}`,
    entity_type: "subscription",
    entity_id: null,
    payload: {
      event_id: eventId,
      event_type: eventType,
      app_user_id: appUserId,
      new_status: status,
      canceled_at_set: setCanceledAt,
      current_period_end: newPeriodEnd,
      product_id: event.product_id ?? null,
      original_transaction_id: event.original_transaction_id ?? null,
    },
  });

  return new Response("ok", { status: 200 });
});
