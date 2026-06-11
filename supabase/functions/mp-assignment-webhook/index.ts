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

serve(async (req) => {
  if (req.method !== "POST") return new Response("ok", { status: 200 });

  const body = (await req.json()) as MpWebhookBody;
  const eventId = body.id?.toString() ?? body.data?.id?.toString();
  if (!eventId) return new Response("ok", { status: 200 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Idempotency
  const { data: existing } = await supabase
    .from("processed_events")
    .select("id")
    .eq("event_id", eventId)
    .eq("provider", "mercadopago_assignment")
    .single();

  if (existing) return new Response("ok", { status: 200 });

  await supabase.from("processed_events").insert({
    event_id: eventId,
    provider: "mercadopago_assignment",
    event_type: body.type ?? body.action ?? null,
    payload: body as Record<string, unknown>,
  });

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
  const { data: payment } = await supabase
    .from("payments")
    .select("id, payer_id, payee_id, metadata")
    .eq("provider_payment_id", preapprovalId)
    .eq("status", "pending")
    .single();

  if (!payment) return new Response("ok", { status: 200 });

  // Mark payment completed
  await supabase
    .from("payments")
    .update({ status: "completed", updated_at: new Date().toISOString() })
    .eq("id", payment.id);

  const packageId = (payment.metadata as { package_id?: string })?.package_id;

  // Create assignment (DB trigger automatically handles billing_model upgrade at 4th active student)
  await supabase.from("coach_assignments").insert({
    coach_id: payment.payee_id,
    student_id: payment.payer_id,
    package_id: packageId ?? null,
    status: "active",
    started_at: new Date().toISOString(),
  });

  // Notify student
  await supabase.from("notifications").insert({
    user_id: payment.payer_id,
    type: "coach_assignment_active",
    title: "¡Tu coach te aceptó!",
    body: "Ya podés ver tu rutina y empezar a entrenar.",
    metadata: { coach_id: payment.payee_id },
  });

  // Audit log
  await supabase.from("audit_log").insert({
    actor_id: null,
    action: "coach_assignment_created",
    entity_type: "coach_assignment",
    entity_id: payment.payee_id,
    metadata: {
      student_id: payment.payer_id,
      package_id: packageId,
      payment_id: payment.id,
    },
  });

  return new Response("ok", { status: 200 });
});
