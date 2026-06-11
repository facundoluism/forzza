import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";

interface PatchBody {
  status: "approved" | "rejected";
  rejection_reason?: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ coachId: string }> }
) {
  try {
    const { adminClient, user } = await requireAdmin();
    const { coachId } = await params;

    const body = (await req.json()) as PatchBody;
    const { status, rejection_reason } = body;

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json(
        { error: "Estado inválido. Debe ser 'approved' o 'rejected'" },
        { status: 400 }
      );
    }

    if (status === "rejected" && !rejection_reason?.trim()) {
      return NextResponse.json(
        { error: "El motivo de rechazo es obligatorio" },
        { status: 400 }
      );
    }

    // Verify coach exists
    const { data: coach, error: fetchError } = await adminClient
      .from("coach_profiles")
      .select("id, user_id, status")
      .eq("id", coachId)
      .single();

    if (fetchError || !coach) {
      return NextResponse.json(
        { error: "Coach no encontrado" },
        { status: 404 }
      );
    }

    // Update coach status
    const { error: updateError } = await adminClient
      .from("coach_profiles")
      .update({ status })
      .eq("id", coachId);

    if (updateError) {
      console.error("Error updating coach status:", updateError);
      return NextResponse.json(
        { error: "Error al actualizar el estado del coach" },
        { status: 500 }
      );
    }

    // Write audit log
    await adminClient.from("audit_log").insert({
      actor_id: user.id,
      action: status === "approved" ? "coach.approved" : "coach.rejected",
      entity_type: "coach_profiles",
      entity_id: coachId,
      payload: {
        previous_status: coach.status,
        new_status: status,
        ...(rejection_reason ? { rejection_reason } : {}),
      },
    });

    return NextResponse.json({ ok: true, status });
  } catch (err) {
    console.error("Admin coach status error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
