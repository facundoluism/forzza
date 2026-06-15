import type { Metadata } from "next";
import Link from "next/link";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import { ActivateProButton } from "./ActivateProButton";

export const metadata: Metadata = {
  title: "Elegí tu plan — Forzza",
  description:
    "Accedé a todas las funciones PRO de Forzza. Historial ilimitado, rutinas sin límite y más.",
};

interface PlanFeature {
  text: string;
  available: boolean;
}

const FREE_FEATURES: PlanFeature[] = [
  { text: "Hasta 3 rutinas", available: true },
  { text: "Historial últimos 10 días", available: true },
  { text: "Tracking de series y reps", available: true },
  { text: "Historial completo", available: false },
  { text: "Rutinas ilimitadas", available: false },
  { text: "Métricas corporales", available: false },
  { text: "Fotos de progreso", available: false },
];

const PRO_FEATURES: PlanFeature[] = [
  { text: "Rutinas ilimitadas", available: true },
  { text: "Historial completo sin límites", available: true },
  { text: "Tracking de series y reps", available: true },
  { text: "Métricas corporales", available: true },
  { text: "Fotos de progreso", available: true },
  { text: "Soporte prioritario", available: true },
  { text: "Acceso anticipado a nuevas funciones", available: true },
];

function FeatureRow({ feature }: { feature: PlanFeature }): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-[#2A2A2A]">
      <span className={`font-bold text-base w-5 text-center flex-shrink-0 ${feature.available ? "text-[#C8FF00]" : "text-[#4A4A4A]"}`}>
        {feature.available ? "✓" : "✕"}
      </span>
      <span className={`text-[15px] ${feature.available ? "text-[#FAFAFA]" : "text-[#4A4A4A]"}`}>
        {feature.text}
      </span>
    </div>
  );
}

interface CountryConfig {
  pro_monthly_price_cents: number;
  currency_code: string;
  currency_symbol: string;
}

async function getProPrice(): Promise<{ formatted: string; note: string }> {
  if (!isSupabaseConfigured()) {
    return { formatted: "$ 9.999", note: "por mes en ARS · cancelá cuando quieras" };
  }
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("country_config")
      .select("pro_monthly_price_cents, currency_code, currency_symbol")
      .eq("country", "AR")
      .single();

    if (!data) return { formatted: "$ 9.999", note: "por mes en ARS · cancelá cuando quieras" };

    const config = data as CountryConfig;
    const amount = config.pro_monthly_price_cents / 100;
    const symbol = config.currency_symbol ?? "$";
    const formatted = `${symbol}${amount.toLocaleString("es-AR")}`;
    return {
      formatted,
      note: `por mes en ${config.currency_code} · cancelá cuando quieras`,
    };
  } catch {
    return { formatted: "$ 9.999", note: "por mes en ARS · cancelá cuando quieras" };
  }
}

export default async function UpgradePage(): Promise<React.JSX.Element> {
  const proPrice = await getProPrice();

  return (
    <main className="bg-[#0A0A0A] min-h-screen text-[#FAFAFA] px-6 py-12 pb-20">
      {/* Back link */}
      <div className="max-w-[900px] mx-auto mb-8">
        <Link href="/" className="text-[#6A6A6A] text-sm hover:text-[#FAFAFA] transition-colors">
          {"← Volver al inicio"}
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-[800px] mx-auto text-center mb-12">
        <h1 className="text-[clamp(36px,6vw,64px)] font-black tracking-tight text-[#FAFAFA] mb-4 uppercase">
          Elegí tu{" "}
          <span className="text-[#C8FF00]">plan</span>
        </h1>
        <p className="text-[#8A8A8A] text-lg leading-relaxed">
          Empezá gratis y actualizá cuando estés listo para llevar tu
          entrenamiento al siguiente nivel.
        </p>
      </div>

      {/* Plan cards */}
      <div className="flex flex-wrap gap-10 md:gap-6 justify-center max-w-[900px] mx-auto">
        {/* Free card */}
        <div className="bg-[#111111] rounded-2xl border-2 border-[#3A3A3A] p-6 flex-1 min-w-[280px] max-w-[400px] flex flex-col gap-4">
          <div>
            <h2 className="text-[#FAFAFA] text-2xl font-black tracking-wide uppercase mb-2">
              Free
            </h2>
            <div className="text-[#FAFAFA] text-4xl font-black leading-none">$0</div>
            <div className="text-[#6A6A6A] text-sm mt-1">Para siempre gratis</div>
          </div>

          <div className="flex-1">
            {FREE_FEATURES.map((f) => (
              <FeatureRow key={f.text} feature={f} />
            ))}
          </div>

          <Link
            href="/login"
            className="block text-center py-4 bg-[#2A2A2A] text-[#FAFAFA] rounded-xl font-bold text-base hover:bg-[#3A3A3A] transition-colors"
          >
            Tu plan actual
          </Link>
        </div>

        {/* PRO card */}
        <div className="bg-[#111111] rounded-2xl border-2 border-[#C8FF00] p-6 flex-1 min-w-[280px] max-w-[400px] flex flex-col gap-4 relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C8FF00] text-black font-bold text-xs tracking-wide uppercase px-3 py-1 rounded-full whitespace-nowrap">
            Recomendado
          </div>

          <div>
            <h2 className="text-[#C8FF00] text-2xl font-black tracking-wide uppercase mb-2">
              PRO
            </h2>
            <div className="text-[#FAFAFA] text-4xl font-black leading-none">
              {proPrice.formatted}
            </div>
            <div className="text-[#6A6A6A] text-sm mt-1">
              {proPrice.note}
            </div>
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
      <p className="text-center text-[#4A4A4A] text-[13px] mt-10 max-w-[500px] mx-auto leading-relaxed">
        Todos los precios en ARS. Sin sorpresas: cancelá en cualquier momento
        desde tu perfil.
      </p>
    </main>
  );
}
