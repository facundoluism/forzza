import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import type { Json } from "@forzza/db-types";

type AllowedRole = "student" | "coach" | "promoter";
const ALLOWED_ROLES: AllowedRole[] = ["student", "coach", "promoter"];

// Settlement statuses that represent open/pending money — not yet finalized.
// "transferred" and "rejected" are terminal states and do NOT block deactivation.
const OPEN_SETTLEMENT_STATUSES = [
  "pending",
  "pending_invoice",
  "invoiced",
  "approved",
] as const;

interface PatchBody {
  action: "set_role" | "deactivate" | "restore";
  role?: string;
}

/**
 * Returns the coach_profiles.id for the given user, or null if the user has
 * no coach profile.
 */
async function fetchCoachProfileId(
  adminClient: Awaited<ReturnType<typeof requireAdmin>>["adminClient"],
  userId: string
): Promise<string | null> {
  const { data } = await adminClient
    .from("coach_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  return data?.id ?? null;
}

/**
 * Returns true if the coach has at least one settlement in an open status
 * (pending, pending_invoice, invoiced, approved). These statuses mean there is
 * unsettled money that must be resolved before the account can be closed.
 */
async function coachHasOpenSettlements(
  adminClient: Awaited<ReturnType<typeof requireAdmin>>["adminClient"],
  coachProfileId: string
): Promise<boolean> {
  const { data } = await adminClient
    .from("settlements")
    .select("id")
    .eq("coach_id", coachProfileId)
    .in("status", [...OPEN_SETTLEMENT_STATUSES])
    .limit(1);

  return (data?.length ?? 0) > 0;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { adminClient, user: adminUser } = await requireAdmin();
    const { userId } = await params;

    const body = (await req.json()) as PatchBody;
    const { action } = body;

    if (!action || !["set_role", "deactivate", "restore"].includes(action)) {
      return NextResponse.json({ error: "Acción inválida." }, { status: 400 });
    }

    // Fetch current user state — needed for all three actions
    const { data: targetUser, error: fetchError } = await adminClient
      .from("users")
      .select("id, role, country, deleted_at")
      .eq("id", userId)
      .single();

    if (fetchError || !targetUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();

    // ── Guard: auto-action (set_role / deactivate on own account) ────────────
    // Restore on own account is intentionally allowed (no risk).
    if (
      adminUser.id === userId &&
      (action === "set_role" || action === "deactivate")
    ) {
      return NextResponse.json(
        {
          error:
            "No podés cambiar el rol ni dar de baja tu propia cuenta.",
        },
        { status: 403 }
      );
    }

    // ── Guard: owner accounts are immutable from the UI ──────────────────────
    if (
      targetUser.role === "owner" &&
      (action === "set_role" || action === "deactivate")
    ) {
      return NextResponse.json(
        {
          error:
            "No se puede modificar ni dar de baja una cuenta owner desde la UI.",
        },
        { status: 403 }
      );
    }

    // ── Action: set_role ─────────────────────────────────────────────────────
    if (action === "set_role") {
      const newRole = body.role;

      // Reject owner promotion — business invariant
      if (newRole === "owner") {
        return NextResponse.json(
          { error: "No se puede asignar el rol 'owner' desde la UI." },
          { status: 400 }
        );
      }

      if (!newRole || !ALLOWED_ROLES.includes(newRole as AllowedRole)) {
        return NextResponse.json(
          {
            error:
              "Rol inválido. Roles permitidos: student, coach, promoter.",
          },
          { status: 400 }
        );
      }

      // Guard: demoting a coach with open settlements is blocked
      if (targetUser.role === "coach" && newRole !== "coach") {
        const coachProfileId = await fetchCoachProfileId(adminClient, userId);
        if (coachProfileId !== null) {
          const hasOpen = await coachHasOpenSettlements(
            adminClient,
            coachProfileId
          );
          if (hasOpen) {
            return NextResponse.json(
              {
                error:
                  "El coach tiene liquidaciones abiertas. Resolvelas (factura aprobada + transferido) antes de dar de baja.",
              },
              { status: 409 }
            );
          }
        }
      }

      const previousRole = targetUser.role;

      const { error: updateError } = await adminClient
        .from("users")
        .update({ role: newRole as AllowedRole, updated_at: now })
        .eq("id", userId);

      if (updateError) {
        return NextResponse.json(
          { error: "Error al actualizar el rol." },
          { status: 500 }
        );
      }

      await adminClient.from("audit_log").insert({
        actor_id: adminUser.id,
        action: "user.role_changed",
        entity_type: "users",
        entity_id: userId,
        payload: {
          previous_role: previousRole,
          new_role: newRole,
        },
      });

      return NextResponse.json({ ok: true, role: newRole });
    }

    // ── Action: deactivate ───────────────────────────────────────────────────
    if (action === "deactivate") {
      if (targetUser.deleted_at !== null) {
        return NextResponse.json(
          { error: "El usuario ya está dado de baja." },
          { status: 409 }
        );
      }

      // Guard: coach with open settlements cannot be deactivated
      const coachProfileId = await fetchCoachProfileId(adminClient, userId);
      if (coachProfileId !== null) {
        const hasOpen = await coachHasOpenSettlements(
          adminClient,
          coachProfileId
        );
        if (hasOpen) {
          return NextResponse.json(
            {
              error:
                "El coach tiene liquidaciones abiertas. Resolvelas (factura aprobada + transferido) antes de dar de baja.",
            },
            { status: 409 }
          );
        }
      }

      // Step 1: Resolve active assignments as student + collect affected coaches
      // (mirrors supabase/functions/delete-account/index.ts step 2)
      const { data: activeAssignments } = await adminClient
        .from("coach_assignments")
        .select(
          "id, coach_id, coach_profiles(user_id, display_name)"
        )
        .eq("student_id", userId)
        .in("status", ["pending", "active"]);

      // Step 2: Cancel active subscriptions
      await adminClient
        .from("subscriptions")
        .update({ status: "canceled", canceled_at: now, updated_at: now })
        .eq("user_id", userId)
        .in("status", ["active", "trialing", "past_due"]);

      // Step 3: Cancel coach assignments
      await adminClient
        .from("coach_assignments")
        .update({ status: "canceled", ended_at: now, updated_at: now })
        .eq("student_id", userId)
        .in("status", ["pending", "active"]);

      // Step 4: Notify each affected coach
      // Type gymnastics: the joined select returns coach_profiles as object | null
      type AssignmentRow = {
        id: string;
        coach_id: string;
        coach_profiles: { user_id: string; display_name: string } | null;
      };

      if (activeAssignments && activeAssignments.length > 0) {
        const notifications = (activeAssignments as AssignmentRow[])
          .filter((a) => a.coach_profiles !== null)
          .map((a) => ({
            user_id: a.coach_profiles!.user_id,
            type: "N_STUDENT_ACCOUNT_DELETED",
            title: "Un alumno eliminó su cuenta",
            body: "Un alumno que tenías asignado ha eliminado su cuenta de Forzza. El seguimiento fue cerrado automáticamente.",
            data: { assignment_id: a.id } as Json,
          }));

        if (notifications.length > 0) {
          await adminClient.from("notifications").insert(notifications);
        }
      }

      // Step 5: Soft delete
      await adminClient
        .from("users")
        .update({ deleted_at: now, updated_at: now })
        .eq("id", userId);

      // Step 6: Enqueue anonymization (30 days)
      const anonymizeAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString();

      await adminClient.from("deletion_queue").upsert(
        {
          user_id: userId,
          requested_at: now,
          anonymize_at: anonymizeAt,
          processed_at: null,
        },
        { onConflict: "user_id", ignoreDuplicates: false }
      );

      // Step 7: Audit log — trazabilidad ampliada, sin PII
      const wasCoach = coachProfileId !== null;
      const affectedCoachCount =
        (activeAssignments as AssignmentRow[] | null)?.filter(
          (a) => a.coach_profiles !== null
        ).length ?? 0;

      await adminClient.from("audit_log").insert({
        actor_id: adminUser.id,
        action: "user.deactivated_by_admin",
        entity_type: "users",
        entity_id: userId,
        payload: {
          deleted_at: now,
          anonymize_at: anonymizeAt,
          was_coach: wasCoach,
          affected_coach_count: affectedCoachCount,
        },
      });

      return NextResponse.json({ ok: true, anonymize_at: anonymizeAt });
    }

    // ── Action: restore ──────────────────────────────────────────────────────
    if (action === "restore") {
      if (targetUser.deleted_at === null) {
        return NextResponse.json(
          { error: "El usuario no está dado de baja." },
          { status: 409 }
        );
      }

      // Check if anonymization was already processed (irreversible)
      const { data: queueRow } = await adminClient
        .from("deletion_queue")
        .select("processed_at")
        .eq("user_id", userId)
        .single();

      if (
        queueRow?.processed_at !== null &&
        queueRow?.processed_at !== undefined
      ) {
        return NextResponse.json(
          {
            error:
              "La cuenta ya fue anonimizada. La restauración es irreversible en este punto.",
          },
          { status: 409 }
        );
      }

      // Clear soft delete
      await adminClient
        .from("users")
        .update({ deleted_at: null, updated_at: now })
        .eq("id", userId);

      // Remove from deletion queue
      await adminClient
        .from("deletion_queue")
        .delete()
        .eq("user_id", userId);

      // Audit log
      await adminClient.from("audit_log").insert({
        actor_id: adminUser.id,
        action: "user.restored",
        entity_type: "users",
        entity_id: userId,
        payload: {
          restored_at: now,
          previously_deleted_at: targetUser.deleted_at,
        },
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: "Acción no reconocida." },
      { status: 400 }
    );
  } catch (err) {
    // No PII in logs
    console.error("Admin user PATCH error:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
