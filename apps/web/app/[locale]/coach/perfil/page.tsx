import { requireCoach } from "@/lib/auth/coach";
import type { Metadata } from "next";
import { PerfilForm } from "./PerfilForm";
import { AvatarUpload } from "./AvatarUpload";
import { DeleteAccountButton } from "./DeleteAccountButton";
import { AnalyticsOptOut } from "@/components/AnalyticsOptOut";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "coach" });
  return { title: t("perfil.metaTitle") };
}

export default async function PerfilPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "coach" });

  const { supabase, coachProfileId } = await requireCoach();

  // Fetch coach profile
  const { data: coachProfile } = await supabase
    .from("coach_profiles")
    .select(
      "id, display_name, bio, specialties, years_experience, country, avatar_url"
    )
    .eq("id", coachProfileId)
    .single();

  // Fetch packages
  const { data: packages } = await supabase
    .from("coach_packages")
    .select("id, title, description, price, active, features")
    .eq("coach_id", coachProfileId)
    .order("created_at", { ascending: true });

  // Fetch min_coach_price, commission_rate and currency from country_config
  const { data: countryConfig } = await supabase
    .from("country_config")
    .select("min_coach_price, currency_symbol, commission_rate")
    .eq("country", coachProfile?.country ?? "AR")
    .single();

  const tDel = await getTranslations({ locale, namespace: "deleteAccount" });

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">{t("perfil.title")}</h1>
        <p className="text-muted text-sm mt-1">
          {t("perfil.subtitle")}
        </p>
      </div>

      <AvatarUpload currentAvatarUrl={coachProfile?.avatar_url ?? null} />

      <PerfilForm
        initialProfile={{
          display_name: coachProfile?.display_name ?? "",
          bio: coachProfile?.bio ?? "",
          specialties: coachProfile?.specialties ?? [],
          years_experience: coachProfile?.years_experience ?? null,
        }}
        initialPackages={
          (packages ?? []).map((p) => ({
            id: p.id,
            name: p.title,
            description: p.description ?? "",
            price_cents: p.price,
            billing_type: "mensual" as const,
            features: p.features ?? [],
            is_active: p.active ?? true,
          }))
        }
        minCoachPrice={countryConfig?.min_coach_price ?? 0}
        currencySymbol={countryConfig?.currency_symbol ?? "$"}
        commissionRate={Number(countryConfig?.commission_rate ?? 0.20)}
      />

      {/* Privacy controls */}
      <div
        style={{
          marginTop: "32px",
          border: "1px solid #242436",
          borderRadius: "12px",
          padding: "20px 24px",
        }}
      >
        <h2
          style={{
            color: "var(--color-muted)",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            marginBottom: "4px",
            fontFamily: "var(--font-mono)",
          }}
        >
          {t("perfil.privacySection")}
        </h2>
        <AnalyticsOptOut />
      </div>

      {/* Danger zone — delete account */}
      <div
        style={{
          marginTop: "48px",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <h2
          style={{
            color: "var(--color-error)",
            fontSize: "14px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            marginBottom: "8px",
            fontFamily: "var(--font-mono)",
          }}
        >
          {tDel("sectionTitle")}
        </h2>
        <p
          style={{
            color: "var(--color-muted)",
            fontSize: "13px",
            lineHeight: 1.6,
            marginBottom: "16px",
          }}
        >
          {tDel("sectionDesc")}
        </p>
        <DeleteAccountButton />
      </div>
    </div>
  );
}
