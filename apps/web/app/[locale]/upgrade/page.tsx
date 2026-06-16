import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { ActivateProButton } from "./ActivateProButton";
import { PriceBlock } from "./PriceBlock";
import { PriceSkeleton } from "./PriceSkeleton";
import type { Locale } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "upgrade" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

interface PlanFeature {
  text: string;
  available: boolean;
}

function FeatureRow({ feature }: { feature: PlanFeature }): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-surface-3">
      <span
        className={`font-bold text-base w-5 text-center flex-shrink-0 ${
          feature.available ? "text-lime" : "text-surface-3"
        }`}
      >
        {feature.available ? "✓" : "✕"}
      </span>
      <span
        className={`text-[15px] ${
          feature.available ? "text-text" : "text-muted"
        }`}
      >
        {feature.text}
      </span>
    </div>
  );
}

export default async function UpgradePage({ params }: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: "upgrade" });

  const FREE_FEATURES: PlanFeature[] = [
    { text: t("features.upTo3Routines"), available: true },
    { text: t("features.history10Days"), available: true },
    { text: t("features.trackingSetsReps"), available: true },
    { text: t("features.unlimitedHistory"), available: false },
    { text: t("features.unlimitedRoutines"), available: false },
    { text: t("features.bodyMetrics"), available: false },
    { text: t("features.progressPhotos"), available: false },
  ];

  const PRO_FEATURES: PlanFeature[] = [
    { text: t("features.upTo3Routines"), available: true },
    { text: t("features.history10Days"), available: true },
    { text: t("features.trackingSetsReps"), available: true },
    { text: t("features.unlimitedHistory"), available: true },
    { text: t("features.unlimitedRoutines"), available: true },
    { text: t("features.bodyMetrics"), available: true },
    { text: t("features.progressPhotos"), available: true },
  ];

  return (
    <main className="bg-bg min-h-screen text-text px-6 py-12 pb-20">
      {/* Back link */}
      <div className="max-w-[900px] mx-auto mb-8">
        <Link
          href="/"
          className="text-muted text-sm hover:text-text transition-colors"
        >
          {t("backToHome")}
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-[800px] mx-auto text-center mb-12">
        <h1 className="text-[clamp(36px,6vw,64px)] font-black tracking-tight text-text mb-4 uppercase">
          {t("heading").split(" ").slice(0, -1).join(" ")}{" "}
          <span className="text-lime">{t("heading").split(" ").slice(-1)[0]}</span>
        </h1>
        <p className="text-muted text-lg leading-relaxed">
          {t("subheading")}
        </p>
      </div>

      {/* Plan cards */}
      <div className="flex flex-wrap gap-10 md:gap-6 justify-center max-w-[900px] mx-auto">
        {/* Free card */}
        <div className="bg-surface rounded-2xl border-2 border-border p-6 flex-1 min-w-[280px] max-w-[400px] flex flex-col gap-4">
          <div>
            <h2 className="text-text text-2xl font-black tracking-wide uppercase mb-2">
              {t("freePlanName")}
            </h2>
            <div className="text-text text-4xl font-black leading-none">{t("freePrice")}</div>
            <div className="text-muted text-sm mt-1">{t("freeTagline")}</div>
          </div>

          <div className="flex-1">
            {FREE_FEATURES.map((f) => (
              <FeatureRow key={f.text} feature={f} />
            ))}
          </div>

          <Link
            href="/login"
            className="block text-center py-4 bg-surface-2 text-text rounded-xl font-bold text-base hover:bg-surface-3 transition-colors"
          >
            {t("freeCta")}
          </Link>
        </div>

        {/* PRO card */}
        <div className="bg-surface rounded-2xl border-2 border-lime p-6 flex-1 min-w-[280px] max-w-[400px] flex flex-col gap-4 relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-lime text-bg font-bold text-xs tracking-wide uppercase px-3 py-1 rounded-full whitespace-nowrap">
            {t("proRecommended")}
          </div>

          <div>
            <h2 className="text-lime text-2xl font-black tracking-wide uppercase mb-2">
              {t("proPlanName")}
            </h2>

            {/*
              Suspense boundary: muestra PriceSkeleton mientras PriceBlock
              (Server Component async) resuelve la query a country_config.
              Si la query falla, PriceBlock muestra el fallback + aviso de error.
            */}
            <Suspense fallback={<PriceSkeleton />}>
              <PriceBlock />
            </Suspense>
          </div>

          <div className="flex-1">
            {PRO_FEATURES.map((f) => (
              <FeatureRow key={f.text} feature={f} />
            ))}
          </div>

          {/* Client component handles the MP flow */}
          <ActivateProButton />
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-muted text-[13px] mt-10 max-w-[500px] mx-auto leading-relaxed">
        {t("footerNote")}
      </p>
    </main>
  );
}
