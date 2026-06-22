"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getStoredConsent, setConsent } from "@/lib/analytics";

/**
 * Analytics opt-out toggle for the profile/settings page.
 * Renders a labelled toggle that lets the user flip their stored consent.
 */
export function AnalyticsOptOut() {
  const t = useTranslations("analyticsOptOut");
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    // Treat "no decision" as not enabled — user hasn't opted in yet
    setEnabled(stored === "granted");
    setMounted(true);
  }, []);

  function handleToggle() {
    const next = !enabled;
    setEnabled(next);
    setConsent(next ? "granted" : "denied");
  }

  // Avoid hydration mismatch — render nothing until client
  if (!mounted) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "16px 0",
        borderTop: "1px solid #1E1E2E",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            color: "#F0F0FF",
            fontSize: 14,
            fontWeight: 600,
            margin: 0,
            marginBottom: 2,
          }}
        >
          {t("title")}
        </p>
        <p
          style={{
            color: "#6868A0",
            fontSize: 12,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {t("description")}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={t("ariaLabel")}
        onClick={handleToggle}
        style={{
          flexShrink: 0,
          width: 48,
          height: 26,
          borderRadius: 13,
          background: enabled ? "#C8FF00" : "#242436",
          border: "none",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.2s",
          padding: 0,
        }}
      >
        <span
          style={{
            display: "block",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: enabled ? "#000" : "#6868A0",
            position: "absolute",
            top: 3,
            left: enabled ? 25 : 3,
            transition: "left 0.2s, background 0.2s",
          }}
        />
      </button>
    </div>
  );
}
