import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { requireCoach } from "@/lib/auth/coach";
import type { Tables } from "@forzza/db-types";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string; routineId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "coach" });
  return { title: t("rutinas.metaTitle") };
}

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

/** Contrato canónico JSONB routines.exercises — idéntico al de mobile */
interface RoutineExercise {
  exercise_id?: string;
  /** Snapshot del nombre al momento de crear; fallback para entradas sin exercise_id */
  name?: string;
  sets?: number;
  /** String para admitir rangos como "8-12" */
  reps?: string;
  rest_seconds?: number;
  duration_seconds?: number | null;
  notes?: string;
  order?: number;
}

type ExerciseLibraryRow = Pick<
  Tables<"exercise_library">,
  | "id"
  | "name"
  | "primary_group"
  | "primary_muscles"
  | "secondary_muscles"
  | "equipment"
  | "difficulty"
>;

interface EnrichedExercise extends RoutineExercise {
  library: ExerciseLibraryRow | undefined;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function difficultyColor(d: string | null | undefined): string {
  const map: Record<string, string> = {
    beginner: "text-green-400",
    intermediate: "text-yellow-400",
    advanced: "text-red-400",
  };
  return d ? (map[d] ?? "text-[#AAAAAA]") : "text-[#AAAAAA]";
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function RutinaDetailPage({ params }: Props) {
  const { locale, routineId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "coach" });

  const { supabase, coachProfileId } = await requireCoach();

  // --- Fetch rutina ---
  const { data: routine, error: routineError } = await supabase
    .from("routines")
    .select(
      `
      id,
      title,
      description,
      created_at,
      updated_at,
      coach_id,
      student_id,
      exercises
    `
    )
    .eq("id", routineId)
    .single();

  if (routineError || !routine) {
    notFound();
  }

  // Verificar que la rutina pertenece a este coach
  if (routine.coach_id !== coachProfileId) {
    notFound();
  }

  // Fetch student_profiles separately (routines.student_id → users(id), no direct FK to student_profiles)
  const { data: studentProfileRaw } = routine.student_id
    ? await supabase
        .from("student_profiles")
        .select("display_name")
        .eq("user_id", routine.student_id)
        .single()
    : { data: null };

  // --- Parsear ejercicios del JSONB ---
  let exercisesRaw: RoutineExercise[] = [];
  try {
    const parsed = routine.exercises as unknown;
    if (Array.isArray(parsed)) {
      exercisesRaw = parsed as RoutineExercise[];
    }
  } catch {
    exercisesRaw = [];
  }

  // Ordenar por order si está presente
  exercisesRaw.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // --- Batch fetch exercise_library para los IDs presentes ---
  const exerciseIds = exercisesRaw
    .map((e) => e.exercise_id)
    .filter((id): id is string => Boolean(id));

  const libraryMap = new Map<string, ExerciseLibraryRow>();

  if (exerciseIds.length > 0) {
    const { data: libraryRows } = await supabase
      .from("exercise_library")
      .select(
        "id, name, primary_group, primary_muscles, secondary_muscles, equipment, difficulty"
      )
      .in("id", exerciseIds);

    if (libraryRows) {
      for (const row of libraryRows as ExerciseLibraryRow[]) {
        libraryMap.set(row.id, row);
      }
    }
  }

  // Enriquecer cada entrada
  const enriched: EnrichedExercise[] = exercisesRaw.map((e) => ({
    ...e,
    library: e.exercise_id ? libraryMap.get(e.exercise_id) : undefined,
  }));

  // student_profiles fetched via separate query above
  const studentProfile = studentProfileRaw;

  const difficultyLabel: Record<string, string> = {
    beginner: t("rutinas.nueva.diffBeginner"),
    intermediate: t("rutinas.nueva.diffIntermediate"),
    advanced: t("rutinas.nueva.diffAdvanced"),
  };

  // --- Render ---
  return (
    <div className="max-w-2xl">
      {/* Navegación */}
      <div className="mb-8">
        <Link
          href="/coach/rutinas"
          className="text-muted hover:text-muted text-sm transition-colors mb-2 block"
        >
          ← {t("rutinas.title")}
        </Link>
        <h1 className="text-2xl font-bold text-text">{routine.title}</h1>
        <p className="text-muted text-xs mt-1">
          {formatDate(routine.created_at)}
          {studentProfile?.display_name
            ? ` · ${studentProfile.display_name}`
            : ""}
        </p>
        {routine.description && (
          <p className="text-muted text-sm mt-3">{routine.description}</p>
        )}
      </div>

      {/* Lista de ejercicios */}
      {enriched.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted text-sm opacity-60">
            {t("rutinas.nueva.noExercises")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enriched.map((ex, index) => {
            const displayName =
              ex.library?.name ?? ex.name ?? `Ejercicio ${index + 1}`;
            const primaryMuscles = ex.library?.primary_muscles ?? [];
            const secondaryMuscles = ex.library?.secondary_muscles ?? [];
            const equipment = ex.library?.equipment ?? [];
            const difficulty = ex.library?.difficulty ?? null;
            const primaryGroup = ex.library?.primary_group ?? null;

            return (
              <div
                key={ex.exercise_id ?? index}
                className="rounded-xl border border-border bg-surface p-5"
              >
                {/* Encabezado */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-surface-2 text-muted text-xs font-mono">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-text font-semibold text-sm leading-tight truncate">
                        {displayName}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                        {primaryGroup && (
                          <span className="text-lime text-xs font-medium">
                            {primaryGroup}
                          </span>
                        )}
                        {difficulty && (
                          <span className={`text-xs ${difficultyColor(difficulty)}`}>
                            {difficultyLabel[difficulty] ?? difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Músculos */}
                {(primaryMuscles.length > 0 || secondaryMuscles.length > 0) && (
                  <div className="mb-3 space-y-1">
                    {primaryMuscles.length > 0 && (
                      <p className="text-muted text-xs">
                        <span className="text-muted font-medium">{t("rutinas.detail.muscles")}: </span>
                        {primaryMuscles.join(", ")}
                      </p>
                    )}
                    {secondaryMuscles.length > 0 && (
                      <p className="text-muted text-xs">
                        <span className="text-muted font-medium">Secundario: </span>
                        {secondaryMuscles.join(", ")}
                      </p>
                    )}
                  </div>
                )}

                {/* Equipment */}
                {equipment.length > 0 && (
                  <p className="text-muted text-xs mb-3 opacity-60">
                    {t("rutinas.detail.equipment")}: {equipment.join(", ")}
                  </p>
                )}

                {/* Series / reps / descanso */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-surface-2">
                  {ex.sets != null && (
                    <div className="text-center">
                      <p className="text-lime font-bold text-lg leading-none">
                        {ex.sets}
                      </p>
                      <p className="text-muted text-xs mt-0.5">{t("rutinas.detail.sets")}</p>
                    </div>
                  )}
                  {ex.reps != null && (
                    <div className="text-center">
                      <p className="text-lime font-bold text-lg leading-none">
                        {ex.reps}
                      </p>
                      <p className="text-muted text-xs mt-0.5">{t("rutinas.detail.reps")}</p>
                    </div>
                  )}
                  {ex.duration_seconds != null && (
                    <div className="text-center">
                      <p className="text-lime font-bold text-lg leading-none">
                        {ex.duration_seconds}s
                      </p>
                      <p className="text-muted text-xs mt-0.5">duración</p>
                    </div>
                  )}
                  {ex.rest_seconds != null && (
                    <div className="text-center">
                      <p className="text-muted font-bold text-lg leading-none">
                        {ex.rest_seconds}s
                      </p>
                      <p className="text-muted text-xs mt-0.5">{t("rutinas.detail.rest")}</p>
                    </div>
                  )}
                </div>

                {/* Notas opcionales */}
                {ex.notes && (
                  <p className="mt-3 text-muted text-xs italic border-t border-surface-2 pt-3">
                    {ex.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <p className="text-muted text-xs text-center mt-8 opacity-30">
        {formatDate(routine.updated_at)}
      </p>
    </div>
  );
}
