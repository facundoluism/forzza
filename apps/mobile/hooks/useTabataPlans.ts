import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { track } from "@/lib/analytics";
import { TRACKED_EVENTS } from "@forzza/core";
import type { SimpleConfig, TabataSegment, TabataMode } from "@forzza/core";
import type { Json } from "@forzza/db-types";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface TabataPlanRecord {
  id: string;
  name: string;
  mode: TabataMode;
  config: SimpleConfig | TabataSegment[];
  created_at: string;
}

interface RawRow {
  id: string;
  name: string;
  mode: string;
  config: unknown;
  created_at: string;
}

function isTabataMode(value: unknown): value is TabataMode {
  return value === "simple" || value === "advanced";
}

function parseRow(row: RawRow): TabataPlanRecord {
  const mode: TabataMode = isTabataMode(row.mode) ? row.mode : "simple";
  return {
    id: row.id,
    name: row.name,
    mode,
    config: row.config as SimpleConfig | TabataSegment[],
    created_at: row.created_at,
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useTabataPlans() {
  const queryClient = useQueryClient();

  const { data: plans = [], isLoading, isError } = useQuery<TabataPlanRecord[]>({
    queryKey: ["tabata-plans"],
    queryFn: async (): Promise<TabataPlanRecord[]> => {
      const { data, error } = await supabase
        .from("tabata_plans")
        .select("id, name, mode, config, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return (data as RawRow[]).map(parseRow);
    },
    staleTime: 2 * 60 * 1000,
  });

  const saveMutation = useMutation({
    mutationFn: async ({
      name,
      mode,
      config,
    }: {
      name: string;
      mode: TabataMode;
      config: SimpleConfig | TabataSegment[];
    }) => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("No hay sesión activa");

      const { error } = await supabase.from("tabata_plans").insert({
        name,
        mode,
        config: config as unknown as Json,
        student_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      track(TRACKED_EVENTS.TABATA_PLAN_SAVED, {});
      void queryClient.invalidateQueries({ queryKey: ["tabata-plans"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tabata_plans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tabata-plans"] });
    },
  });

  return {
    plans,
    isLoading,
    isError,
    savePlan: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    deletePlan: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
