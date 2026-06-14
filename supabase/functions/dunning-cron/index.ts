import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface SubscriptionRow {
  id: string;
  user_id: string;
}

serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const now = new Date().toISOString();
  // Regla: past_due tiene gracia de 5 días antes de cancelar (CLAUDE.md)
  const fiveDaysAgo = new Date(
    Date.now() - 5 * 24 * 60 * 60 * 1000
  ).toISOString();

  // 1. Cancelar suscripciones activas cuyo período ya venció
  // Columna real: current_period_end (no expires_at)
  // Estado válido en enum: 'canceled' (no 'expired' ni 'cancelled')
  const { data: expired } = await supabase
    .from("subscriptions")
    .update({ status: "canceled", updated_at: now })
    .eq("status", "active")
    .lt("current_period_end", now)
    .select("id, user_id");

  // 2. Cancelar suscripciones past_due pasado el período de gracia (>5 días, no 7)
  // Estado válido en enum: 'canceled' (no 'suspended' ni 'cancelled')
  const { data: cancelled } = await supabase
    .from("subscriptions")
    .update({ status: "canceled", updated_at: now })
    .eq("status", "past_due")
    .lt("updated_at", fiveDaysAgo)
    .select("id, user_id");

  // Audit log — columna 'payload' (no metadata)
  const auditEntries = [
    ...((expired ?? []) as SubscriptionRow[]).map((s) => ({
      actor_id: null as string | null,
      action: "subscription_expired",
      entity_type: "subscription",
      entity_id: s.id,
      payload: { user_id: s.user_id },
    })),
    ...((cancelled ?? []) as SubscriptionRow[]).map((s) => ({
      actor_id: null as string | null,
      action: "subscription_cancelled_grace_expired",
      entity_type: "subscription",
      entity_id: s.id,
      payload: { user_id: s.user_id },
    })),
  ];

  if (auditEntries.length > 0) {
    await supabase.from("audit_log").insert(auditEntries);
  }

  return new Response(
    JSON.stringify({
      expired: (expired ?? []).length,
      cancelled: (cancelled ?? []).length,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
