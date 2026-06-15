import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

/**
 * Contrato canónico JSONB routines.exercises — idéntico al contrato de mobile.
 * reps es string para admitir rangos como "8-12".
 * name es snapshot del nombre del ejercicio al momento de crear la rutina.
 */
const exerciseSchema = z.object({
  exercise_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  order: z.number().int().positive(),
  sets: z.number().int().positive(),
  reps: z.string().min(1).max(20),
  rest_seconds: z.number().int().min(0),
  duration_seconds: z.number().int().positive().nullable().optional(),
  notes: z.string().max(500).optional(),
});

const routineSchema = z.object({
  name: z.string().min(1).max(200),
  // student_id must be a valid UUID when provided — empty string is rejected
  student_id: z.string().uuid("El ID del alumno no es válido").optional(),
  exercises: z.array(exerciseSchema).min(1),
});

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
    const { data: userRow } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userRow?.role !== "coach") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    // Resolve coach_profiles.id — all coach tables use this, NOT the auth user id
    const { data: coachProfile } = await supabase
      .from("coach_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!coachProfile) {
      return NextResponse.json(
        { error: "Perfil de coach no encontrado" },
        { status: 404 }
      );
    }

    const coachProfileId = coachProfile.id;

    const body: unknown = await request.json();
    const parsed = routineSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, student_id, exercises } = parsed.data;

    // student_id is required by DB schema (NOT NULL). Reject if not provided.
    if (!student_id) {
      return NextResponse.json(
        { error: "Seleccioná un alumno para asignar la rutina." },
        { status: 400 }
      );
    }

    // Verify this coach has an active assignment with that student
    const { data: assignment } = await supabase
      .from("coach_assignments")
      .select("id")
      .eq("coach_id", coachProfileId)
      .eq("student_id", student_id)
      .single();

    if (!assignment) {
      return NextResponse.json(
        { error: "No tenés una asignación con ese alumno" },
        { status: 403 }
      );
    }

    // Build exercises JSONB payload — contrato canónico, idéntico al de mobile
    const exercisesJson = exercises.map((ex) => ({
      exercise_id: ex.exercise_id,
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      rest_seconds: ex.rest_seconds,
      duration_seconds: ex.duration_seconds ?? null,
      order: ex.order,
      ...(ex.notes ? { notes: ex.notes } : {}),
    }));

    // Create routine with exercises as JSONB
    const { data: routine, error: routineError } = await supabase
      .from("routines")
      .insert({
        coach_id: coachProfileId,
        student_id,
        title: name,
        exercises: exercisesJson,
      })
      .select("id")
      .single();

    if (routineError || !routine) {
      console.error("Error creating routine:", routineError);
      return NextResponse.json(
        { error: "Error al crear la rutina" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: routine.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
