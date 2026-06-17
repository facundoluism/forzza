import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  let assignment_id: string | undefined;
  try {
    const body = (await req.json()) as { assignment_id?: string };
    assignment_id = body.assignment_id;
  } catch {
    return new Response(JSON.stringify({ error: "invalid_body" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  if (!assignment_id) {
    return new Response(
      JSON.stringify({ error: "assignment_id is required" }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }

  // Authenticate with user's token (RLS enforced)
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Fetch assignment — verify ownership (student only can cancel their own plan)
  const { data: assignment } = await supabase
    .from("coach_assignments")
    .select("id, student_id, coach_id, package_id, status, payment_id")
    .eq("id", assignment_id)
    .single();

  if (!assignment) {
    return new Response(JSON.stringify({ error: "assignment_not_found" }), {
      status: 404,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Only the student who owns the assignment can cancel it
  if (assignment.student_id !== user.id) {
    return new Response(JSON.stringify({ error: "forbidden" }), {
      status: 403,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Idempotency: if already canceled, return 200 without re-executing
  if (assignment.status === "canceled") {
    return new Response(
      JSON.stringify({ success: true, already_canceled: true }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }

  if (assignment.status !== "active") {
    return new Response(
      JSON.stringify({ error: "assignment_not_active", status: assignment.status }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }

  // Use service role for all writes
  const adminSupabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Fetch the associated payment to get the MP preapproval id.
  // gateway_payment_id holds the preapproval id set at checkout (mp-create-preapproval).
  let mpPreapprovalId: string | null = null;
  if (assignment.payment_id) {
    const { data: payment } = await adminSupabase
      .from("payments")
      .select("id, gateway_payment_id, gateway")
      .eq("id", assignment.payment_id)
      .single();

    if (payment?.gateway === "mercadopago") {
      mpPreapprovalId = payment.gateway_payment_id ?? null;
    }
  }

  // Cancel the preapproval in Mercado Pago (best-effort; log failure but proceed)
  let mpCancelError: string | null = null;
  if (mpPreapprovalId) {
    const mpAccessToken = Deno.env.get("MP_ACCESS_TOKEN");
    if (!mpAccessToken) {
      // HUMAN_REQUIRED: set MP_ACCESS_TOKEN in Supabase Edge Function secrets.
      // Without it, MP preapproval stays active but our DB will reflect canceled.
      console.error(
        "[cancel-coach-plan] HUMAN_REQUIRED: MP_ACCESS_TOKEN is not set. " +
          "Preapproval was NOT canceled in MP. Manually cancel preapproval: " +
          mpPreapprovalId,
      );
      mpCancelError = "MP_ACCESS_TOKEN_MISSING";
    } else {
      const mpRes = await fetch(
        `https://api.mercadopago.com/preapproval/${mpPreapprovalId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${mpAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "cancelled" }),
        },
      );

      if (!mpRes.ok) {
        // Non-blocking: log the error and continue with DB update.
        // MP may already have cancelled it, or the preapproval may not exist.
        const errBody = await mpRes.text();
        console.error(
          `[cancel-coach-plan] MP cancel preapproval ${mpPreapprovalId} failed: ` +
            `HTTP ${mpRes.status} — ${errBody}`,
        );
        mpCancelError = `MP_HTTP_${mpRes.status}`;
      }
    }
  }

  const now = new Date().toISOString();

  // Mark assignment as canceled.
  // Access rule: "acceso hasta fin de ciclo" — ended_at is set to now for record-keeping,
  // but the frontend must check current_period_end of the associated payment/subscription
  // before blocking chat access. The chat becomes read-only upon cancellation (status=canceled).
  const { error: updateError } = await adminSupabase
    .from("coach_assignments")
    .update({
      status: "canceled",
      ended_at: now,
      updated_at: now,
    })
    .eq("id", assignment_id);

  if (updateError) {
    console.error(
      "[cancel-coach-plan] Failed to update assignment:",
      updateError,
    );
    return new Response(
      JSON.stringify({ error: "internal_error", detail: updateError.message }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }

  // Audit log — append-only, payload column (no metadata)
  await adminSupabase.from("audit_log").insert({
    actor_id: user.id,
    action: "coach_plan_canceled",
    entity_type: "coach_assignment",
    entity_id: assignment_id,
    payload: {
      student_id: user.id,
      coach_id: assignment.coach_id,
      package_id: assignment.package_id,
      payment_id: assignment.payment_id,
      mp_preapproval_id: mpPreapprovalId,
      mp_cancel_error: mpCancelError,
    },
  });

  // Notify student (confirmation) and coach (alert) — data column (not metadata)
  await adminSupabase.from("notifications").insert([
    {
      user_id: user.id,
      type: "coach_plan_canceled",
      title: "Plan con coach cancelado",
      body: "Tu plan con el coach fue cancelado. El acceso al chat queda en solo lectura.",
      data: { assignment_id },
    },
    {
      user_id: assignment.coach_id,
      type: "student_plan_canceled",
      title: "Un alumno canceló el plan",
      body: "Un alumno/a canceló su plan. El chat pasa a solo lectura.",
      data: { assignment_id, student_id: user.id },
    },
  ]);

  return new Response(
    JSON.stringify({
      success: true,
      mp_preapproval_canceled: mpCancelError === null && mpPreapprovalId !== null,
      mp_cancel_error: mpCancelError,
    }),
    {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    },
  );
});
