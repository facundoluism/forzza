export interface WorkoutSetLog {
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  duration_seconds: number | null;
  completed_at: string;
}

export interface WorkoutExerciseLog {
  exercise_id: string;
  sets: WorkoutSetLog[];
}

export interface RoutineExerciseDefinition {
  exercise_id?: string;
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
}

export interface ActiveWorkoutSession {
  id: string;
  client_uuid: string;
  routine_id: string;
  routine_name: string;
  student_id: string;
  started_at: string;
  exercises: WorkoutExerciseLog[];
  routineExercises: RoutineExerciseDefinition[];
  status: "active" | "paused" | "completed";
}

export interface WorkoutSyncItem {
  client_uuid: string;
  payload: {
    client_uuid: string;
    student_id: string;
    routine_id: string;
    started_at: string;
    completed_at: string;
    sets_data: WorkoutExerciseLog[];
    status: "completed";
    routine_name: string;
  };
  retries: number;
}

export interface WorkoutSessionUpsert {
  client_uuid: string;
  student_id: string;
  routine_id: string | null;
  started_at: string;
  completed_at: string | null;
  status: "in_progress" | "completed" | "abandoned";
  sets_data: WorkoutExerciseLog[];
}

export function createActiveWorkoutSession(input: {
  id: string;
  clientUuid: string;
  routineId: string;
  routineName: string;
  studentId: string;
  startedAt: string;
  routineExercises?: RoutineExerciseDefinition[];
}): ActiveWorkoutSession {
  return {
    id: input.id,
    client_uuid: input.clientUuid,
    routine_id: input.routineId,
    routine_name: input.routineName,
    student_id: input.studentId,
    started_at: input.startedAt,
    exercises: [],
    routineExercises: input.routineExercises ?? [],
    status: "active",
  };
}

export function logWorkoutSet(
  session: ActiveWorkoutSession,
  exerciseId: string,
  setData: Omit<WorkoutSetLog, "set_number" | "completed_at">,
  completedAt: string
): ActiveWorkoutSession {
  const exercises = [...session.exercises];
  const existingIdx = exercises.findIndex((exercise) => exercise.exercise_id === exerciseId);

  const newSet: WorkoutSetLog = {
    ...setData,
    set_number: 1,
    completed_at: completedAt,
  };

  if (existingIdx >= 0) {
    const existing = exercises[existingIdx]!;
    newSet.set_number = existing.sets.length + 1;
    exercises[existingIdx] = {
      ...existing,
      sets: [...existing.sets, newSet],
    };
  } else {
    exercises.push({ exercise_id: exerciseId, sets: [newSet] });
  }

  return { ...session, exercises };
}

export function finishWorkoutSession(
  session: ActiveWorkoutSession,
  completedAt: string
): { completedSession: ActiveWorkoutSession; syncItem: WorkoutSyncItem } {
  const completedSession: ActiveWorkoutSession = {
    ...session,
    status: "completed",
  };

  return {
    completedSession,
    syncItem: {
      client_uuid: session.client_uuid,
      payload: {
        client_uuid: session.client_uuid,
        student_id: session.student_id,
        routine_id: session.routine_id,
        started_at: session.started_at,
        completed_at: completedAt,
        sets_data: session.exercises,
        status: "completed",
        routine_name: session.routine_name,
      },
      retries: 0,
    },
  };
}

export function toWorkoutSessionUpsert(item: WorkoutSyncItem): WorkoutSessionUpsert {
  const routineId = item.payload.routine_id.trim();

  return {
    client_uuid: item.payload.client_uuid,
    student_id: item.payload.student_id,
    routine_id: routineId.length > 0 ? routineId : null,
    started_at: item.payload.started_at,
    completed_at: item.payload.completed_at ?? null,
    status: item.payload.status ?? "completed",
    sets_data: item.payload.sets_data ?? [],
  };
}
