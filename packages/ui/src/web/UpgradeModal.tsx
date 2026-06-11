"use client";

import { useEffect, type CSSProperties } from "react";
import { colors, spacing, radius, typography, fontSize } from "../tokens";

export interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  feature?: string;
  style?: CSSProperties;
}

export function UpgradeModal({
  visible,
  onClose,
  onUpgrade,
  feature,
  style,
}: UpgradeModalProps) {
  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  useEffect(() => {
    if (!visible) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${spacing[6]}px`,
        backgroundColor: "rgba(0,0,0,0.75)",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal
        aria-labelledby="upgrade-title"
        style={{
          backgroundColor: colors.gray900,
          borderRadius: `${radius.xl}px`,
          border: `1px solid ${colors.gray700}`,
          padding: `${spacing[6]}px`,
          width: "100%",
          maxWidth: "360px",
          animation: "scaleIn 0.2s ease",
          ...style,
        }}
      >
        <h2
          id="upgrade-title"
          style={{
            fontFamily: `var(--font-bebas-neue, ${typography.heading})`,
            color: colors.white,
            fontSize: `${fontSize["2xl"]}px`,
            letterSpacing: "1px",
            textTransform: "uppercase",
            margin: `0 0 ${spacing[3]}px`,
            fontWeight: 400,
          }}
        >
          Funcionalidad PRO
        </h2>
        <p
          style={{
            color: colors.gray300,
            fontSize: `${fontSize.base}px`,
            lineHeight: "24px",
            margin: `0 0 ${spacing[6]}px`,
          }}
        >
          {feature
            ? `Para acceder a ${feature}, necesitás el plan PRO.`
            : "Esta funcionalidad requiere el plan PRO."}
        </p>
        <div style={{ display: "flex", gap: `${spacing[3]}px` }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              backgroundColor: colors.gray800,
              border: "none",
              borderRadius: `${radius.md}px`,
              padding: `${spacing[3]}px`,
              color: colors.gray300,
              fontSize: `${fontSize.base}px`,
              fontWeight: 600,
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
          >
            Más tarde
          </button>
          <button
            type="button"
            onClick={onUpgrade}
            style={{
              flex: 1,
              backgroundColor: colors.lime,
              border: "none",
              borderRadius: `${radius.md}px`,
              padding: `${spacing[3]}px`,
              color: colors.black,
              fontSize: `${fontSize.base}px`,
              fontWeight: 700,
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
          >
            Ver planes
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  );
}
