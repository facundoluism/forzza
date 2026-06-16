import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import { CheckoutClient } from "./CheckoutClient";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string; coachId: string }>;
  searchParams: Promise<{ package_id?: string }>;
}

interface CoachPackageData {
  id: string;
  title: string;
  price: number;
  active: boolean;
  tier: string;
  description: string | null;
}

interface CoachProfileData {
  id: string;
  display_name: string;
  status: string;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function CoachCheckoutPage({
  params,
  searchParams,
}: PageProps) {
  const { locale, coachId } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: "checkout" });
  const { package_id: packageId } = await searchParams;

  // Si no hay package_id, redirigir al perfil del coach
  if (!packageId) {
    redirect(`/coaches/${coachId}`);
  }

  // Si Supabase no está configurado, mostrar el checkout igual (el cliente manejará el error)
  if (!isSupabaseConfigured()) {
    return (
      <CheckoutClient
        coachId={coachId}
        packageId={packageId}
        coachName="Coach"
        packageTitle={t("selectedPackageFallback")}
        packagePrice={0}
        currency="ARS"
        isMinorWithoutConsent={false}
        errorMessage={t("errorDevMode")}
      />
    );
  }

  const supabase = await createClient();

  // Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = `/coaches/${coachId}/checkout?package_id=${packageId}`;
    redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  }

  // Verificar menor de edad sin consentimiento paternal (Regla #7)
  let isMinorWithoutConsent = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: studentProfile } = await (supabase as any)
    .from("student_profiles")
    .select("birth_date, parental_consent_at")
    .eq("user_id", user.id)
    .single();

  if (studentProfile?.birth_date) {
    const ageMs = Date.now() - new Date(studentProfile.birth_date as string).getTime();
    const age = Math.floor(ageMs / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 18 && !studentProfile.parental_consent_at) {
      isMinorWithoutConsent = true;
    }
  }

  // Obtener datos del coach y el paquete
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: coachData } = await (supabase as any)
    .from("coach_profiles")
    .select("id, display_name, status")
    .eq("id", coachId)
    .eq("status", "approved")
    .single();

  if (!coachData) {
    return (
      <CheckoutClient
        coachId={coachId}
        packageId={packageId}
        coachName="Coach"
        packageTitle=""
        packagePrice={0}
        currency="ARS"
        isMinorWithoutConsent={false}
        errorMessage={t("errorCoachUnavailable")}
      />
    );
  }

  const coach = coachData as CoachProfileData;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: packageData } = await (supabase as any)
    .from("coach_packages")
    .select("id, title, price, active, tier, description")
    .eq("id", packageId)
    .eq("coach_id", coachId)
    .eq("active", true)
    .single();

  if (!packageData) {
    return (
      <CheckoutClient
        coachId={coachId}
        packageId={packageId}
        coachName={coach.display_name}
        packageTitle=""
        packagePrice={0}
        currency="ARS"
        isMinorWithoutConsent={false}
        errorMessage={t("errorPackageNotAvailable")}
      />
    );
  }

  const pkg = packageData as CoachPackageData;

  // Obtener símbolo de moneda del país del usuario
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

  return (
    <CheckoutClient
      coachId={coachId}
      packageId={packageId}
      coachName={coach.display_name}
      packageTitle={pkg.title}
      packagePrice={pkg.price}
      currency={currency}
      currencySymbol={currencySymbol}
      isMinorWithoutConsent={isMinorWithoutConsent}
      errorMessage={null}
    />
  );
}
