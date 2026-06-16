import { requireAdmin } from "@/lib/auth/admin";
import { AdminSideNav } from "./AdminSideNav";
import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "admin" });

  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
  const isDevMode = !supabaseUrl || supabaseUrl.includes("placeholder");

  if (!isDevMode) {
    await requireAdmin();
  }

  return (
    <div className="min-h-screen bg-bg text-text flex">
      <AdminSideNav />

      {/* Main content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-surface border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <span style={{ color: "#C8FF00", fontWeight: 800, fontSize: "16px", letterSpacing: "4px" }}>FORZZA</span>
          <span className="text-muted text-xs uppercase tracking-wider">{t("layout.mobileRole")}</span>
        </header>

        <div className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
