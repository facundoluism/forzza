"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { getStoredConsent, setConsent, initAnalytics, type ConsentValue } from "@/lib/analytics";

/**
 * Analytics consent banner — shown once until the user decides.
 * Positioned at the bottom of the viewport, non-blocking.
 */
export function AnalyticsBanner() {
  const t = useTranslations("analyticsBanner");
  const [visible, setVisible] = useState(false);
  // Entrada suave: arranca en estado oculto (opacity 0 + translateY) y se anima a
  // visible en el frame siguiente, en vez de aparecer de golpe.
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Run analytics init for users who already consented
    initAnalytics();

    // Only show if no decision has been stored yet
    const stored = getStoredConsent();
    if (stored === null) {
      setVisible(true);
    }
  }, []);

  // Dispara la transición de entrada en el frame siguiente al montaje del banner.
  useEffect(() => {
    if (!visible) return;
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [visible]);

  // Mientras el banner está visible, reservar espacio al pie para que el banner
  // fixed no tape el contenido del final de la página (ej. botón de eliminar
  // cuenta, tarjetas de paquete). Se restaura al decidir/ocultar.
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.paddingBottom;
    document.body.style.paddingBottom = "160px";
    return () => {
      document.body.style.paddingBottom = prev;
    };
  }, [visible]);

  function handleDecision(value: ConsentValue) {
    setConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t("ariaLabel")}
      style={{
        position: "fixed",
        bottom: 20,
        left: 16,
        right: 16,
        maxWidth: 560,
        margin: "0 auto",
        background: "#0E0E18",
        border: "1px solid #242436",
        borderRadius: 12,
        padding: "16px 20px",
        zIndex: 1000,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        // Entrada suave: sólo opacity + transform, ease-out, duración dropdown (< 300ms).
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(8px)",
        transition:
          "opacity var(--duration-dropdown) var(--ease-out), transform var(--duration-dropdown) var(--ease-out)",
      }}
    >
      <p
        style={{
          color: "#F0F0FF",
          fontSize: 13,
          lineHeight: 1.55,
          margin: 0,
          marginBottom: 14,
        }}
      >
        {t("body")}{" "}
        <Link
          href="/legales/privacidad"
          style={{ color: "#C8FF00", textDecoration: "underline", fontSize: 13 }}
        >
          {t("privacyLink")}
        </Link>
        .
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => handleDecision("granted")}
          style={{
            background: "#C8FF00",
            color: "#000",
            border: "none",
            borderRadius: 8,
            padding: "9px 18px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            flex: "1 1 auto",
          }}
        >
          {t("accept")}
        </button>
        <button
          type="button"
          onClick={() => handleDecision("denied")}
          style={{
            background: "transparent",
            color: "#6868A0",
            border: "1px solid #242436",
            borderRadius: 8,
            padding: "9px 18px",
            fontSize: 13,
            cursor: "pointer",
            flex: "1 1 auto",
          }}
        >
          {t("reject")}
        </button>
      </div>
    </div>
  );
}
