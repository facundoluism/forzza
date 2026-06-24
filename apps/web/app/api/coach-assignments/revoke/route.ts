/**
 * POST /api/coach-assignments/revoke
 *
 * Derecho de arrepentimiento — Ley 24.240 Defensa del Consumidor (Argentina).
 * Ventana: 10 días corridos desde created_at del coach_assignment.
 *
 * IMPORTANTE: el reembolso real a Mercado Pago es Fase B (pendiente).
 * Esta ruta solo cancela el assignment y registra el pedido de reembolso
 * como pending en audit_log. El movimiento de dinero queda en manos del
 * adaptador stub refundAdapter (HUMAN_REQUIRED / pendiente Fase B).
 *
 * DUDA ABIERTA (ver docs/open-questions.md):
 * La ley prevé una excepción al arrepentimiento para "servicios cuya
 * ejecución haya comenzado con acuerdo del consumidor". Si el coach ya
 * inició el plan (asignó rutina, hizo check-ins, etc.) podría aplicar
 * la excepción. NO se asume aquí: la excepción NO se implementa en V1
 * sin dictamen legal firmado. Está documentada en docs/open-questions.md.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const REVOCATION_WINDOW_DAYS = 10;

const revokeSchema = z.object({
  assignment_id: z.string().uuid("ID de contratación inválido"),
});

/** Stub del adaptador de reembolso — Fase B pendiente. */
async function refundAdapter(_params: {
  assignmentId: string;
  gatewayPaymentId: string | null;
  amount: number;
  currency: string;
}): Promise<{ ok: false; pendingPhaseB: true }> {
  // HUMAN_REQUIRED — Fase B: llamar a la API de reembolso de Mercado Pago.
  // Por ahora solo registra el pedido en audit_log y devuelve pending.
  return { ok: false, pendingPhaseB: true };
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

    const body: unknown = await request.json();
    const parsed = revokeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { assignment_id } = parsed.data;

    // 1. Obtener el assignment — debe pertenecer al usuario autenticado
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: assignment, error: fetchError } = await (supabase as any)
      .from("coach_assignments")
      .select(
        "id, student_id, coach_id, package_id, payment_id, status, created_at, refunded_at"
      )
      .eq("id", assignment_id)
      .eq("student_id", user.id)
      .single();

    if (fetchError || !assignment) {
      return NextResponse.json(
        { error: "Contratación no encontrada" },
        { status: 404 }
      );
    }

    // 2. Validar que no esté ya cancelado/reembolsado
    if (
      assignment.status === "canceled" ||
      assignment.status === "refunded"
    ) {
      return NextResponse.json(
        { error: "La contratación ya fue cancelada o reembolsada" },
        { status: 409 }
      );
    }

    // 3. Validar ventana de 10 días corridos
    const createdAt = new Date(assignment.created_at as string);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays > REVOCATION_WINDOW_DAYS) {
      return NextResponse.json(
        {
          error: "Fuera de la ventana de arrepentimiento",
          detail: `El derecho de arrepentimiento vence 10 días corridos desde la contratación (${createdAt.toLocaleDateString("es-AR")}).`,
        },
        { status: 422 }
      );
    }

    // 4. Obtener datos del pago asociado para el stub de reembolso
    let gatewayPaymentId: string | null = null;
    let paymentAmount = 0;
    let paymentCurrency = "ARS";

    if (assignment.payment_id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: payment } = await (supabase as any)
        .from("payments")
        .select("gateway_payment_id, amount, currency")
        .eq("id", assignment.payment_id)
        .single();

      if (payment) {
        gatewayPaymentId = payment.gateway_payment_id as string | null;
        paymentAmount = payment.amount as number;
        paymentCurrency = payment.currency as string;
      }
    }

    // 5. Cancelar el assignment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from("coach_assignments")
      .update({
        status: "canceled",
        ended_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq("id", assignment_id)
      .eq("student_id", user.id);

    if (updateError) {
      console.error("[revoke] update error:", updateError);
      return NextResponse.json(
        { error: "Error al cancelar la contratación" },
        { status: 500 }
      );
    }

    // 6. Llamar al stub de reembolso (Fase B pendiente)
    const refundResult = await refundAdapter({
      assignmentId: assignment_id,
      gatewayPaymentId,
      amount: paymentAmount,
      currency: paymentCurrency,
    });

    // 7. Registrar en audit_log (append-only — acción financiera)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("audit_log").insert({
      actor_id: user.id,
      entity_type: "coach_assignment",
      entity_id: assignment_id,
      action: "revoke_arrepentimiento",
      payload: {
        student_id: user.id,
        coach_id: assignment.coach_id,
        package_id: assignment.package_id,
        payment_id: assignment.payment_id,
        gateway_payment_id: gatewayPaymentId,
        amount: paymentAmount,
        currency: paymentCurrency,
        revoked_at: now.toISOString(),
        refund_status: refundResult.pendingPhaseB ? "pending_phase_b" : "ok",
        window_days_elapsed: Math.floor(diffDays),
        // DUDA ABIERTA: excepción por servicio iniciado — no aplica hasta
        // dictamen legal (ver docs/open-questions.md).
        service_started_exception_applied: false,
      },
    });

    return NextResponse.json({
      ok: true,
      refund_status: "pending",
      // Aclaración al cliente: el reembolso real se tramita en Fase B
      refund_note:
        "Tu pedido de reembolso fue registrado. El dinero se acreditará en el plazo que establezca Mercado Pago (generalmente 5–15 días hábiles). Si no recibís la acreditación, contactá a soporte@forzza.app.",
    });
  } catch (err) {
    console.error("[revoke] unexpected error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
