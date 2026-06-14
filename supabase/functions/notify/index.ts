import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface NotifyPayload {
  user_id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  send_email?: boolean;
  email_template?: string;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("ok", { status: 200 });
  }

  const payload: NotifyPayload = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Verificar preferencias de notificación
  const { data: prefs } = await supabase
    .from("notification_preferences")
    .select("push_enabled, email_enabled, push_token")
    .eq("user_id", payload.user_id)
    .single();

  // Siempre insertar notificación in-app
  // La columna se llama 'data', no 'metadata'
  await supabase.from("notifications").insert({
    user_id: payload.user_id,
    type: payload.type,
    title: payload.title,
    body: payload.body,
    data: payload.data ?? {},
  });

  // Enviar email si fue solicitado y el usuario no lo deshabilitó
  if (payload.send_email && prefs?.email_enabled !== false) {
    // El email está en auth.users, no en la tabla users pública
    const { data: authUser } = await supabase.auth.admin.getUserById(
      payload.user_id
    );

    // El nombre del usuario puede estar en student_profiles o coach_profiles
    let displayName: string | null = null;
    const [studentResult, coachResult] = await Promise.allSettled([
      supabase
        .from("student_profiles")
        .select("display_name")
        .eq("user_id", payload.user_id)
        .single(),
      supabase
        .from("coach_profiles")
        .select("display_name")
        .eq("user_id", payload.user_id)
        .single(),
    ]);

    if (
      studentResult.status === "fulfilled" &&
      studentResult.value.data?.display_name
    ) {
      displayName = studentResult.value.data.display_name;
    } else if (
      coachResult.status === "fulfilled" &&
      coachResult.value.data?.display_name
    ) {
      displayName = coachResult.value.data.display_name;
    }

    const userEmail = authUser?.user?.email;
    if (userEmail) {
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (resendKey) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from:
              Deno.env.get("RESEND_FROM_EMAIL") ?? "hola@forzza.app",
            to: userEmail,
            subject: payload.title,
            html: `<p>Hola ${displayName ?? ""},</p><p>${payload.body}</p><p>— El equipo de Forzza</p>`,
          }),
        });
      }
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
