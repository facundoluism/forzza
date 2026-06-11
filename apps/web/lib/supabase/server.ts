import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@forzza/db-types";

export function isSupabaseConfigured(): boolean {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
  return url.length > 0 && !url.includes("placeholder");
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "https://placeholder.supabase.co",
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ?? "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // ignorar en Server Components (solo middleware puede setear cookies)
          }
        },
      },
    }
  );
}
