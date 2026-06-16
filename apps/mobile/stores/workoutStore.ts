import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import {
  createActiveWorkoutSession,
  finishWorkoutSession as finishCoreWorkoutSession,
  logWorkoutSet,
  type ActiveWorkoutSession as ActiveSession,
  type RoutineExerciseDefinition,
  type WorkoutSetLog as SetLog,
  type WorkoutSyncItem as SyncItem,
} from "@forzza/core";

export type { ActiveSession, RoutineExerciseDefinition, SetLog, SyncItem };

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
        set({
          activeSession: createActiveWorkoutSession({
            id: randomUUID(),
            clientUuid: randomUUID(),
            routineId: routine_id,
            routineName: routine_name,
            studentId: student_id,
            startedAt: new Date().toISOString(),
            routineExercises: routineExercises ?? [],
          }),
        });
      },

      logSet: (exercise_id, set_data) => {
        const { activeSession } = get();
        if (!activeSession) return;

        set({
          activeSession: logWorkoutSet(
            activeSession,
            exercise_id,
            set_data,
            new Date().toISOString()
          ),
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

        const { completedSession, syncItem } = finishCoreWorkoutSession(
          activeSession,
          new Date().toISOString()
        );

        set({
          activeSession: completedSession,
          syncQueue: [...syncQueue, syncItem],
        });

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
