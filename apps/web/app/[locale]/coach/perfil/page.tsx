import { requireCoach } from "@/lib/auth/coach";
import type { Metadata } from "next";
import { PerfilForm } from "./PerfilForm";
import { AvatarUpload } from "./AvatarUpload";
import { GalleryUpload } from "./GalleryUpload";
import { VideoUpload } from "./VideoUpload";
import { DeleteAccountButton } from "./DeleteAccountButton";
import { AnalyticsOptOut } from "@/components/AnalyticsOptOut";
import { ExportDataButton } from "./ExportDataButton";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import type { Database } from "@forzza/db-types";

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

  // Service-role client for signed URLs
  const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const adminClient =
    serviceKey && supabaseUrl
      ? createSupabaseAdminClient<Database>(supabaseUrl, serviceKey)
      : null;

  // Fetch coach profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: coachProfile } = await (supabase as any)
    .from("coach_profiles")
    .select(
      "id, display_name, bio, specialties, interests, years_experience, country, avatar_url, presentation_video_path"
    )
    .eq("id", coachProfileId)
    .single();

  // Generate signed URL for presentation video
  let presentationVideoSignedUrl: string | null = null;
  const videoPresentationPath = (coachProfile as { presentation_video_path?: string | null } | null)?.presentation_video_path;
  if (adminClient && videoPresentationPath) {
    const { data: signedData } = await adminClient.storage
      .from("coach-gallery")
      .createSignedUrl(videoPresentationPath, 3600);
    presentationVideoSignedUrl = signedData?.signedUrl ?? null;
  }

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

      <GalleryUpload />

      <VideoUpload currentVideoSignedUrl={presentationVideoSignedUrl} />

      <PerfilForm
        initialProfile={{
          display_name: coachProfile?.display_name ?? "",
          bio: coachProfile?.bio ?? "",
          specialties: coachProfile?.specialties ?? [],
          interests: (coachProfile as { interests?: string[] | null } | null)?.interests ?? [],
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
        <ExportDataButton />
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
