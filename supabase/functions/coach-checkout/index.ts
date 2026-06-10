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

  // Fetch user info (email + country)
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

  // Validate coach + package
  const { data: coachPackage } = await supabase
    .from("coach_packages")
    .select("id, name, price_cents, billing_type, coach:coach_profiles(user_id, status, display_name)")
    .eq("id", package_id)
    .eq("coach_id", coach_id)
    .eq("is_active", true)
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

  const priceInCurrency = coachPackage.price_cents / 100;

  // Get currency config from country
  const countryCode = userRecord?.country ?? "AR";
  const { data: config } = await supabase
    .from("country_config")
    .select("currency_code, currency_symbol")
    .eq("country_code", countryCode)
    .single();

  const currencyCode = config?.currency_code ?? "ARS";

  // Get user email from auth
  const userEmail = user.email ?? "";

  // Create MP preapproval_plan (subscription)
  const mpBody = {
    reason: `Forzza Coach: ${coachPackage.name}`,
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

  // Insert payment record
  await supabase.from("payments").insert({
    payer_id: user.id,
    payee_id: (coachPackage.coach as { user_id: string } | null)?.user_id ?? coach_id,
    amount_cents: coachPackage.price_cents,
    currency_code: currencyCode,
    status: "pending",
    provider: "mercadopago",
    provider_payment_id: mpData.id,
    metadata: { package_id, coach_id, mp_preapproval_id: mpData.id },
  });

  // Audit log
  await supabase.from("audit_log").insert({
    actor_id: user.id,
    action: "coach_checkout_initiated",
    entity_type: "payment",
    entity_id: mpData.id,
    metadata: { coach_id, package_id, amount_cents: coachPackage.price_cents },
  });

  return new Response(
    JSON.stringify({ init_point: mpData.init_point }),
    { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
  );
});
