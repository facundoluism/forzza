import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
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

    const body = (await request.json()) as {
      student_id?: string;
      assignment_id?: string | null;
      title?: string;
      scheduled_at?: string;
      room_url?: string;
    };

    const { student_id, assignment_id, title, scheduled_at, room_url } = body;

    if (!student_id || !title?.trim() || !scheduled_at || !room_url?.trim()) {
      return NextResponse.json(
        { error: "Campos obligatorios faltantes" },
        { status: 400 }
      );
    }

    // Validate scheduled_at is a valid date
    const scheduledDate = new Date(scheduled_at);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { error: "Fecha inválida" },
        { status: 400 }
      );
    }

    // Validate room_url is a proper URL
    try {
      new URL(room_url.trim());
    } catch {
      return NextResponse.json(
        { error: "URL de sala inválida" },
        { status: 400 }
      );
    }

    // Verify the coach has an assignment with this student
    const { data: assignment } = await supabase
      .from("coach_assignments")
      .select("id")
      .eq("coach_id", coachProfile.id)
      .eq("student_id", student_id)
      .single();

    if (!assignment) {
      return NextResponse.json(
        { error: "No tenés una asignación con este alumno" },
        { status: 403 }
      );
    }

    const { data: inserted, error: insertError } = await supabase
      .from("live_sessions")
      .insert({
        coach_id: coachProfile.id,
        student_id,
        assignment_id: assignment_id ?? assignment.id,
        title: title.trim(),
        scheduled_at: scheduledDate.toISOString(),
        room_url: room_url.trim(),
        status: "scheduled",
      })
      .select("id, created_at")
      .single();

    if (insertError) {
      console.error("Error inserting live_session:", insertError);
      return NextResponse.json(
        { error: "Error al crear la sesión" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: inserted.id, created_at: inserted.created_at });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
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

    const body = (await request.json()) as {
      id?: string;
      status?: string;
    };

    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Campos obligatorios faltantes" },
        { status: 400 }
      );
    }

    if (status !== "completed" && status !== "canceled") {
      return NextResponse.json(
        { error: "Estado inválido. Solo se permite 'completed' o 'canceled'" },
        { status: 400 }
      );
    }

    // Verify the session belongs to this coach and is in 'scheduled' status
    const { data: session } = await supabase
      .from("live_sessions")
      .select("id, status")
      .eq("id", id)
      .eq("coach_id", coachProfile.id)
      .single();

    if (!session) {
      return NextResponse.json(
        { error: "Sesión no encontrada" },
        { status: 404 }
      );
    }

    if (session.status !== "scheduled") {
      return NextResponse.json(
        { error: "Solo se pueden actualizar sesiones en estado 'scheduled'" },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("live_sessions")
      .update({ status })
      .eq("id", id)
      .eq("coach_id", coachProfile.id);

    if (updateError) {
      console.error("Error updating live_session:", updateError);
      return NextResponse.json(
        { error: "Error al actualizar la sesión" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
