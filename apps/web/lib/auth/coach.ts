import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Database } from "@forzza/db-types";

const SUPABASE_URL = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
const IS_DEV_MODE = !SUPABASE_URL || SUPABASE_URL.includes("placeholder");

// Mock Supabase client for dev mode — returns empty results for any query
function createMockClient() {
  const mockQuery = () => ({
    select: () => mockQuery(),
    insert: () => mockQuery(),
    update: () => mockQuery(),
    delete: () => mockQuery(),
    eq: () => mockQuery(),
    neq: () => mockQuery(),
    gte: () => mockQuery(),
    lte: () => mockQuery(),
    in: () => mockQuery(),
    order: () => mockQuery(),
    limit: () => mockQuery(),
    single: () => mockQuery(),
    maybeSingle: () => mockQuery(),
    then: (resolve: (v: { data: never[]; error: null; count: 0 }) => void) =>
      resolve({ data: [], error: null, count: 0 }),
    data: [],
    error: null,
    count: 0,
  });
  return {
    from: () => mockQuery(),
    auth: { getUser: async () => ({ data: { user: null }, error: null }) },
  } as unknown as ReturnType<typeof createServerClient<Database>>;
}

export async function requireCoach() {
  // Dev bypass: return mock client so pages render with empty data
  if (IS_DEV_MODE) {
    const mockClient = createMockClient();
    return {
      supabase: mockClient,
      user: { id: "dev-coach-000", email: "coach@dev.local" } as never,
      /** coach_profiles.id (NOT auth user id) */
      coachProfileId: "dev-coach-000",
    };
  }

  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userRow } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userRow?.role !== "coach") redirect("/");

  // Resolve the coach_profiles row — all coach tables use coach_profiles.id, NOT auth user id
  const { data: coachProfile } = await supabase
    .from("coach_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!coachProfile) redirect("/onboarding-coach");

  return {
    supabase,
    user,
    /** coach_profiles.id — use this as coach_id in all table filters/inserts */
    coachProfileId: coachProfile.id,
  };
}
