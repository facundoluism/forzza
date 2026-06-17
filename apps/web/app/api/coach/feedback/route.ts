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

    // Verify coach role
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "coach") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    // Resolve coach_profiles.id
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
      target_type?: string;
      target_id?: string;
      feedback_text?: string;
    };

    const { student_id, target_type, target_id, feedback_text } = body;

    if (!student_id || !target_type || !target_id || !feedback_text?.trim()) {
      return NextResponse.json(
        { error: "Campos obligatorios faltantes" },
        { status: 400 }
      );
    }

    if (target_type !== "metric" && target_type !== "photo") {
      return NextResponse.json(
        { error: "target_type inválido" },
        { status: 400 }
      );
    }

    // Verify the coach has an active assignment with this student (RLS also enforces this)
    const { data: assignment } = await supabase
      .from("coach_assignments")
      .select(
        `
        id,
        status,
        coach_packages!coach_assignments_package_id_fkey(tier)
      `
      )
      .eq("coach_id", coachProfile.id)
      .eq("student_id", student_id)
      .eq("status", "active")
      .single();

    if (!assignment) {
      return NextResponse.json(
        { error: "No tenés una asignación activa con este alumno" },
        { status: 403 }
      );
    }

    // Only allow feedback for PRO/elite packages
    const pkg = assignment.coach_packages as { tier: string } | null;
    if (!pkg || (pkg.tier !== "pro" && pkg.tier !== "elite")) {
      return NextResponse.json(
        { error: "El alumno debe tener un paquete PRO o elite para recibir feedback" },
        { status: 403 }
      );
    }

    const { data: inserted, error: insertError } = await supabase
      .from("coach_feedback")
      .insert({
        coach_id: coachProfile.id,
        student_id,
        target_type,
        target_id,
        feedback_text: feedback_text.trim(),
      })
      .select("id, created_at")
      .single();

    if (insertError) {
      console.error("Error inserting coach_feedback:", insertError);
      return NextResponse.json(
        { error: "Error al guardar el comentario" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: inserted.id, created_at: inserted.created_at });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
