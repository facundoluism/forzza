import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const scheduleSchema = z.object({
  assignment_id: z.string().uuid(),
  student_id: z.string().uuid(),
  routine_id: z.string().uuid(),
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato: YYYY-MM-DD"),
  notes: z.string().max(500).optional(),
});

/** GET /api/coach/calendario?year=YYYY&month=MM
 *  Returns all routine_schedule rows for the authenticated coach in the given month.
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { data: coachProfile } = await supabase
      .from("coach_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!coachProfile) return NextResponse.json({ error: "Perfil de coach no encontrado" }, { status: 404 });

    const url = new URL(request.url);
    const year = Number(url.searchParams.get("year") ?? new Date().getFullYear());
    const month = Number(url.searchParams.get("month") ?? new Date().getMonth() + 1);

    const from = `${year}-${String(month).padStart(2, "0")}-01`;
    const toDate = new Date(year, month, 0); // last day of month
    const to = `${year}-${String(month).padStart(2, "0")}-${String(toDate.getDate()).padStart(2, "0")}`;

    const { data, error } = await supabase
      .from("routine_schedule")
      .select(`
        id,
        scheduled_date,
        notes,
        student_id,
        routine_id,
        assignment_id,
        routines!routine_schedule_routine_id_fkey(id, title),
        student_profiles!routine_schedule_student_id_fkey(display_name, user_id)
      `)
      .eq("coach_id", coachProfile.id)
      .gte("scheduled_date", from)
      .lte("scheduled_date", to)
      .order("scheduled_date", { ascending: true });

    if (error) {
      console.error("Error fetching routine_schedule:", error);
      return NextResponse.json({ error: "Error al cargar el calendario" }, { status: 500 });
    }

    return NextResponse.json({ items: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

/** POST /api/coach/calendario
 *  Upserts a routine_schedule entry (unique: assignment_id + scheduled_date).
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { data: coachProfile } = await supabase
      .from("coach_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!coachProfile) return NextResponse.json({ error: "Perfil de coach no encontrado" }, { status: 404 });

    const body: unknown = await request.json();
    const parsed = scheduleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
    }

    const { assignment_id, student_id, routine_id, scheduled_date, notes } = parsed.data;

    // Verify coach owns this assignment
    const { data: assignment } = await supabase
      .from("coach_assignments")
      .select("id")
      .eq("id", assignment_id)
      .eq("coach_id", coachProfile.id)
      .eq("student_id", student_id)
      .eq("status", "active")
      .single();

    if (!assignment) {
      return NextResponse.json({ error: "Asignación no encontrada o inactiva" }, { status: 403 });
    }

    // Verify routine belongs to this coach
    const { data: routine } = await supabase
      .from("routines")
      .select("id")
      .eq("id", routine_id)
      .eq("coach_id", coachProfile.id)
      .single();

    if (!routine) {
      return NextResponse.json({ error: "Rutina no encontrada" }, { status: 403 });
    }

    // Upsert — conflict on (assignment_id, scheduled_date)
    const { data: upserted, error: upsertError } = await supabase
      .from("routine_schedule")
      .upsert(
        {
          assignment_id,
          student_id,
          coach_id: coachProfile.id,
          routine_id,
          scheduled_date,
          notes: notes ?? null,
        },
        { onConflict: "assignment_id,scheduled_date" }
      )
      .select("id")
      .single();

    if (upsertError || !upserted) {
      console.error("Error upserting routine_schedule:", upsertError);
      return NextResponse.json({ error: "Error al guardar la asignación" }, { status: 500 });
    }

    return NextResponse.json({ id: upserted.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

/** DELETE /api/coach/calendario?id=<schedule_id>
 *  Removes a routine_schedule entry.
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { data: coachProfile } = await supabase
      .from("coach_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!coachProfile) return NextResponse.json({ error: "Perfil de coach no encontrado" }, { status: 404 });

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    const { error } = await supabase
      .from("routine_schedule")
      .delete()
      .eq("id", id)
      .eq("coach_id", coachProfile.id);

    if (error) {
      console.error("Error deleting routine_schedule:", error);
      return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
