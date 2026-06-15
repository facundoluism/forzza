import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@forzza/db-types";
import { Skeleton, ErrorState, EmptyState } from "@forzza/ui/native";
import { colors, spacing, radius, fontSize, typography } from "@forzza/ui/tokens";
import { supabase } from "@/lib/supabase";
import {
  getExerciseIcon,
  type ExerciseIconId,
  EXERCISE_ICON_MAP,
} from "@/constants/exerciseIcons";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ExerciseLibraryRow = Database["public"]["Tables"]["exercise_library"]["Row"];

export type ExercisePickResult = {
  exercise_id: string;
  name: string;
  icon_id: string | null;
  sets: number;
  reps: string;
  rest_seconds: number;
};

export interface ExerciseLibraryPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (exercise: ExercisePickResult) => void;
}

// Subset que traemos de la DB para la lista (evitar over-fetching)
type ExerciseListItem = Pick<
  ExerciseLibraryRow,
  "id" | "name" | "name_en" | "icon_id" | "primary_group" | "primary_muscles" | "difficulty"
>;

// ─── Chips de filtro muscular ─────────────────────────────────────────────────

const FILTER_CHIPS: { id: ExerciseIconId; label: string; emoji: string }[] = (
  Object.keys(EXERCISE_ICON_MAP) as ExerciseIconId[]
).map((id) => ({
  id,
  label: EXERCISE_ICON_MAP[id].label,
  emoji: EXERCISE_ICON_MAP[id].emoji,
}));

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchExercises(
  query: string,
  filterIconId: ExerciseIconId | null
): Promise<ExerciseListItem[]> {
  let builder = supabase
    .from("exercise_library")
    .select("id, name, name_en, icon_id, primary_group, primary_muscles, difficulty");

  if (query.trim().length > 0) {
    const q = query.trim();
    builder = builder.or(`name.ilike.%${q}%,name_en.ilike.%${q}%`);
  }

  if (filterIconId !== null) {
    builder = builder.eq("icon_id", filterIconId);
  }

  const { data, error } = await builder.limit(50);
  if (error) throw error;
  return data ?? [];
}

// ─── Fila de resultado ────────────────────────────────────────────────────────

function ExerciseRow({
  item,
  onSelect,
}: {
  item: ExerciseListItem;
  onSelect: () => void;
}): React.JSX.Element {
  const icon = getExerciseIcon(item.icon_id);
  const groupLabel = item.primary_group ?? icon.label;

  return (
    <TouchableOpacity
      style={styles.exerciseRow}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.exerciseRowEmoji}>
        <Text style={styles.exerciseRowEmojiText}>{icon.emoji}</Text>
      </View>
      <View style={styles.exerciseRowInfo}>
        <Text style={styles.exerciseRowName}>{item.name}</Text>
        <Text style={styles.exerciseRowGroup}>{groupLabel}</Text>
      </View>
      <Text style={styles.exerciseRowChevron}>›</Text>
    </TouchableOpacity>
  );
}

// ─── Esqueleto de carga ───────────────────────────────────────────────────────

