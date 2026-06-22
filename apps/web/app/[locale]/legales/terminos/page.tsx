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
    title: t("terms.metaTitle"),
  };
}

interface LegalSection {
  title: string;
  body: string;
}

export default async function TerminosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: "legal" });
  const sections = t.raw("terms.sections") as LegalSection[];

  return (
    <main className="bg-bg min-h-screen px-6 py-16 max-w-[800px] mx-auto text-[#FAFAFA]">
      <Link href="/" className="text-[#C8FF00] text-sm hover:text-[#b8ef00] transition-colors">
        {t("backToHome")}
      </Link>
      <h1 className="text-4xl font-black text-[#FAFAFA] mt-6 mb-6 tracking-tight">
        {t("terms.title")}
      </h1>
      <div className="bg-[#1A1A1A] border border-[#FFAA00] rounded-lg p-4 mb-6">
        <p className="text-[#FFAA00] m-0 text-sm">
          ⚠️ {t("draftNotice")}
        </p>
      </div>
      <div className="text-muted leading-[1.8] text-base">
        <p className="mb-6">{t("terms.intro")}</p>
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-[#FAFAFA] text-2xl font-bold mt-8 mb-3">{section.title}</h2>
            {section.body.split("\n\n").map((paragraph, pIdx) => (
              <p key={pIdx} className="mb-4 whitespace-pre-line">{paragraph}</p>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-12 pt-8 border-t border-[#2A2A2A]">
        <p className="text-muted text-sm mb-3">{t("crossLinks.heading")}</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/legales/privacidad" className="text-[#C8FF00] text-sm hover:text-[#b8ef00] transition-colors">
            {t("crossLinks.privacy")}
          </Link>
          <Link href="/legales/ia" className="text-[#C8FF00] text-sm hover:text-[#b8ef00] transition-colors">
            {t("crossLinks.aiPolicy")}
          </Link>
          <Link href="/legales/disclaimer-salud" className="text-[#C8FF00] text-sm hover:text-[#b8ef00] transition-colors">
            {t("crossLinks.healthDisclaimer")}
          </Link>
        </div>
      </div>
    </main>
  );
}
