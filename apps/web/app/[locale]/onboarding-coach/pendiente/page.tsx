"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";

export default function PendientePage() {
  const t = useTranslations("onboardingCoach");
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080810", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: "1px solid #242436",
      }}>
        <Link href="/" style={{ color: "#C8FF00", fontSize: "20px", fontWeight: 800, letterSpacing: "6px", fontFamily: "var(--font-display)", textDecoration: "none" }}>
          FORZZA
        </Link>
        <Link href="/" style={{ color: "#9898C0", fontSize: "14px", textDecoration: "none" }}>
          {t("pendiente.backToHome")}
        </Link>
      </nav>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          {/* Success icon */}
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(200, 255, 0, 0.1)",
            border: "2px solid rgba(200, 255, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C8FF00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 style={{ color: "#F0F0FF", fontSize: "28px", fontWeight: 700, marginBottom: "16px", fontFamily: "var(--font-display)", letterSpacing: "0.5px" }}>
            {t("pendiente.heading")}
          </h1>

          <p style={{ color: "#9898C0", lineHeight: 1.6, marginBottom: "8px", fontSize: "16px" }}>
            {t("pendiente.body1Start")}{" "}
            <strong style={{ color: "#F0F0FF" }}>{t("pendiente.body1Bold")}</strong>
            {t("pendiente.body1End")}
          </p>
          <p style={{ color: "#9898C0", lineHeight: 1.6, marginBottom: "32px", fontSize: "16px" }}>
            {t("pendiente.body2")}
          </p>

          {/* Countdown */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#0E0E18",
            border: "1px solid #242436",
            borderRadius: "8px",
            padding: "12px 20px",
            marginBottom: "16px",
          }}>
            <span style={{ color: "#6868A0", fontSize: "14px" }}>{t("pendiente.redirectLabel")}</span>
            <span style={{
              color: "#C8FF00",
              fontSize: "20px",
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              minWidth: "24px",
              textAlign: "center",
            }}>
              {seconds}
            </span>
          </div>

          <div>
            <Link
              href="/"
              style={{
                color: "#6868A0",
                fontSize: "13px",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {t("pendiente.goNow")}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #242436", padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <span style={{ color: "#C8FF00", fontSize: "16px", fontWeight: 800, letterSpacing: "6px", fontFamily: "var(--font-display)" }}>FORZZA</span>
        <div style={{ display: "flex", gap: "24px" }}>
          <Link href="/legales/terminos" style={{ color: "#6868A0", fontSize: "13px", textDecoration: "none" }}>{t("pendiente.footerTerms")}</Link>
          <Link href="/legales/privacidad" style={{ color: "#6868A0", fontSize: "13px", textDecoration: "none" }}>{t("pendiente.footerPrivacy")}</Link>
        </div>
        <p style={{ color: "#242436", fontSize: "12px", fontFamily: "var(--font-mono)", margin: 0 }}>{t("pendiente.footerCopy")}</p>
      </footer>
    </div>
  );
}
