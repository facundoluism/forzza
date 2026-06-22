import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Period: last calendar month
  const now = new Date();
  const periodStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const periodEndDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  const periodStart = periodStartDate.toISOString().slice(0, 10); // DATE format
  const periodEnd = periodEndDate.toISOString().slice(0, 10);

  // Get all approved payments in the period grouped by coach
  // Columnas reales de payments: coach_id (no payee_id), amount (no amount_cents)
  // Status 'approved' es el equivalente a pagos completados en el enum
  const { data: payments } = await supabase
    .from("payments")
    .select("coach_id, amount, metadata")
    .eq("status", "approved")
    .gte("created_at", periodStartDate.toISOString())
    .lte("created_at", periodEndDate.toISOString())
    .not("coach_id", "is", null);

  if (!payments || payments.length === 0) {
    return new Response(JSON.stringify({ settlements_created: 0 }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Necesitamos el currency del coach — lo sacamos del primer pago del grupo
  interface PaymentRow {
    coach_id: string | null;
    amount: number;
    metadata: Record<string, unknown>;
  }

  // Group by coach
  const byCoach = (payments as PaymentRow[]).reduce<
    Record<string, { total: number; coach_id: string }>
  >((acc, p) => {
    const key = p.coach_id!;
    if (!acc[key]) acc[key] = { total: 0, coach_id: key };
    acc[key].total += p.amount;
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
    // users.country (no country_code)
    const { data: coachUser } = await supabase
      .from("users")
      .select("country")
      .eq("id", coachId)
      .single();

    // country_config PK es 'country' (no 'country_code')
    const { data: config } = await supabase
      .from("country_config")
      .select("commission_rate, currency")
      .eq("country", coachUser?.country ?? "AR")
      .single();

    // Regla de negocio #1: la comisión se lee SIEMPRE de country_config, jamás
    // se hardcodea. Si falta config para el país del coach, se omite la
    // liquidación (no se aplica una tasa por defecto) y se loguea para corregir.
    if (config?.commission_rate == null || config?.currency == null) {
      console.error(
        `generate-settlements: sin country_config para país '${coachUser?.country ?? "?"}' (coach ${coachId}); se omite la liquidación en vez de aplicar comisión hardcodeada.`
      );
      continue;
    }
    const commissionRate = config.commission_rate;
    const currency = config.currency;
    const grossAmount = data.total;
    const commission = Math.round(grossAmount * commissionRate);
    const netAmount = grossAmount - commission;

    // Columnas reales de settlements: gross_amount, commission, net_amount, currency
    // NO tiene gross_amount_cents, commission_amount_cents, net_amount_cents
    await supabase.from("settlements").insert({
      coach_id: coachId,
      period_start: periodStart,
      period_end: periodEnd,
      gross_amount: grossAmount,
      commission: commission,
      net_amount: netAmount,
      currency: currency,
      status: "pending",
    });

    // Audit log — columna 'payload' (no metadata)
    await supabase.from("audit_log").insert({
      actor_id: null,
      action: "settlement_generated",
      entity_type: "settlement",
      entity_id: coachId,
      payload: {
        period_start: periodStart,
        period_end: periodEnd,
        gross_amount: grossAmount,
        commission: commission,
        net_amount: netAmount,
      },
    });

    created++;
  }

  return new Response(JSON.stringify({ settlements_created: created }), {
    headers: { "Content-Type": "application/json" },
  });
});
