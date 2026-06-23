/**
 * mp-oauth-connect — Edge Function para el intercambio OAuth de Mercado Pago.
 *
 * Esta función corre con service-role y es la ÚNICA que toca los tokens OAuth
 * del coach. Nunca los expone al cliente.
 *
 * Flujo:
 *   POST /mp-oauth-connect  { code: string, coach_id: string }
 *     1. Intercambia el `code` por access_token + refresh_token en la API de MP.
 *     2. Hace upsert en coach_mp_accounts (service-role).
 *     3. Escribe audit_log.
 *     4. Devuelve { ok: true, mp_user_id: string } — SIN tokens.
 *
 * Seguridad:
 *   - Requiere Authorization header del coach autenticado (anon key + JWT del coach).
 *   - Verifica que el JWT corresponde al coach dueño del coach_id.
 *   - Usa service-role internamente para escritura de tokens.
 *   - NUNCA logguea tokens.
 *
 * HUMAN_REQUIRED:
 *   MP_OAUTH_CLIENT_ID y MP_OAUTH_CLIENT_SECRET deben cargarse como Supabase secrets:
 *     supabase secrets set MP_OAUTH_CLIENT_ID=<client_id_de_la_app_marketplace>
 *     supabase secrets set MP_OAUTH_CLIENT_SECRET=<client_secret_de_la_app_marketplace>
 *   Obtener en: mercadopago.com → Herramientas de desarrollo → Credenciales de OAuth
 *   (la app debe ser de tipo "Marketplace" con permisos de "split payments").
 *
 * Refresh (futuro):
 *   Cuando token_expires_at esté próximo, llamar a esta misma función con
 *   { action: "refresh", coach_id } — implementar en Fase B cuando se use el token
 *   para crear el pago dividido.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Respuesta de MP al intercambio de código OAuth
interface MpOAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;       // segundos hasta expiración
  scope: string;
  user_id: number;          // mp_user_id numérico
  refresh_token: string;
  public_key?: string;
}

// Error de MP OAuth
interface MpOAuthErrorResponse {
  message?: string;
  error?: string;
  status?: number;
  cause?: unknown[];
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

  // --- Autenticación del coach ---
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Cliente anon para verificar el JWT del coach
  const supabaseAnon = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const {
    data: { user },
  } = await supabaseAnon.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Body
  let code: string | undefined;
  let coachId: string | undefined;
  try {
    const body = (await req.json()) as {
      code?: string;
      coach_id?: string;
    };
    code = body.code;
    coachId = body.coach_id;
  } catch {
    return new Response(JSON.stringify({ error: "invalid_body" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  if (!code || !coachId) {
    return new Response(
      JSON.stringify({ error: "code and coach_id are required" }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  // --- Service-role client para leer y escribir datos sensibles ---
  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Verificar que el coach_id pertenece al usuario autenticado
  const { data: coachProfile } = await supabaseService
    .from("coach_profiles")
    .select("id, user_id")
    .eq("id", coachId)
    .single();

  if (!coachProfile || coachProfile.user_id !== user.id) {
    return new Response(
      JSON.stringify({ error: "forbidden: coach_id does not belong to you" }),
      {
        status: 403,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  // --- Credenciales OAuth de la app marketplace de MP ---
  const mpClientId = Deno.env.get("MP_OAUTH_CLIENT_ID");
  const mpClientSecret = Deno.env.get("MP_OAUTH_CLIENT_SECRET");
  const appUrl = Deno.env.get("APP_URL") ?? "https://forzza.com.ar";

  // HUMAN_REQUIRED: si faltan las credenciales OAuth, no se puede hacer el intercambio.
  // Las credenciales deben cargarse como secrets:
  //   supabase secrets set MP_OAUTH_CLIENT_ID=...
  //   supabase secrets set MP_OAUTH_CLIENT_SECRET=...
  if (!mpClientId || !mpClientSecret) {
    console.error(
      "[mp-oauth-connect] HUMAN_REQUIRED: MP_OAUTH_CLIENT_ID y/o MP_OAUTH_CLIENT_SECRET no están configurados. " +
        "Obtener en: mercadopago.com → Herramientas de desarrollo → Credenciales de OAuth (app Marketplace). " +
        "Cargar con: supabase secrets set MP_OAUTH_CLIENT_ID=<id> MP_OAUTH_CLIENT_SECRET=<secret>"
    );
    return new Response(
      JSON.stringify({
        error: "mp_oauth_not_configured",
        hint: "HUMAN_REQUIRED: cargar MP_OAUTH_CLIENT_ID y MP_OAUTH_CLIENT_SECRET como Supabase secrets. Ver supabase/functions/mp-oauth-connect/index.ts para instrucciones.",
      }),
      {
        status: 503,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  // --- Intercambio de code por tokens en la API de MP ---
  // Doc: https://www.mercadopago.com.ar/developers/es/docs/marketplace/getting-started/get-authorization-code
  const redirectUri = `${appUrl}/api/coach/mp-oauth/callback`;

  const tokenPayload = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: mpClientId,
    client_secret: mpClientSecret,
    code,
    redirect_uri: redirectUri,
  });

  const mpTokenResponse = await fetch("https://api.mercadopago.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: tokenPayload.toString(),
  });

  if (!mpTokenResponse.ok) {
    const mpError = (await mpTokenResponse.json()) as MpOAuthErrorResponse;
    // NO loguear el body completo — puede contener datos parciales del code
    console.error(
      "[mp-oauth-connect] MP OAuth token exchange failed, status:",
      mpTokenResponse.status,
      "mp_error_message:",
      mpError?.message ?? mpError?.error ?? "unknown"
    );
    return new Response(
      JSON.stringify({
        error: "mp_oauth_exchange_failed",
        mp_status: mpTokenResponse.status,
      }),
      {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  const tokenData = (await mpTokenResponse.json()) as MpOAuthTokenResponse;

  // Calcular token_expires_at
  const expiresAt = new Date(
    Date.now() + tokenData.expires_in * 1000
  ).toISOString();

  const mpUserId = tokenData.user_id.toString();

  // --- Upsert en coach_mp_accounts (service-role) ---
  // NOTA: los tokens se guardan en la DB via service-role — la capa de presentación
  // nunca los ve. La política RLS solo permite que el coach lea status/connected_at.
  const { error: upsertError } = await supabaseService
    .from("coach_mp_accounts")
    .upsert(
      {
        coach_id: coachId,
        mp_user_id: mpUserId,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: expiresAt,
        scope: tokenData.scope ?? "",
        status: "connected",
        connected_at: new Date().toISOString(),
      },
      { onConflict: "coach_id" }
    );

  if (upsertError) {
    console.error(
      "[mp-oauth-connect] upsert coach_mp_accounts failed:",
      upsertError.code,
      upsertError.message
    );
    return new Response(
      JSON.stringify({ error: "db_error", code: upsertError.code }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  // --- Audit log (sin tokens) ---
  await supabaseService.from("audit_log").insert({
    actor_id: user.id,
    action: "coach_mp_account_connected",
    entity_type: "coach_mp_account",
    entity_id: coachId,
    payload: {
      mp_user_id: mpUserId,
      scope: tokenData.scope ?? "",
      // NO incluir access_token ni refresh_token
    },
  });

  // Devolver solo datos no-sensibles
  return new Response(
    JSON.stringify({
      ok: true,
      mp_user_id: mpUserId,
    }),
    {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    }
  );
});
