"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { colors, spacing, radius } from "../tokens";

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  style?: CSSProperties;
}

export function Sheet({ visible, onClose, children, style }: SheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Focus trap and escape key
  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  // Prevent body scroll when sheet open
  useEffect(() => {
    if (!visible) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          animation: "fadeIn 0.2s ease",
        }}
      />
      {/* Sheet panel */}
      <div
        role="dialog"
        aria-modal
        style={{
          position: "relative",
          backgroundColor: colors.surface2,
          borderTopLeftRadius: `${radius.xl}px`,
          borderTopRightRadius: `${radius.xl}px`,
          border: `1px solid ${colors.border}`,
          borderBottom: "none",
          maxHeight: "90vh",
          overflowY: "auto",
          animation: "slideUp 0.25s cubic-bezier(0.16,1,0.3,1)",
          ...style,
        }}
      >
        {/* Drag handle (visual only on web) */}
        <div style={{ display: "flex", justifyContent: "center", padding: `${spacing[3]}px 0 ${spacing[2]}px` }}>
          <div
            style={{
              width: "36px",
              height: "4px",
              borderRadius: `${radius.full}px`,
              backgroundColor: colors.gray,
              opacity: 0.5,
            }}
          />
        </div>
        <div style={{ padding: `0 ${spacing[4]}px ${spacing[6]}px` }}>
          {children}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
    </div>
  );
}
