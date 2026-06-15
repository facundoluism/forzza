import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@forzza/db-types";
import { useWorkoutStore } from "@/stores/workoutStore";

const MAX_RETRIES = 5;

/**
 * Columnas reales de workout_sessions:
 *   client_uuid, student_id, routine_id, started_at, completed_at, status, sets_data
 * onConflict: client_uuid (UNIQUE — garantiza idempotencia offline)
 * student_id es requerido (NOT NULL) y debe venir en el payload de la store.
 */
interface WorkoutSessionUpsert {
  client_uuid: string;
  student_id: string;
  routine_id: string | null;
  started_at: string;
  completed_at: string | null;
  status: "in_progress" | "completed" | "abandoned";
  sets_data: unknown; // JSONB — array de ExerciseLog
}

export async function syncPendingItems(
  supabase: SupabaseClient<Database>
): Promise<void> {
  const { syncQueue, removeSyncItem, addToSyncQueue } = useWorkoutStore.getState();

  for (const item of syncQueue) {
    if (item.retries >= MAX_RETRIES) {
      console.warn(`[sync] Item ${item.client_uuid} reached max retries, skipping`);
      continue;
    }

    // Construir el payload exacto que acepta workout_sessions
    // El store guarda el student_id en el payload desde finishSession
    const upsertPayload: WorkoutSessionUpsert = {
      client_uuid: item.payload.client_uuid,
      student_id: item.payload.student_id,
      routine_id: item.payload.routine_id ?? null,
      started_at: item.payload.started_at,
      completed_at: item.payload.completed_at ?? null,
      status: item.payload.status ?? "completed",
      sets_data: item.payload.sets_data ?? [],
    };

    // TODO: regenerar db-types — cast mínimo hasta que se actualice el esquema generado
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("workout_sessions")
      .upsert(upsertPayload, { onConflict: "client_uuid" });

    if (error) {
      console.error(`[sync] Error syncing item ${item.client_uuid}:`, error.message);
      removeSyncItem(item.client_uuid);
      addToSyncQueue({ ...item, retries: item.retries + 1 });
    } else {
      console.log(`[sync] Successfully synced item ${item.client_uuid}`);
      removeSyncItem(item.client_uuid);
    }
  }
}

let syncIntervalId: ReturnType<typeof setInterval> | null = null;

export function startSyncInterval(supabase: SupabaseClient<Database>): () => void {
  if (syncIntervalId !== null) {
    clearInterval(syncIntervalId);
  }

  syncIntervalId = setInterval(() => {
    const { isOnline, syncQueue } = useWorkoutStore.getState();
    if (isOnline && syncQueue.length > 0) {
      void syncPendingItems(supabase);
    }
  }, 30_000);

  return () => {
    if (syncIntervalId !== null) {
      clearInterval(syncIntervalId);
      syncIntervalId = null;
    }
  };
}
