import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  // Buscar asignaciones activas
  const { data: assignments } = await supabase
    .from("coach_assignments")
    .select("student_id, coach_id")
    .eq("status", "active");

  if (!assignments) {
    return new Response("ok");
  }

  let notified = 0;

  for (const assignment of assignments) {
    // Verificar que el coach tiene al menos un template
    const { data: templates } = await supabase
      .from("checkin_templates")
      .select("id")
      .eq("coach_id", assignment.coach_id)
      .limit(1);

    if (!templates?.length) continue;

    // Verificar la última respuesta del alumno
    const { data: lastResponse } = await supabase
      .from("checkin_responses")
      .select("submitted_at")
      .eq("student_id", assignment.student_id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .single();

    const lastDate = (lastResponse as { submitted_at: string } | null)?.submitted_at;
    if (lastDate && new Date(lastDate) > new Date(sevenDaysAgo)) continue;

    // Enviar recordatorio
    await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/notify`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: assignment.student_id,
          type: "checkin_reminder",
          title: "Recordatorio de check-in",
          body: "Tu coach está esperando tu check-in semanal. ¡No te olvides de completarlo!",
          metadata: { coach_id: assignment.coach_id },
          send_email: false,
        }),
      }
    );

    notified++;
  }

  return new Response(JSON.stringify({ notified }), {
    headers: { "Content-Type": "application/json" },
  });
});
