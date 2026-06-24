import { requireCoach } from "@/lib/auth/coach";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ErrorState } from "@forzza/ui/web";
import { StaggerList } from "./StaggerList";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "coach" });
  return { title: t("alumnos.metaTitle") };
}

type AssignmentStatus = "pending" | "active" | "completed" | "refunded" | "canceled";

interface StudentAssignment {
  id: string;
  status: AssignmentStatus;
  started_at: string | null;
  student_id: string;
  student_profiles: {
    display_name: string | null;
    user_id: string;
  } | null;
  coach_packages: {
    title: string;
  } | null;
}

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

export default async function AlumnosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "coach" });

  const { supabase, coachProfileId } = await requireCoach();

  const { data: assignments, error } = await supabase
    .from("coach_assignments")
    .select(
      `
      id,
      status,
      started_at,
      student_id,
      coach_packages!coach_assignments_package_id_fkey(title)
    `
    )
    .eq("coach_id", coachProfileId)
    .order("started_at", { ascending: false });

  if (error) {
    console.error("Error fetching assignments:", error);
    return (
      <ErrorState
        title={t("alumnos.errorTitle")}
        description={t("alumnos.errorDesc")}
      />
    );
  }

  const rawAssignments = assignments ?? [];

  // Fetch student_profiles separately (student_id → users(id), no direct FK to student_profiles)
  const studentIds = rawAssignments.map((a) => a.student_id).filter(Boolean);
  const { data: studentProfilesData } = studentIds.length > 0
    ? await supabase
        .from("student_profiles")
        .select("user_id, display_name")
        .in("user_id", studentIds)
    : { data: [] };

  const profileByUserId = new Map(
    (studentProfilesData ?? []).map((p) => [p.user_id, p])
  );

  const rows: StudentAssignment[] = rawAssignments.map((a) => ({
    ...a,
    student_profiles: profileByUserId.get(a.student_id) ?? null,
    coach_packages: (a as unknown as { coach_packages: { title: string } | null }).coach_packages,
  }));

  const statusLabel: Record<AssignmentStatus, string> = {
    pending: t("alumnos.statusPaused"),
    active: t("alumnos.statusActive"),
    completed: t("alumnos.statusCancelled"),
    refunded: t("alumnos.statusCancelled"),
    canceled: t("alumnos.statusCancelled"),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">{t("alumnos.title")}</h1>
        <p className="text-muted text-sm mt-1">
          {t("alumnos.subtitle", { count: rows.length })}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-4xl mb-4">👥</p>
          <p className="text-text text-lg font-semibold">{t("alumnos.emptyState")}</p>
          <p className="text-muted text-sm mt-2">
            {t("alumnos.emptySubtitle")}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-3">{t("alumnos.colStudent")}</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">{t("alumnos.colPackage")}</th>
                <th className="text-left px-6 py-3 hidden sm:table-cell">{t("alumnos.colSince")}</th>
                <th className="text-left px-6 py-3">{t("alumnos.colStatus")}</th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-2">
              <StaggerList>
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-2 [transition:background-color_var(--duration-dropdown)_var(--ease-out),transform_var(--duration-press)_var(--ease-out)] active:scale-[var(--press-scale)]">
                  <td className="px-6 py-4">
                    <span className="font-medium text-text">
                      {row.student_profiles?.display_name ?? "Sin nombre"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted hidden md:table-cell">
                    {row.coach_packages?.title ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-muted hidden sm:table-cell">
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
                      className="text-lime hover:text-[#AADD00] text-xs font-medium transition-colors"
                    >
                      {t("alumnos.viewDetail")} →
                    </Link>
                  </td>
                </tr>
              ))}
              </StaggerList>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
