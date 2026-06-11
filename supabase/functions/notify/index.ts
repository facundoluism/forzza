import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface NotifyPayload {
  user_id: string;
  type: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
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
    .select("*")
    .eq("user_id", payload.user_id)
    .single();

  // Siempre insertar notificación in-app
  await supabase.from("notifications").insert({
    user_id: payload.user_id,
    type: payload.type,
    title: payload.title,
    body: payload.body,
    metadata: payload.metadata ?? null,
  });

  // Enviar email si fue solicitado y el usuario no lo deshabilitó
  if (payload.send_email && prefs?.email_enabled !== false) {
    const { data: user } = await supabase
      .from("users")
      .select("email, full_name")
      .eq("id", payload.user_id)
      .single();

    const userRecord = user as { email: string; full_name: string | null } | null;

    if (userRecord?.email) {
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
            to: userRecord.email,
            subject: payload.title,
            html: `<p>Hola ${userRecord.full_name ?? ""},</p><p>${payload.body}</p><p>— El equipo de Forzza</p>`,
          }),
        });
      }
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
