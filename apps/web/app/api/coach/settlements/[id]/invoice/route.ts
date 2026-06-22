import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@forzza/db-types";

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

    const { data: coachProfile } = await supabase
      .from("coach_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!coachProfile) {
      return NextResponse.json(
        { error: "Perfil de coach no encontrado" },
        { status: 403 }
      );
    }

    // Verify settlement belongs to this coach and is in pending/pending_invoice status
    const { data: settlement } = await supabase
      .from("settlements")
      .select("id, status")
      .eq("id", settlementId)
      .eq("coach_id", coachProfile.id)
      .single();

    if (!settlement) {
      return NextResponse.json(
        { error: "Liquidación no encontrada" },
        { status: 404 }
      );
    }

    if (
      settlement.status !== "pending" &&
      settlement.status !== "pending_invoice" &&
      settlement.status !== "rejected"
    ) {
      return NextResponse.json(
        { error: "Esta liquidación no acepta facturas en este estado" },
        { status: 400 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file");
    const invoiceNumber = formData.get("invoice_number");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Archivo no proporcionado" },
        { status: 400 }
      );
    }

    if (typeof invoiceNumber !== "string" || !invoiceNumber.trim()) {
      return NextResponse.json(
        { error: "Número de factura requerido" },
        { status: 400 }
      );
    }

    // Número de factura único por coach: no reutilizar un comprobante ya cargado
    // en otra liquidación (el coach puede SELECT sus propias settlements).
    const { data: dupInvoice } = await supabase
      .from("settlements")
      .select("id")
      .eq("coach_id", coachProfile.id)
      .eq("invoice_number", invoiceNumber.trim())
      .neq("id", settlementId)
      .limit(1);

    if (dupInvoice && dupInvoice.length > 0) {
      return NextResponse.json(
        { error: "Ese número de factura ya está registrado en otra liquidación" },
        { status: 409 }
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

    // Update settlement: set invoice_path and change status to 'invoiced'.
    // El coach NO tiene política RLS de UPDATE sobre settlements (solo SELECT),
    // así que el update se hace con service-role tras validar propiedad y estado
    // arriba en código. Mismos filtros (.eq/.in) como defensa adicional.
    const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
    const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];
    if (!serviceKey || !supabaseUrl) {
      return NextResponse.json(
        { error: "Falta configuración de Supabase" },
        { status: 500 }
      );
    }
    const admin = createServiceClient<Database>(supabaseUrl, serviceKey);

    const { error: updateError } = await admin
      .from("settlements")
      .update({
        invoice_number: invoiceNumber.trim(),
        invoice_path: fileName,
        status: "invoiced" as const,
        invoice_rejection_reason: null,
      })
      .eq("id", settlementId)
      .eq("coach_id", coachProfile.id)
      .in("status", ["pending", "pending_invoice", "rejected"]);

    if (updateError) {
      console.error("Error updating settlement:", updateError);
      return NextResponse.json(
        { error: "Error al actualizar la liquidación" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, invoice_path: fileName });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
