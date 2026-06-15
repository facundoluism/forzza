import { requireCoach } from "@/lib/auth/coach";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alumnos — Forzza Coach",
};

type AssignmentStatus = "pending" | "active" | "completed" | "refunded" | "canceled";

interface StudentAssignment {
  id: string;
  status: AssignmentStatus;
  started_at: string | null;
  student_profiles: {
    display_name: string | null;
    user_id: string;
  } | null;
  coach_packages: {
    title: string;
  } | null;
}

const statusLabel: Record<AssignmentStatus, string> = {
  pending: "Pendiente",
  active: "Activo",
  completed: "Completado",
  refunded: "Reembolsado",
  canceled: "Cancelado",
};

const statusColors: Record<AssignmentStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  active: "bg-green-500/10 text-green-400 border border-green-500/20",
  completed: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  refunded: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  canceled: "bg-red-500/10 text-red-400 border border-red-500/20",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AlumnosPage() {
  const { supabase, coachProfileId } = await requireCoach();

  const { data: assignments, error } = await supabase
    .from("coach_assignments")
    .select(
      `
      id,
      status,
      started_at,
      student_id,
      student_profiles!coach_assignments_student_id_fkey(display_name, user_id),
      coach_packages!coach_assignments_package_id_fkey(title)
    `
    )
    .eq("coach_id", coachProfileId)
    .order("started_at", { ascending: false });

  if (error) {
    console.error("Error fetching assignments:", error);
  }

  const rows = (assignments ?? []) as unknown as StudentAssignment[];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Alumnos</h1>
        <p className="text-[#666666] text-sm mt-1">
          {rows.length} alumno{rows.length !== 1 ? "s" : ""} en total
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-12 text-center">
          <p className="text-4xl mb-4">👥</p>
          <p className="text-[#FAFAFA] text-lg font-semibold">Todavía no tenés alumnos asignados.</p>
          <p className="text-[#666666] text-sm mt-2">
            Cuando un alumno te seleccione, aparecerá acá.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[#666666] text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-3">Alumno</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">Paquete</th>
                <th className="text-left px-6 py-3 hidden sm:table-cell">Inicio</th>
                <th className="text-left px-6 py-3">Estado</th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-[#161616] transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-[#FAFAFA]">
                      {row.student_profiles?.display_name ?? "Sin nombre"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#AAAAAA] hidden md:table-cell">
                    {row.coach_packages?.title ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-[#AAAAAA] hidden sm:table-cell">
                    {formatDate(row.started_at)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[row.status]}`}
                    >
                      {statusLabel[row.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/coach/alumnos/${row.student_profiles?.user_id ?? ""}`}
                      className="text-[#C8FF00] hover:text-[#AADD00] text-xs font-medium transition-colors"
                    >
                      Ver detalle →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
