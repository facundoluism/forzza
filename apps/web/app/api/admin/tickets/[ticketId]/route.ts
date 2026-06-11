import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";

type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

const VALID_STATUSES: TicketStatus[] = [
  "open",
  "in_progress",
  "resolved",
  "closed",
];

interface PatchBody {
  status: TicketStatus;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { adminClient, user } = await requireAdmin();
    const { ticketId } = await params;

    const body = (await req.json()) as PatchBody;
    const { status } = body;

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Estado inválido" },
        { status: 400 }
      );
    }

    // Verify ticket exists
    const { data: ticket, error: fetchError } = await adminClient
      .from("tickets")
      .select("id, status")
      .eq("id", ticketId)
      .single();

    if (fetchError || !ticket) {
      return NextResponse.json(
        { error: "Ticket no encontrado" },
        { status: 404 }
      );
    }

    // Update status
    const { error: updateError } = await adminClient
      .from("tickets")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", ticketId);

    if (updateError) {
      console.error("Error updating ticket:", updateError);
      return NextResponse.json(
        { error: "Error al actualizar el ticket" },
        { status: 500 }
      );
    }

    // Write audit log
    await adminClient.from("audit_log").insert({
      actor_id: user.id,
      action: "ticket.status_updated",
      entity_type: "tickets",
      entity_id: ticketId,
      payload: {
        previous_status: ticket.status,
        new_status: status,
      },
    });

    return NextResponse.json({ ok: true, status });
  } catch (err) {
    console.error("Admin ticket PATCH error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
