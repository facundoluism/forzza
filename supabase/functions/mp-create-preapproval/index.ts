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

  // Regla §7 extendida a PRO (aprobado por el owner — ver docs/open-questions.md):
  // menor de 18 sin consentimiento parental no puede comprar PRO. Cálculo de edad
  // preciso por año/mes/día (espejo de isMinorWithoutConsent en packages/core;
  // Deno no puede importar el workspace).
  const { data: studentProfile } = await supabase
    .from("student_profiles")
    .select("birth_date, parental_consent_at")
    .eq("user_id", user.id)
    .single();

  if (studentProfile?.birth_date) {
    const today = new Date();
    const birth = new Date(studentProfile.birth_date);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age -= 1;
    }
    if (age < 18 && !studentProfile.parental_consent_at) {
      return new Response(JSON.stringify({ error: "minor_no_consent" }), {
        status: 403,
      });
    }
  }

  // El email está en auth.users (user.email); solo buscamos country en users pública
  // La columna es 'country', no 'email' ni 'country_code'
  const { data: profile } = await supabase
    .from("users")
    .select("country")
    .eq("id", user.id)
    .single();

  if (!profile)
    return new Response(JSON.stringify({ error: "profile not found" }), {
      status: 404,
    });

  const userCountry = (profile as { country: string }).country ?? "AR";
  const userEmail = user.email ?? "";

  // Get PRO price from country_config — NUNCA hardcodear precios
  // PK de country_config es 'country' (no 'country_code')
  // pro_monthly_price_cents y currency_code existen desde migración 20260615
  const { data: config } = await supabase
    .from("country_config")
    .select("pro_monthly_price_cents, currency_code")
    .eq("country", userCountry)
    .single();

  const priceInCents =
    (config as { pro_monthly_price_cents: number; currency_code: string } | null)
      ?.pro_monthly_price_cents ?? 999900;
  const currencyCode =
    (config as { pro_monthly_price_cents: number; currency_code: string } | null)
      ?.currency_code ?? "ARS";

  // MP espera el amount en unidad monetaria (pesos), no en centavos
  const priceInCurrency = priceInCents / 100;

  // Create MP preapproval plan
  const mpResponse = await fetch("https://api.mercadopago.com/preapproval_plan", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("MP_ACCESS_TOKEN")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reason: "Forzza PRO",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: priceInCurrency,
        currency_id: currencyCode,
      },
      payer_email: userEmail,
      back_url: `${Deno.env.get("APP_URL")}/upgrade?status=success`,
    }),
  });

  if (!mpResponse.ok) {
    const err = await mpResponse.json();
    return new Response(
      JSON.stringify({ error: "mp_error", details: err }),
      { status: 502 }
    );
  }

  const mpData = await mpResponse.json() as { id: string; init_point: string };

  // Las escrituras de subscriptions son operación de servidor de confianza (ya
  // validamos auth + §7 arriba). Se usan con SERVICE ROLE porque la RLS de
  // subscriptions solo permite escribir al rol 'owner' — con el JWT del alumno
  // el INSERT se bloquea silenciosamente y la suscripción nunca se crea.
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Remove any stale trialing rows before creating a new one.
  // Each MP preapproval generates a unique plan ID, so onConflict("gateway_subscription_id")
  // would silently insert duplicates for the same user. Deleting trialing rows first
  // keeps one pending row per user; the webhook promotes it to "active" on payment.
  await admin
    .from("subscriptions")
    .delete()
    .eq("user_id", user.id)
    .in("status", ["trialing", "pending"]);

  const now = new Date();
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const { error: subInsertError } = await admin.from("subscriptions").insert({
    user_id: user.id,
    plan: "pro",
    status: "trialing",
    platform: "web",
    gateway: "mercadopago",
    gateway_subscription_id: mpData.id,
    current_period_start: now.toISOString(),
    current_period_end: periodEnd.toISOString(),
  });

  if (subInsertError) {
    console.error("[mp-create-preapproval] subscription insert error:", subInsertError);
    return new Response(
      JSON.stringify({ error: "subscription_insert_failed", details: subInsertError.message }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({
      init_point: mpData.init_point,
      subscription_id: mpData.id,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
