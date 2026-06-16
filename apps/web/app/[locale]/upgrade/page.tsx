import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ActivateProButton } from "./ActivateProButton";
import { PriceBlock } from "./PriceBlock";
import { PriceSkeleton } from "./PriceSkeleton";
import { PRO_FEATURES } from "@/lib/plans";

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

// PRO_FEATURES viene de @/lib/plans (fuente de verdad canónica)

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

export default function UpgradePage(): React.JSX.Element {
  return (
    <main className="bg-bg min-h-screen text-text px-6 py-12 pb-20">
      {/* Back link */}
      <div className="max-w-[900px] mx-auto mb-8">
        <Link
          href="/"
          className="text-muted text-sm hover:text-text transition-colors"
        >
          {"← Volver al inicio"}
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-[800px] mx-auto text-center mb-12">
        <h1 className="text-[clamp(36px,6vw,64px)] font-black tracking-tight text-text mb-4 uppercase">
          Elegí tu{" "}
          <span className="text-lime">plan</span>
        </h1>
        <p className="text-muted text-lg leading-relaxed">
          Empezá gratis y actualizá cuando estés listo para llevar tu
          entrenamiento al siguiente nivel.
        </p>
      </div>

      {/* Plan cards */}
      <div className="flex flex-wrap gap-10 md:gap-6 justify-center max-w-[900px] mx-auto">
        {/* Free card */}
        <div className="bg-surface rounded-2xl border-2 border-border p-6 flex-1 min-w-[280px] max-w-[400px] flex flex-col gap-4">
          <div>
            <h2 className="text-text text-2xl font-black tracking-wide uppercase mb-2">
              Free
            </h2>
            <div className="text-text text-4xl font-black leading-none">$0</div>
            <div className="text-muted text-sm mt-1">Para siempre gratis</div>
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
            Tu plan actual
          </Link>
        </div>

        {/* PRO card */}
        <div className="bg-surface rounded-2xl border-2 border-lime p-6 flex-1 min-w-[280px] max-w-[400px] flex flex-col gap-4 relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-lime text-bg font-bold text-xs tracking-wide uppercase px-3 py-1 rounded-full whitespace-nowrap">
            Recomendado
          </div>

          <div>
            <h2 className="text-lime text-2xl font-black tracking-wide uppercase mb-2">
              PRO
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
              <FeatureRow key={f} feature={{ text: f, available: true }} />
            ))}
          </div>

          {/* Client component handles the MP flow */}
          <ActivateProButton />
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-muted text-[13px] mt-10 max-w-[500px] mx-auto leading-relaxed">
        Todos los precios en ARS. Sin sorpresas: cancelá en cualquier momento
        desde tu perfil.
      </p>
    </main>
  );
}
