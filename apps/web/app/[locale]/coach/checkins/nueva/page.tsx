"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type QuestionType = "text" | "number" | "boolean" | "photo";

interface QuestionEntry {
  label: string;
  question_type: QuestionType;
  required: boolean;
  order: number;
}

export default function NuevaPlantillaPage() {
  const router = useRouter();
  const t = useTranslations("coach");
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<QuestionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questionTypeLabels: Record<QuestionType, string> = {
    text: t("checkins.nueva.questionText"),
    number: t("checkins.nueva.questionNumber"),
    boolean: t("checkins.nueva.questionBool"),
    photo: t("checkins.nueva.questionPhoto"),
  };

  function addQuestion() {
    setQuestions((prev) => [
      ...prev,
      {
        label: "",
        question_type: "text",
        required: true,
        order: prev.length + 1,
      },
    ]);
  }

  function updateQuestion(
    index: number,
    field: keyof QuestionEntry,
    value: string | boolean | number
  ) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  }

  function removeQuestion(index: number) {
    setQuestions((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((q, i) => ({ ...q, order: i + 1 }))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("checkins.nueva.errorSave"));
      return;
    }
    if (questions.length === 0) {
      setError(t("checkins.nueva.noQuestions"));
      return;
    }
    const emptyLabel = questions.some((q) => !q.label.trim());
    if (emptyLabel) {
      setError(t("checkins.nueva.errorSave"));
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/coach/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), questions }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? t("checkins.nueva.errorSave"));
        setLoading(false);
        return;
      }

      router.push("/coach/checkins");
    } catch {
      setError(t("checkins.nueva.errorNetwork"));
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-muted hover:text-muted text-sm transition-colors mb-2 block"
        >
          ← {t("checkins.nueva.cancel")}
        </button>
        <h1 className="text-2xl font-bold text-text">{t("checkins.nueva.title")}</h1>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            {t("checkins.nueva.fieldName")} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Check-in semanal"
            className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] transition-colors"
          />
        </div>

        {/* Preguntas */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-text">
              {t("checkins.colQuestions")} <span className="text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={addQuestion}
              className="text-lime hover:text-[#AADD00] text-sm font-medium transition-colors"
            >
              {t("checkins.nueva.addQuestion")}
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-muted text-sm opacity-60">
                {t("checkins.nueva.noQuestions")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-surface p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-muted text-xs font-mono">
                      {t("checkins.nueva.questionNumber", { n: index + 1 })}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-muted hover:text-red-400 text-xs transition-colors"
                    >
                      {t("checkins.nueva.removeQuestion")}
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={q.label}
                      onChange={(e) =>
                        updateQuestion(index, "label", e.target.value)
                      }
                      placeholder={t("checkins.nueva.questionPlaceholder")}
                      className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] text-sm transition-colors"
                    />
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-muted text-xs mb-1">
                          Tipo de respuesta
                        </label>
                        <select
                          value={q.question_type}
                          onChange={(e) =>
                            updateQuestion(
                              index,
                              "question_type",
                              e.target.value as QuestionType
                            )
                          }
                          className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm focus:outline-none focus:border-[#C8FF00] transition-colors"
                        >
                          {(
                            Object.entries(questionTypeLabels) as [
                              QuestionType,
                              string,
                            ][]
                          ).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer mt-4">
                        <input
                          type="checkbox"
                          checked={q.required}
                          onChange={(e) =>
                            updateQuestion(index, "required", e.target.checked)
                          }
                          className="w-4 h-4 accent-[#C8FF00]"
                        />
                        <span className="text-muted text-sm">
                          Obligatoria
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#C8FF00] text-[#0A0A0A] rounded-lg font-semibold hover:bg-[#AADD00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? t("checkins.nueva.btnSaving") : t("checkins.nueva.btnSave")}
        </button>
      </form>
    </div>
  );
}
