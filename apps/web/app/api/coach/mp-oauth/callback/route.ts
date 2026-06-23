/**
 * GET /api/coach/mp-oauth/callback
 *
 * Callback del flujo OAuth de Mercado Pago. MP redirige aquí con ?code=...&state=...
 * Este handler:
 *   1. Valida que el coach está autenticado.
 *   2. Verifica el state para prevenir CSRF.
 *   3. Llama a la Edge Function mp-oauth-connect para intercambiar el code por tokens
 *      (el intercambio se hace server-side, NUNCA en el cliente).
 *   4. Redirige al coach a /coach/perfil con ?mp_connected=true|error.
 *
 * Seguridad:
 *   - Requiere sesión de coach autenticado.
 *   - El state es verificado contra el coach_profile_id de la sesión.
 *   - El `code` NUNCA se loguea ni se expone al cliente.
 *   - El intercambio de tokens ocurre en la Edge Function con service-role.
 */

import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@forzza/db-types";

export async function GET(req: NextRequest) {
  const appUrl = process.env["NEXT_PUBLIC_APP_URL"] ?? "https://forzza.com.ar";
  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
  const isDevMode = !supabaseUrl || supabaseUrl.includes("placeholder");

  // Extraer code y state de la query
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const mpError = searchParams.get("error");

  // Si MP devolvió un error (ej: el coach canceló la autorización)
  if (mpError) {
    return NextResponse.redirect(
      `${appUrl}/coach/perfil?mp_connected=error&reason=${encodeURIComponent(mpError)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${appUrl}/coach/perfil?mp_connected=error&reason=missing_params`
    );
  }

  // Dev bypass — simula conexión exitosa sin llamar a MP
  if (isDevMode) {
    return NextResponse.redirect(`${appUrl}/coach/perfil?mp_connected=true`);
  }

  // --- Verificar sesión del coach ---
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    supabaseUrl,
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${appUrl}/ingresar`);
  }

  // Verificar rol coach
  const { data: userRow } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userRow?.role !== "coach") {
    return NextResponse.redirect(`${appUrl}/`);
  }

  // Obtener coach_profile_id
  const { data: coachProfile } = await supabase
    .from("coach_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!coachProfile) {
    return NextResponse.redirect(`${appUrl}/onboarding-coach`);
  }

  // --- Verificar state (anti-CSRF básico) ---
  // El state contiene { coach_id, ts } en base64url.
  // Verificamos que el coach_id del state coincide con el de la sesión.
  try {
    const statePayload = JSON.parse(
      Buffer.from(state, "base64url").toString("utf-8")
    ) as { coach_id?: string; ts?: number };

    if (statePayload.coach_id !== coachProfile.id) {
      return NextResponse.redirect(
        `${appUrl}/coach/perfil?mp_connected=error&reason=state_mismatch`
      );
    }

    // Opcional: rechazar states demasiado viejos (>10 min) para reducir ventana CSRF
    const stateAge = Date.now() - (statePayload.ts ?? 0);
    if (stateAge > 10 * 60 * 1000) {
      return NextResponse.redirect(
        `${appUrl}/coach/perfil?mp_connected=error&reason=state_expired`
      );
    }
  } catch {
    return NextResponse.redirect(
      `${appUrl}/coach/perfil?mp_connected=error&reason=invalid_state`
    );
  }

  // --- Llamar a la Edge Function para intercambiar code por tokens ---
  // El code se pasa al servidor (Edge Function con service-role), NUNCA al cliente.
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;

  if (!accessToken) {
    return NextResponse.redirect(
      `${appUrl}/coach/perfil?mp_connected=error&reason=no_session`
    );
  }

  const edgeFunctionUrl = `${supabaseUrl}/functions/v1/mp-oauth-connect`;
  const edgeResponse = await fetch(edgeFunctionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      apikey: process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
    },
    body: JSON.stringify({
      code,
      coach_id: coachProfile.id,
    }),
  });

  if (!edgeResponse.ok) {
    const errorBody = (await edgeResponse.json().catch(() => ({}))) as {
      error?: string;
    };
    const reason = errorBody?.error ?? "edge_function_error";
    return NextResponse.redirect(
      `${appUrl}/coach/perfil?mp_connected=error&reason=${encodeURIComponent(reason)}`
    );
  }

  // Éxito — redirigir al perfil con indicador de conexión exitosa
  return NextResponse.redirect(`${appUrl}/coach/perfil?mp_connected=true`);
}
