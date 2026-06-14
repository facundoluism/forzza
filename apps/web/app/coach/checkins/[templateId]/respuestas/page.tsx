import { requireCoach } from "@/lib/auth/coach";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Respuestas de check-in — Forzza Coach",
};

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
  answers: Record<string, Answer> | Answer[];
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

export default async function RespuestasPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const { supabase, coachUserId } = await requireCoach();

  // Verify template belongs to this coach
  const { data: template } = await supabase
    .from("checkin_templates")
    .select("id, title, questions")
    .eq("id", templateId)
    .eq("coach_id", coachUserId)
    .single();

  if (!template) notFound();

  // Build question label map from JSONB questions array
  const questionsArray: QuestionJson[] = Array.isArray(template.questions)
    ? (template.questions as QuestionJson[])
    : [];
  const questionMap = new Map(
    questionsArray.map((q, i) => [String(i), q.label])
  );

  // Fetch responses
  const { data: responses, error } = await supabase
    .from("checkin_responses")
    .select(
      `
      id,
      submitted_at,
      answers,
      student_profiles!checkin_responses_student_id_fkey(display_name, user_id)
    `
    )
    .eq("template_id", templateId)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching responses:", error);
  }

  const rows = (responses ?? []) as unknown as CheckinResponse[];

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link
          href="/coach/checkins"
          className="text-[#666666] hover:text-[#AAAAAA] text-sm transition-colors"
        >
          ← Volver a check-ins
        </Link>
        <h1 className="text-2xl font-bold text-[#FAFAFA] mt-2">{template.title}</h1>
        <p className="text-[#666666] text-sm mt-1">
          {rows.length} respuesta{rows.length !== 1 ? "s" : ""}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-12 text-center">
          <p className="text-[#666666] text-lg">Todavía no hay respuestas para esta plantilla.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((response) => (
            <details
              key={response.id}
              className="rounded-xl border border-[#2A2A2A] bg-[#111111] overflow-hidden group"
            >
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-[#161616] transition-colors list-none">
                <div>
                  <span className="font-medium text-[#FAFAFA]">
                    {response.student_profiles?.display_name ?? "Alumno sin nombre"}
                  </span>
                  <p className="text-[#666666] text-xs mt-0.5">
                    {formatDate(response.submitted_at)}
                  </p>
                </div>
                <span className="text-[#666666] text-sm group-open:rotate-180 transition-transform">
                  ▾
                </span>
              </summary>
              <div className="px-6 py-4 border-t border-[#1A1A1A] space-y-3">
                {response.answers && typeof response.answers === "object" ? (
                  Object.entries(response.answers as Record<string, unknown>).map(
                    ([key, val]) => (
                      <div key={key} className="flex gap-3 text-sm">
                        <span className="text-[#666666] min-w-0 flex-shrink-0">
                          {questionMap.get(key) ?? key}:
                        </span>
                        <span className="text-[#FAFAFA]">
                          {renderValue(val)}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-[#444444] text-sm">Sin respuestas</p>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
