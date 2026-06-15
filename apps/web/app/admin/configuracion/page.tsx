import { requireAdmin } from "@/lib/auth/admin";
import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { ConfigEditor } from "./ConfigEditor";

export const metadata: Metadata = {
  title: "Configuración — Forzza Admin",
};

export default async function AdminConfiguracionPage() {
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
        <h1 className="text-2xl font-bold text-text">Configuración</h1>
        <p className="text-muted text-sm mt-1">
          Parámetros por país: comisión, precios y moneda
        </p>
      </div>

      {/* Error state: query falló */}
      {error && (
        <div className="rounded-xl border border-error/30 bg-error/5 p-5 mb-6 flex items-start gap-4">
          <AlertTriangle className="text-error mt-0.5 shrink-0" size={20} />
          <div>
            <p className="text-error text-sm font-semibold">
              Error al cargar la configuración
            </p>
            <p className="text-muted text-xs mt-1">
              No se pudo conectar con la base de datos. Recargá la página o
              revisá los logs.
            </p>
          </div>
        </div>
      )}

      <ConfigEditor configs={rows} />
    </div>
  );
}