function LoadingSkeleton(): React.JSX.Element {
  return (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={styles.skeletonRow}>
          <Skeleton width={44} height={44} borderRadius={radius.md} />
          <View style={styles.skeletonText}>
            <Skeleton width="70%" height={16} />
            <View style={{ height: spacing[1] }} />
            <Skeleton width="40%" height={12} />
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function ExerciseLibraryPicker({
  visible,
  onClose,
  onSelect,
}: ExerciseLibraryPickerProps): React.JSX.Element {
  const [query, setQuery] = useState("");
  const [filterIconId, setFilterIconId] = useState<ExerciseIconId | null>(null);

  const {
    data: exercises,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["exercise_library", query, filterIconId],
    queryFn: () => fetchExercises(query, filterIconId),
    enabled: visible,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const handleSelect = useCallback(
    (item: ExerciseListItem): void => {
      onSelect({
        exercise_id: item.id,
        name: item.name,
        icon_id: item.icon_id,
        sets: 3,
        reps: "10",
        rest_seconds: 90,
      });
      onClose();
    },
    [onSelect, onClose]
  );

  const handleClose = useCallback((): void => {
    setQuery("");
    setFilterIconId(null);
    onClose();
  }, [onClose]);

  const toggleFilter = useCallback((id: ExerciseIconId): void => {
    setFilterIconId((prev) => (prev === id ? null : id));
  }, []);

  const renderContent = (): React.JSX.Element => {
    if (isLoading) return <LoadingSkeleton />;

    if (isError) {
      return (
        <ErrorState
          title="No se pudo cargar la biblioteca"
          description="Verificá tu conexión e intentá de nuevo."
          onRetry={() => { void refetch(); }}
        />
      );
    }

    if (!exercises || exercises.length === 0) {
      return (
        <EmptyState
          icon="🔍"
          title="Sin resultados"
          description="No encontramos ejercicios con esa búsqueda. Probá con otro término o filtro."
        />
      );
    }

    return (
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExerciseRow item={item} onSelect={() => handleSelect(item)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent={Platform.OS === "android"}
    >
      <KeyboardAvoidingView
        style={styles.modalRoot}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Backdrop */}
        <Pressable style={styles.backdrop} onPress={handleClose} />

        {/* Sheet container */}
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handleArea}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Biblioteca de ejercicios</Text>
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.closeButton}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          {/* Buscador */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscá un ejercicio..."
              placeholderTextColor={colors.muted}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => setQuery("")}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Chips de filtro muscular */}
          <View style={styles.chipsWrapper}>
            <FlatList
              horizontal
              data={FILTER_CHIPS}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsContent}
              renderItem={({ item }) => {
                const isActive = filterIconId === item.id;
                return (
                  <TouchableOpacity
                    onPress={() => toggleFilter(item.id)}
                    activeOpacity={0.7}
                    style={[styles.chip, isActive && styles.chipActive]}
                  >
                    <Text style={styles.chipEmoji}>{item.emoji}</Text>
                    <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* Contador de resultados */}
          {!isLoading && !isError && exercises && exercises.length > 0 && (
            <Text style={styles.resultCount}>
              {exercises.length} {exercises.length === 1 ? "ejercicio" : "ejercicios"}
            </Text>
          )}

          {/* Lista / estado */}
          <View style={styles.listContainer}>{renderContent()}</View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  sheet: {
    backgroundColor: colors.surface2,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
    // Altura definida (no solo maxHeight): da espacio acotado para que el
    // flex:1 de la lista se expanda en vez de colapsar a minHeight.
    height: "85%",
    paddingBottom: spacing[8],
  },
  handleArea: {
    alignItems: "center",
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.gray,
    opacity: 0.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  headerTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize["2xl"],
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  closeButton: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    backgroundColor: colors.surface3,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing[3],
    gap: spacing[2],
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    paddingVertical: spacing[3],
  },
  clearIcon: {
    color: colors.muted,
    fontSize: fontSize.base,
  },
  chipsWrapper: {
    marginBottom: spacing[3],
  },
  chipsContent: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.limeGlow,
    borderColor: colors.lime,
  },
  chipEmoji: {
    fontSize: fontSize.sm,
  },
  chipLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  chipLabelActive: {
    color: colors.lime,
  },
  resultCount: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
  },
  listContainer: {
    flex: 1,
    minHeight: 200,
  },
  listContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  skeletonContainer: {
    paddingHorizontal: spacing[4],
    gap: spacing[3],
    marginTop: spacing[2],
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  skeletonText: {
    flex: 1,
  },

  // Fila de ejercicio
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  exerciseRowEmoji: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface3,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseRowEmojiText: {
    fontSize: 22,
  },
  exerciseRowInfo: {
    flex: 1,
  },
  exerciseRowName: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: "600",
    marginBottom: spacing[1],
  },
  exerciseRowGroup: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  exerciseRowChevron: {
    color: colors.muted,
    fontSize: 20,
  },
});
