import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { Database } from "@forzza/db-types";
import { Sheet, Tabs, Pill, ErrorState } from "@forzza/ui/native";
import { colors, spacing, fontSize, typography } from "@forzza/ui/tokens";
import { supabase } from "@/lib/supabase";
import { useLanguageStore } from "@/stores/languageStore";
import { getExerciseIcon } from "@/constants/exerciseIcons";
import { localizeMeta } from "@/constants/exerciseI18n";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ExerciseLibraryRow = Database["public"]["Tables"]["exercise_library"]["Row"];

export interface ExercisePreviewSheetProps {
  exerciseId: string | null; // null = cerrado
  onClose: () => void;
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchExerciseDetail(id: string): Promise<ExerciseLibraryRow> {
  const { data, error } = await supabase
    .from("exercise_library")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  if (!data) throw new Error("Ejercicio no encontrado.");
  return data;
}

// ─── Tab: Ejecución ───────────────────────────────────────────────────────────

function EjecucionTab({
  description,
}: {
  description: string | null;
}): React.JSX.Element {
  const { t } = useTranslation();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
    >
      <Text style={styles.descriptionText}>
        {description ?? t("exercisePreview.noDescription")}
      </Text>
    </ScrollView>
  );
}

// ─── Tab: Músculos ────────────────────────────────────────────────────────────

function MusculosTab({
  primaryMuscles,
  secondaryMuscles,
}: {
  primaryMuscles: string[];
  secondaryMuscles: string[];
}): React.JSX.Element {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
    >
      <Text style={styles.muscleGroupTitle}>{t("exercisePreview.primaryMuscles")}</Text>
      {primaryMuscles.length > 0 ? (
        <View style={styles.pillRow}>
          {primaryMuscles.map((m) => (
            <Pill key={m} label={localizeMeta(m, "muscle", language)} variant="active" />
          ))}
        </View>
      ) : (
        <Text style={styles.musclePlaceholder}>—</Text>
      )}

      <Text style={[styles.muscleGroupTitle, styles.muscleGroupTitleSecondary]}>
        {t("exercisePreview.secondaryMuscles")}
      </Text>
      {secondaryMuscles.length > 0 ? (
        <View style={styles.pillRow}>
          {secondaryMuscles.map((m) => (
            <Pill key={m} label={localizeMeta(m, "muscle", language)} variant="default" />
          ))}
        </View>
      ) : (
        <Text style={styles.musclePlaceholder}>—</Text>
      )}
    </ScrollView>
  );
}

// ─── Tab: Info ────────────────────────────────────────────────────────────────

