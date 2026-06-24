"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { colors, spacing, radius, cssEasing, duration } from "../tokens";

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  style?: CSSProperties;
}

export function Sheet({ visible, onClose, children, style }: SheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  // `rendered` keeps the node mounted while the exit transition plays.
  const [rendered, setRendered] = useState(visible);
  // `open` drives the enter/exit transition target (translateY/opacity).
  const [open, setOpen] = useState(false);

  // Mount, then flip `open` on the next frame so the enter transition runs.
  useEffect(() => {
    if (visible) {
      setRendered(true);
      const id = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(id);
    }
    setOpen(false);
    const id = setTimeout(() => setRendered(false), duration.sheet);
    return () => clearTimeout(id);
  }, [visible]);

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

  if (!rendered) return null;

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
          opacity: open ? 1 : 0,
          transition: `opacity var(--duration-sheet, ${duration.sheet}ms) var(--ease-out, ${cssEasing.out})`,
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
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: `transform var(--duration-sheet, ${duration.sheet}ms) var(--ease-drawer, ${cssEasing.drawer})`,
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
    </div>
  );
}
