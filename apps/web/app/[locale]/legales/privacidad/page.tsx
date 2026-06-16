import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: t("privacy.metaTitle"),
  };
}

export default async function PrivacidadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <main className="bg-bg min-h-screen px-6 py-16 max-w-[800px] mx-auto text-[#FAFAFA]">
      <Link href="/" className="text-[#C8FF00] text-sm hover:text-[#b8ef00] transition-colors">
        {t("backToHome")}
      </Link>
      <h1 className="text-4xl font-black text-[#FAFAFA] mt-6 mb-6 tracking-tight">
        {t("privacy.title")}
      </h1>
      <div className="bg-[#1A1A1A] border border-[#FFAA00] rounded-lg p-4 mb-6">
        <p className="text-[#FFAA00] m-0 text-sm">
          ⚠️ {t("draftNotice")}
        </p>
      </div>
      <div className="text-muted leading-[1.8] text-base">
        <p>{t("privacy.intro")}</p>
        <h2 className="text-[#FAFAFA] text-2xl font-bold mt-8 mb-3">{t("privacy.section1Title")}</h2>
        <p>{t("privacy.section1Body")}</p>
        <h2 className="text-[#FAFAFA] text-2xl font-bold mt-8 mb-3">{t("privacy.section2Title")}</h2>
        <p>{t("privacy.section2Body")}</p>
        <h2 className="text-[#FAFAFA] text-2xl font-bold mt-8 mb-3">{t("privacy.section3Title")}</h2>
        <p>{t("privacy.section3Body")}</p>
      </div>
    </main>
  );
}
