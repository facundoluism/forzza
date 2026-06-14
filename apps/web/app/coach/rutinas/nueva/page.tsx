"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Exercise {
  id: string;
  name: string;
  muscle_groups: string[] | null;
}

interface Student {
  user_id: string;
  display_name: string | null;
}

interface RoutineExerciseEntry {
  exercise_id: string;
  exercise_name: string;
  order: number;
  sets: number | null;
  reps: number | null;
  duration_seconds: number | null;
  rest_seconds: number | null;
}

export default function NuevaRutinaPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<RoutineExerciseEntry[]>([]);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    void (async () => {
      const [{ data: exData }, { data: { user } }] = await Promise.all([
        supabase.from("exercise_library").select("id, name, muscle_groups").order("name"),
        supabase.auth.getUser(),
      ]);

      if (exData) setAllExercises(exData as Exercise[]);

      if (user) {
        const { data: stData } = await supabase
          .from("coach_assignments")
          .select("student_id, student_profiles!coach_assignments_student_id_fkey(display_name, user_id)")
          .eq("coach_id", user.id)
          .eq("status", "active");

        if (stData) {
          const studentList = (stData as unknown as { student_profiles: Student | null }[])
            .map((a) => a.student_profiles)
            .filter((s): s is Student => s !== null);
          setStudents(studentList);
        }
      }
    })();
  }, []);

  const filteredExercises = allExercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) &&
      !exercises.some((e) => e.exercise_id === ex.id)
  );

  function addExercise(exercise: Exercise) {
    setExercises((prev) => [
      ...prev,
      {
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        order: prev.length + 1,
        sets: 3,
        reps: 10,
        duration_seconds: null,
        rest_seconds: 60,
      },
    ]);
    setShowExercisePicker(false);
    setExerciseSearch("");
  }

  function updateExercise(
    index: number,
    field: keyof RoutineExerciseEntry,
    value: number | null
  ) {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
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
      setError("El nombre de la rutina es obligatorio.");
      return;
    }
    if (exercises.length === 0) {
      setError("Agregá al menos un ejercicio.");
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
          exercises: exercises.map(({ exercise_name: _n, ...rest }) => rest),
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Error al guardar la rutina.");
        setLoading(false);
        return;
      }

      router.push("/coach/rutinas");
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
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Nueva rutina</h1>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-[#FAFAFA] mb-2">
            Nombre de la rutina <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Fuerza upper body"
            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#FAFAFA] placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] transition-colors"
          />
        </div>

        {/* Asignar a alumno */}
        {students.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-[#FAFAFA] mb-2">
              Asignar a alumno (opcional)
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#FAFAFA] focus:outline-none focus:border-[#C8FF00] transition-colors"
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
            <label className="text-sm font-medium text-[#FAFAFA]">
              Ejercicios <span className="text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowExercisePicker(true)}
              className="text-[#C8FF00] hover:text-[#AADD00] text-sm font-medium transition-colors"
            >
              + Agregar ejercicio
            </button>
          </div>

          {/* Exercise picker */}
          {showExercisePicker && (
            <div className="mb-4 rounded-lg border border-[#2A2A2A] bg-[#111111] p-4">
              <input
                type="text"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                placeholder="Buscar ejercicio..."
                autoFocus
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#FAFAFA] placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] text-sm transition-colors mb-3"
              />
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredExercises.length === 0 ? (
                  <p className="text-[#444444] text-sm text-center py-4">
                    No se encontraron ejercicios
                  </p>
                ) : (
                  filteredExercises.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => addExercise(ex)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#1A1A1A] transition-colors"
                    >
                      <span className="text-[#FAFAFA] text-sm">{ex.name}</span>
                      {ex.muscle_groups && ex.muscle_groups.length > 0 && (
                        <span className="text-[#666666] text-xs ml-2">
                          {ex.muscle_groups.join(", ")}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowExercisePicker(false);
                  setExerciseSearch("");
                }}
                className="mt-3 text-[#666666] hover:text-[#AAAAAA] text-xs transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}

          {/* Exercise list */}
          {exercises.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#2A2A2A] p-8 text-center">
              <p className="text-[#444444] text-sm">
                Agregá ejercicios a la rutina
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {exercises.map((ex, index) => (
                <div
                  key={ex.exercise_id}
                  className="rounded-lg border border-[#2A2A2A] bg-[#111111] p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[#666666] text-xs font-mono w-5 text-center">
                        {index + 1}
                      </span>
                      <span className="text-[#FAFAFA] font-medium text-sm">
                        {ex.exercise_name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="text-[#666666] hover:text-red-400 text-xs transition-colors"
                    >
                      Quitar
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[#666666] text-xs mb-1">
                        Series
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={ex.sets ?? ""}
                        onChange={(e) =>
                          updateExercise(
                            index,
                            "sets",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-full px-2 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#FAFAFA] text-sm focus:outline-none focus:border-[#C8FF00]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] text-xs mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={ex.reps ?? ""}
                        onChange={(e) =>
                          updateExercise(
                            index,
                            "reps",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-full px-2 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#FAFAFA] text-sm focus:outline-none focus:border-[#C8FF00]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] text-xs mb-1">
                        Duración (seg)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={ex.duration_seconds ?? ""}
                        onChange={(e) =>
                          updateExercise(
                            index,
                            "duration_seconds",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-full px-2 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#FAFAFA] text-sm focus:outline-none focus:border-[#C8FF00]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] text-xs mb-1">
                        Descanso (seg)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={ex.rest_seconds ?? ""}
                        onChange={(e) =>
                          updateExercise(
                            index,
                            "rest_seconds",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-full px-2 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#FAFAFA] text-sm focus:outline-none focus:border-[#C8FF00]"
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
          {loading ? "Guardando..." : "Guardar rutina"}
        </button>
      </form>
    </div>
  );
}