function InfoTab({ exercise }: { exercise: ExerciseLibraryRow }): React.JSX.Element {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);

  const infoRows: { label: string; value: string }[] = [
    {
      label: t("exercisePreview.equipment"),
      value:
        exercise.equipment && exercise.equipment.length > 0
          ? exercise.equipment
              .map((e) => localizeMeta(e, "equipment", language))
              .join(", ")
          : t("exercisePreview.noEquipment"),
    },
    {
      label: t("exercisePreview.movementPattern"),
      value: exercise.movement_pattern
        ? localizeMeta(exercise.movement_pattern, "movement", language)
        : "—",
    },
    {
      label: t("exercisePreview.difficulty"),
      value: exercise.difficulty
        ? localizeMeta(exercise.difficulty, "difficulty", language)
        : "—",
    },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
    >
      {infoRows.map(({ label, value }) => (
        <View key={label} style={styles.infoRow}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      ))}

      {exercise.tags && exercise.tags.length > 0 && (
        <View style={styles.tagsSection}>
          {/* tags: keywords de búsqueda técnica, no se traducen (ver exerciseI18n.ts) */}
          <Text style={styles.infoLabel}>{t("exercisePreview.tags")}</Text>
          <View style={styles.pillRow}>
            {exercise.tags.map((tag) => (
              <Pill key={tag} label={tag} variant="default" />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Contenido del sheet (estado success) ─────────────────────────────────────

function ExerciseDetailContent({
  exercise,
}: {
  exercise: ExerciseLibraryRow;
}): React.JSX.Element {
  const { t } = useTranslation();
  // Tabs dinámicos para que las etiquetas respondan al cambio de idioma
  const DETAIL_TABS = [
    { key: "ejecucion", label: t("exercisePreview.tabs.execution") },
    { key: "musculos", label: t("exercisePreview.tabs.muscles") },
    { key: "info", label: t("exercisePreview.tabs.info") },
  ] as const;

  type DetailTabKey = (typeof DETAIL_TABS)[number]["key"];
  const [activeTab, setActiveTab] = useState<DetailTabKey>("ejecucion");

  const icon = getExerciseIcon(exercise.icon_id);

  const language = useLanguageStore((s) => s.language);

  // Nombre según idioma: name_en cuando EN, fallback a name si null.
  const displayName =
    language === "en" && exercise.name_en ? exercise.name_en : exercise.name;

  // Descripción localizada con fallback robusto al campo original.
  // description_en puede ser null en db:reset fresco para ejercicios cuyo
  // `description` ya está en inglés; en ese caso usamos description directamente.
  const localizedDescription =
    language === "es"
      ? (exercise.description_es ?? exercise.description)
      : (exercise.description_en ?? exercise.description);

  return (
    <>
      {/* Header */}
      <View style={styles.detailHeader}>
        <Text style={styles.detailEmoji}>{icon.emoji}</Text>
        <Text style={styles.detailName}>{displayName}</Text>
        {/* Mostrar el nombre en el otro idioma como subtítulo si existe */}
        {language === "es" && exercise.name_en ? (
          <Text style={styles.detailNameAlt}>{exercise.name_en}</Text>
        ) : language === "en" && exercise.name !== displayName ? (
          <Text style={styles.detailNameAlt}>{exercise.name}</Text>
        ) : null}
        <View style={styles.detailPillRow}>
          <Pill label={icon.label} variant="active" />
        </View>
      </View>

      {/* Tabs */}
      <Tabs
        tabs={DETAIL_TABS as unknown as { key: string; label: string }[]}
        activeKey={activeTab}
        onTabChange={(key) => setActiveTab(key as DetailTabKey)}
      />

      {/* Cuerpo del tab activo */}
      <View style={styles.tabBody}>
        {activeTab === "ejecucion" && (
          <EjecucionTab description={localizedDescription} />
        )}
        {activeTab === "musculos" && (
          <MusculosTab
            primaryMuscles={exercise.primary_muscles}
            secondaryMuscles={exercise.secondary_muscles}
          />
        )}
        {activeTab === "info" && <InfoTab exercise={exercise} />}
      </View>
    </>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function ExercisePreviewSheet({
  exerciseId,
  onClose,
}: ExercisePreviewSheetProps): React.JSX.Element {
  const { t } = useTranslation();
  const {
    data: exercise,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["exercise_library_detail", exerciseId],
    queryFn: () => fetchExerciseDetail(exerciseId!),
    enabled: exerciseId !== null,
    staleTime: 1000 * 60 * 10, // 10 min — datos de biblioteca cambian poco
  });

  const renderBody = (): React.JSX.Element => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.lime} size="large" />
        </View>
      );
    }

    if (isError || !exercise) {
      return (
        <ErrorState
          title={t("exercisePreview.error_title")}
          description={t("exercisePreview.error_desc")}
          onRetry={() => {
            void refetch();
          }}
        />
      );
    }

    return <ExerciseDetailContent exercise={exercise} />;
  };

  return (
    <Sheet visible={exerciseId !== null} onClose={onClose} snapPoints={[620]}>
      {renderBody()}
    </Sheet>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing[10],
  },

  // Header del detalle
  detailHeader: {
    alignItems: "center",
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
  },
  detailEmoji: {
    fontSize: 48,
    marginBottom: spacing[3],
  },
  detailName: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize["2xl"],
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
    marginBottom: spacing[1],
  },
  detailNameAlt: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    textAlign: "center",
    marginBottom: spacing[3],
  },
  detailPillRow: {
    alignItems: "center",
  },

  // Tabs body
  tabBody: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },

  // Tab ejecución
  descriptionText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    lineHeight: 26,
  },

  // Tab músculos
  muscleGroupTitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing[3],
  },
  muscleGroupTitleSecondary: {
    marginTop: spacing[5],
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  musclePlaceholder: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
  },

  // Tab info
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing[4],
  },
  infoLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    flexShrink: 0,
  },
  infoValue: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    textAlign: "right",
    flex: 1,
  },
  tagsSection: {
    marginTop: spacing[4],
    gap: spacing[3],
  },
});
