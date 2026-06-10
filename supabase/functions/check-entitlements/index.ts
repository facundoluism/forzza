import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const authHeader = req.headers.get("Authorization")
  if (!authHeader) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })

  // Check active PRO subscription
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status, expires_at")
    .eq("user_id", user.id)
    .eq("status", "active")
    .gte("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: false })
    .limit(1)
    .single()

  // Check active coach assignment
  const { data: assignment } = await supabase
    .from("coach_assignments")
    .select("id, coach_id, package_id")
    .eq("student_id", user.id)
    .eq("status", "active")
    .limit(1)
    .single()

  const isPro = !!(sub?.plan === "pro" || sub?.plan === "elite")
  const hasCoach = !!assignment

  return new Response(
    JSON.stringify({ isPro, hasCoach, plan: sub?.plan ?? "free", coachId: assignment?.coach_id ?? null }),
    { headers: { "Content-Type": "application/json" } }
  )
})
