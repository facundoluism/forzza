"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { ExercisePicker } from "@/components/ExercisePicker";
import type { ExercisePickResult } from "@/components/ExercisePicker";

interface Student {
  user_id: string;
  display_name: string | null;
}

/** Contrato canónico JSONB routines.exercises — idéntico al de mobile */
interface RoutineExerciseEntry {
  exercise_id: string;
  /** Snapshot del nombre al momento de crear la rutina */
  name: string;
  order: number;
  sets: number;
  /** Acepta rangos como "8-12" */
  reps: string;
  rest_seconds: number;
  duration_seconds: number | null;
  notes?: string;
}

export default function NuevaRutinaPage() {
  const router = useRouter();
  const t = useTranslations("coach");
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<RoutineExerciseEntry[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Resolve coach_profiles.id — coach_assignments.coach_id references coach_profiles.id, not auth user id
        const { data: coachProfile } = await supabase
          .from("coach_profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();

        const coachProfileId = coachProfile?.id;

        const { data: stData } = coachProfileId
          ? await supabase
              .from("coach_assignments")
              .select("student_id")
              .eq("coach_id", coachProfileId)
              .eq("status", "active")
          : { data: null };

        if (stData) {
          const studentIds = stData.map((a) => a.student_id).filter(Boolean);
          if (studentIds.length > 0) {
            const { data: profilesData } = await supabase
              .from("student_profiles")
              .select("user_id, display_name")
              .in("user_id", studentIds);
            if (profilesData) {
              setStudents(profilesData as Student[]);
            }
          }
        }
      }
    })();
  }, []);

  function addExercise(result: ExercisePickResult) {
    setExercises((prev) => [
      ...prev,
      {
        exercise_id: result.exercise_id,
        name: result.name,
        order: prev.length + 1,
        sets: 3,
        reps: "10",
        duration_seconds: null,
        rest_seconds: 60,
      },
    ]);
    setShowExercisePicker(false);
  }

  function updateExerciseNumber(
    index: number,
    field: "sets" | "rest_seconds" | "duration_seconds",
    value: number | null
  ) {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  }

  function updateExerciseReps(index: number, value: string) {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, reps: value } : ex))
    );
  }

  function removeExercise(index: number) {
    setExercises((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((ex, i) => ({ ...ex, order: i + 1 }))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("rutinas.nueva.errorSave"));
      return;
    }
    if (exercises.length === 0) {
      setError(t("rutinas.nueva.noExercises"));
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/coach/rutinas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          student_id: selectedStudentId || undefined,
          exercises,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? t("rutinas.nueva.errorSave"));
        setLoading(false);
        return;
      }

      router.push("/coach/rutinas");
    } catch {
      setError(t("rutinas.nueva.errorNetwork"));
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
          ← {t("rutinas.nueva.cancel")}
        </button>
        <h1 className="text-2xl font-bold text-text">{t("rutinas.nueva.title")}</h1>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            {t("rutinas.nueva.fieldName")} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Fuerza upper body"
            className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] transition-colors"
          />
        </div>

        {/* Asignar a alumno */}
        {students.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Asignar a alumno (opcional)
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text focus:outline-none focus:border-[#C8FF00] transition-colors"
            >
              <option value="">Sin asignar</option>
              {students.map((s) => (
                <option key={s.user_id} value={s.user_id}>
                  {s.display_name ?? s.user_id}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Ejercicios */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-text">
              {t("rutinas.exercises")} <span className="text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowExercisePicker(true)}
              className="text-lime hover:text-[#AADD00] text-sm font-medium transition-colors"
            >
              {t("rutinas.nueva.addExercise")}
            </button>
          </div>

          {/* Exercise picker */}
          {showExercisePicker && (
            <div className="mb-4">
              <ExercisePicker
                excludeIds={exercises.map((e) => e.exercise_id)}
                onSelect={addExercise}
                onClose={() => setShowExercisePicker(false)}
              />
            </div>
          )}

          {/* Exercise list */}
          {exercises.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-muted text-sm opacity-60">
                {t("rutinas.nueva.noExercises")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {exercises.map((ex, index) => (
                <div
                  key={ex.exercise_id}
                  className="rounded-lg border border-border bg-surface p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-muted text-xs font-mono w-5 text-center">
                        {index + 1}
                      </span>
                      <span className="text-text font-medium text-sm">
                        {ex.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="text-muted hover:text-red-400 text-xs transition-colors"
                    >
                      {t("rutinas.nueva.removeExercise")}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-muted text-xs mb-1">
                        {t("rutinas.nueva.sets")}
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={ex.sets}
                        onChange={(e) =>
                          updateExerciseNumber(
                            index,
                            "sets",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-full px-2 py-1.5 bg-surface-2 border border-border rounded text-text text-sm focus:outline-none focus:border-[#C8FF00]"
                      />
                    </div>
                    <div>
                      <label className="block text-muted text-xs mb-1">
                        {t("rutinas.nueva.reps")}
                      </label>
                      <input
                        type="text"
                        value={ex.reps}
                        onChange={(e) =>
                          updateExerciseReps(index, e.target.value)
                        }
                        placeholder="10 o 8-12"
                        className="w-full px-2 py-1.5 bg-surface-2 border border-border rounded text-text text-sm focus:outline-none focus:border-[#C8FF00]"
                      />
                    </div>
                    <div>
                      <label className="block text-muted text-xs mb-1">
                        Duración (seg)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={ex.duration_seconds ?? ""}
                        onChange={(e) =>
                          updateExerciseNumber(
                            index,
                            "duration_seconds",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-full px-2 py-1.5 bg-surface-2 border border-border rounded text-text text-sm focus:outline-none focus:border-[#C8FF00]"
                      />
                    </div>
                    <div>
                      <label className="block text-muted text-xs mb-1">
                        {t("rutinas.nueva.rest")}
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={ex.rest_seconds}
                        onChange={(e) =>
                          updateExerciseNumber(
                            index,
                            "rest_seconds",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-full px-2 py-1.5 bg-surface-2 border border-border rounded text-text text-sm focus:outline-none focus:border-[#C8FF00]"
                      />
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
          {loading ? t("rutinas.nueva.btnSaving") : t("rutinas.nueva.btnSave")}
        </button>
      </form>
    </div>
  );
}
