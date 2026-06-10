import { supabase } from "@/lib/supabase";
import type { Tables } from "@forzza/db-types";

type StudentProfile = Tables<"student_profiles">;

export async function getStudentProfile(userId: string): Promise<StudentProfile | null> {
  const { data, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw error;
  }

  return data;
}

export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const profile = await getStudentProfile(userId);
  return profile !== null && profile.display_name !== null;
}
