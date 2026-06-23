/**
 * GET /api/coach/mp-oauth
 *
 * Inicia el flujo OAuth de Mercado Pago para vincular la cuenta del coach.
 * Redirige al coach a la URL de autorización de MP.
 *
 * HUMAN_REQUIRED:
 *   MP_OAUTH_CLIENT_ID debe estar en .env (y en Supabase secrets para Edge Functions).
 *   Obtener en: mercadopago.com → Herramientas de desarrollo → Mis aplicaciones
 *   La app debe ser de tipo "Marketplace" con permisos de split payments.
 *
 * Seguridad:
 *   - Requiere sesión de coach autenticado.
 *   - El state incluye el coach_profile_id para vincularlo en el callback.
 *   - El callback verifica que el state.coach_id coincide con el de la sesión (anti-CSRF).
 */

import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@forzza/db-types";

// URL de autorización OAuth de Mercado Pago (Marketplace)
// Doc: https://www.mercadopago.com.ar/developers/es/docs/marketplace/getting-started/get-authorization-code
const MP_OAUTH_URL = "https://auth.mercadopago.com.ar/authorization";

export async function GET(_req: NextRequest) {
  const mpClientId = process.env["MP_OAUTH_CLIENT_ID"];
  const appUrl = process.env["NEXT_PUBLIC_APP_URL"] ?? "https://forzza.com.ar";
  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
  const isDevMode = !supabaseUrl || supabaseUrl.includes("placeholder");

  // HUMAN_REQUIRED: si falta el client_id, no se puede iniciar el flujo
  if (!mpClientId && !isDevMode) {
    return NextResponse.json(
      {
        error: "mp_oauth_not_configured",
        hint: "HUMAN_REQUIRED: agregar MP_OAUTH_CLIENT_ID en .env y como Supabase secret. Obtener en: mercadopago.com → Herramientas de desarrollo → Mis aplicaciones (app Marketplace con permisos split payments).",
      },
      { status: 503 }
    );
  }

  // Dev bypass — si no hay Supabase configurado, usar mock coach_id
  if (isDevMode) {
    const mockState = Buffer.from(
      JSON.stringify({ coach_id: "dev-coach-000", ts: Date.now() })
    ).toString("base64url");
    const params = new URLSearchParams({
      response_type: "code",
      client_id: mpClientId ?? "mock-client-id",
      state: mockState,
      redirect_uri: `${appUrl}/api/coach/mp-oauth/callback`,
    });
    return NextResponse.redirect(`${MP_OAUTH_URL}?${params.toString()}`);
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

  const redirectUri = `${appUrl}/api/coach/mp-oauth/callback`;

  // State: coach_profile_id + timestamp en base64url
  // El callback verifica que coach_id === coachProfile.id de la sesión activa (anti-CSRF).
  const state = Buffer.from(
    JSON.stringify({ coach_id: coachProfile.id, ts: Date.now() })
  ).toString("base64url");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: mpClientId!,
    state,
    redirect_uri: redirectUri,
  });

  const authUrl = `${MP_OAUTH_URL}?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
