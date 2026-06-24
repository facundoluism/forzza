import { requireCoach } from "@/lib/auth/coach";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StaggerList } from "../alumnos/StaggerList";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "coach" });
  return { title: t("checkins.metaTitle") };
}

interface CheckinTemplate {
  id: string;
  title: string;
  created_at: string;
  question_count: number;
  last_response_at: string | null;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function CheckinsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "coach" });

  const { supabase, coachProfileId } = await requireCoach();

  const { data: templates, error } = await supabase
    .from("checkin_templates")
    .select("id, title, questions, created_at")
    .eq("coach_id", coachProfileId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching templates:", error);
  }

  // For each template, get last response
  const enriched: CheckinTemplate[] = [];
  for (const tmpl of templates ?? []) {
    const { data: lastResp } = await supabase
      .from("checkin_responses")
      .select("submitted_at")
      .eq("template_id", tmpl.id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .single();

    const questions = Array.isArray(tmpl.questions) ? tmpl.questions : [];

    enriched.push({
      id: tmpl.id,
      title: tmpl.title,
      created_at: tmpl.created_at,
      question_count: questions.length,
      last_response_at: lastResp?.submitted_at ?? null,
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">{t("checkins.title")}</h1>
          <p className="text-muted text-sm mt-1">
            {t("checkins.subtitle", { count: enriched.length })}
          </p>
        </div>
        <Link
          href="/coach/checkins/nueva"
          className="px-4 py-2 bg-[#C8FF00] text-[#0A0A0A] rounded-lg text-sm font-semibold hover:bg-[#AADD00] transition-colors"
        >
          {t("checkins.btnCreate")}
        </Link>
      </div>

      {enriched.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-4xl mb-4">✅</p>
          <p className="text-text text-lg font-semibold">{t("checkins.emptyState")}</p>
          <p className="text-muted text-sm mt-2 mb-6">
            {t("checkins.emptySubtitle")}
          </p>
          <Link
            href="/coach/checkins/nueva"
            className="px-6 py-3 bg-[#C8FF00] text-[#0A0A0A] rounded-lg text-sm font-semibold hover:bg-[#AADD00] transition-colors"
          >
            {t("checkins.btnCreate")}
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-3">{t("checkins.colTemplate")}</th>
                <th className="text-left px-6 py-3 hidden sm:table-cell">{t("checkins.colQuestions")}</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">{t("checkins.colLastResponse")}</th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-2">
              <StaggerList>
              {enriched.map((tmpl) => (
                <tr key={tmpl.id} className="hover:bg-surface-2 [transition:background-color_var(--duration-dropdown)_var(--ease-out),transform_var(--duration-press)_var(--ease-out)] active:scale-[var(--press-scale)]">
                  <td className="px-6 py-4">
                    <span className="font-medium text-text">{tmpl.title}</span>
                    <p className="text-muted text-xs mt-0.5 opacity-60">
                      {formatDate(tmpl.created_at)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-muted hidden sm:table-cell">
                    {tmpl.question_count}
                  </td>
                  <td className="px-6 py-4 text-muted hidden md:table-cell">
                    {tmpl.last_response_at ? formatDate(tmpl.last_response_at) : t("checkins.noResponses")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/coach/checkins/${tmpl.id}/respuestas`}
                      className="text-lime hover:text-[#AADD00] text-xs font-medium transition-colors"
                    >
                      {t("checkins.viewResponses")} →
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
