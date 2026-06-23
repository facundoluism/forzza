"use client";

/**
 * ExercisePicker — selector de ejercicios para el backoffice coach (web).
 *
 * Funcionalidades:
 *  - Búsqueda por nombre (name + name_en, ilike) con debounce suave
 *  - Filtros combinables: grupo muscular (icon_id / primary_group),
 *    equipo (equipment[]) y dificultad (difficulty)
 *  - Lista con ícono SVG + nombre + grupo + dificultad
 *  - Botón "Ver ficha" → Sheet lateral con tabs: Ejecución, Errores, Músculos
 *  - Botón "Agregar" → callback onSelect()
 *
 * Reusa ExerciseIcon, Sheet y Tabs del design system web (@forzza/ui/web).
 * El fetch ocurre en el cliente porque la página nueva/edición es "use client".
 */

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@forzza/db-types";
import { ExerciseIcon, Sheet, Tabs } from "@forzza/ui/web";
import { resolveExerciseIconKey } from "@forzza/ui";
import type { ExerciseIconKey } from "@forzza/ui";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type ExerciseRow = Tables<"exercise_library">;

/** Campos mínimos para mostrar en la lista */
type ExerciseListItem = Pick<
  ExerciseRow,
  | "id"
  | "name"
  | "name_en"
  | "icon_id"
  | "primary_group"
  | "difficulty"
  | "equipment"
  | "movement_pattern"
  | "svg_icon"
>;

/** Campos completos para el sheet de ficha */
type ExerciseDetail = Pick<
  ExerciseRow,
  | "id"
  | "name"
  | "name_en"
  | "icon_id"
  | "primary_group"
  | "difficulty"
  | "equipment"
  | "movement_pattern"
  | "svg_icon"
  | "execution_steps_es"
  | "execution_steps_en"
  | "common_errors_es"
  | "common_errors_en"
  | "primary_muscles"
  | "secondary_muscles"
  | "tertiary_muscles"
  | "pro_tip_es"
  | "pro_tip_en"
>;

export interface ExercisePickResult {
  exercise_id: string;
  name: string;
}

