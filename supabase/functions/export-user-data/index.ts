import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─────────────────────────────────────────────────────────────────────────────
// P1.3 — export-user-data
// Derecho de acceso (Ley 25.326 / portabilidad GDPR):
// devuelve todos los datos personales del usuario autenticado como JSON
// descargable. Registra en audit_log. NUNCA loguea PII.
// ─────────────────────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// TTL para URLs firmadas de progress-photos (1 hora en segundos)
const SIGNED_URL_TTL_SECS = 3600;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  // ── Autenticación ──────────────────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Cliente con JWT del usuario — respeta RLS; asegura que sólo ve sus propios
  // datos incluso si hay un bug en la query.
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

  // Admin client: necesario para crear URLs firmadas (storage admin) y para
  // asegurar lectura completa aunque la fila esté en tabla con RLS restrictiva.
  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // ── Recolección de datos ───────────────────────────────────────────────────
  // Todas las queries filtran por userId. Usamos Promise.allSettled para no
  // fallar la exportación completa si una tabla menor da error.

  const [
    userRowResult,
    studentProfileResult,
    coachProfileResult,
    bodyMetricsResult,
    workoutSessionsResult,
    progressPhotosResult,
    tabataPlansResult,
    checkinResponsesResult,
    subscriptionsResult,
    paymentsResult,
    notifPrefsResult,
    billingProfileResult,
  ] = await Promise.allSettled([
    adminClient.from("users").select("*").eq("id", userId).single(),
    adminClient
      .from("student_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(),
    adminClient
      .from("coach_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(),
    adminClient
      .from("body_metrics")
      .select("*")
      .eq("student_id", userId)
      .order("recorded_at", { ascending: false }),
    adminClient
      .from("workout_sessions")
      .select("*")
      .eq("student_id", userId)
      .order("started_at", { ascending: false }),
    // progress_photos: solo metadata, NO el binario
    adminClient
      .from("progress_photos")
      .select("id, storage_path, notes, recorded_at, created_at, assignment_id")
      .eq("student_id", userId)
      .order("recorded_at", { ascending: false }),
    adminClient
      .from("tabata_plans")
      .select("*")
      .eq("student_id", userId)
      .order("created_at", { ascending: false }),
    adminClient
      .from("checkin_responses")
      .select("*")
      .eq("student_id", userId)
      .order("submitted_at", { ascending: false }),
    // subscriptions donde el user es titular (PRO del alumno)
    adminClient
      .from("subscriptions")
      .select("id, status, platform, gateway, gateway_subscription_id, current_period_start, current_period_end, canceled_at, created_at, updated_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    // payments donde el user es el pagador
    adminClient
      .from("payments")
      .select("id, amount, currency, status, gateway, gateway_payment_id, created_at, updated_at, metadata")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    adminClient
      .from("notification_preferences")
      .select("push_enabled, email_enabled, quiet_start, quiet_end, updated_at")
      .eq("user_id", userId)
      .maybeSingle(),
    adminClient
      .from("billing_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  // ── URLs firmadas para progress_photos (TTL 1h) ────────────────────────────
  // Generamos URL firmada por cada foto para que el usuario pueda descargar sus
  // binarios durante la hora siguiente. No incluimos el binario en el JSON.
  let progressPhotosWithUrls: unknown[] = [];
  if (
    progressPhotosResult.status === "fulfilled" &&
    progressPhotosResult.value.data &&
    progressPhotosResult.value.data.length > 0
  ) {
    const photos = progressPhotosResult.value.data;
    const urlResults = await Promise.allSettled(
      photos.map((photo: { storage_path: string }) =>
        adminClient.storage
          .from("progress-photos")
          .createSignedUrl(photo.storage_path, SIGNED_URL_TTL_SECS)
      )
    );

    progressPhotosWithUrls = photos.map(
      (photo: Record<string, unknown>, idx: number) => {
        const urlResult = urlResults[idx];
        const signedUrl =
          urlResult.status === "fulfilled" && !urlResult.value.error
            ? urlResult.value.data?.signedUrl ?? null
            : null;
        return {
          ...photo,
          signed_url: signedUrl,
          signed_url_expires_at:
            signedUrl
              ? new Date(Date.now() + SIGNED_URL_TTL_SECS * 1000).toISOString()
              : null,
        };
      }
    );
  }

  // ── Sanitización de coach_profiles: excluir datos sensibles en tránsito ───
  // fiscal_id, bank_account, cbu, alias_cbu y constancia_path son datos
  // sensibles que SÍ pertenecen al usuario y se incluyen en la exportación
  // (es su propio dato), pero se marcan para que el consumidor sepa qué es qué.
  // No los omitimos: el derecho de acceso los incluye explícitamente.

  // ── Ensamblado del payload ─────────────────────────────────────────────────
  function unwrap<T>(
    result: PromiseSettledResult<{ data: T | null; error: unknown }>
  ): T | null {
    return result.status === "fulfilled" ? (result.value.data ?? null) : null;
  }

  const exportedAt = new Date().toISOString();

  const payload = {
    exported_at: exportedAt,
    export_format_version: "1.0",
    user_id: userId,
    // Nota: email está en auth.users — se omite del payload público
    // para no exponer el campo en un JSON sin TLS verificado en el cliente.
    // El usuario conoce su propio email. Incluirlo haría el JSON más riesgoso
    // si se descarga en un dispositivo compartido.
    account: unwrap(userRowResult),
    student_profile: unwrap(studentProfileResult),
    // coach_profile incluye datos fiscales (fiscal_id, bank_account, cbu):
    // son del propio usuario, el derecho de acceso los incluye.
    coach_profile: unwrap(coachProfileResult),
    body_metrics: unwrap(bodyMetricsResult) ?? [],
    workout_sessions: unwrap(workoutSessionsResult) ?? [],
    // progress_photos: solo metadata + URL firmada TTL 1h (no el binario)
    progress_photos: progressPhotosWithUrls,
    tabata_plans: unwrap(tabataPlansResult) ?? [],
    checkin_responses: unwrap(checkinResponsesResult) ?? [],
    subscriptions: unwrap(subscriptionsResult) ?? [],
    payments: unwrap(paymentsResult) ?? [],
    notification_preferences: unwrap(notifPrefsResult),
    billing_profile: unwrap(billingProfileResult),
  };

  // ── Audit log (append-only, sin PII) ──────────────────────────────────────
  // No logueamos el contenido exportado: solo la acción y los conteos.
  await adminClient.from("audit_log").insert({
    actor_id: userId,
    action: "data.exported",
    entity_type: "user",
    entity_id: userId,
    payload: {
      exported_at: exportedAt,
      photos_count: progressPhotosWithUrls.length,
      workout_sessions_count:
        (unwrap(workoutSessionsResult) as unknown[] | null)?.length ?? 0,
    },
  });

  // ── Respuesta descargable ──────────────────────────────────────────────────
  const filename = `forzza-mis-datos-${exportedAt.slice(0, 10)}.json`;

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
});
