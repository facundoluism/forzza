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
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  // 1. Expire active subscriptions past expires_at
  const { data: expired } = await supabase
    .from("subscriptions")
    .update({ status: "expired", updated_at: now })
    .eq("status", "active")
    .lt("expires_at", now)
    .select("id, user_id");

  // 2. Cancel suspended subscriptions past grace period (>7 days since updated_at)
  const { data: cancelled } = await supabase
    .from("subscriptions")
    .update({ status: "cancelled", updated_at: now })
    .eq("status", "suspended")
    .lt("updated_at", sevenDaysAgo)
    .select("id, user_id");

  // Audit log all changes
  const auditEntries = [
    ...((expired ?? []) as SubscriptionRow[]).map((s) => ({
      actor_id: null as string | null,
      action: "subscription_expired",
      entity_type: "subscription",
      entity_id: s.id,
      metadata: { user_id: s.user_id },
    })),
    ...((cancelled ?? []) as SubscriptionRow[]).map((s) => ({
      actor_id: null as string | null,
      action: "subscription_cancelled_grace_expired",
      entity_type: "subscription",
      entity_id: s.id,
      metadata: { user_id: s.user_id },
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
