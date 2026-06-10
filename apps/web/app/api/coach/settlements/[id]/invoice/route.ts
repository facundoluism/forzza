import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: settlementId } = await params;

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verify coach role
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "coach") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    // Verify settlement belongs to this coach and is in pending/pending_invoice status
    const { data: settlement } = await supabase
      .from("settlements")
      .select("id, status")
      .eq("id", settlementId)
      .eq("coach_id", user.id)
      .single();

    if (!settlement) {
      return NextResponse.json(
        { error: "Liquidación no encontrada" },
        { status: 404 }
      );
    }

    if (
      settlement.status !== "pending" &&
      settlement.status !== "pending_invoice"
    ) {
      return NextResponse.json(
        { error: "Esta liquidación no acepta facturas en este estado" },
        { status: 400 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Archivo no proporcionado" },
        { status: 400 }
      );
    }

    // Validate type
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido" },
        { status: 400 }
      );
    }

    // Validate size (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El archivo supera el límite de 10 MB" },
        { status: 400 }
      );
    }

    const ext = file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : "jpg";
    const fileName = `${user.id}/${settlementId}/${Date.now()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("invoices")
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading invoice:", uploadError);
      return NextResponse.json(
        { error: "Error al subir el archivo" },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from("invoices")
      .getPublicUrl(fileName);

    const invoiceUrl = urlData.publicUrl;

    // Update settlement: set invoice_url and change status to 'invoiced'
    const { error: updateError } = await supabase
      .from("settlements")
      .update({ invoice_url: invoiceUrl, status: "invoiced" })
      .eq("id", settlementId)
      .eq("coach_id", user.id)
      .in("status", ["pending", "pending_invoice"]);

    if (updateError) {
      console.error("Error updating settlement:", updateError);
      return NextResponse.json(
        { error: "Error al actualizar la liquidación" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, invoice_url: invoiceUrl });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
