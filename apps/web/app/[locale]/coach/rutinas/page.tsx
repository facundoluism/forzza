import { requireCoach } from "@/lib/auth/coach";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ErrorState } from "@forzza/ui/web";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "coach" });
  return { title: t("rutinas.metaTitle") };
}

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

export default async function RutinasPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "coach" });

  const { supabase, coachProfileId } = await requireCoach();

  const { data: routines, error } = await supabase
    .from("routines")
    .select(
      `
      id,
      title,
      created_at,
      student_id
    `
    )
    .eq("coach_id", coachProfileId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching routines:", error);
    return (
      <ErrorState
        title={t("rutinas.errorTitle")}
        description={t("rutinas.errorDesc")}
      />
    );
  }

  const rawRoutines = routines ?? [];

  // Fetch student_profiles separately (routines.student_id → users(id), no direct FK to student_profiles)
  const studentIds = rawRoutines
    .map((r) => r.student_id)
    .filter((id): id is string => Boolean(id));
  const { data: studentProfilesData } = studentIds.length > 0
    ? await supabase
        .from("student_profiles")
        .select("user_id, display_name")
        .in("user_id", studentIds)
    : { data: [] };

  const profileByUserId = new Map(
    (studentProfilesData ?? []).map((p) => [p.user_id, p])
  );

  const rows: Routine[] = rawRoutines.map((r) => ({
    ...r,
    student_profiles: r.student_id ? (profileByUserId.get(r.student_id) ?? null) : null,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">{t("rutinas.title")}</h1>
          <p className="text-muted text-sm mt-1">
            {t("rutinas.subtitle", { count: rows.length })}
          </p>
        </div>
        <Link
          href="/coach/rutinas/nueva"
          className="px-4 py-2 bg-[#C8FF00] text-[#0A0A0A] rounded-lg text-sm font-semibold hover:bg-[#AADD00] transition-colors"
        >
          {t("rutinas.btnCreate")}
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-text text-lg font-semibold">{t("rutinas.emptyState")}</p>
          <p className="text-muted text-sm mt-2 mb-6">
            {t("rutinas.emptySubtitle")}
          </p>
          <Link
            href="/coach/rutinas/nueva"
            className="px-6 py-3 bg-[#C8FF00] text-[#0A0A0A] rounded-lg text-sm font-semibold hover:bg-[#AADD00] transition-colors"
          >
            {t("rutinas.btnCreate")}
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
                {formatDate(routine.created_at)}
              </p>
              {routine.student_profiles?.display_name && (
                <p className="text-muted text-xs mb-3">
                  {routine.student_profiles.display_name}
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
                  {t("rutinas.viewDetail")} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
