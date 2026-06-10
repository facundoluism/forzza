import type { Metadata } from "next";
import { colors, spacing } from "@forzza/ui";
import { createClient } from "@/lib/supabase/server";
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: `${spacing[3]}px`,
        paddingTop: `${spacing[2]}px`,
        paddingBottom: `${spacing[2]}px`,
        borderBottom: `1px solid ${colors.gray800}`,
      }}
    >
      <span
        style={{
          color: feature.available ? colors.lime : colors.gray600,
          fontWeight: "700",
          fontSize: "16px",
          width: "20px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {feature.available ? "✓" : "✕"}
      </span>
      <span
        style={{
          color: feature.available ? colors.white : colors.gray600,
          fontSize: "15px",
        }}
      >
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
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("country_config")
      .select("pro_monthly_price_cents, currency_code, currency_symbol")
      .eq("country_code", "AR")
      .single();

    if (!data) return { formatted: "—", note: "por mes · cancelá cuando quieras" };

    const config = data as CountryConfig;
    const amount = config.pro_monthly_price_cents / 100;
    const symbol = config.currency_symbol ?? "$";
    const formatted = `${symbol}${amount.toLocaleString("es-AR")}`;
    return {
      formatted,
      note: `por mes en ${config.currency_code} · cancelá cuando quieras`,
    };
  } catch {
    return { formatted: "—", note: "por mes · cancelá cuando quieras" };
  }
}

export default async function UpgradePage(): Promise<React.JSX.Element> {
  const proPrice = await getProPrice();

  return (
    <main
      style={{
        backgroundColor: colors.black,
        minHeight: "100vh",
        padding: `${spacing[12]}px ${spacing[6]}px ${spacing[20]}px`,
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "center",
          marginBottom: `${spacing[12]}px`,
        }}
      >
        <h1
          style={{
            color: colors.white,
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: "900",
            letterSpacing: "-1px",
            margin: 0,
            marginBottom: `${spacing[4]}px`,
            textTransform: "uppercase",
          }}
        >
          Elegí tu{" "}
          <span style={{ color: colors.lime }}>plan</span>
        </h1>
        <p
          style={{
            color: colors.gray400,
            fontSize: "18px",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Empezá gratis y actualizá cuando estés listo para llevar tu
          entrenamiento al siguiente nivel.
        </p>
      </div>

      {/* Plan cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: `${spacing[6]}px`,
          justifyContent: "center",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Free card */}
        <div
          style={{
            backgroundColor: colors.gray900,
            borderRadius: "16px",
            border: `2px solid ${colors.gray700}`,
            padding: `${spacing[6]}px`,
            flex: 1,
            minWidth: "280px",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: `${spacing[4]}px`,
          }}
        >
          <div>
            <h2
              style={{
                color: colors.white,
                fontSize: "28px",
                fontWeight: "900",
                letterSpacing: "1px",
                textTransform: "uppercase",
                margin: 0,
                marginBottom: `${spacing[2]}px`,
              }}
            >
              Free
            </h2>
            <div
              style={{
                color: colors.white,
                fontSize: "36px",
                fontWeight: "900",
                lineHeight: 1,
              }}
            >
              $0
            </div>
            <div
              style={{
                color: colors.gray400,
                fontSize: "13px",
                marginTop: `${spacing[1]}px`,
              }}
            >
              Para siempre gratis
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {FREE_FEATURES.map((f) => (
              <FeatureRow key={f.text} feature={f} />
            ))}
          </div>

          <a
            href="/auth/login"
            style={{
              display: "block",
              textAlign: "center",
              padding: `${spacing[4]}px`,
              backgroundColor: colors.gray800,
              color: colors.white,
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "16px",
              textDecoration: "none",
              letterSpacing: "0.5px",
            }}
          >
            Tu plan actual
          </a>
        </div>

        {/* PRO card */}
        <div
          style={{
            backgroundColor: colors.gray900,
            borderRadius: "16px",
            border: `2px solid ${colors.lime}`,
            padding: `${spacing[6]}px`,
            flex: 1,
            minWidth: "280px",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: `${spacing[4]}px`,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-14px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: colors.lime,
              color: colors.black,
              fontWeight: "700",
              fontSize: "12px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              padding: `${spacing[1]}px ${spacing[3]}px`,
              borderRadius: "999px",
              whiteSpace: "nowrap",
            }}
          >
            Recomendado
          </div>

          <div>
            <h2
              style={{
                color: colors.lime,
                fontSize: "28px",
                fontWeight: "900",
                letterSpacing: "1px",
                textTransform: "uppercase",
                margin: 0,
                marginBottom: `${spacing[2]}px`,
              }}
            >
              PRO
            </h2>
            <div
              style={{
                color: colors.white,
                fontSize: "36px",
                fontWeight: "900",
                lineHeight: 1,
              }}
            >
              {proPrice.formatted}
            </div>
            <div
              style={{
                color: colors.gray400,
                fontSize: "13px",
                marginTop: `${spacing[1]}px`,
              }}
            >
              {proPrice.note}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {PRO_FEATURES.map((f) => (
              <FeatureRow key={f.text} feature={f} />
            ))}
          </div>

          {/* Client component handles the MP flow */}
          <ActivateProButton />
        </div>
      </div>

      {/* Footer note */}
      <p
        style={{
          textAlign: "center",
          color: colors.gray600,
          fontSize: "13px",
          marginTop: `${spacing[10]}px`,
          maxWidth: "500px",
          margin: `${spacing[10]}px auto 0`,
          lineHeight: 1.6,
        }}
      >
        Todos los precios en ARS. Sin sorpresas: cancelá en cualquier momento
        desde tu perfil.
      </p>
    </main>
  );
}
