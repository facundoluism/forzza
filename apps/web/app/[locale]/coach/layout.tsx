import { requireCoach } from "@/lib/auth/coach";
import { CoachSideNav } from "./CoachSideNav";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function CoachLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "coach" });

  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
  const isDevMode = !supabaseUrl || supabaseUrl.includes("placeholder");

  if (!isDevMode) {
    await requireCoach();
  }

  return (
    <div className="min-h-screen bg-bg text-text flex">
      <CoachSideNav />

      {/* Main content */}
      <main className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-surface border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <span style={{ color: "#C8FF00", fontWeight: 800, fontSize: "18px", letterSpacing: "4px" }}>FORZZA</span>
          <span className="text-muted text-xs uppercase tracking-wider">{t("layout.mobileRole")}</span>
        </header>

        <div className="flex-1 p-4 lg:p-8 pb-28 lg:pb-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
