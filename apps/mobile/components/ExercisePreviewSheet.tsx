import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@forzza/db-types";
import { Sheet, Tabs, Pill, ErrorState } from "@forzza/ui/native";
import { colors, spacing, fontSize, typography } from "@forzza/ui/tokens";
import { supabase } from "@/lib/supabase";
import { getExerciseIcon } from "@/constants/exerciseIcons";

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

// ─── Definición de tabs ───────────────────────────────────────────────────────

const DETAIL_TABS = [
  { key: "ejecucion", label: "Ejecución" },
  { key: "musculos", label: "Músculos" },
  { key: "info", label: "Info" },
] as const;

type DetailTabKey = (typeof DETAIL_TABS)[number]["key"];

// ─── Tab: Ejecución ───────────────────────────────────────────────────────────

function EjecucionTab({
  description,
}: {
  description: string | null;
}): React.JSX.Element {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
    >
      <Text style={styles.descriptionText}>
        {description ?? "Sin descripción disponible."}
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
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
    >
      <Text style={styles.muscleGroupTitle}>Músculos principales</Text>
      {primaryMuscles.length > 0 ? (
        <View style={styles.pillRow}>
          {primaryMuscles.map((m) => (
            <Pill key={m} label={m} variant="active" />
          ))}
        </View>
      ) : (
        <Text style={styles.musclePlaceholder}>—</Text>
      )}

      <Text style={[styles.muscleGroupTitle, styles.muscleGroupTitleSecondary]}>
        Músculos secundarios
      </Text>
      {secondaryMuscles.length > 0 ? (
        <View style={styles.pillRow}>
          {secondaryMuscles.map((m) => (
            <Pill key={m} label={m} variant="default" />
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
  const infoRows: { label: string; value: string }[] = [
    {
      label: "Equipamiento",
      value:
        exercise.equipment && exercise.equipment.length > 0
          ? exercise.equipment.join(", ")
          : "Sin equipamiento",
    },
    {
      label: "Patrón de movimiento",
      value: exercise.movement_pattern ?? "—",
    },
    {
      label: "Dificultad",
      value: exercise.difficulty ?? "—",
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
          <Text style={styles.infoLabel}>Etiquetas</Text>
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
  const [activeTab, setActiveTab] = useState<DetailTabKey>("ejecucion");
  const icon = getExerciseIcon(exercise.icon_id);

  return (
    <>
      {/* Header */}
      <View style={styles.detailHeader}>
        <Text style={styles.detailEmoji}>{icon.emoji}</Text>
        <Text style={styles.detailName}>{exercise.name}</Text>
        {exercise.name_en ? (
          <Text style={styles.detailNameEn}>{exercise.name_en}</Text>
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
          <EjecucionTab description={exercise.description} />
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
          title="No se pudo cargar el ejercicio"
          description="Verificá tu conexión e intentá de nuevo."
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
  detailNameEn: {
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
