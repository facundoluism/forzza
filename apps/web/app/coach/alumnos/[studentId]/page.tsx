import { requireCoach } from "@/lib/auth/coach";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle de alumno — Forzza Coach",
};

type WorkoutStatus = "in_progress" | "completed" | "abandoned";

interface WorkoutSession {
  id: string;
  status: WorkoutStatus;
  started_at: string;
  finished_at: string | null;
  routines: { name: string } | null;
}

interface CheckinResponse {
  id: string;
  submitted_at: string;
  answers: Record<string, unknown>;
  checkin_templates: { name: string } | null;
}

const workoutStatusLabel: Record<WorkoutStatus, string> = {
  in_progress: "En progreso",
  completed: "Completado",
  abandoned: "Abandonado",
};

const workoutStatusColor: Record<WorkoutStatus, string> = {
  in_progress: "text-yellow-400",
  completed: "text-green-400",
  abandoned: "text-red-400",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const { supabase, coachUserId } = await requireCoach();

  // Verify coach has an assignment with this student
  const { data: assignment } = await supabase
    .from("coach_assignments")
    .select(
      `
      id,
      status,
      routine_id,
      routines!coach_assignments_routine_id_fkey(name)
    `
    )
    .eq("coach_id", coachUserId)
    .eq("student_id", studentId)
    .single();

  if (!assignment) notFound();

  // Fetch student profile
  const { data: studentProfile } = await supabase
    .from("student_profiles")
    .select("display_name, goals, level, birth_date, avatar_url")
    .eq("user_id", studentId)
    .single();

  // Last 5 workout sessions
  const { data: sessions } = await supabase
    .from("workout_sessions")
    .select(
      `
      id,
      status,
      started_at,
      finished_at,
      routines!workout_sessions_routine_id_fkey(name)
    `
    )
    .eq("student_id", studentId)
    .order("started_at", { ascending: false })
    .limit(5);

  // Last check-in response
  const { data: lastCheckin } = await supabase
    .from("checkin_responses")
    .select(
      `
      id,
      submitted_at,
      answers,
      checkin_templates!checkin_responses_template_id_fkey(name)
    `
    )
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .single();

  const workoutSessions = (sessions ?? []) as unknown as WorkoutSession[];
  const checkin = lastCheckin as unknown as CheckinResponse | null;
  const assignmentData = assignment as unknown as {
    id: string;
    status: string;
    routine_id: string | null;
    routines: { name: string } | null;
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/coach/alumnos"
            className="text-[#666666] hover:text-[#AAAAAA] text-sm transition-colors"
          >
            ← Volver a alumnos
          </Link>
          <h1 className="text-2xl font-bold text-[#FAFAFA] mt-2">
            {studentProfile?.display_name ?? "Sin nombre"}
          </h1>
          {studentProfile?.level && (
            <p className="text-[#AAAAAA] text-sm mt-1">
              Nivel: {studentProfile.level}
            </p>
          )}
        </div>
      </div>

      {/* Goals & profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-5">
          <h2 className="text-xs uppercase tracking-wider text-[#666666] mb-3">
            Objetivos
          </h2>
          {studentProfile?.goals && studentProfile.goals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {studentProfile.goals.map((goal, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-xs text-[#AAAAAA]"
                >
                  {goal}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[#444444] text-sm">Sin objetivos registrados</p>
          )}
        </div>

        <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-5">
          <h2 className="text-xs uppercase tracking-wider text-[#666666] mb-3">
            Rutina asignada
          </h2>
          {assignmentData.routines ? (
            <div className="flex items-center justify-between">
              <span className="text-[#FAFAFA] font-medium">
                {assignmentData.routines.name}
              </span>
              <Link
                href="/coach/rutinas"
                className="text-[#C8FF00] hover:text-[#AADD00] text-xs transition-colors"
              >
                Cambiar rutina →
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-[#444444] text-sm">Sin rutina asignada</span>
              <Link
                href="/coach/rutinas/nueva"
                className="text-[#C8FF00] hover:text-[#AADD00] text-xs transition-colors"
              >
                Asignar rutina →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Last check-in */}
      <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-5">
        <h2 className="text-xs uppercase tracking-wider text-[#666666] mb-3">
          Último check-in
        </h2>
        {checkin ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#AAAAAA] text-sm">
                {checkin.checkin_templates?.name ?? "Check-in"}
              </span>
              <span className="text-[#666666] text-xs">
                {formatDate(checkin.submitted_at)}
              </span>
            </div>
            <div className="space-y-2">
              {Object.entries(checkin.answers ?? {})
                .slice(0, 3)
                .map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-sm">
                    <span className="text-[#666666]">{key}:</span>
                    <span className="text-[#FAFAFA]">{String(value)}</span>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <p className="text-[#444444] text-sm">Sin respuestas de check-in</p>
        )}
      </div>

      {/* Last 5 workout sessions */}
      <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-5">
        <h2 className="text-xs uppercase tracking-wider text-[#666666] mb-4">
          Últimas sesiones de entrenamiento
        </h2>
        {workoutSessions.length === 0 ? (
          <p className="text-[#444444] text-sm">Sin sesiones registradas</p>
        ) : (
          <div className="space-y-2">
            {workoutSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between py-2 border-b border-[#1A1A1A] last:border-0"
              >
                <div>
                  <p className="text-[#FAFAFA] text-sm font-medium">
                    {session.routines?.name ?? "Entrenamiento libre"}
                  </p>
                  <p className="text-[#666666] text-xs mt-0.5">
                    {formatDate(session.started_at)}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium ${workoutStatusColor[session.status]}`}
                >
                  {workoutStatusLabel[session.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Body metrics placeholder */}
      <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs uppercase tracking-wider text-[#666666]">
            Métricas corporales
          </h2>
          <span className="text-[#444444] text-xs">TODO_CHART</span>
        </div>
        <div className="h-32 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
          <p className="text-[#444444] text-sm">
            Gráfico de progreso — próximamente
          </p>
        </div>
      </div>

      {/* Progress placeholder */}
      <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-wider text-[#666666]">
            Progreso general
          </h2>
          <button
            type="button"
            className="text-[#C8FF00] hover:text-[#AADD00] text-xs transition-colors cursor-not-allowed opacity-50"
            disabled
          >
            Ver progreso (próximamente)
          </button>
        </div>
      </div>
    </div>
  );
}
