import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

export interface SetLog {
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  duration_seconds: number | null;
  completed_at: string;
}

export interface ExerciseLog {
  exercise_id: string;
  sets: SetLog[];
}

/** Definición de un ejercicio de la rutina — transportada en la sesión activa */
export interface RoutineExerciseDefinition {
  exercise_id?: string;
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
}

export interface ActiveSession {
  id: string;
  client_uuid: string;
  routine_id: string;
  routine_name: string;
  student_id: string; // requerido (NOT NULL) para el upsert a workout_sessions
  started_at: string;
  exercises: ExerciseLog[];
  /** Definición completa de ejercicios de la rutina — para mostrar nombres y descanso real */
  routineExercises: RoutineExerciseDefinition[];
  status: "active" | "paused" | "completed";
}

export interface SyncItem {
  client_uuid: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  retries: number;
}

interface WorkoutState {
  activeSession: ActiveSession | null;
  syncQueue: SyncItem[];
  isOnline: boolean;
}

interface WorkoutActions {
  startSession: (
    routine_id: string,
    routine_name: string,
    student_id: string,
    routineExercises?: RoutineExerciseDefinition[]
  ) => void;
  logSet: (exercise_id: string, set_data: Omit<SetLog, "set_number" | "completed_at">) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  finishSession: () => void;
  addToSyncQueue: (item: SyncItem) => void;
  removeSyncItem: (client_uuid: string) => void;
  setOnline: (v: boolean) => void;
}

type WorkoutStore = WorkoutState & WorkoutActions;

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      activeSession: null,
      syncQueue: [],
      isOnline: true,

      startSession: (routine_id, routine_name, student_id, routineExercises) => {
        const session: ActiveSession = {
          id: randomUUID(),
          client_uuid: randomUUID(),
          routine_id,
          routine_name,
          student_id,
          started_at: new Date().toISOString(),
          exercises: [],
          routineExercises: routineExercises ?? [],
          status: "active",
        };
        set({ activeSession: session });
      },

      logSet: (exercise_id, set_data) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const exercises = [...activeSession.exercises];
        const existingIdx = exercises.findIndex((e) => e.exercise_id === exercise_id);

        const newSet: SetLog = {
          ...set_data,
          set_number: 1,
          completed_at: new Date().toISOString(),
        };

        if (existingIdx >= 0) {
          const existing = exercises[existingIdx]!;
          newSet.set_number = existing.sets.length + 1;
          exercises[existingIdx] = {
            ...existing,
            sets: [...existing.sets, newSet],
          };
        } else {
          exercises.push({ exercise_id, sets: [newSet] });
        }

        set({
          activeSession: { ...activeSession, exercises },
        });
      },

      pauseSession: () => {
        const { activeSession } = get();
        if (!activeSession) return;
        set({ activeSession: { ...activeSession, status: "paused" } });
      },

      resumeSession: () => {
        const { activeSession } = get();
        if (!activeSession) return;
        set({ activeSession: { ...activeSession, status: "active" } });
      },

      finishSession: () => {
        const { activeSession, syncQueue } = get();
        if (!activeSession) return;

        const completedSession = { ...activeSession, status: "completed" as const };

        const syncItem: SyncItem = {
          client_uuid: activeSession.client_uuid,
          payload: {
            client_uuid: activeSession.client_uuid,
            student_id: activeSession.student_id,    // requerido NOT NULL en workout_sessions
            routine_id: activeSession.routine_id,
            started_at: activeSession.started_at,
            completed_at: new Date().toISOString(),  // columna real: completed_at (no finished_at)
            sets_data: activeSession.exercises,       // columna real: sets_data (no exercises)
            status: "completed",
            routine_name: activeSession.routine_name, // solo para mostrar en UI local
          },
          retries: 0,
        };

        set({
          activeSession: completedSession,
          syncQueue: [...syncQueue, syncItem],
        });

        // Clear session after adding to sync queue
        set({ activeSession: null });
      },

      addToSyncQueue: (item) => {
        set((state) => ({ syncQueue: [...state.syncQueue, item] }));
      },

      removeSyncItem: (client_uuid) => {
        set((state) => ({
          syncQueue: state.syncQueue.filter((i) => i.client_uuid !== client_uuid),
        }));
      },

      setOnline: (v) => {
        set({ isOnline: v });
      },
    }),
    {
      name: "forzza-workout-session",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
