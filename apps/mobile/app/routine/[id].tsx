import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useWorkoutStore } from "@/stores/workoutStore";
import type { RoutineExerciseDefinition } from "@/stores/workoutStore";
import { getExerciseIcon } from "@/constants/exerciseIcons";
import { ExercisePreviewSheet } from "@/components/ExercisePreviewSheet";
import { Button, EmptyState, ScreenHeader } from "@forzza/ui/native";
import { colors, fontSize, spacing, typography, radius } from "@forzza/ui/tokens";

// Shape canónico del JSONB routines.exercises (coordinado con el seed)
interface RoutineExercise {
  exercise_id?: string;
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
  order?: number;
  duration_seconds?: number | null;
}

interface RoutineDetail {
  id: string;
  title: string;
  student_id: string;
  created_at: string;
  exercises: unknown; // JSONB — se castea después de validar con Array.isArray
}

interface ExerciseLibraryEntry {
  id: string;
  name: string;
  icon_id: string | null;
}

interface ExerciseRowProps {
  item: RoutineExercise;
  index: number;
  libraryEntry: ExerciseLibraryEntry | null;
  onPress: () => void;
  restLabel: string;
}

function ExerciseRow({ item, index, libraryEntry, onPress, restLabel }: ExerciseRowProps) {
  const icon = getExerciseIcon(libraryEntry?.icon_id ?? null);
  const displayName = libraryEntry?.name ?? item.name;
  const label = `${item.sets} x ${item.reps}`;
  const rest = item.rest_seconds > 0 ? restLabel : null;
  const isTappable = !!item.exercise_id;

  const content = (
    <View style={styles.exerciseCard}>
      {/* Badge with index number */}
      <View style={styles.exerciseIndex}>
        <Text style={styles.exerciseIndexText}>{index + 1}</Text>
      </View>

      {/* Emoji icon box */}
      <View style={styles.exerciseEmojiBox}>
        <Text style={styles.exerciseEmoji}>{icon.emoji}</Text>
      </View>

      {/* Info column */}
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{displayName}</Text>
        <View style={styles.exerciseMeta}>
          <Text style={styles.exerciseLabel}>{label}</Text>
          {rest && (
            <>
              <Text style={styles.exerciseMetaDot}>·</Text>
              <Text style={styles.exerciseRestLabel}>{rest}</Text>
            </>
          )}
        </View>
        {item.notes ? (
          <Text style={styles.exerciseNotes}>{item.notes}</Text>
        ) : null}
      </View>

      {/* Info badge for tappable exercises */}
      {isTappable && (
        <Text style={styles.exerciseInfoIcon}>ℹ</Text>
      )}
    </View>
  );

  if (!isTappable) {
    return content;
  }

  return (
    <Pressable
      testID={`routine-exercise-${index}`}
      accessibilityLabel={`${displayName}. ${label}${rest ? `. ${rest}` : ""}`}
      onPress={onPress}
      android_ripple={{ color: colors.limeGlow }}
    >
      {content}
    </Pressable>
  );
}

