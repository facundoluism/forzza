import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const exerciseSchema = z.object({
  exercise_id: z.string().uuid(),
  order: z.number().int().positive(),
  sets: z.number().int().positive().nullable().optional(),
  reps: z.number().int().positive().nullable().optional(),
  duration_seconds: z.number().int().positive().nullable().optional(),
  rest_seconds: z.number().int().min(0).nullable().optional(),
});

const routineSchema = z.object({
  name: z.string().min(1).max(200),
  student_id: z.string().uuid().optional(),
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
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "coach") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const body: unknown = await request.json();
    const parsed = routineSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, student_id, exercises } = parsed.data;

    // If student_id provided, verify this coach has an assignment with that student
    if (student_id) {
      const { data: assignment } = await supabase
        .from("coach_assignments")
        .select("id")
        .eq("coach_id", user.id)
        .eq("student_id", student_id)
        .single();

      if (!assignment) {
        return NextResponse.json(
          { error: "No tenés una asignación con ese alumno" },
          { status: 403 }
        );
      }
    }

    // Create routine
    const { data: routine, error: routineError } = await supabase
      .from("routines")
      .insert({
        coach_id: user.id,
        student_id: student_id ?? null,
        name,
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

    // Insert routine_exercises
    const exerciseRows = exercises.map((ex) => ({
      routine_id: routine.id,
      exercise_id: ex.exercise_id,
      order: ex.order,
      sets: ex.sets ?? null,
      reps: ex.reps ?? null,
      duration_seconds: ex.duration_seconds ?? null,
      rest_seconds: ex.rest_seconds ?? null,
    }));

    const { error: exError } = await supabase
      .from("routine_exercises")
      .insert(exerciseRows);

    if (exError) {
      console.error("Error inserting routine exercises:", exError);
      // Clean up orphan routine
      await supabase.from("routines").delete().eq("id", routine.id);
      return NextResponse.json(
        { error: "Error al guardar los ejercicios" },
        { status: 500 }
      );
    }

    // If student_id provided: upsert assignment.routine_id
    if (student_id) {
      await supabase
        .from("coach_assignments")
        .update({ routine_id: routine.id })
        .eq("coach_id", user.id)
        .eq("student_id", student_id);
    }

    return NextResponse.json({ id: routine.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
