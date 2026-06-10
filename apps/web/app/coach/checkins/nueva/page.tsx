"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type QuestionType = "text" | "number" | "boolean" | "photo";

interface QuestionEntry {
  label: string;
  question_type: QuestionType;
  required: boolean;
  order: number;
}

const questionTypeLabels: Record<QuestionType, string> = {
  text: "Texto",
  number: "Número",
  boolean: "Sí / No",
  photo: "Foto",
};

export default function NuevaPlantillaPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<QuestionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError("El nombre de la plantilla es obligatorio.");
      return;
    }
    if (questions.length === 0) {
      setError("Agregá al menos una pregunta.");
      return;
    }
    const emptyLabel = questions.some((q) => !q.label.trim());
    if (emptyLabel) {
      setError("Todas las preguntas deben tener un texto.");
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
        setError(data.error ?? "Error al guardar la plantilla.");
        setLoading(false);
        return;
      }

      router.push("/coach/checkins");
    } catch {
      setError("Error inesperado. Intentá de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[#666666] hover:text-[#AAAAAA] text-sm transition-colors mb-2 block"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Nueva plantilla de check-in</h1>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-[#FAFAFA] mb-2">
            Nombre de la plantilla <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Check-in semanal"
            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#FAFAFA] placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] transition-colors"
          />
        </div>

        {/* Preguntas */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-[#FAFAFA]">
              Preguntas <span className="text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={addQuestion}
              className="text-[#C8FF00] hover:text-[#AADD00] text-sm font-medium transition-colors"
            >
              + Agregar pregunta
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#2A2A2A] p-8 text-center">
              <p className="text-[#444444] text-sm">
                Agregá preguntas a la plantilla
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-[#2A2A2A] bg-[#111111] p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#666666] text-xs font-mono">
                      Pregunta {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-[#666666] hover:text-red-400 text-xs transition-colors"
                    >
                      Quitar
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={q.label}
                      onChange={(e) =>
                        updateQuestion(index, "label", e.target.value)
                      }
                      placeholder="Texto de la pregunta"
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#FAFAFA] placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] text-sm transition-colors"
                    />
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-[#666666] text-xs mb-1">
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
                          className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#FAFAFA] text-sm focus:outline-none focus:border-[#C8FF00] transition-colors"
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
                        <span className="text-[#AAAAAA] text-sm">
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
          {loading ? "Guardando..." : "Guardar plantilla"}
        </button>
      </form>
    </div>
  );
}
