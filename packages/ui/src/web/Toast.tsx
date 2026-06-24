"use client";

import { useEffect, type CSSProperties } from "react";
import { colors, spacing, radius, fontSize, cssEasing, duration as motionDuration } from "../tokens";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
  style?: CSSProperties;
}

const typeConfig: Record<ToastType, { bg: string; icon: string }> = {
  success: { bg: colors.success + "CC", icon: "✓" },
  error:   { bg: colors.error   + "CC", icon: "✕" },
  warning: { bg: colors.warning + "CC", icon: "!" },
  info:    { bg: colors.gray800,         icon: "i" },
};

export function Toast({
  message,
  type = "info",
  duration = 3000,
  onDismiss,
  style,
}: ToastProps) {
  useEffect(() => {
    if (!duration || !onDismiss) return;
    const id = setTimeout(onDismiss, duration);
    return () => clearTimeout(id);
  }, [duration, onDismiss]);

  const { bg, icon } = typeConfig[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className="ui-toast"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: `${spacing[2]}px`,
        padding: `${spacing[3]}px ${spacing[4]}px`,
        borderRadius: `${radius.md}px`,
        backgroundColor: bg,
        color: colors.white,
        fontSize: `${fontSize.sm}px`,
        fontWeight: 500,
        maxWidth: "360px",
        pointerEvents: "auto",
        opacity: 1,
        transform: "translateY(0)",
        // Interruptible transition (not keyframes): a flick/re-trigger can
        // catch the toast mid-flight. Entry handled by @starting-style below.
        transition: `opacity var(--duration-dropdown, ${motionDuration.dropdown}ms) var(--ease-out, ${cssEasing.out}), transform var(--duration-dropdown, ${motionDuration.dropdown}ms) var(--ease-out, ${cssEasing.out})`,
        ...style,
      }}
    >
      <span
        style={{
          width: "20px",
          height: "20px",
          borderRadius: `${radius.full}px`,
          backgroundColor: "rgba(255,255,255,0.2)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <span style={{ flex: 1 }}>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Cerrar"
          style={{
            background: "none",
            border: "none",
            color: colors.white,
            cursor: "pointer",
            opacity: 0.7,
            fontSize: "16px",
            lineHeight: 1,
            padding: "0 0 0 4px",
            flexShrink: 0,
          }}
        >
          ×
        </button>
      )}
      <style>{`
        @starting-style {
          .ui-toast { opacity: 0; transform: translateY(8px); }
        }
      `}</style>
    </div>
  );
}
