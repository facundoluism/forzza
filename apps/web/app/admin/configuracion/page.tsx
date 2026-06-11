import { requireAdmin } from "@/lib/auth/admin";
import type { Metadata } from "next";
import { ConfigEditor } from "./ConfigEditor";

export const metadata: Metadata = {
  title: "Configuración — Forzza Admin",
};

export default async function AdminConfiguracionPage() {
  const { adminClient } = await requireAdmin();

  const { data: configs, error } = await adminClient
    .from("country_config")
    .select(
      "country_code, commission_rate, currency, currency_code, currency_symbol, min_coach_price, pro_monthly_price_cents, active"
    )
    .order("country_code");

  if (error) {
    console.error("Error fetching country_config:", error);
  }

  const rows = configs ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Configuración</h1>
        <p className="text-[#555555] text-sm mt-1">
          Parámetros por país: comisión, precios y moneda
        </p>
      </div>

      <ConfigEditor configs={rows} />
    </div>
  );
}
