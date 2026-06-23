import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "coach-exercise-videos";
const ALLOWED_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_SIZE = 200 * 1024 * 1024; // 200 MB
const SIGNED_URL_TTL = 3600; // 1 hour

async function getCoachProfileId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("coach_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();
  return data?.id ?? null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const exercise_id = searchParams.get("exercise_id");

    if (!exercise_id) {
      return NextResponse.json(
        { error: "exercise_id es requerido" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const coachProfileId = await getCoachProfileId(supabase, user.id);
    if (!coachProfileId) {
      return NextResponse.json(
        { error: "Perfil de coach no encontrado" },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("coach_exercise_personalizations")
      .select("id, tips, video_path, created_at, updated_at")
      .eq("coach_id", coachProfileId)
      .eq("exercise_id", exercise_id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching personalization:", error);
      return NextResponse.json({ error: "Error al cargar" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ data: null });
    }

    // Generate signed URL if there's a video (bucket is private)
    let video_signed_url: string | null = null;
    if (data.video_path) {
      const { data: signedData, error: signedError } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(data.video_path, SIGNED_URL_TTL);
      if (!signedError && signedData?.signedUrl) {
        video_signed_url = signedData.signedUrl;
      }
    }

    return NextResponse.json({
      data: {
        ...data,
        video_signed_url,
      },
    });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const coachProfileId = await getCoachProfileId(supabase, user.id);
    if (!coachProfileId) {
      return NextResponse.json(
        { error: "Perfil de coach no encontrado" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const exercise_id = formData.get("exercise_id");
    const tips = formData.get("tips");
    const video = formData.get("video");
    const remove_video = formData.get("remove_video");

    if (!exercise_id || typeof exercise_id !== "string") {
      return NextResponse.json(
        { error: "exercise_id es requerido" },
        { status: 400 }
      );
    }

    // undefined = no change; null = explicit removal
    let video_path: string | null | undefined = undefined;

    // Handle video removal
    if (remove_video === "true") {
      const { data: current } = await supabase
        .from("coach_exercise_personalizations")
        .select("video_path")
        .eq("coach_id", coachProfileId)
        .eq("exercise_id", exercise_id)
        .maybeSingle();

      if (current?.video_path) {
        const { error: removeError } = await supabase.storage
          .from(BUCKET)
          .remove([current.video_path]);
        if (removeError) {
          console.error("Error removing video from storage:", removeError);
          // Non-fatal: proceed to clear DB column anyway
        }
      }
      video_path = null;
    }

    // Handle new video upload
    if (video && video instanceof Blob && video.size > 0) {
      if (!ALLOWED_TYPES.includes(video.type)) {
        return NextResponse.json(
          {
            error:
              "Tipo de archivo no permitido. Usá MP4, QuickTime o WebM.",
          },
          { status: 400 }
        );
      }

      if (video.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "El archivo supera el límite de 200 MB." },
          { status: 400 }
        );
      }

      const ext =
        video.type === "video/quicktime"
          ? "mov"
          : video.type === "video/webm"
            ? "webm"
            : "mp4";

      // Path convention: {auth.uid()}/{exercise_id}.{ext}
      const storagePath = `${user.id}/${exercise_id}.${ext}`;

      // Remove old video if it was stored under a different extension (best-effort)
      const { data: current } = await supabase
        .from("coach_exercise_personalizations")
        .select("video_path")
        .eq("coach_id", coachProfileId)
        .eq("exercise_id", exercise_id)
        .maybeSingle();

      if (current?.video_path && current.video_path !== storagePath) {
        await supabase.storage.from(BUCKET).remove([current.video_path]);
      }

      const arrayBuffer = await video.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, arrayBuffer, {
          contentType: video.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("Error uploading video:", uploadError);
        return NextResponse.json(
          { error: "Error al subir el video." },
          { status: 500 }
        );
      }

      video_path = storagePath;
    }

    // Build upsert payload
    const upsertData: {
      coach_id: string;
      exercise_id: string;
      tips?: string | null;
      video_path?: string | null;
    } = {
      coach_id: coachProfileId,
      exercise_id,
    };

    if (typeof tips === "string") {
      upsertData.tips = tips.trim() || null;
    }

    if (video_path !== undefined) {
      upsertData.video_path = video_path;
    }

    const { data: upserted, error: upsertError } = await supabase
      .from("coach_exercise_personalizations")
      .upsert(upsertData, { onConflict: "coach_id,exercise_id" })
      .select("id, tips, video_path, updated_at")
      .single();

    if (upsertError) {
      console.error("Error upserting personalization:", upsertError);
      return NextResponse.json(
        { error: "Error al guardar la personalización." },
        { status: 500 }
      );
    }

    // Return signed URL for the video (bucket is private — no public URLs)
    let video_signed_url: string | null = null;
    if (upserted.video_path) {
      const { data: signedData, error: signedError } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(upserted.video_path, SIGNED_URL_TTL);
      if (!signedError && signedData?.signedUrl) {
        video_signed_url = signedData.signedUrl;
      }
    }

    return NextResponse.json({
      ok: true,
      data: {
        ...upserted,
        video_signed_url,
      },
    });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
