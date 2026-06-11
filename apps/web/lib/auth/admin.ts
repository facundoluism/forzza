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
    // Make it thenable so await works on query chains
  } as unknown as ReturnType<typeof createServerClient<Database>>;
}

export async function requireAdmin() {
  // Dev bypass: return mock client so pages render with empty data
  if (IS_DEV_MODE) {
    const mockClient = createMockClient();
    return {
      supabase: mockClient,
      adminClient: mockClient,
      user: { id: "dev-admin-000", email: "admin@dev.local" } as never,
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

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "owner") redirect("/");

  // Use service role for admin operations
  const { createClient } = await import("@supabase/supabase-js");
  const adminClient = createClient<Database>(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["SUPABASE_SERVICE_ROLE_KEY"]!
  );

  return { supabase, adminClient, user };
}
