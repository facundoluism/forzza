import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useWorkoutStore } from "@/stores/workoutStore";
import type { RoutineExerciseDefinition } from "@/stores/workoutStore";
import { getExerciseIcon } from "@/constants/exerciseIcons";
import { ExercisePreviewSheet } from "@/components/ExercisePreviewSheet";
import { Button, Card, EmptyState } from "@forzza/ui/native";
import { colors, spacing, typography, radius } from "@forzza/ui/tokens";

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
}

function ExerciseRow({ item, index, libraryEntry, onPress }: ExerciseRowProps) {
  const icon = getExerciseIcon(libraryEntry?.icon_id ?? null);
  const displayName = libraryEntry?.name ?? item.name;
  const label = `${item.sets} x ${item.reps}`;
  const rest = item.rest_seconds > 0 ? `Descanso: ${item.rest_seconds}s` : null;
  const isTappable = !!item.exercise_id;

  const content = (
    <Card style={styles.exerciseCard}>
      <View style={styles.exerciseIndex}>
        <Text style={styles.exerciseIndexText}>{index + 1}</Text>
      </View>
      <View style={styles.exerciseInfo}>
        <View style={styles.exerciseNameRow}>
          <Text style={styles.exerciseEmoji}>{icon.emoji}</Text>
          <Text style={styles.exerciseName}>{displayName}</Text>
          {isTappable && (
            <Text style={styles.exerciseInfoIcon}>ℹ</Text>
          )}
        </View>
        <View style={styles.exerciseMeta}>
          <Text style={styles.exerciseLabel}>{label}</Text>
          {rest && (
            <>
              <Text style={styles.exerciseMetaDot}>·</Text>
              <Text style={styles.exerciseLabel}>{rest}</Text>
            </>
          )}
          {item.notes ? (
            <>
              <Text style={styles.exerciseMetaDot}>·</Text>
              <Text style={styles.exerciseNotes}>{item.notes}</Text>
            </>
          ) : null}
        </View>
      </View>
    </Card>
  );

  if (!isTappable) {
    return content;
  }

  return (
    <Pressable onPress={onPress} android_ripple={{ color: colors.limeGlow }}>
      {content}
    </Pressable>
  );
}

export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const startSession = useWorkoutStore((s) => s.startSession);
  const activeSession = useWorkoutStore((s) => s.activeSession);

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
  const exerciseIds = exercises
    .map((ex) => ex.exercise_id)
    .filter((eid): eid is string => typeof eid === "string" && eid.length > 0);

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
    if (!routine || !user) return;

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

    startSession(routine.id, routine.title, user.id, exerciseDefinitions);
    router.push("/session");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.lime} size="large" />
      </View>
    );
  }

  if (isError || !routine) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}>
          <Text style={styles.backBtnText}>‹ Volver</Text>
        </TouchableOpacity>
        <EmptyState
          title="No se pudo cargar la rutina"
          description="Revisá tu conexión e intentá de nuevo."
          icon="⚠️"
        />
      </View>
    );
  }

  const hasActiveSession = activeSession !== null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>‹ Volver</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.routineTitle}>{routine.title}</Text>
        <Text style={styles.exerciseCount}>
          {exercises.length}{" "}
          {exercises.length === 1 ? "ejercicio" : "ejercicios"}
        </Text>

        <View style={styles.exerciseList}>
          {exercises.length === 0 ? (
            <EmptyState
              title="Esta rutina no tiene ejercicios"
              description="Tu coach todavía no agregó ejercicios."
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
          <View style={styles.activeSessionNotice}>
            <Text style={styles.activeSessionText}>
              Ya tenés un entreno activo
            </Text>
            <Button
              label="Continuar entreno"
              onPress={() => router.push("/session")}
              fullWidth
              variant="secondary"
            />
          </View>
        ) : (
          <Button
            label="Iniciar entreno"
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
    backgroundColor: colors.black,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    paddingTop: spacing[12],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  backBtnText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: 16,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  routineTitle: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: 36,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: spacing[1],
  },
  exerciseCount: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 14,
    marginBottom: spacing[5],
  },
  exerciseList: {
    gap: spacing[3],
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
  },
  exerciseIndex: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.gray800,
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
  exerciseInfo: {
    flex: 1,
  },
  exerciseNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  exerciseEmoji: {
    fontSize: 18,
    lineHeight: 22,
  },
  exerciseName: {
    fontFamily: typography.body,
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  exerciseInfoIcon: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 14,
  },
  exerciseMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing[1],
  },
  exerciseLabel: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 13,
  },
  exerciseMetaDot: {
    color: colors.gray700,
    fontSize: 13,
  },
  exerciseNotes: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 12,
    fontStyle: "italic",
  },
  footer: {
    padding: spacing[4],
    paddingBottom: spacing[8],
    borderTopWidth: 1,
    borderTopColor: colors.gray800,
    backgroundColor: colors.black,
  },
  activeSessionNotice: {
    gap: spacing[3],
  },
  activeSessionText: {
    fontFamily: typography.body,
    color: colors.warning,
    fontSize: 14,
    textAlign: "center",
  },
});
