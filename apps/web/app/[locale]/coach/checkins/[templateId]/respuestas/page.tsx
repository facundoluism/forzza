import { requireCoach } from "@/lib/auth/coach";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string; templateId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "coach" });
  return { title: t("checkins.metaTitle") };
}

interface QuestionJson {
  label: string;
  question_type: string;
  required?: boolean;
  order?: number;
  [key: string]: unknown;
}

interface Answer {
  question_label?: string;
  value?: unknown;
  [key: string]: unknown;
}

interface CheckinResponse {
  id: string;
  submitted_at: string;
  answers: Record<string, unknown> | unknown[];
  student_profiles: { display_name: string | null; user_id: string } | null;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "boolean") return val ? "Sí" : "No";
  return String(val);
}

export default async function RespuestasPage({ params }: Props) {
  const { locale, templateId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "coach" });

  const { supabase, coachProfileId } = await requireCoach();

  // Verify template belongs to this coach
  const { data: template } = await supabase
    .from("checkin_templates")
    .select("id, title, questions")
    .eq("id", templateId)
    .eq("coach_id", coachProfileId)
    .single();

  if (!template) notFound();

  // Build question label map from JSONB questions array
  const questionsArray: QuestionJson[] = Array.isArray(template.questions)
    ? (template.questions as QuestionJson[])
    : [];
  const questionMap = new Map(
    questionsArray.map((q, i) => [String(i), q.label])
  );

  // Fetch responses (without student_profiles embed — no direct FK from checkin_responses to student_profiles)
  const { data: responses, error } = await supabase
    .from("checkin_responses")
    .select(
      `
      id,
      submitted_at,
      answers,
      student_id
    `
    )
    .eq("template_id", templateId)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching responses:", error);
  }

  const rawResponses = responses ?? [];

  // Fetch student_profiles separately (checkin_responses.student_id → users(id), no direct FK)
  const studentIds = [...new Set(rawResponses.map((r) => (r as unknown as { student_id: string }).student_id).filter(Boolean))];
  const { data: profilesData } = studentIds.length > 0
    ? await supabase
        .from("student_profiles")
        .select("user_id, display_name")
        .in("user_id", studentIds)
    : { data: [] };

  const profileByUserId = new Map(
    (profilesData ?? []).map((p) => [p.user_id, p])
  );

  const rows: CheckinResponse[] = rawResponses.map((r) => {
    const raw = r as unknown as { id: string; submitted_at: string; answers: Record<string, unknown>; student_id: string };
    return {
      id: raw.id,
      submitted_at: raw.submitted_at,
      answers: raw.answers,
      student_profiles: profileByUserId.get(raw.student_id) ?? null,
    };
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link
          href="/coach/checkins"
          className="text-muted hover:text-muted text-sm transition-colors"
        >
          ← {t("checkins.title")}
        </Link>
        <h1 className="text-2xl font-bold text-text mt-2">{template.title}</h1>
        <p className="text-muted text-sm mt-1">
          {t("checkins.respuestas.title", { count: rows.length })}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-muted text-lg">{t("checkins.respuestas.noResponses")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((response) => (
            <details
              key={response.id}
              className="rounded-xl border border-border bg-surface overflow-hidden group"
            >
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-surface-2 transition-colors list-none">
                <div>
                  <span className="font-medium text-text">
                    {response.student_profiles?.display_name ?? "Alumno sin nombre"}
                  </span>
                  <p className="text-muted text-xs mt-0.5">
                    {formatDate(response.submitted_at)}
                  </p>
                </div>
                <span className="text-muted text-sm group-open:rotate-180 transition-transform">
                  ▾
                </span>
              </summary>
              <div className="px-6 py-4 border-t border-surface-2 space-y-3">
                {response.answers && typeof response.answers === "object" ? (
                  Object.entries(response.answers as Record<string, unknown>).map(
                    ([key, val]) => (
                      <div key={key} className="flex gap-3 text-sm">
                        <span className="text-muted min-w-0 flex-shrink-0">
                          {questionMap.get(key) ?? key}:
                        </span>
                        <span className="text-text">
                          {renderValue(val)}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-muted text-sm opacity-50">{t("checkins.respuestas.noResponses")}</p>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
