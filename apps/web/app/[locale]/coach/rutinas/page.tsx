import { requireCoach } from "@/lib/auth/coach";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rutinas — Forzza Coach",
};

interface Routine {
  id: string;
  title: string;
  created_at: string;
  student_id: string | null;
  student_profiles: { display_name: string | null } | null;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function RutinasPage() {
  const { supabase, coachProfileId } = await requireCoach();

  const { data: routines, error } = await supabase
    .from("routines")
    .select(
      `
      id,
      title,
      created_at,
      student_id,
      student_profiles!routines_student_id_fkey(display_name)
    `
    )
    .eq("coach_id", coachProfileId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching routines:", error);
  }

  const rows = (routines ?? []) as unknown as Routine[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Rutinas</h1>
          <p className="text-muted text-sm mt-1">
            {rows.length} rutina{rows.length !== 1 ? "s" : ""} creadas
          </p>
        </div>
        <Link
          href="/coach/rutinas/nueva"
          className="px-4 py-2 bg-[#C8FF00] text-[#0A0A0A] rounded-lg text-sm font-semibold hover:bg-[#AADD00] transition-colors"
        >
          + Nueva rutina
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-text text-lg font-semibold">Todavía no creaste ninguna rutina.</p>
          <p className="text-muted text-sm mt-2 mb-6">
            Creá rutinas y asignálas a tus alumnos.
          </p>
          <Link
            href="/coach/rutinas/nueva"
            className="px-6 py-3 bg-[#C8FF00] text-[#0A0A0A] rounded-lg text-sm font-semibold hover:bg-[#AADD00] transition-colors"
          >
            Crear primera rutina
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((routine) => (
            <div
              key={routine.id}
              className="rounded-xl border border-border bg-surface p-5 hover:border-[#C8FF00]/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex flex-col"
            >
              <h3 className="font-semibold text-text text-base mb-1">
                {routine.title}
              </h3>
              <p className="text-muted text-xs mb-3">
                Creada el {formatDate(routine.created_at)}
              </p>
              {routine.student_profiles?.display_name && (
                <p className="text-muted text-xs mb-3">
                  Asignada a: {routine.student_profiles.display_name}
                </p>
              )}
              {!routine.student_id && (
                <p className="text-muted text-xs mb-3 italic opacity-50">
                  Sin alumno asignado
                </p>
              )}
              <div className="mt-auto pt-3 border-t border-surface-2">
                <Link
                  href={`/coach/rutinas/${routine.id}`}
                  className="text-lime hover:text-[#AADD00] text-xs font-medium transition-colors"
                >
                  Ver rutina →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
