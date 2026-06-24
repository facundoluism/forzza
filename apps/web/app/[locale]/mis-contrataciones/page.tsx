import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { MisContratacionesClient } from "./MisContratacionesClient";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export interface AssignmentRow {
  id: string;
  created_at: string;
  status: string;
  refunded_at: string | null;
  coach_name: string;
  package_title: string;
  package_price: number;
  currency: string;
  currency_symbol: string;
  /** días corridos desde la contratación */
  days_elapsed: number;
  /** si está dentro de la ventana de 10 días y no está cancelado/reembolsado */
  eligible_for_revocation: boolean;
}

const REVOCATION_WINDOW_DAYS = 10;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "misContrataciones" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function MisContratacionesPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: "misContrataciones" });

  // Modo dev sin Supabase
  if (!isSupabaseConfigured()) {
    return (
      <MisContratacionesClient
        assignments={[]}
        errorMessage={t("errorDevMode")}
      />
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/ingresar?redirect=/mis-contrataciones", locale });
    return null as unknown as React.JSX.Element;
  }

  // Obtener moneda del usuario
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: userRecord } = await (supabase as any)
    .from("users")
    .select("country")
    .eq("id", user.id)
    .single();

  const country = (userRecord?.country as string) ?? "AR";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: countryConfig } = await (supabase as any)
    .from("country_config")
    .select("currency_code, currency_symbol")
    .eq("country", country)
    .single();

  const currency = (countryConfig?.currency_code as string) ?? "ARS";
  const currencySymbol = (countryConfig?.currency_symbol as string) ?? "$";

  // Obtener contrataciones del alumno con datos del coach y paquete
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawAssignments, error } = await (supabase as any)
    .from("coach_assignments")
    .select(
      `
      id,
      created_at,
      status,
      refunded_at,
      coach_profiles!coach_assignments_coach_id_fkey ( display_name ),
      coach_packages!coach_assignments_package_id_fkey ( title, price )
      `
    )
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[mis-contrataciones] fetch error:", error);
    return (
      <MisContratacionesClient
        assignments={[]}
        errorMessage={t("errorLoad")}
      />
    );
  }

  const now = new Date();

  type RawAssignment = {
    id: string;
    created_at: string;
    status: string;
    refunded_at: string | null;
    coach_profiles: { display_name: string } | null;
    coach_packages: { title: string; price: number } | null;
  };

  const assignments: AssignmentRow[] = ((rawAssignments as RawAssignment[]) ?? []).map(
    (a) => {
      const createdAt = new Date(a.created_at);
      const diffMs = now.getTime() - createdAt.getTime();
      const daysElapsed = diffMs / (1000 * 60 * 60 * 24);
      const isRevocable =
        daysElapsed <= REVOCATION_WINDOW_DAYS &&
        a.status !== "canceled" &&
        a.status !== "refunded";

      return {
        id: a.id,
        created_at: a.created_at,
        status: a.status,
        refunded_at: a.refunded_at,
        coach_name: a.coach_profiles?.display_name ?? "Coach",
        package_title: a.coach_packages?.title ?? "Paquete",
        package_price: a.coach_packages?.price ?? 0,
        currency,
        currency_symbol: currencySymbol,
        days_elapsed: Math.floor(daysElapsed),
        eligible_for_revocation: isRevocable,
      };
    }
  );

  return <MisContratacionesClient assignments={assignments} errorMessage={null} />;
}
