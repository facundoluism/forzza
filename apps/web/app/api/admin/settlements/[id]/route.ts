import { NextResponse } from "next/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@forzza/db-types";

type SettlementAction = "approve" | "reject" | "transfer";

interface Body {
  action?: SettlementAction;
  rejection_reason?: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Body;

    if (!body.action || !["approve", "reject", "transfer"].includes(body.action)) {
      return NextResponse.json({ error: "Accion invalida" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "owner") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
    const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];

    if (!serviceKey || !supabaseUrl) {
      return NextResponse.json(
        { error: "Falta configuracion de Supabase" },
        { status: 500 }
      );
    }

    const adminClient = createSupabaseAdminClient<Database>(
      supabaseUrl,
      serviceKey
    );

    // TODO: regenerate db-types after applying 20260616000001_settlement_approval_flow.sql.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: settlement } = await (adminClient as any)
      .from("settlements")
      .select("id, status, invoice_number, invoice_path")
      .eq("id", id)
      .single();

    if (!settlement) {
      return NextResponse.json(
        { error: "Liquidacion no encontrada" },
        { status: 404 }
      );
    }

    const invoiceReady =
      typeof settlement.invoice_number === "string" &&
      settlement.invoice_number.trim().length > 0 &&
      typeof settlement.invoice_path === "string" &&
      settlement.invoice_path.trim().length > 0;

    let nextStatus: string;
    const patch: Record<string, unknown> = {};

    if (body.action === "approve") {
      if (settlement.status !== "invoiced" || !invoiceReady) {
        return NextResponse.json(
          { error: "Solo se aprueban facturas cargadas con numero y archivo" },
          { status: 409 }
        );
      }
      nextStatus = "approved";
      patch.status = nextStatus;
      patch.invoice_rejection_reason = null;
    } else if (body.action === "reject") {
      const reason = body.rejection_reason?.trim();
      if (!reason) {
        return NextResponse.json(
          { error: "El motivo de rechazo es obligatorio" },
          { status: 400 }
        );
      }
      if (settlement.status !== "invoiced" && settlement.status !== "approved") {
        return NextResponse.json(
          { error: "Esta liquidacion no puede rechazarse en su estado actual" },
          { status: 409 }
        );
      }
      nextStatus = "rejected";
      patch.status = nextStatus;
      patch.invoice_rejection_reason = reason;
    } else {
      if (settlement.status !== "approved" || !invoiceReady) {
        return NextResponse.json(
          { error: "Solo una factura aprobada puede marcarse como transferida" },
          { status: 409 }
        );
      }
      nextStatus = "transferred";
      patch.status = nextStatus;
      patch.transferred_at = new Date().toISOString();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (adminClient as any)
      .from("settlements")
      .update(patch)
      .eq("id", id);

    if (updateError) {
      console.error("Error updating settlement:", updateError);
      return NextResponse.json(
        { error: "No se pudo actualizar la liquidacion" },
        { status: 500 }
      );
    }

    await adminClient.from("audit_log").insert({
      actor_id: user.id,
      action: `settlement.${nextStatus}`,
      entity_type: "settlement",
      entity_id: id,
      payload: {
        previous_status: settlement.status,
        next_status: nextStatus,
        rejection_reason: body.rejection_reason ?? null,
      },
    });

    return NextResponse.json({ ok: true, status: nextStatus });
  } catch (error) {
    console.error("Admin settlement action failed:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
