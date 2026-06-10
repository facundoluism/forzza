import type { Metadata } from "next";
import Link from "next/link";
import { colors, spacing } from "@forzza/ui";

export const metadata: Metadata = {
  title: "Contratar coach — Forzza",
  description: "Finalizá la contratación de tu coach desde la app Forzza.",
};

interface PageProps {
  params: Promise<{ coachId: string }>;
  searchParams: Promise<{ package_id?: string }>;
}

export default async function CoachCheckoutWebPage({ params, searchParams }: PageProps) {
  const { coachId } = await params;
  const { package_id } = await searchParams;

  const appDeepLink = `forzza://marketplace/checkout?coach_id=${coachId}${package_id ? `&package_id=${package_id}` : ""}`;

  return (
    <main
      style={{
        backgroundColor: colors.black,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${spacing[6]}px`,
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          backgroundColor: colors.gray900,
          borderRadius: "24px",
          border: `1px solid ${colors.gray800}`,
          padding: `${spacing[10]}px ${spacing[8]}px`,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: `${spacing[6]}px`,
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: "48px" }}>{"📱"}</div>

        <div>
          <h1
            style={{
              color: colors.white,
              fontSize: "28px",
              fontWeight: "900",
              margin: `0 0 ${spacing[3]}px`,
              letterSpacing: "-0.5px",
            }}
          >
            Continuar en la app
          </h1>
          <p style={{ color: colors.gray400, fontSize: "15px", lineHeight: "1.6", margin: 0 }}>
            Para completar la contratación de tu coach, necesitás usar la app de Forzza. El proceso de pago es 100% seguro a través de Mercado Pago.
          </p>
        </div>

        {/* Deep link CTA */}
        <a
          href={appDeepLink}
          style={{
            display: "block",
            backgroundColor: colors.lime,
            color: colors.black,
            borderRadius: "10px",
            padding: `${spacing[4]}px`,
            fontWeight: "700",
            fontSize: "16px",
            textDecoration: "none",
          }}
        >
          Abrir en la app Forzza
        </a>

        {/* Download links */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: `${spacing[2]}px`,
          }}
        >
          <p style={{ color: colors.gray500, fontSize: "13px", margin: 0 }}>
            {"¿No tenés la app instalada?"}
          </p>
          <div style={{ display: "flex", gap: `${spacing[3]}px`, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://apps.apple.com/app/forzza"
              style={{
                color: colors.gray300,
                fontSize: "13px",
                textDecoration: "underline",
              }}
            >
              App Store (iOS)
            </a>
            <a
              href="https://play.google.com/store/apps/forzza"
              style={{
                color: colors.gray300,
                fontSize: "13px",
                textDecoration: "underline",
              }}
            >
              Google Play (Android)
            </a>
          </div>
        </div>

        {/* Back */}
        <Link
          href={`/coaches/${coachId}`}
          style={{ color: colors.gray500, fontSize: "13px", textDecoration: "none" }}
        >
          {"← Volver al perfil del coach"}
        </Link>
      </div>
    </main>
  );
}
