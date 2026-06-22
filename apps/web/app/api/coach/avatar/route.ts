import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "coach-avatars";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verify coach role
    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userProfile?.role !== "coach") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Archivo no proporcionado" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Usá JPEG, PNG o WebP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "El archivo supera el límite de 5 MB." },
        { status: 400 }
      );
    }

    const ext =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "jpg";

    // Path must start with uid so storage RLS (owner-scoped) allows the write
    const fileName = `${user.id}/avatar.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
      return NextResponse.json(
        { error: "Error al subir la imagen." },
        { status: 500 }
      );
    }

    // Build public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    // Update coach_profiles.avatar_url
    const { error: updateError } = await supabase
      .from("coach_profiles")
      .update({ avatar_url: publicUrl })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating avatar_url:", updateError);
      return NextResponse.json(
        { error: "Error al actualizar el perfil." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, avatar_url: publicUrl });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verify coach role
    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userProfile?.role !== "coach") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    // Fetch current avatar_url so we know which file to remove
    const { data: coachProfile } = await supabase
      .from("coach_profiles")
      .select("avatar_url")
      .eq("user_id", user.id)
      .single();

    if (coachProfile?.avatar_url) {
      // Extract the storage path from the public URL
      // Public URL pattern: .../storage/v1/object/public/<bucket>/<path>
      const url = new URL(coachProfile.avatar_url);
      const marker = `/object/public/${BUCKET}/`;
      const idx = url.pathname.indexOf(marker);
      if (idx !== -1) {
        const storagePath = url.pathname.slice(idx + marker.length);
        const { error: removeError } = await supabase.storage
          .from(BUCKET)
          .remove([storagePath]);
        if (removeError) {
          console.error("Error removing avatar file:", removeError);
          // Non-fatal: proceed to clear the DB column anyway
        }
      }
    }

    // Clear avatar_url in coach_profiles
    const { error: updateError } = await supabase
      .from("coach_profiles")
      .update({ avatar_url: null })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error clearing avatar_url:", updateError);
      return NextResponse.json(
        { error: "Error al eliminar la imagen." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
