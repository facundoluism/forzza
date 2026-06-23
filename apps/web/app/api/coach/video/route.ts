import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import type { Database } from "@forzza/db-types";

async function getAdminClient() {
  const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  if (!serviceKey || !supabaseUrl) return null;
  return createSupabaseAdminClient<Database>(supabaseUrl, serviceKey);
}

async function getCoachAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado", status: 401, data: null };

  const { data: userProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userProfile?.role !== "coach")
    return { error: "Sin permisos", status: 403, data: null };

  const { data: coachProfile } = await supabase
    .from("coach_profiles")
    .select("id, presentation_video_path")
    .eq("user_id", user.id)
    .single();

  if (!coachProfile)
    return { error: "Perfil de coach no encontrado", status: 404, data: null };

  return { error: null, status: 200, data: { user, coachProfile, supabase } };
}

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(request: Request) {
  try {
    const { error, status, data } = await getCoachAuth();
    if (error || !data) return NextResponse.json({ error }, { status });

    const adminClient = await getAdminClient();
    if (!adminClient)
      return NextResponse.json(
        { error: "Error de configuración" },
        { status: 500 }
      );

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }

    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido" },
        { status: 400 }
      );
    }

    if (file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: "Archivo demasiado grande" },
        { status: 400 }
      );
    }

    // Derive extension from type
    const extMap: Record<string, string> = {
      "video/mp4": "mp4",
      "video/quicktime": "mov",
      "video/webm": "webm",
    };
    const ext = extMap[file.type] ?? "mp4";
    const timestamp = Date.now();
    const filePath = `${data.user.id}/video-${timestamp}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await adminClient.storage
      .from("coach-gallery")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Video upload error:", uploadError);
      return NextResponse.json(
        { error: "Error al subir el video" },
        { status: 500 }
      );
    }

    // Delete previous video if exists
    const prevPath = (
      data.coachProfile as { id: string; presentation_video_path?: string | null }
    ).presentation_video_path;
    if (prevPath) {
      await adminClient.storage.from("coach-gallery").remove([prevPath]);
    }

    // Update coach_profiles
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (data.supabase as any)
      .from("coach_profiles")
      .update({ presentation_video_path: filePath })
      .eq("user_id", data.user.id);

    if (updateError) {
      console.error("Video profile update error:", updateError);
      await adminClient.storage.from("coach-gallery").remove([filePath]);
      return NextResponse.json(
        { error: "Error al actualizar el perfil" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { error, status, data } = await getCoachAuth();
    if (error || !data) return NextResponse.json({ error }, { status });

    const adminClient = await getAdminClient();
    if (!adminClient)
      return NextResponse.json(
        { error: "Error de configuración" },
        { status: 500 }
      );

    const currentPath = (
      data.coachProfile as { id: string; presentation_video_path?: string | null }
    ).presentation_video_path;

    if (!currentPath) {
      return NextResponse.json({ ok: true });
    }

    await adminClient.storage.from("coach-gallery").remove([currentPath]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (data.supabase as any)
      .from("coach_profiles")
      .update({ presentation_video_path: null })
      .eq("user_id", data.user.id);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
