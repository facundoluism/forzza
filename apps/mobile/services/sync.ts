import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@forzza/db-types";
import {
  toWorkoutSessionUpsert,
  type WorkoutSessionUpsert,
} from "@forzza/core";
import { useWorkoutStore } from "@/stores/workoutStore";

const MAX_RETRIES = 5;

/**
 * Real workout_sessions columns:
 * client_uuid, student_id, routine_id, started_at, completed_at, status, sets_data.
 * routine_id is nullable so a deleted routine can still sync as a freestyle workout.
 */
const PG_FK_VIOLATION = "23503";

const PG_PERMANENT_VIOLATIONS = new Set(["23502", "23505", "23514"]);

function isPermanentConstraintError(error: {
  code?: string;
  message?: string;
  details?: string;
}): boolean {
  if (!error.code) return false;

  if (error.code === PG_FK_VIOLATION) {
    const hint = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
    const isRoutineIdFK = hint.includes("routine_id") || hint.includes('"routines"');
    return !isRoutineIdFK;
  }

  return PG_PERMANENT_VIOLATIONS.has(error.code);
}

function isRoutineIdFKViolation(error: {
  code?: string;
  message?: string;
  details?: string;
}): boolean {
  if (error.code !== PG_FK_VIOLATION) return false;
  const hint = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
  return hint.includes("routine_id") || hint.includes('"routines"');
}

async function upsertSession(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<Database> | any,
  payload: WorkoutSessionUpsert
): Promise<{ error: { code?: string; message?: string; details?: string } | null }> {
  // TODO: regenerate db-types after workout_sessions schema catches up.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any)
    .from("workout_sessions")
    .upsert(payload, { onConflict: "client_uuid" });
}

export async function syncPendingItems(
  supabase: SupabaseClient<Database>
): Promise<void> {
  const { syncQueue, removeSyncItem, addToSyncQueue } = useWorkoutStore.getState();

  for (const item of syncQueue) {
    const upsertPayload = toWorkoutSessionUpsert(item);
    const { error } = await upsertSession(supabase, upsertPayload);

    if (!error) {
      console.log(`[sync] Item ${item.client_uuid} sincronizado correctamente.`);
      removeSyncItem(item.client_uuid);
      continue;
    }

    if (isRoutineIdFKViolation(error)) {
      console.warn(
        `[sync] Item ${item.client_uuid}: FK violation en routine_id ` +
          `(routine_id="${upsertPayload.routine_id}"). ` +
          "Reintentando como sesion freestyle (routine_id: null)."
      );

      const retryPayload: WorkoutSessionUpsert = { ...upsertPayload, routine_id: null };
      const retryResult = await upsertSession(supabase, retryPayload);

      if (!retryResult.error) {
        console.log(`[sync] Item ${item.client_uuid} sincronizado como sesion freestyle.`);
        removeSyncItem(item.client_uuid);
      } else {
        console.error(
          `[sync] Item ${item.client_uuid}: fallo el retry freestyle. ` +
            `Error: ${retryResult.error.message ?? "desconocido"} ` +
            `(code: ${retryResult.error.code ?? "-"}). ` +
            "Moviendo a dead-letter; el item se elimina de la cola."
        );
        removeSyncItem(item.client_uuid);
      }
      continue;
    }

    if (isPermanentConstraintError(error)) {
      console.error(
        `[sync] Item ${item.client_uuid}: error permanente ` +
          `(code: ${error.code ?? "-"}, mensaje: ${error.message ?? "desconocido"}). ` +
          "Dead-letter inmediato; el item se elimina de la cola sin reintentar."
      );
      removeSyncItem(item.client_uuid);
      continue;
    }

    if (item.retries >= MAX_RETRIES) {
      console.error(
        `[sync] Item ${item.client_uuid}: alcanzo MAX_RETRIES (${MAX_RETRIES}). ` +
          `Ultimo error: ${error.message ?? "desconocido"}. ` +
          "Dead-letter; el item se elimina de la cola."
      );
      removeSyncItem(item.client_uuid);
      continue;
    }

    console.warn(
      `[sync] Item ${item.client_uuid}: error transitorio ` +
        `(intento ${item.retries + 1}/${MAX_RETRIES}). ` +
        `Error: ${error.message ?? "desconocido"}. Se reintentara en el proximo ciclo.`
    );
    removeSyncItem(item.client_uuid);
    addToSyncQueue({ ...item, retries: item.retries + 1 });
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
