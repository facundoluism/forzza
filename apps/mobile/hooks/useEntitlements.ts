import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Entitlements {
  isPro: boolean;
  hasCoach: boolean;
  plan: "free" | "pro" | "elite";
  coachId: string | null;
  isLoading: boolean;
}

interface EntitlementsResponse {
  isPro: boolean;
  hasCoach: boolean;
  plan: "free" | "pro" | "elite";
  coachId: string | null;
}

const DEV_FALLBACK: Entitlements = {
  isPro: false,
  hasCoach: false,
  plan: "free",
  coachId: null,
  isLoading: false,
};

export function useEntitlements(): Entitlements {
  const supabaseUrl = process.env["EXPO_PUBLIC_SUPABASE_URL"];

  const { data, isLoading } = useQuery<EntitlementsResponse>({
    queryKey: ["entitlements"],
    queryFn: async (): Promise<EntitlementsResponse> => {
      const { data, error } = await supabase.functions.invoke<EntitlementsResponse>(
        "check-entitlements"
      );
      if (error) throw error;
      if (!data) throw new Error("No entitlements data returned");
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!supabaseUrl,
  });

  // In dev when SUPABASE_URL is not set, return safe defaults
  if (!supabaseUrl) {
    return DEV_FALLBACK;
  }

  if (isLoading || !data) {
    return {
      isPro: false,
      hasCoach: false,
      plan: "free",
      coachId: null,
      isLoading,
    };
  }

  return {
    isPro: data.isPro,
    hasCoach: data.hasCoach,
    plan: data.plan,
    coachId: data.coachId,
    isLoading: false,
  };
}
