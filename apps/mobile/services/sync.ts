import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@forzza/db-types";
import { useWorkoutStore } from "@/stores/workoutStore";

const MAX_RETRIES = 5;

export async function syncPendingItems(
  supabase: SupabaseClient<Database>
): Promise<void> {
  const { syncQueue, removeSyncItem, addToSyncQueue } = useWorkoutStore.getState();

  for (const item of syncQueue) {
    if (item.retries >= MAX_RETRIES) {
      console.warn(`[sync] Item ${item.client_uuid} reached max retries, skipping`);
      continue;
    }

    const { error } = await supabase
      .from("workout_sessions" as never)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert({ ...item.payload } as any, { onConflict: "client_uuid" });

    if (error) {
      console.error(`[sync] Error syncing item ${item.client_uuid}:`, error.message);
      // Increment retries by replacing item with incremented count
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
