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

  // Get user email and country
  const { data: profile } = await supabase
    .from("users")
    .select("email, country_code")
    .eq("id", user.id)
    .single();

  if (!profile)
    return new Response(JSON.stringify({ error: "profile not found" }), {
      status: 404,
    });

  // Get PRO price from country_config — NEVER hardcode prices
  const { data: config } = await supabase
    .from("country_config")
    .select("pro_monthly_price_cents, currency_code")
    .eq("country_code", (profile as { email: string; country_code: string }).country_code ?? "AR")
    .single();

  const priceInCurrency =
    ((config as { pro_monthly_price_cents: number; currency_code: string } | null)
      ?.pro_monthly_price_cents ?? 999900) / 100;
  const currencyCode =
    (config as { pro_monthly_price_cents: number; currency_code: string } | null)
      ?.currency_code ?? "ARS";

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
      payer_email: (profile as { email: string; country_code: string }).email,
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

  // Store pending subscription
  await supabase.from("subscriptions").upsert(
    {
      user_id: user.id,
      plan: "pro",
      status: "pending",
      provider: "mercadopago",
      provider_subscription_id: mpData.id,
      started_at: new Date().toISOString(),
      expires_at: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // +30 days
    },
    { onConflict: "user_id,provider" }
  );

  return new Response(
    JSON.stringify({
      init_point: mpData.init_point,
      subscription_id: mpData.id,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
