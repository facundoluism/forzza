import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─────────────────────────────────────────────────────────────────────────────
// P1.5 — submit-content-report
// Canal mínimo de reclamos/denuncias de contenido.
// El reporte se registra en audit_log (no se crea tabla nueva).
// Se notifica a todos los usuarios con role='owner' (in-app + email opcional).
//
// HUMAN_REQUIRED: configurar LEGAL_REPORTS_EMAIL en el dashboard de Supabase
// (env var de Edge Functions) con la casilla real, ej. legal@forzza.app.
// Sin esa variable, el email se omite silenciosamente sin error.
// ─────────────────────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Tipos de target aceptados
const VALID_TARGET_TYPES = [
  "coach_profile",
  "video",
  "message",
  "progress_photo",
  "routine",
  "workout_session",
] as const;
type TargetType = (typeof VALID_TARGET_TYPES)[number];

interface ReportPayload {
  target_type: string;
  target_id: string;
  reason: string;
  details?: string;
}

// ── Idempotencia simple: evitar doble insert del mismo reporte ────────────────
// Usamos SHA-256 del tuple (actor_id, target_type, target_id, reason) como
// idempotency_key en el payload. Si ya existe una fila con esa clave en
// audit_log en los últimos 5 minutos, respondemos 200 sin reinsertar.
// No es crítico (el enunciado lo marca como "razonable"), pero evita spam.
async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
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

  // ── Autenticación ──────────────────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

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

  // ── Parseo y validación del body ───────────────────────────────────────────
  let body: ReportPayload;
  try {
    body = (await req.json()) as ReportPayload;
  } catch {
    return new Response(JSON.stringify({ error: "invalid_body" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const { target_type, target_id, reason, details } = body;

  if (!target_type || !target_id || !reason) {
    return new Response(
      JSON.stringify({ error: "target_type, target_id y reason son requeridos" }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  if (!(VALID_TARGET_TYPES as readonly string[]).includes(target_type)) {
    return new Response(
      JSON.stringify({
        error: "target_type inválido",
        valid_types: VALID_TARGET_TYPES,
      }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  const typedTargetType = target_type as TargetType;
  const actorId = user.id;
  const now = new Date().toISOString();

  // ── Admin client para escrituras ───────────────────────────────────────────
  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // ── Idempotencia: detectar reporte duplicado en ventana de 5 minutos ───────
  // La key es SHA-256 de actor+target+reason, guardada en payload->idempotency_key.
  // Si ya existe en audit_log en los últimos 5 min, respondemos sin reinsertar.
  const idempotencyKey = await sha256Hex(
    `${actorId}:${typedTargetType}:${target_id}:${reason}`
  );
  const windowStart = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const { data: existingReport } = await adminClient
    .from("audit_log")
    .select("id, created_at")
    .eq("action", "content.reported")
    .eq("actor_id", actorId)
    .gte("created_at", windowStart)
    // Postgres JSONB: filtramos por el campo anidado
    .eq("payload->>idempotency_key", idempotencyKey)
    .maybeSingle();

  if (existingReport) {
    return new Response(
      JSON.stringify({
        status: "already_reported",
        report_id: existingReport.id,
        reported_at: existingReport.created_at,
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  // ── Registrar reporte en audit_log ────────────────────────────────────────
  // No creamos tabla nueva: el canal mínimo usa audit_log como registro.
  // entity_id espera UUID; target_id puede no ser UUID si es, ej., un path de
  // storage. Lo pasamos como null en entity_id y en payload para no perder info.
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      target_id
    );

  const { data: auditRow, error: auditError } = await adminClient
    .from("audit_log")
    .insert({
      actor_id: actorId,
      action: "content.reported",
      entity_type: typedTargetType,
      entity_id: isUuid ? target_id : null,
      payload: {
        target_id,
        reason,
        details: details ?? null,
        reported_at: now,
        idempotency_key: idempotencyKey,
      },
    })
    .select("id")
    .single();

  if (auditError) {
    console.error("[submit-content-report] audit_log insert error:", auditError.code);
    return new Response(
      JSON.stringify({ error: "internal_error" }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  const reportId = auditRow?.id;

  // ── Notificar a todos los owners ──────────────────────────────────────────
  // 1. Obtener user_ids de usuarios con role='owner'
  const { data: ownerRows } = await adminClient
    .from("users")
    .select("id")
    .eq("role", "owner")
    .is("deleted_at", null);

  if (ownerRows && ownerRows.length > 0) {
    // 2. Notificación in-app para cada owner
    // NO incluimos PII del reporter: solo el tipo de target y el motivo.
    const notificationsToInsert = ownerRows.map(
      (row: { id: string }) => ({
        user_id: row.id,
        type: "N_CONTENT_REPORTED",
        title: "Nueva denuncia de contenido",
        body: `Se reportó un ${typedTargetType}. Motivo: ${reason.slice(0, 100)}`,
        data: {
          report_id: reportId,
          target_type: typedTargetType,
          // No incluimos target_id ni actor_id en la notificación in-app
          // para evitar exponer IDs cruzados en el payload visible al owner
          // antes de que acceda al backoffice.
          reason: reason.slice(0, 200),
        },
      })
    );

    await adminClient.from("notifications").insert(notificationsToInsert);

    // 3. Email vía Resend a LEGAL_REPORTS_EMAIL (opcional — omitir si no está configurado)
    // HUMAN_REQUIRED: definir LEGAL_REPORTS_EMAIL en las env vars de Edge Functions
    // en el dashboard de Supabase con la casilla legal, ej. legal@forzza.app
    const legalEmail = Deno.env.get("LEGAL_REPORTS_EMAIL");
    const resendKey = Deno.env.get("RESEND_API_KEY");

    if (legalEmail && resendKey) {
      // No incluimos PII del denunciante en el email (solo IDs opacos y motivo)
      const emailBody = [
        `<h2>Nueva denuncia de contenido</h2>`,
        `<p><strong>ID del reporte:</strong> ${reportId}</p>`,
        `<p><strong>Tipo de contenido:</strong> ${typedTargetType}</p>`,
        `<p><strong>Motivo:</strong> ${reason}</p>`,
        details ? `<p><strong>Detalles:</strong> ${details}</p>` : "",
        `<p><strong>Fecha:</strong> ${now}</p>`,
        `<hr><p style="font-size:12px;color:#666;">No incluimos identificadores del denunciante en este email. Consultá el audit_log (ID: ${reportId}) para la trazabilidad completa.</p>`,
      ].join("\n");

      // Envío sin await ni throw: si Resend falla, el reporte ya está en
      // audit_log y las notificaciones in-app ya se insertaron.
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: Deno.env.get("RESEND_FROM_EMAIL") ?? "hola@forzza.app",
          to: legalEmail,
          subject: `[Forzza] Denuncia de contenido — ${typedTargetType}`,
          html: emailBody,
        }),
      }).catch((err: Error) => {
        // Log sin PII: solo el error de red/transporte
        console.error("[submit-content-report] Resend send failed:", err.message);
      });
    }
  }

  return new Response(
    JSON.stringify({
      status: "reported",
      report_id: reportId,
      reported_at: now,
    }),
    {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    }
  );
});
