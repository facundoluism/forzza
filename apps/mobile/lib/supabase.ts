import { createClient } from "@supabase/supabase-js";
import type { Database } from "@forzza/db-types";
import { ExpoSecureStoreAdapter } from "./secureStoreAdapter";

const supabaseUrl = process.env["EXPO_PUBLIC_SUPABASE_URL"] ?? "";
const supabaseAnonKey = process.env["EXPO_PUBLIC_SUPABASE_ANON_KEY"] ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Forzza] EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY no configuradas. " +
      "Creá apps/mobile/.env con tus credenciales de Supabase."
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder",
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
