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

serve(async (req) => {
  if (req.method !== "POST") return new Response("ok", { status: 200 });

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
