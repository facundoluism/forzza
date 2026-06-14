import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "unauthorized" }),
      { status: 401, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  let coach_id: string | undefined;
  let package_id: string | undefined;
  try {
    const body = await req.json() as { coach_id?: string; package_id?: string };
    coach_id = body.coach_id;
    package_id = body.package_id;
  } catch {
    return new Response(
      JSON.stringify({ error: "invalid_body" }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  if (!coach_id || !package_id) {
    return new Response(
      JSON.stringify({ error: "coach_id and package_id are required" }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(
      JSON.stringify({ error: "unauthorized" }),
      { status: 401, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  // Fetch user country — users table no tiene email (está en auth.users)
  const { data: userRecord } = await supabase
    .from("users")
    .select("country")
    .eq("id", user.id)
    .single();

  // Check user age (minor without parental consent)
  const { data: studentProfile } = await supabase
    .from("student_profiles")
    .select("birth_date, parental_consent_at")
    .eq("user_id", user.id)
    .single();

  if (studentProfile?.birth_date) {
    const ageMs = Date.now() - new Date(studentProfile.birth_date).getTime();
    const age = Math.floor(ageMs / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 18 && !studentProfile.parental_consent_at) {
      return new Response(
        JSON.stringify({ error: "minor_no_consent" }),
        { status: 403, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }
  }

  // Validate coach + package — usar columnas reales: title, price, active (no name/price_cents/is_active)
  const { data: coachPackage } = await supabase
    .from("coach_packages")
    .select("id, title, price, active, country, coach:coach_profiles(user_id, status, display_name)")
    .eq("id", package_id)
    .eq("coach_id", coach_id)
    .eq("active", true)
    .single();

  if (
    !coachPackage ||
    (coachPackage.coach as { status: string } | null)?.status !== "approved"
  ) {
    return new Response(
      JSON.stringify({ error: "invalid_package" }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  // price ya está en centavos/enteros según la migración — NO dividir por 100
  const priceInCents = coachPackage.price;

  // Get currency config from country — PK de country_config es 'country', no 'country_code'
  const countryCode = userRecord?.country ?? "AR";
  const { data: config } = await supabase
    .from("country_config")
    .select("currency_code, currency_symbol")
    .eq("country", countryCode)
    .single();

  const currencyCode = config?.currency_code ?? "ARS";
  // MP espera el amount en la unidad monetaria (pesos), no en centavos
  const priceInCurrency = priceInCents / 100;

  // Get user email from auth (no está en users pública)
  const userEmail = user.email ?? "";

  // Create MP preapproval_plan (subscription)
  // reason usa title (no name — no existe esa columna)
  const mpBody = {
    reason: `Forzza Coach: ${coachPackage.title}`,
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: priceInCurrency,
      currency_id: currencyCode,
    },
    payer_email: userEmail,
    back_url: `${Deno.env.get("APP_URL") ?? "https://forzza.app"}/marketplace?payment=success`,
  };

  const mpResponse = await fetch("https://api.mercadopago.com/preapproval_plan", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("MP_ACCESS_TOKEN")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mpBody),
  });

  if (!mpResponse.ok) {
    const err = await mpResponse.json() as unknown;
    return new Response(
      JSON.stringify({ error: "mp_error", details: err }),
      { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  const mpData = await mpResponse.json() as { id: string; init_point: string };

  // Insert payment record — columnas reales de la migración
  // user_id = payer, coach_id = coach, amount, currency, gateway, gateway_payment_id
  await supabase.from("payments").insert({
    user_id: user.id,
    coach_id: (coachPackage.coach as { user_id: string } | null)?.user_id ?? coach_id,
    amount: priceInCents,
    currency: currencyCode,
    status: "pending",
    gateway: "mercadopago",
    gateway_payment_id: mpData.id,
    metadata: { package_id, coach_id, mp_preapproval_id: mpData.id },
  });

  // Audit log — columna 'payload' (no metadata)
  await supabase.from("audit_log").insert({
    actor_id: user.id,
    action: "coach_checkout_initiated",
    entity_type: "payment",
    entity_id: null,
    payload: {
      coach_id,
      package_id,
      amount: priceInCents,
      mp_preapproval_id: mpData.id,
    },
  });

  return new Response(
    JSON.stringify({ init_point: mpData.init_point }),
    { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
  );
});
