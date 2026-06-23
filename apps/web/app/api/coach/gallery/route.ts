import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import type { Database } from "@forzza/db-types";
import { z } from "zod";

async function getAdminClient() {
  const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  if (!serviceKey || !supabaseUrl) return null;
  return createSupabaseAdminClient<Database>(supabaseUrl, serviceKey);
}

async function getCoachProfile() {
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
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!coachProfile)
    return { error: "Perfil de coach no encontrado", status: 404, data: null };

  return { error: null, status: 200, data: { user, coachProfile, supabase } };
}

export async function GET() {
  try {
    const { error, status, data } = await getCoachProfile();
    if (error || !data) return NextResponse.json({ error }, { status });

    const adminClient = await getAdminClient();
    if (!adminClient)
      return NextResponse.json(
        { error: "Error de configuración" },
        { status: 500 }
      );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rows } = await (adminClient as any)
      .from("coach_gallery")
      .select("id, file_path, display_order")
      .eq("coach_id", data.coachProfile.id)
      .order("display_order", { ascending: true });

    const items = await Promise.all(
      (rows ?? []).map(
        async (row: {
          id: string;
          file_path: string;
          display_order: number;
        }) => {
          const { data: signedUrlData } = await adminClient.storage
            .from("coach-gallery")
            .createSignedUrl(row.file_path, 3600);
          return {
            id: row.id,
            file_path: row.file_path,
            display_order: row.display_order,
            signed_url: signedUrlData?.signedUrl ?? null,
          };
        }
      )
    );

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { error, status, data } = await getCoachProfile();
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

    const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido" },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Archivo demasiado grande" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${data.user.id}/${timestamp}-${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await adminClient.storage
      .from("coach-gallery")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Gallery upload error:", uploadError);
      return NextResponse.json(
        { error: "Error al subir la imagen" },
        { status: 500 }
      );
    }

    // Get max display_order
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: maxRow } = await (adminClient as any)
      .from("coach_gallery")
      .select("display_order")
      .eq("coach_id", data.coachProfile.id)
      .order("display_order", { ascending: false })
      .limit(1)
      .single();

    const nextOrder = maxRow ? (maxRow.display_order as number) + 1 : 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: newRow, error: insertError } = await (adminClient as any)
      .from("coach_gallery")
      .insert({
        coach_id: data.coachProfile.id,
        file_path: filePath,
        display_order: nextOrder,
      })
      .select("id, file_path, display_order")
      .single();

    if (insertError) {
      console.error("Gallery insert error:", insertError);
      // cleanup storage
      await adminClient.storage.from("coach-gallery").remove([filePath]);
      return NextResponse.json(
        { error: "Error al guardar la imagen" },
        { status: 500 }
      );
    }

    const { data: signedUrlData } = await adminClient.storage
      .from("coach-gallery")
      .createSignedUrl(filePath, 3600);

    return NextResponse.json({
      item: {
        id: (newRow as { id: string; file_path: string; display_order: number }).id,
        file_path: filePath,
        display_order: nextOrder,
        signed_url: signedUrlData?.signedUrl ?? null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

const deleteSchema = z.object({ id: z.string().uuid() });

export async function DELETE(request: Request) {
  try {
    const { error, status, data } = await getCoachProfile();
    if (error || !data) return NextResponse.json({ error }, { status });

    const adminClient = await getAdminClient();
    if (!adminClient)
      return NextResponse.json(
        { error: "Error de configuración" },
        { status: 500 }
      );

    const body: unknown = await request.json();
    const parsed = deleteSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

    // Fetch row to get file_path
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: row } = await (adminClient as any)
      .from("coach_gallery")
      .select("id, file_path")
      .eq("id", parsed.data.id)
      .eq("coach_id", data.coachProfile.id)
      .single();

    if (!row)
      return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 });

    const { error: storageError } = await adminClient.storage
      .from("coach-gallery")
      .remove([(row as { id: string; file_path: string }).file_path]);

    if (storageError) {
      console.error("Gallery delete storage error:", storageError);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any)
      .from("coach_gallery")
      .delete()
      .eq("id", parsed.data.id)
      .eq("coach_id", data.coachProfile.id);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

const patchSchema = z.object({
  id: z.string().uuid(),
  direction: z.enum(["up", "down"]),
});

export async function PATCH(request: Request) {
  try {
    const { error, status, data } = await getCoachProfile();
    if (error || !data) return NextResponse.json({ error }, { status });

    const adminClient = await getAdminClient();
    if (!adminClient)
      return NextResponse.json(
        { error: "Error de configuración" },
        { status: 500 }
      );

    const body: unknown = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

    const { id, direction } = parsed.data;

    // Fetch all rows ordered
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rows } = await (adminClient as any)
      .from("coach_gallery")
      .select("id, display_order")
      .eq("coach_id", data.coachProfile.id)
      .order("display_order", { ascending: true });

    const rowList = (rows ?? []) as { id: string; display_order: number }[];
    const currentIndex = rowList.findIndex((r) => r.id === id);
    if (currentIndex === -1)
      return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 });

    const swapIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (swapIndex < 0 || swapIndex >= rowList.length)
      return NextResponse.json({ ok: true }); // nothing to swap

    const current = rowList[currentIndex]!;
    const swap = rowList[swapIndex]!;

    // Swap display_order
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any)
      .from("coach_gallery")
      .update({ display_order: swap.display_order })
      .eq("id", current.id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any)
      .from("coach_gallery")
      .update({ display_order: current.display_order })
      .eq("id", swap.id);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
