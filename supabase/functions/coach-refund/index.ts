import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405 });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader)
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });

  const { assignment_id } = (await req.json()) as { assignment_id: string };

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });

  // Fetch assignment
  const { data: assignment } = await supabase
    .from("coach_assignments")
    .select("id, coach_id, student_id, started_at, status")
    .eq("id", assignment_id)
    .single();

  if (!assignment)
    return new Response(JSON.stringify({ error: "assignment_not_found" }), {
      status: 404,
    });

  // Only student or coach can refund their own assignment
  if (assignment.student_id !== user.id && assignment.coach_id !== user.id) {
    return new Response(JSON.stringify({ error: "forbidden" }), {
      status: 403,
    });
  }

  // Check 72h window
  const startedAt = new Date(assignment.started_at!).getTime();
  const hoursSinceStart = (Date.now() - startedAt) / (1000 * 60 * 60);
  if (hoursSinceStart > 72) {
    return new Response(
      JSON.stringify({
        error: "refund_window_expired",
        hours_elapsed: Math.round(hoursSinceStart),
      }),
      { status: 400 }
    );
  }

  if (assignment.status !== "active") {
    return new Response(
      JSON.stringify({ error: "assignment_not_active" }),
      { status: 400 }
    );
  }

  // Use service role for writes
  const adminSupabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Cancel assignment — 'canceled' es el valor del enum (no 'cancelled')
  await adminSupabase
    .from("coach_assignments")
    .update({
      status: "canceled",
      ended_at: new Date().toISOString(),
    })
    .eq("id", assignment_id);

  // Find payment and mark as refunded
  // Columnas reales: user_id (payer), coach_id (payee), gateway_payment_id (no provider_payment_id)
  // status 'approved' es el equivalente a "completado" según el enum payment_status
  const { data: payment } = await adminSupabase
    .from("payments")
    .select("id, gateway_payment_id")
    .eq("user_id", assignment.student_id)
    .eq("coach_id", assignment.coach_id)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (payment) {
    await adminSupabase
      .from("payments")
      .update({ status: "refunded" })
      .eq("id", payment.id);

    // TODO: call MP API to actually issue refund when MP access token is configured
    // await fetch(`https://api.mercadopago.com/v1/payments/${payment.gateway_payment_id}/refunds`, { method: 'POST', ... })
  }

  // Notify both parties — columna 'data' (no metadata) en notifications
  await adminSupabase.from("notifications").insert([
    {
      user_id: assignment.student_id,
      type: "refund_processed",
      title: "Reembolso procesado",
      body: "Tu solicitud de reembolso fue aceptada. El dinero volverá en 5-10 días hábiles.",
      data: { assignment_id },
    },
    {
      user_id: assignment.coach_id,
      type: "assignment_cancelled",
      title: "Contratación cancelada",
      body: "Un alumno/a canceló la contratación dentro de las 72 horas. Se procesó el reembolso.",
      data: { assignment_id },
    },
  ]);

  // Audit log — columna 'payload' (no metadata) en audit_log
  await adminSupabase.from("audit_log").insert({
    actor_id: user.id,
    action: "refund_issued",
    entity_type: "coach_assignment",
    entity_id: assignment_id,
    payload: {
      payment_id: payment?.id,
      hours_elapsed: Math.round(hoursSinceStart),
    },
  });

  return new Response(
    JSON.stringify({ success: true, refund_payment_id: payment?.id }),
    { headers: { "Content-Type": "application/json" } }
  );
});
