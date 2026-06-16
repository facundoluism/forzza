import { describe, expect, it } from "vitest";
import {
  createActiveWorkoutSession,
  finishWorkoutSession,
  logWorkoutSet,
  toWorkoutSessionUpsert,
  type RoutineExerciseDefinition,
} from "./index";

const routineExercises: RoutineExerciseDefinition[] = [
  {
    exercise_id: "ex-squat",
    name: "Sentadilla goblet",
    sets: 3,
    reps: "10-12",
    rest_seconds: 75,
    notes: "Mantener el torso alto.",
  },
  {
    name: "Plancha",
    sets: 2,
    reps: "30s",
    rest_seconds: 45,
  },
];

function createSession() {
  return createActiveWorkoutSession({
    id: "session-1",
    clientUuid: "client-1",
    routineId: "routine-1",
    routineName: "Piernas principiante",
    studentId: "student-1",
    startedAt: "2026-06-16T12:00:00.000Z",
    routineExercises,
  });
}

describe("workout sessions", () => {
  it("creates an active workout session with the routine exercise definitions", () => {
    const session = createSession();

    expect(session).toMatchObject({
      id: "session-1",
      client_uuid: "client-1",
      routine_id: "routine-1",
      routine_name: "Piernas principiante",
      student_id: "student-1",
      started_at: "2026-06-16T12:00:00.000Z",
      exercises: [],
      status: "active",
    });
    expect(session.routineExercises).toEqual(routineExercises);
  });

  it("logs sets by exercise without mutating the original session", () => {
    const session = createSession();

    const firstLog = logWorkoutSet(
      session,
      "ex-squat",
      { reps: 12, weight_kg: 20, duration_seconds: null },
      "2026-06-16T12:05:00.000Z"
    );
    const secondLog = logWorkoutSet(
      firstLog,
      "ex-squat",
      { reps: 10, weight_kg: 22.5, duration_seconds: null },
      "2026-06-16T12:08:00.000Z"
    );

    expect(session.exercises).toEqual([]);
    expect(firstLog.exercises[0]?.sets).toHaveLength(1);
    expect(secondLog.exercises).toEqual([
      {
        exercise_id: "ex-squat",
        sets: [
          {
            set_number: 1,
            reps: 12,
            weight_kg: 20,
            duration_seconds: null,
            completed_at: "2026-06-16T12:05:00.000Z",
          },
          {
            set_number: 2,
            reps: 10,
            weight_kg: 22.5,
            duration_seconds: null,
            completed_at: "2026-06-16T12:08:00.000Z",
          },
        ],
      },
    ]);
  });

  it("supports manual routine exercise keys when the exercise is not in the library", () => {
    const session = createSession();

    const logged = logWorkoutSet(
      session,
      "exercise_2",
      { reps: null, weight_kg: null, duration_seconds: 30 },
      "2026-06-16T12:10:00.000Z"
    );

    expect(logged.exercises).toEqual([
      {
        exercise_id: "exercise_2",
        sets: [
          {
            set_number: 1,
            reps: null,
            weight_kg: null,
            duration_seconds: 30,
            completed_at: "2026-06-16T12:10:00.000Z",
          },
        ],
      },
    ]);
  });

  it("finishes the session with the Supabase sync payload used by mobile", () => {
    const active = logWorkoutSet(
      createSession(),
      "ex-squat",
      { reps: 12, weight_kg: 20, duration_seconds: null },
      "2026-06-16T12:05:00.000Z"
    );

    const { completedSession, syncItem } = finishWorkoutSession(
      active,
      "2026-06-16T12:30:00.000Z"
    );

    expect(completedSession.status).toBe("completed");
    expect(syncItem).toEqual({
      client_uuid: "client-1",
      payload: {
        client_uuid: "client-1",
        student_id: "student-1",
        routine_id: "routine-1",
        started_at: "2026-06-16T12:00:00.000Z",
        completed_at: "2026-06-16T12:30:00.000Z",
        sets_data: active.exercises,
        status: "completed",
        routine_name: "Piernas principiante",
      },
      retries: 0,
    });
  });

  it("converts a queued mobile workout into the exact workout_sessions upsert", () => {
    const active = logWorkoutSet(
      createSession(),
      "ex-squat",
      { reps: 12, weight_kg: 20, duration_seconds: null },
      "2026-06-16T12:05:00.000Z"
    );
    const { syncItem } = finishWorkoutSession(active, "2026-06-16T12:30:00.000Z");

    expect(toWorkoutSessionUpsert(syncItem)).toEqual({
      client_uuid: "client-1",
      student_id: "student-1",
      routine_id: "routine-1",
      started_at: "2026-06-16T12:00:00.000Z",
      completed_at: "2026-06-16T12:30:00.000Z",
      status: "completed",
      sets_data: active.exercises,
    });
  });

  it("keeps freestyle sessions syncable when routine_id is absent", () => {
    const session = createActiveWorkoutSession({
      id: "session-2",
      clientUuid: "client-2",
      routineId: "",
      routineName: "Entreno libre",
      studentId: "student-1",
      startedAt: "2026-06-16T13:00:00.000Z",
    });
    const { syncItem } = finishWorkoutSession(session, "2026-06-16T13:30:00.000Z");
    syncItem.payload.routine_id = "";

    expect(toWorkoutSessionUpsert(syncItem)).toMatchObject({
      client_uuid: "client-2",
      routine_id: null,
      sets_data: [],
    });
  });
});
