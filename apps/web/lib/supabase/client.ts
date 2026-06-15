"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@forzza/db-types";

const SUPABASE_URL = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
const SUPABASE_ANON_KEY = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ?? "";
const IS_DEV_MODE =
  !SUPABASE_URL || SUPABASE_URL.includes("placeholder") || !SUPABASE_ANON_KEY;

// Mock browser client para dev mode: las queries resuelven vacío y auth.getUser
// devuelve null. Evita que `createBrowserClient` tire "URL and API key required"
// y crashee las páginas client-side cuando no hay env (mismo criterio que el server).
function createMockClient(): ReturnType<typeof createBrowserClient<Database>> {
  const mockQuery = (): Record<string, unknown> => {
    const q: Record<string, unknown> = {
      select: () => mockQuery(),
      insert: () => mockQuery(),
      update: () => mockQuery(),
      delete: () => mockQuery(),
      upsert: () => mockQuery(),
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
    };
    return q;
  };
  return {
    from: () => mockQuery(),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      resetPasswordForEmail: async () => ({ data: {}, error: null }),
      updateUser: async () => ({ data: { user: null }, error: null }),
      exchangeCodeForSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
  } as unknown as ReturnType<typeof createBrowserClient<Database>>;
}

export function createClient() {
  if (IS_DEV_MODE) return createMockClient();
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
