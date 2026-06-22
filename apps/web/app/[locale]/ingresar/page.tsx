/**
 * /ingresar — Punto de entrada: ¿Sos coach o alumno?
 *
 * Server Component. No requiere auth.
 * - Coach → /login (con acceso al registro de coach)
 * - Alumno → pantalla explicativa con QR + tarjetas de descarga de app
 *
 * Rutas de tienda configurables via env:
 *   NEXT_PUBLIC_IOS_APP_URL
 *   NEXT_PUBLIC_ANDROID_APP_URL
 *   NEXT_PUBLIC_APP_DOWNLOAD_URL   (URL codificada en el QR)
 */

import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { AppQrCode } from "@/components/AppQrCode";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ingresar.metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function IngresarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: "ingresar" });

  const iosUrl =
    process.env["NEXT_PUBLIC_IOS_APP_URL"] ?? "https://apps.apple.com";
  const androidUrl =
    process.env["NEXT_PUBLIC_ANDROID_APP_URL"] ??
    "https://play.google.com/store";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-body)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* NAV mínima */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <Link
          href="/"
          style={{
            color: "var(--color-lime)",
            fontSize: "22px",
            fontWeight: 800,
            letterSpacing: "6px",
            fontFamily: "var(--font-display)",
            textDecoration: "none",
          }}
        >
          FORZZA
        </Link>
        <LanguageSwitcher />
      </nav>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          maxWidth: "900px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 900,
            textAlign: "center",
            marginBottom: "12px",
            fontFamily: "var(--font-display)",
            letterSpacing: "1px",
            color: "var(--color-text)",
          }}
        >
          {t("headline")}
        </h1>
        <p
          style={{
            color: "var(--color-muted)",
            fontSize: "17px",
            textAlign: "center",
            marginBottom: "48px",
            maxWidth: "480px",
          }}
        >
          {t("subheadline")}
        </p>

        {/* Two big option cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: "20px",
            width: "100%",
            maxWidth: "640px",
          }}
        >
          {/* Coach card */}
          <Link
            href="/login"
            style={{ textDecoration: "none" }}
          >
            <div
              className="card-hover"
              style={{
                padding: "36px 28px",
                background: "var(--color-surface)",
                border: "2px solid var(--color-lime)",
                borderRadius: "20px",
                boxShadow: "0 0 32px rgba(200,255,0,0.12)",
                cursor: "pointer",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top highlight */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "20px",
                  right: "20px",
                  height: "2px",
                  background:
                    "linear-gradient(90deg, transparent, var(--color-lime), transparent)",
                }}
              />
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏋️</div>
              <h2
                style={{
                  color: "var(--color-lime)",
                  fontSize: "22px",
                  fontWeight: 800,
                  fontFamily: "var(--font-display)",
                  letterSpacing: "1px",
                  marginBottom: "10px",
                }}
              >
                {t("coach.title")}
              </h2>
              <p
                style={{
                  color: "var(--color-muted)",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                {t("coach.desc")}
              </p>
              <div
                style={{
                  display: "inline-block",
                  padding: "12px 28px",
                  background: "var(--color-lime)",
                  borderRadius: "10px",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "15px",
                }}
              >
                {t("coach.cta")}
              </div>
            </div>
          </Link>

          {/* Alumno card — scroll to download section on same page */}
          <a
            href="#descargar-app"
            style={{ textDecoration: "none" }}
          >
            <div
              className="card-hover"
              style={{
                padding: "36px 28px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "20px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📱</div>
              <h2
                style={{
                  color: "var(--color-text)",
                  fontSize: "22px",
                  fontWeight: 800,
                  fontFamily: "var(--font-display)",
                  letterSpacing: "1px",
                  marginBottom: "10px",
                }}
              >
                {t("student.title")}
              </h2>
              <p
                style={{
                  color: "var(--color-muted)",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                {t("student.desc")}
              </p>
              <div
                style={{
                  display: "inline-block",
                  padding: "12px 28px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "10px",
                  color: "var(--color-text)",
                  fontWeight: 700,
                  fontSize: "15px",
                }}
              >
                {t("student.cta")}
              </div>
            </div>
          </a>
        </div>

        {/* DOWNLOAD SECTION — alumno */}
        <section
          id="descargar-app"
          style={{
            marginTop: "80px",
            width: "100%",
            maxWidth: "700px",
            scrollMarginTop: "40px",
          }}
        >
          <div
            style={{
              padding: "clamp(28px, 5vw, 48px)",
              background: "var(--color-surface)",
              borderRadius: "24px",
              border: "1px solid var(--color-border)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(200,255,0,0.1)",
                border: "1px solid rgba(200,255,0,0.2)",
                borderRadius: "999px",
                padding: "4px 14px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-lime)",
                  letterSpacing: "1px",
                }}
              >
                {t("download.badge")}
              </span>
            </div>

            <h2
              style={{
                fontSize: "clamp(22px, 4vw, 32px)",
                fontWeight: 800,
                fontFamily: "var(--font-display)",
                marginBottom: "12px",
                color: "var(--color-text)",
              }}
            >
              {t("download.heading")}
            </h2>
            <p
              style={{
                color: "var(--color-muted)",
                fontSize: "16px",
                lineHeight: 1.7,
                marginBottom: "40px",
                maxWidth: "480px",
                margin: "0 auto 40px",
              }}
            >
              {t("download.body")}
            </p>

            {/* QR + Store cards layout */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "32px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* QR */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    padding: "16px",
                    background: "#0A0A0A",
                    borderRadius: "16px",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <AppQrCode
                    size={168}
                    alt={t("download.qrAlt")}
                  />
                </div>
                <p
                  style={{
                    color: "var(--color-muted)",
                    fontSize: "12px",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.5px",
                  }}
                >
                  {t("download.qrHint")}
                </p>
              </div>

              {/* Store cards */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  minWidth: "220px",
                }}
              >
                {/* App Store */}
                <a
                  href={iosUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="card-hover"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "18px 20px",
                      background: "#111111",
                      border: "1px solid var(--color-border)",
                      borderRadius: "14px",
                      cursor: "pointer",
                    }}
                  >
                    {/* Apple icon */}
                    <svg
                      width="28"
                      height="34"
                      viewBox="0 0 814 1000"
                      aria-hidden="true"
                      fill="var(--color-text)"
                      style={{ flexShrink: 0 }}
                    >
                      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 405.8 0 303.3 0 207.7 0 94.6 62.1 34.2 125.4 20.3c30.6-7.1 60.8-11.3 90.6-11.3 68 0 134.5 34.2 180.1 34.2 44.8 0 126.6-39.5 207.6-39.5 33.4 0 124.1 3.2 183.5 75.1z" />
                    </svg>
                    <div style={{ textAlign: "left" }}>
                      <div
                        style={{
                          color: "var(--color-muted)",
                          fontSize: "11px",
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.5px",
                          marginBottom: "3px",
                        }}
                      >
                        {t("download.ios.eyebrow")}
                      </div>
                      <div
                        style={{
                          color: "var(--color-text)",
                          fontWeight: 700,
                          fontSize: "16px",
                          fontFamily: "var(--font-display)",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {t("download.ios.label")}
                      </div>
                    </div>
                  </div>
                </a>

                {/* Google Play */}
                <a
                  href={androidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="card-hover"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "18px 20px",
                      background: "#111111",
                      border: "1px solid var(--color-border)",
                      borderRadius: "14px",
                      cursor: "pointer",
                    }}
                  >
                    {/* Google Play triangle icon */}
                    <svg
                      width="28"
                      height="32"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      style={{ flexShrink: 0 }}
                    >
                      <path
                        d="M3.18 23.76A2 2 0 0 1 2 22V2a2 2 0 0 1 1.18-1.76l11.8 11.76L3.18 23.76z"
                        fill="#EA4335"
                      />
                      <path
                        d="M15.72 8.28L4.3.24 16.88 7.46l-1.16.82z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M15.72 15.72l1.16.82L4.3 23.76l11.42-8.04z"
                        fill="#34A853"
                      />
                      <path
                        d="M22 12a2 2 0 0 1-1.12 1.82l-3.16 1.78-2.12-1.6 2.12-1.6 3.16 1.78A2 2 0 0 1 22 12z"
                        fill="#4285F4"
                      />
                    </svg>
                    <div style={{ textAlign: "left" }}>
                      <div
                        style={{
                          color: "var(--color-muted)",
                          fontSize: "11px",
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.5px",
                          marginBottom: "3px",
                        }}
                      >
                        {t("download.android.eyebrow")}
                      </div>
                      <div
                        style={{
                          color: "var(--color-text)",
                          fontWeight: 700,
                          fontSize: "16px",
                          fontFamily: "var(--font-display)",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {t("download.android.label")}
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Testing note */}
            <p
              style={{
                marginTop: "32px",
                color: "var(--color-muted)",
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
                opacity: 0.7,
              }}
            >
              {t("download.testingNote")}
            </p>

            {/* Back to selection */}
            <div style={{ marginTop: "24px" }}>
              <a
                href="#top"
                style={{
                  color: "var(--color-muted)",
                  fontSize: "14px",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                {t("download.backToOptions")}
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