export interface ExercisePickerProps {
  /** IDs de ejercicios ya agregados — se excluyen de los resultados */
  excludeIds?: string[];
  onSelect: (result: ExercisePickResult) => void;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Constantes de filtro
// ---------------------------------------------------------------------------

const GROUP_CHIPS: { id: string; label: string; emoji: string }[] = [
  { id: "chest",     label: "Pecho",     emoji: "💪" },
  { id: "back",      label: "Espalda",   emoji: "🔙" },
  { id: "legs",      label: "Piernas",   emoji: "🦵" },
  { id: "shoulders", label: "Hombros",   emoji: "🏋️" },
  { id: "arms",      label: "Brazos",    emoji: "💪" },
  { id: "core",      label: "Core",      emoji: "⚡" },
];

const DIFFICULTY_OPTIONS: { value: string; label: string }[] = [
  { value: "Beginner",     label: "Principiante" },
  { value: "Intermediate", label: "Intermedio" },
  { value: "Advanced",     label: "Avanzado" },
];

const EQUIPMENT_OPTIONS: string[] = [
  "Barbell",
  "Dumbbell",
  "Cable",
  "Machine",
  "Bodyweight",
  "Kettlebell",
  "Resistance Band",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function localizeJsonbArray(
  esField: unknown,
  enField: unknown,
  lang: string
): string[] {
  const pick = (f: unknown): string[] | null =>
    Array.isArray(f) && f.length > 0 ? (f as string[]) : null;
  if (lang === "es") return pick(esField) ?? pick(enField) ?? [];
  return pick(enField) ?? pick(esField) ?? [];
}

function getIconKey(ex: {
  svg_icon: string | null;
  movement_pattern: string | null;
  equipment: string[] | null;
  primary_group: string | null;
  icon_id: string | null;
}): ExerciseIconKey {
  // Preferir svg_icon si existe y es un key válido
  if (ex.svg_icon) return ex.svg_icon as ExerciseIconKey;
  return resolveExerciseIconKey(
    ex.movement_pattern,
    ex.equipment,
    ex.primary_group
  );
}

function difficultyLabel(d: string | null): string {
  if (!d) return "";
  const map: Record<string, string> = {
    Beginner:     "Principiante",
    Intermediate: "Intermedio",
    Advanced:     "Avanzado",
  };
  return map[d] ?? d;
}

function difficultyColor(d: string | null): string {
  const map: Record<string, string> = {
    Beginner:     "#22C55E",
    Intermediate: "#FF8840",
    Advanced:     "#FF4466",
  };
  return d ? (map[d] ?? "#9898C0") : "#9898C0";
}

// ---------------------------------------------------------------------------
// Skeleton loader
// ---------------------------------------------------------------------------

function SkeletonRows(): ReactNode {
  return (
    <div className="space-y-2 mt-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface animate-pulse">
          <div className="w-10 h-10 rounded-lg bg-surface-2 flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-48 rounded bg-surface-2" />
            <div className="h-3 w-28 rounded bg-surface-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Ejecución
// ---------------------------------------------------------------------------

function EjecucionTab({
  exercise,
  lang,
}: {
  exercise: ExerciseDetail;
  lang: string;
}): ReactNode {
  const steps = localizeJsonbArray(
    exercise.execution_steps_es,
    exercise.execution_steps_en,
    lang
  );
  const proTip =
    lang === "es"
      ? (exercise.pro_tip_es ?? exercise.pro_tip_en ?? null)
      : (exercise.pro_tip_en ?? exercise.pro_tip_es ?? null);

  return (
    <div className="space-y-4 py-4">
      {steps.length > 0 ? (
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-md bg-lime flex items-center justify-center text-[#0A0A0A] text-xs font-bold font-mono">
                {i + 1}
              </span>
              <p className="text-text text-sm leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-muted text-sm opacity-60">Sin pasos de ejecución.</p>
      )}

      {proTip && (
        <div className="flex gap-3 bg-lime/10 border border-lime/20 rounded-lg p-4 mt-2">
          <span className="text-base flex-shrink-0">🧠</span>
          <div>
            <p className="text-lime text-xs font-bold mb-1 tracking-wide">PRO TIP</p>
            <p className="text-text text-sm leading-relaxed">{proTip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Errores
// ---------------------------------------------------------------------------

function ErroresTab({
  exercise,
  lang,
}: {
  exercise: ExerciseDetail;
  lang: string;
}): ReactNode {
  const errors = localizeJsonbArray(
    exercise.common_errors_es,
    exercise.common_errors_en,
    lang
  );

  return (
    <div className="space-y-3 py-4">
      <div className="bg-red-500/5 border border-red-500/20 rounded-lg px-4 py-3">
        <p className="text-red-400 text-xs font-semibold leading-relaxed">
          Errores comunes a corregir en la técnica
        </p>
      </div>
      {errors.length > 0 ? (
        <div className="space-y-2">
          {errors.map((err, i) => (
            <div
              key={i}
              className="flex gap-3 items-start bg-surface rounded-lg border border-border px-3 py-3"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-md bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xs font-bold">
                ✕
              </span>
              <p className="text-text text-sm leading-relaxed">{err}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted text-sm opacity-60">Sin errores comunes registrados.</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Músculos
// ---------------------------------------------------------------------------

function MusculosTab({ exercise }: { exercise: ExerciseDetail }): ReactNode {
  type Group = { label: string; muscles: string[]; color: string };
  const groups: Group[] = [
    { label: "Primario",    muscles: exercise.primary_muscles ?? [],   color: "#C8FF00" },
    { label: "Secundario",  muscles: exercise.secondary_muscles ?? [], color: "#4488FF" },
    { label: "Terciario",   muscles: exercise.tertiary_muscles ?? [],  color: "#9898C0" },
  ];

  return (
    <div className="space-y-2 py-4">
      {groups.map((g) =>
        g.muscles.map((m, i) => (
          <div
            key={`${g.label}-${i}`}
            className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3"
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: g.color }}
            />
            <span className="text-text text-sm flex-1">{m}</span>
            {g.label === "Primario" && i === 0 && (
              <span className="text-lime text-xs font-semibold bg-lime/10 border border-lime/20 px-2 py-0.5 rounded-full">
                Principal
              </span>
            )}
          </div>
        ))
      )}
      {groups.every((g) => g.muscles.length === 0) && (
        <p className="text-muted text-sm opacity-60">Sin información de músculos.</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Panel de ficha (Sheet content)
// ---------------------------------------------------------------------------

type DetailTab = "ejecucion" | "errores" | "musculos";

const DETAIL_TABS: { key: DetailTab; label: string }[] = [
  { key: "ejecucion", label: "Ejecución" },
  { key: "errores",   label: "Errores" },
  { key: "musculos",  label: "Músculos" },
];

function ExerciseDetailPanel({
  exercise,
  lang,
  onAdd,
  onClose,
}: {
  exercise: ExerciseDetail;
  lang: string;
  onAdd: () => void;
  onClose: () => void;
}): ReactNode {
  const [activeTab, setActiveTab] = useState<DetailTab>("ejecucion");
  const iconKey = getIconKey(exercise);
  const displayName =
    lang === "en" && exercise.name_en ? exercise.name_en : exercise.name;

  return (
    <>
      {/* Header */}
      <div className="flex items-start gap-4 pb-4 border-b border-border">
        <div className="w-16 h-16 rounded-xl bg-surface-2 border border-border flex items-center justify-center flex-shrink-0">
          <ExerciseIcon icon={iconKey} size={44} color="#C8FF00" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-text font-bold text-lg leading-tight">{displayName}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {exercise.primary_group && (
              <span className="text-lime text-xs font-semibold bg-lime/10 border border-lime/20 px-2 py-0.5 rounded-full">
                {exercise.primary_group}
              </span>
            )}
            {exercise.difficulty && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  color: difficultyColor(exercise.difficulty),
                  backgroundColor: `${difficultyColor(exercise.difficulty)}15`,
                  border: `1px solid ${difficultyColor(exercise.difficulty)}40`,
                }}
              >
                {difficultyLabel(exercise.difficulty)}
              </span>
            )}
          </div>
          {(exercise.equipment ?? []).length > 0 && (
            <p className="text-muted text-xs mt-1.5 opacity-70">
              {(exercise.equipment ?? []).join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-1">
        <Tabs
          tabs={DETAIL_TABS}
          activeKey={activeTab}
          onTabChange={(k) => setActiveTab(k as DetailTab)}
        />
      </div>

      {/* Tab content */}
      <div className="overflow-y-auto max-h-[40vh]">
        {activeTab === "ejecucion" && (
          <EjecucionTab exercise={exercise} lang={lang} />
        )}
        {activeTab === "errores" && (
          <ErroresTab exercise={exercise} lang={lang} />
        )}
        {activeTab === "musculos" && (
          <MusculosTab exercise={exercise} />
        )}
      </div>

      {/* Footer actions */}
      <div className="flex gap-3 pt-4 border-t border-border mt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 border border-border rounded-lg text-muted text-sm font-semibold hover:border-[#9898C0] transition-colors"
        >
          Cerrar
        </button>
        <button
          type="button"
          onClick={() => { onAdd(); onClose(); }}
          className="flex-1 py-2.5 bg-lime text-[#0A0A0A] rounded-lg text-sm font-bold hover:bg-[#AADD00] transition-colors"
        >
          Agregar a la rutina
        </button>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Componente principal: ExercisePicker
// ---------------------------------------------------------------------------

export function ExercisePicker({
  excludeIds = [],
  onSelect,
  onClose,
}: ExercisePickerProps): ReactNode {
  const t = useTranslations("coach.rutinas.nueva");
  const locale = useLocale();
  const lang = locale === "en" ? "en" : "es";

  const [query, setQuery] = useState("");
  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [filterEquipment, setFilterEquipment] = useState<string | null>(null);

  const [items, setItems] = useState<ExerciseListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Sheet de ficha
  const [previewDetail, setPreviewDetail] = useState<ExerciseDetail | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const queryRef = useRef(query);
  queryRef.current = query;

  // ---------------------------------------------------------------------------
  // Fetch de lista
  // ---------------------------------------------------------------------------
  const fetchList = useCallback(async (
    q: string,
    group: string | null,
    difficulty: string | null,
    equipment: string | null
  ) => {
    setLoading(true);
    setLoadError(null);

    try {
      const supabase = createClient();
      let builder = supabase
        .from("exercise_library")
        .select(
          "id, name, name_en, icon_id, primary_group, difficulty, equipment, movement_pattern, svg_icon"
        )
        .order("name")
        .limit(80);

      if (q.trim()) {
        builder = builder.or(`name.ilike.%${q.trim()}%,name_en.ilike.%${q.trim()}%`);
      }
      if (group) {
        // primary_group es "Chest"/"Back"/etc — ilike para case-insensitive
        builder = builder.ilike("primary_group", group);
      }
      if (difficulty) {
        builder = builder.eq("difficulty", difficulty);
      }
      if (equipment) {
        // equipment es TEXT[] — contains element
        builder = builder.contains("equipment", [equipment]);
      }

      const { data, error } = await builder;
      if (error) throw error;

      const fetched = (data ?? []) as ExerciseListItem[];
      // Excluir ejercicios ya agregados
      setItems(fetched.filter((e) => !excludeIds.includes(e.id)));
    } catch {
      setLoadError("No se pudo cargar la lista de ejercicios.");
    } finally {
      setLoading(false);
    }
  }, [excludeIds]);

  // Debounce del query + refetch en cada cambio de filtro
  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchList(query, filterGroup, filterDifficulty, filterEquipment);
    }, query ? 300 : 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filterGroup, filterDifficulty, filterEquipment]);

  // ---------------------------------------------------------------------------
  // Fetch de ficha completa
  // ---------------------------------------------------------------------------
  const handlePreview = useCallback(async (id: string) => {
    setPreviewLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("exercise_library")
        .select(
          "id, name, name_en, icon_id, primary_group, difficulty, equipment, movement_pattern, svg_icon, execution_steps_es, execution_steps_en, common_errors_es, common_errors_en, primary_muscles, secondary_muscles, tertiary_muscles, pro_tip_es, pro_tip_en"
        )
        .eq("id", id)
        .single();
      if (error) throw error;
      setPreviewDetail(data as ExerciseDetail);
    } catch {
      // Silencio — el sheet simplemente no se abre
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* Panel picker */}
      <div className="rounded-lg border border-border bg-surface p-4 space-y-3">

        {/* Buscador */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchExercise")}
            autoFocus
            className="w-full pl-9 pr-9 py-2.5 bg-surface-2 border border-border rounded-lg text-text placeholder-[#9898C0] focus:outline-none focus:border-[#C8FF00] text-sm transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Chips de grupo muscular */}
        <div className="flex flex-wrap gap-1.5">
          {GROUP_CHIPS.map((chip) => {
            const isActive = filterGroup?.toLowerCase() === chip.id.toLowerCase();
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilterGroup(isActive ? null : chip.id)}
                className={[
                  "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors",
                  isActive
                    ? "bg-lime/15 border-lime text-lime"
                    : "bg-surface-2 border-border text-muted hover:border-[#9898C0]",
                ].join(" ")}
              >
                <span>{chip.emoji}</span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filtros: dificultad + equipo */}
        <div className="flex gap-2 flex-wrap">
          <select
            value={filterDifficulty ?? ""}
            onChange={(e) => setFilterDifficulty(e.target.value || null)}
            className="flex-1 min-w-[120px] px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text focus:outline-none focus:border-[#C8FF00] transition-colors"
          >
            <option value="">Dificultad</option>
            {DIFFICULTY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={filterEquipment ?? ""}
            onChange={(e) => setFilterEquipment(e.target.value || null)}
            className="flex-1 min-w-[120px] px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text focus:outline-none focus:border-[#C8FF00] transition-colors"
          >
            <option value="">Equipo</option>
            {EQUIPMENT_OPTIONS.map((eq) => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </select>
        </div>

        {/* Contador */}
        {!loading && !loadError && (
          <p className="text-muted text-xs">
            {items.length} ejercicio{items.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Lista */}
        <div className="max-h-72 overflow-y-auto space-y-1 -mx-1 px-1">
          {loading ? (
            <SkeletonRows />
          ) : loadError ? (
            <p className="text-red-400 text-sm text-center py-6 opacity-80">{loadError}</p>
          ) : items.length === 0 ? (
            <p className="text-muted text-sm text-center py-6 opacity-60">
              Sin resultados. Probá otro filtro.
            </p>
          ) : (
            items.map((ex) => {
              const iconKey = getIconKey(ex);
              const displayName =
                lang === "en" && ex.name_en ? ex.name_en : ex.name;
              return (
                <div
                  key={ex.id}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-2 transition-colors group"
                >
                  {/* Ícono */}
                  <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center flex-shrink-0">
                    <ExerciseIcon icon={iconKey} size={28} color="#C8FF00" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-text text-sm font-medium leading-tight truncate">
                      {displayName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {ex.primary_group && (
                        <span className="text-lime text-xs font-medium">
                          {ex.primary_group}
                        </span>
                      )}
                      {ex.difficulty && (
                        <span
                          className="text-xs font-medium"
                          style={{ color: difficultyColor(ex.difficulty) }}
                        >
                          {difficultyLabel(ex.difficulty)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => void handlePreview(ex.id)}
                      disabled={previewLoading}
                      className="px-2.5 py-1.5 text-xs font-semibold text-muted border border-border rounded-md bg-surface-2 hover:border-[#9898C0] transition-colors disabled:opacity-50"
                    >
                      Ver ficha
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onSelect({ exercise_id: ex.id, name: ex.name })
                      }
                      className="px-2.5 py-1.5 text-xs font-bold text-[#0A0A0A] bg-lime rounded-md hover:bg-[#AADD00] transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cerrar picker */}
        <button
          type="button"
          onClick={onClose}
          className="text-muted hover:text-text text-xs transition-colors"
        >
          {t("cancel")}
        </button>
      </div>

      {/* Sheet: ficha del ejercicio */}
      <Sheet
        visible={previewDetail !== null}
        onClose={() => setPreviewDetail(null)}
      >
        {previewDetail && (
          <ExerciseDetailPanel
            exercise={previewDetail}
            lang={lang}
            onAdd={() =>
              onSelect({ exercise_id: previewDetail.id, name: previewDetail.name })
            }
            onClose={() => setPreviewDetail(null)}
          />
        )}
      </Sheet>
    </>
  );
}
