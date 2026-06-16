import { requireAdmin } from "@/lib/auth/admin";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AlertTriangle } from "lucide-react";
import { ConfigEditor } from "./ConfigEditor";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("configuracion.metaTitle") };
}

export default async function AdminConfiguracionPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  const { adminClient } = await requireAdmin();

  const { data: configs, error } = await adminClient
    .from("country_config")
    .select(
      "country_code:country, commission_rate, currency, currency_code, currency_symbol, min_coach_price, pro_monthly_price_cents, active"
    )
    .order("country");

  if (error) {
    console.error("Error fetching country_config:", error);
  }

  const rows = configs ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">{t("configuracion.title")}</h1>
        <p className="text-muted text-sm mt-1">
          {t("configuracion.subtitle")}
        </p>
      </div>

      {/* Error state: query falló */}
      {error && (
        <div className="rounded-xl border border-error/30 bg-error/5 p-5 mb-6 flex items-start gap-4">
          <AlertTriangle className="text-error mt-0.5 shrink-0" size={20} />
          <div>
            <p className="text-error text-sm font-semibold">
              {t("configuracion.errorTitle")}
            </p>
            <p className="text-muted text-xs mt-1">
              {t("configuracion.errorBody")}
            </p>
          </div>
        </div>
      )}

      <ConfigEditor configs={rows} />
    </div>
  );
}
