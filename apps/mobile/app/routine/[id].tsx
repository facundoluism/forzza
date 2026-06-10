import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useWorkoutStore } from "@/stores/workoutStore";
import { Button, Card, EmptyState } from "@forzza/ui/native";
import { colors, spacing, typography, radius } from "@forzza/ui/tokens";

interface ExerciseLibrary {
  id: string;
  name: string;
  muscle_group?: string | null;
  equipment?: string | null;
  description?: string | null;
}

interface RoutineExercise {
  order: number;
  sets: number;
  reps: number | null;
  duration_seconds: number | null;
  rest_seconds: number | null;
  exercise: ExerciseLibrary;
}

interface RoutineDetail {
  id: string;
  name: string;
  student_id: string;
  created_at: string;
  routine_exercises: RoutineExercise[];
}

function ExerciseRow({ item, index }: { item: RoutineExercise; index: number }) {
  const label = item.reps
    ? `${item.sets} x ${item.reps} reps`
    : item.duration_seconds
    ? `${item.sets} x ${item.duration_seconds}s`
    : `${item.sets} series`;

  const rest = item.rest_seconds ? `Descanso: ${item.rest_seconds}s` : null;

  return (
    <Card style={styles.exerciseCard}>
      <View style={styles.exerciseIndex}>
        <Text style={styles.exerciseIndexText}>{index + 1}</Text>
      </View>
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.exercise.name}</Text>
        <View style={styles.exerciseMeta}>
          <Text style={styles.exerciseLabel}>{label}</Text>
          {rest && (
            <>
              <Text style={styles.exerciseMetaDot}>·</Text>
              <Text style={styles.exerciseLabel}>{rest}</Text>
            </>
          )}
          {item.exercise.muscle_group && (
            <>
              <Text style={styles.exerciseMetaDot}>·</Text>
              <Text style={styles.muscleGroup}>{item.exercise.muscle_group}</Text>
            </>
          )}
        </View>
      </View>
    </Card>
  );
}

export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const startSession = useWorkoutStore((s) => s.startSession);
  const activeSession = useWorkoutStore((s) => s.activeSession);

  const { data: routine, isLoading, isError } = useQuery({
    queryKey: ["routine_detail", id],
    queryFn: async () => {
      if (!id) throw new Error("ID de rutina requerido");
      const { data, error } = await supabase
        .from("routines" as never)
        .select(
          "*, routine_exercises(order, sets, reps, duration_seconds, rest_seconds, exercise:exercise_library(*))"
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .eq("id" as any, id)
        .single();
      if (error) throw error;
      return data as RoutineDetail;
    },
    enabled: !!id,
  });

  const handleStartSession = () => {
    if (!routine) return;
    startSession(routine.id, routine.name);
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
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
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

  const sortedExercises = [...(routine.routine_exercises ?? [])].sort(
    (a, b) => a.order - b.order
  );

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
        <Text style={styles.routineTitle}>{routine.name}</Text>
        <Text style={styles.exerciseCount}>
          {sortedExercises.length}{" "}
          {sortedExercises.length === 1 ? "ejercicio" : "ejercicios"}
        </Text>

        <View style={styles.exerciseList}>
          {sortedExercises.length === 0 ? (
            <EmptyState
              title="Esta rutina no tiene ejercicios"
              description="Tu coach todavía no agregó ejercicios."
              icon="📋"
            />
          ) : (
            sortedExercises.map((ex, idx) => (
              <ExerciseRow key={`${ex.exercise.id}-${idx}`} item={ex} index={idx} />
            ))
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
            disabled={sortedExercises.length === 0}
          />
        )}
      </View>
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
  exerciseName: {
    fontFamily: typography.body,
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
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
    color: colors.gray500,
    fontSize: 13,
  },
  exerciseMetaDot: {
    color: colors.gray700,
    fontSize: 13,
  },
  muscleGroup: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