export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const startSession = useWorkoutStore((s) => s.startSession);
  const activeSession = useWorkoutStore((s) => s.activeSession);
  const insets = useSafeAreaInsets();

  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  const { data: routine, isLoading, isError } = useQuery({
    queryKey: ["routine_detail", id],
    queryFn: async () => {
      if (!id) throw new Error("ID de rutina requerido");
      const { data, error } = await supabase
        .from("routines")
        .select("id, title, student_id, created_at, exercises")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as RoutineDetail;
    },
    enabled: !!id,
  });

  // Parsear ejercicios del JSONB
  const exercises: RoutineExercise[] = Array.isArray(routine?.exercises)
    ? (routine.exercises as unknown as RoutineExercise[])
    : [];

  // Extraer IDs para el batch fetch a exercise_library
  const exerciseIds = exercises.reduce<string[]>((ids, ex) => {
    if (ex.exercise_id && ex.exercise_id.length > 0) {
      ids.push(ex.exercise_id);
    }
    return ids;
  }, []);

  const { data: libraryEntries } = useQuery({
    queryKey: ["exercise_library_batch", exerciseIds.join(",")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercise_library")
        .select("id, name, icon_id")
        .in("id", exerciseIds);
      if (error) throw error;
      return data as ExerciseLibraryEntry[];
    },
    enabled: exerciseIds.length > 0,
    staleTime: 1000 * 60 * 10, // 10 minutos — biblioteca estática
  });

  // Mapa id → entry para lookup O(1)
  const exerciseMap: Record<string, ExerciseLibraryEntry> = {};
  if (libraryEntries) {
    for (const entry of libraryEntries) {
      exerciseMap[entry.id] = entry;
    }
  }

  const handleStartSession = () => {
    if (!routine) return;

    const studentId = user?.id ?? routine.student_id;

    const exerciseDefinitions: RoutineExerciseDefinition[] = exercises.map((ex) => {
      const def: RoutineExerciseDefinition = {
        name: (ex.exercise_id && exerciseMap[ex.exercise_id]?.name) || ex.name,
        sets: ex.sets,
        reps: ex.reps,
        rest_seconds: ex.rest_seconds,
      };
      // Solo incluir exercise_id si tiene valor (exactOptionalPropertyTypes)
      if (ex.exercise_id !== undefined) def.exercise_id = ex.exercise_id;
      if (ex.notes !== undefined) def.notes = ex.notes;
      return def;
    });

    startSession(routine.id, routine.title, studentId, exerciseDefinitions);
    router.push("/session");
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + spacing[2] }]}>
          <ScreenHeader title={t("routineDetail.screenTitle")} onBack={() => router.back()} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.lime} size="large" />
          <Text style={styles.loadingText}>{t('routineDetail.loadingText')}</Text>
        </View>
      </View>
    );
  }

  if (isError || !routine) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + spacing[2] }]}>
          <ScreenHeader title={t("routineDetail.screenTitle")} onBack={() => router.back()} />
        </View>
        <EmptyState
          title={t('routineDetail.errorTitle')}
          description={t('routineDetail.errorDesc')}
          icon="⚠️"
        />
      </View>
    );
  }

  const hasActiveSession = activeSession !== null;

  return (
    <View style={styles.container}>
      {/* Fixed header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing[2] }]}>
        <ScreenHeader
          title={routine.title}
          onBack={() => router.back()}
          subtitle={t("routineDetail.headerSubtitle", { count: exercises.length })}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.exerciseList}>
          {exercises.length === 0 ? (
            <EmptyState
              title={t('routineDetail.emptyTitle')}
              description={t('routineDetail.emptyDesc')}
              icon="📋"
            />
          ) : (
            exercises.map((ex, idx) => {
              const libraryEntry =
                ex.exercise_id ? (exerciseMap[ex.exercise_id] ?? null) : null;
              return (
                <ExerciseRow
                  key={`${ex.exercise_id ?? ex.name}-${idx}`}
                  item={ex}
                  index={idx}
                  libraryEntry={libraryEntry}
                  restLabel={t('routineDetail.restLabel', { n: ex.rest_seconds })}
                  onPress={() => {
                    if (ex.exercise_id) setSelectedExerciseId(ex.exercise_id);
                  }}
                />
              );
            })
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {hasActiveSession ? (
          <View style={styles.activeSessionCard}>
            <Text style={styles.activeSessionText}>
              {t('routineDetail.activeWorkoutTitle')}
            </Text>
            <Button
              label={t('routineDetail.continueWorkout')}
              onPress={() => router.push("/session")}
              fullWidth
              variant="secondary"
            />
          </View>
        ) : (
          <Button
            testID="start-workout-button"
            label={t('routineDetail.startWorkout')}
            onPress={handleStartSession}
            fullWidth
            size="lg"
            disabled={exercises.length === 0}
          />
        )}
      </View>

      {/* Sheet de ficha del ejercicio */}
      <ExercisePreviewSheet
        exerciseId={selectedExerciseId}
        onClose={() => setSelectedExerciseId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.md,
    marginTop: spacing[3],
  },
  // Fixed header
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
  },
  exerciseList: {
    gap: spacing[3],
  },
  // Exercise card layout
  exerciseCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[3],
  },
  exerciseIndex: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  exerciseIndexText: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: 13,
    fontWeight: "700",
  },
  exerciseEmojiBox: {
    width: 44,
    height: 44,
    backgroundColor: colors.surface3,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  exerciseEmoji: {
    fontSize: 20,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: "700",
    marginBottom: spacing[1],
  },
  exerciseMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing[1],
  },
  exerciseLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  exerciseRestLabel: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: fontSize.sm,
  },
  exerciseMetaDot: {
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  exerciseNotes: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: fontSize.xs,
    fontStyle: "italic",
    marginTop: spacing[1],
  },
  exerciseInfoIcon: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.sm,
    alignSelf: "center",
  },
  footer: {
    padding: spacing[4],
    paddingBottom: spacing[8],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  activeSessionCard: {
    backgroundColor: `${colors.warning}15`,
    borderWidth: 1,
    borderColor: `${colors.warning}40`,
    borderRadius: radius.lg,
    padding: spacing[3],
    gap: spacing[3],
  },
  activeSessionText: {
    fontFamily: typography.body,
    color: colors.warning,
    fontSize: fontSize.md,
    textAlign: "center",
  },
});
