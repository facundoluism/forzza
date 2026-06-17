import type { WorkoutSyncItem } from "@forzza/core";
import { supabase } from "@/lib/supabase";

export interface CompletedWorkoutSession {
  client_uuid: string;
  routine_name: string;
  started_at: string;
  completed_at: string;
  total_sets: number;
}

interface WorkoutSessionRow {
  client_uuid: string;
  routine_id: string | null;
  started_at: string;
  completed_at: string | null;
  sets_data: unknown;
  routines?: { title: string | null } | { title: string | null }[] | null;
}

function countSets(setsData: unknown): number {
  if (!Array.isArray(setsData)) return 0;

  return setsData.reduce((total, exercise) => {
    const sets = (exercise as { sets?: unknown }).sets;
    return total + (Array.isArray(sets) ? sets.length : 0);
  }, 0);
}

function routineTitle(row: WorkoutSessionRow): string {
  const relation = Array.isArray(row.routines) ? row.routines[0] : row.routines;
  return relation?.title ?? "Entreno";
}

export async function fetchCompletedWorkoutSessions(
  userId: string,
  limit = 90
): Promise<CompletedWorkoutSession[]> {
  const { data, error } = await supabase
    .from("workout_sessions")
    .select("client_uuid,routine_id,started_at,completed_at,sets_data,routines(title)")
    .eq("student_id", userId)
    .eq("status", "completed")
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return ((data ?? []) as WorkoutSessionRow[]).map((row) => ({
    client_uuid: row.client_uuid,
    routine_name: routineTitle(row),
    started_at: row.started_at,
    completed_at: row.completed_at ?? row.started_at,
    total_sets: countSets(row.sets_data),
  }));
}

export function completedSessionsFromQueue(
  syncQueue: WorkoutSyncItem[],
  userId?: string | null
): CompletedWorkoutSession[] {
  return syncQueue
    .filter((item) => item.payload?.status === "completed")
    .filter((item) => !userId || item.payload.student_id === userId)
    .map((item) => ({
      client_uuid: item.client_uuid,
      routine_name: item.payload.routine_name ?? "Entreno",
      started_at: item.payload.started_at,
      completed_at: item.payload.completed_at,
      total_sets: countSets(item.payload.sets_data),
    }));
}

export function mergeCompletedWorkoutSessions(
  remoteSessions: CompletedWorkoutSession[],
  localSessions: CompletedWorkoutSession[]
): CompletedWorkoutSession[] {
  const byClientUuid = new Map<string, CompletedWorkoutSession>();

  for (const session of remoteSessions) {
    byClientUuid.set(session.client_uuid, session);
  }

  for (const session of localSessions) {
    byClientUuid.set(session.client_uuid, session);
  }

  return Array.from(byClientUuid.values()).sort(
    (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
  );
}
