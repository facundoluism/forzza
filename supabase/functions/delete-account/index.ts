import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CoachProfileJoin {
  user_id: string; // references users.id — para notificar al coach
  display_name: string;
}

interface CoachAssignmentRow {
  id: string;
  coach_id: string; // references coach_profiles.id
  // Supabase devuelve relaciones FK como array en el tipo inferido
  coach_profiles: CoachProfileJoin[];
}

// Helper: obtiene el primer elemento de la relación (o null si vacía)
function firstJoin(arr: CoachProfileJoin[]): CoachProfileJoin | null {
  return arr.length > 0 ? arr[0] : null;
}

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

  // ── Autenticación: el usuario debe enviar su JWT ──────────────────────────
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Cliente con el JWT del usuario (respeta RLS)
  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const userId = user.id;

  // Cliente con service_role para efectos de escritura (bypasea RLS)
  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // ── Idempotencia: si deleted_at ya está seteado, responder 200 sin re-ejecutar ─
  const { data: existingUser } = await adminClient
    .from("users")
    .select("deleted_at")
    .eq("id", userId)
    .single();

  if (existingUser?.deleted_at) {
    // Ya procesado. Buscar la entrada en deletion_queue para devolver anonymize_at.
    const { data: queueRow } = await adminClient
      .from("deletion_queue")
      .select("anonymize_at")
      .eq("user_id", userId)
      .single();

    return new Response(
      JSON.stringify({
        status: "deletion_scheduled",
        anonymize_at: queueRow?.anonymize_at ?? null,
      }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  const now = new Date().toISOString();

  // ── 1. Cancelar suscripciones activas/trialing del usuario ───────────────
  await adminClient
    .from("subscriptions")
    .update({ status: "canceled", canceled_at: now, updated_at: now })
    .eq("user_id", userId)
    .in("status", ["active", "trialing", "past_due"]);

  // ── 2. Cerrar assignments activos como alumno + notificar coaches ─────────
  const { data: activeAssignments } = await adminClient
    .from("coach_assignments")
    .select(
      "id, coach_id, coach_profiles(user_id, display_name)"
    )
    .eq("student_id", userId)
    .in("status", ["pending", "active"]);

  if (activeAssignments && activeAssignments.length > 0) {
    // Cast through unknown: el tipo inferido por el cliente genérico es
    // incompatible con nuestro interface; la estructura en runtime es la misma.
    const typedAssignments = activeAssignments as unknown as CoachAssignmentRow[];

    const assignmentIds = typedAssignments.map((a) => a.id);

    // Cerrar los assignments
    await adminClient
      .from("coach_assignments")
      .update({ status: "canceled", ended_at: now, updated_at: now })
      .in("id", assignmentIds);

    // Notificar a cada coach afectado (in-app)
    const notificationsToInsert = typedAssignments
      .map((a) => ({ assignment: a, profile: firstJoin(a.coach_profiles) }))
      .filter(({ profile }) => profile !== null)
      .map(({ assignment, profile }) => ({
        user_id: profile!.user_id,
        type: "N_STUDENT_ACCOUNT_DELETED",
        title: "Un alumno eliminó su cuenta",
        body: "Un alumno que tenías asignado ha eliminado su cuenta de Forzza. El seguimiento fue cerrado automáticamente.",
        data: {
          assignment_id: assignment.id,
          // No incluimos el ID del estudiante: evitar exponer PII
          // de una cuenta ya dada de baja.
        },
      }));

    if (notificationsToInsert.length > 0) {
      await adminClient.from("notifications").insert(notificationsToInsert);
    }
  }

  // ── 3. Soft delete: marcar users.deleted_at ───────────────────────────────
  await adminClient
    .from("users")
    .update({ deleted_at: now, updated_at: now })
    .eq("id", userId);

  // ── 4. Encolar anonimización (30 días desde ahora) ────────────────────────
  const anonymizeAt = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  await adminClient.from("deletion_queue").upsert(
    {
      user_id: userId,
      requested_at: now,
      anonymize_at: anonymizeAt,
      processed_at: null,
    },
    { onConflict: "user_id", ignoreDuplicates: false }
  );

  // ── 5. Audit log (append-only — solo INSERT) ──────────────────────────────
  // No loguear PII: sin email, sin nombre, sin datos fiscales.
  await adminClient.from("audit_log").insert({
    actor_id: userId,
    action: "account_deletion_requested",
    entity_type: "user",
    entity_id: userId,
    payload: {
      requested_at: now,
      anonymize_at: anonymizeAt,
      active_assignments_closed: (activeAssignments ?? []).length,
    },
  });

  return new Response(
    JSON.stringify({
      status: "deletion_scheduled",
      anonymize_at: anonymizeAt,
    }),
    {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    }
  );
});
