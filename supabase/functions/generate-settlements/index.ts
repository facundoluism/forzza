import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Period: last calendar month
  const now = new Date();
  const periodStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  ).toISOString();
  const periodEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59
  ).toISOString();

  // Get all completed payments in the period grouped by payee (coach)
  const { data: payments } = await supabase
    .from("payments")
    .select("payee_id, amount_cents, metadata")
    .eq("status", "completed")
    .gte("created_at", periodStart)
    .lte("created_at", periodEnd)
    .not("payee_id", "is", null);

  if (!payments || payments.length === 0) {
    return new Response(JSON.stringify({ settlements_created: 0 }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Group by coach
  const byCoach = payments.reduce<
    Record<string, { total: number; coach_id: string }>
  >((acc, p) => {
    const key = p.payee_id!;
    if (!acc[key]) acc[key] = { total: 0, coach_id: key };
    acc[key].total += p.amount_cents;
    return acc;
  }, {});

  let created = 0;
  for (const [coachId, data] of Object.entries(byCoach)) {
    // Skip if settlement already exists for this period + coach (idempotent)
    const { data: existing } = await supabase
      .from("settlements")
      .select("id")
      .eq("coach_id", coachId)
      .eq("period_start", periodStart)
      .single();

    if (existing) continue;

    // Get coach country for commission rate
    // users table uses 'country' column (not 'country_code')
    const { data: coachUser } = await supabase
      .from("users")
      .select("country")
      .eq("id", coachId)
      .single();

    const { data: config } = await supabase
      .from("country_config")
      .select("commission_rate")
      .eq("country_code", coachUser?.country ?? "AR")
      .single();

    const commissionRate = config?.commission_rate ?? 0.20;
    const grossCents = data.total;
    const commissionCents = Math.round(grossCents * commissionRate);
    const netCents = grossCents - commissionCents;

    await supabase.from("settlements").insert({
      coach_id: coachId,
      period_start: periodStart,
      period_end: periodEnd,
      gross_amount_cents: grossCents,
      commission_amount_cents: commissionCents,
      net_amount_cents: netCents,
      status: "pending",
    });

    // Audit log
    await supabase.from("audit_log").insert({
      actor_id: null,
      action: "settlement_generated",
      entity_type: "settlement",
      entity_id: coachId,
      metadata: {
        period_start: periodStart,
        period_end: periodEnd,
        gross_cents: grossCents,
        commission_cents: commissionCents,
        net_cents: netCents,
      },
    });

    created++;
  }

  return new Response(JSON.stringify({ settlements_created: created }), {
    headers: { "Content-Type": "application/json" },
  });
});
