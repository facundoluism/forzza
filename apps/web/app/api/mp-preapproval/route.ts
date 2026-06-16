import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isMinorWithoutConsent } from "@forzza/core";
import type { Database } from "@forzza/db-types";

export async function POST(_req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // read-only in route handler — session already set
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Regla §7 extendida a PRO (aprobado por el owner — ver docs/open-questions.md):
  // un menor de 18 sin consentimiento parental no puede comprar PRO. Lógica
  // canónica en @forzza/core. Defensa en profundidad: la Edge Function
  // mp-create-preapproval también lo re-valida ante llamadas directas.
  const { data: studentProfile } = await supabase
    .from("student_profiles")
    .select("birth_date, parental_consent_at")
    .eq("user_id", session.user.id)
    .single();

  if (
    isMinorWithoutConsent({
      birthDate: studentProfile?.birth_date ?? null,
      parentalConsentAt: studentProfile?.parental_consent_at ?? null,
    })
  ) {
    return NextResponse.json({ error: "minor_no_consent" }, { status: 403 });
  }

  const { data, error } = await supabase.functions.invoke<{
    init_point: string;
    subscription_id: string;
  }>("mp-create-preapproval");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
