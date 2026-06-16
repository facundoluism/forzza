import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@forzza/db-types";
import { useWorkoutStore } from "@/stores/workoutStore";

const MAX_RETRIES = 5;

/**
 * Columnas reales de workout_sessions:
 *   client_uuid, student_id, routine_id, started_at, completed_at, status, sets_data
 * onConflict: client_uuid (UNIQUE — garantiza idempotencia offline)
 * student_id es requerido (NOT NULL) y debe venir en el payload de la store.
 * routine_id es NULLABLE — permite sesiones freestyle (sin rutina asignada).
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

// ---------------------------------------------------------------------------
// Clasificación de errores de Postgres (códigos devueltos por PostgREST/supabase-js)
// ---------------------------------------------------------------------------

/**
 * FK violation en routine_id: el routine_id referenciado no existe en el server
 * (fue borrado o nunca sincronizó). Como routine_id es NULLABLE, podemos reintentar
 * con null y guardar la sesión como freestyle. Nunca descartamos el entreno del usuario.
 */
const PG_FK_VIOLATION = "23503";

/**
 * Violaciones de constraint permanentes que NUNCA se van a resolver solas.
 * Dead-letter inmediato — no reintentar.
 *
 * 23502 – not_null_violation   (campo requerido faltante; no se puede arreglar en cliente)
 * 23505 – unique_violation     (client_uuid duplicado distinto del onConflict esperado)
 * 23514 – check_violation      (valor fuera de rango del CHECK constraint)
 */
const PG_PERMANENT_VIOLATIONS = new Set(["23502", "23505", "23514"]);

/**
 * Determina si un error de supabase-js tiene un código de Postgres de violación
 * de constraint permanente (distinto de FK sobre routine_id).
 */
function isPermanentConstraintError(error: {
  code?: string;
  message?: string;
  details?: string;
}): boolean {
  if (!error.code) return false;

  // FK violation que NO es por routine_id: también es permanente
  // (ej. student_id inválido → el usuario no existe en server → sin solución en cliente).
  if (error.code === PG_FK_VIOLATION) {
    // Detectamos si la violación es sobre routine_id por el mensaje o details de PostgREST.
    // Formato típico: "Key (routine_id)=(xxx) is not present in table \"routines\""
    const hint = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
    const isRoutineIdFK =
      hint.includes("routine_id") || hint.includes('"routines"');
    // Si la FK violation NO es sobre routine_id, es permanente.
    return !isRoutineIdFK;
  }

  return PG_PERMANENT_VIOLATIONS.has(error.code);
}

/**
 * Determina si un error es una FK violation sobre routine_id específicamente.
 * En ese caso el retry con routine_id: null es válido porque la columna es NULLABLE.
 */
function isRoutineIdFKViolation(error: {
  code?: string;
  message?: string;
  details?: string;
}): boolean {
  if (error.code !== PG_FK_VIOLATION) return false;
  const hint = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
  return hint.includes("routine_id") || hint.includes('"routines"');
}

// ---------------------------------------------------------------------------
// Función de upsert
// ---------------------------------------------------------------------------

async function upsertSession(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<Database> | any,
  payload: WorkoutSessionUpsert
): Promise<{ error: { code?: string; message?: string; details?: string } | null }> {
  // TODO: regenerar db-types — cast mínimo hasta que se actualice el esquema generado
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any)
    .from("workout_sessions")
    .upsert(payload, { onConflict: "client_uuid" });
}

// ---------------------------------------------------------------------------
// Sync principal
// ---------------------------------------------------------------------------

export async function syncPendingItems(
  supabase: SupabaseClient<Database>
): Promise<void> {
  const { syncQueue, removeSyncItem, addToSyncQueue } = useWorkoutStore.getState();

  for (const item of syncQueue) {
    // Construir el payload exacto que acepta workout_sessions.
    const upsertPayload: WorkoutSessionUpsert = {
      client_uuid: item.payload.client_uuid,
      student_id: item.payload.student_id,
      routine_id: item.payload.routine_id ?? null,
      started_at: item.payload.started_at,
      completed_at: item.payload.completed_at ?? null,
      status: item.payload.status ?? "completed",
      sets_data: item.payload.sets_data ?? [],
    };

    const { error } = await upsertSession(supabase, upsertPayload);

    if (!error) {
      // Éxito — sacar de la cola.
      console.log(`[sync] Item ${item.client_uuid} sincronizado correctamente.`);
      removeSyncItem(item.client_uuid);
      continue;
    }

    // --- Clasificación del error ---

    if (isRoutineIdFKViolation(error)) {
      // La rutina referenciada no existe en el server (fue borrada o nunca subió).
      // routine_id es NULLABLE → reintentamos UNA vez como sesión freestyle (null).
      console.warn(
        `[sync] Item ${item.client_uuid}: FK violation en routine_id ` +
          `(routine_id="${upsertPayload.routine_id}"). ` +
          "Reintentando como sesión freestyle (routine_id: null)."
      );

      const retryPayload: WorkoutSessionUpsert = { ...upsertPayload, routine_id: null };
      const retryResult = await upsertSession(supabase, retryPayload);

      if (!retryResult.error) {
        console.log(
          `[sync] Item ${item.client_uuid} sincronizado como sesión freestyle.`
        );
        removeSyncItem(item.client_uuid);
      } else {
        // Retry con null también falló — dead-letter para no perder el entreno del usuario.
        console.error(
          `[sync] Item ${item.client_uuid}: falló el retry freestyle. ` +
            `Error: ${retryResult.error.message ?? "desconocido"} (code: ${retryResult.error.code ?? "-"}). ` +
            "Moviendo a dead-letter — el item se elimina de la cola."
        );
        removeSyncItem(item.client_uuid);
      }
      continue;
    }

    if (isPermanentConstraintError(error)) {
      // Violación de constraint permanente que nunca se va a resolver sola.
      // Dead-letter inmediato — no reintentar; solo perdemos este item de la cola.
      console.error(
        `[sync] Item ${item.client_uuid}: error permanente (code: ${error.code ?? "-"}, ` +
          `mensaje: ${error.message ?? "desconocido"}). ` +
          "Dead-letter inmediato — el item se elimina de la cola sin reintentar."
      );
      removeSyncItem(item.client_uuid);
      continue;
    }

    // Error transitorio (red, timeout, 5xx sin código de constraint).
    if (item.retries >= MAX_RETRIES) {
      // Alcanzamos el máximo de reintentos — dead-letter de verdad.
      // ANTES: el item se quedaba para siempre logueando warnings cada 30s.
      // AHORA: lo removemos de la cola para no llenarla de basura.
      console.error(
        `[sync] Item ${item.client_uuid}: alcanzó MAX_RETRIES (${MAX_RETRIES}). ` +
          `Último error: ${error.message ?? "desconocido"}. ` +
          "Dead-letter — el item se elimina de la cola."
      );
      removeSyncItem(item.client_uuid);
      continue;
    }

    // Transitorio con reintentos disponibles — incrementar contador y volver a encolar.
    console.warn(
      `[sync] Item ${item.client_uuid}: error transitorio ` +
        `(intento ${item.retries + 1}/${MAX_RETRIES}). ` +
        `Error: ${error.message ?? "desconocido"}. Se reintentará en el próximo ciclo.`
    );
    removeSyncItem(item.client_uuid);
    addToSyncQueue({ ...item, retries: item.retries + 1 });
  }
}

// ---------------------------------------------------------------------------
// Intervalo de sync periódico
// ---------------------------------------------------------------------------

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
