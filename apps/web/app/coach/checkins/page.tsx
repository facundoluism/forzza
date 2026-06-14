import { requireCoach } from "@/lib/auth/coach";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check-ins — Forzza Coach",
};

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

export default async function CheckinsPage() {
  const { supabase, coachUserId } = await requireCoach();

  const { data: templates, error } = await supabase
    .from("checkin_templates")
    .select("id, title, questions, created_at")
    .eq("coach_id", coachUserId)
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
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Check-ins</h1>
          <p className="text-[#666666] text-sm mt-1">
            {enriched.length} plantilla{enriched.length !== 1 ? "s" : ""} creadas
          </p>
        </div>
        <Link
          href="/coach/checkins/nueva"
          className="px-4 py-2 bg-[#C8FF00] text-[#0A0A0A] rounded-lg text-sm font-semibold hover:bg-[#AADD00] transition-colors"
        >
          + Nueva plantilla
        </Link>
      </div>

      {enriched.length === 0 ? (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-12 text-center">
          <p className="text-4xl mb-4">✅</p>
          <p className="text-[#FAFAFA] text-lg font-semibold">Todavía no creaste plantillas de check-in.</p>
          <p className="text-[#666666] text-sm mt-2 mb-6">
            Creá plantillas para hacer seguimiento de tus alumnos.
          </p>
          <Link
            href="/coach/checkins/nueva"
            className="px-6 py-3 bg-[#C8FF00] text-[#0A0A0A] rounded-lg text-sm font-semibold hover:bg-[#AADD00] transition-colors"
          >
            Crear primera plantilla
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[#666666] text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-3">Plantilla</th>
                <th className="text-left px-6 py-3 hidden sm:table-cell">Preguntas</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">Última respuesta</th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {enriched.map((tmpl) => (
                <tr key={tmpl.id} className="hover:bg-[#161616] transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-[#FAFAFA]">{tmpl.title}</span>
                    <p className="text-[#444444] text-xs mt-0.5">
                      Creada el {formatDate(tmpl.created_at)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-[#AAAAAA] hidden sm:table-cell">
                    {tmpl.question_count} pregunta{tmpl.question_count !== 1 ? "s" : ""}
                  </td>
                  <td className="px-6 py-4 text-[#AAAAAA] hidden md:table-cell">
                    {formatDate(tmpl.last_response_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/coach/checkins/${tmpl.id}/respuestas`}
                      className="text-[#C8FF00] hover:text-[#AADD00] text-xs font-medium transition-colors"
                    >
                      Ver respuestas →
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
