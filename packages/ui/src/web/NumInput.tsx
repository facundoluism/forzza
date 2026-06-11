import type { CSSProperties } from "react";
import { colors, spacing, radius, fontSize } from "../tokens";

export interface NumInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

export function NumInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  disabled = false,
  style,
}: NumInputProps) {
  const canDecrement = !disabled && (min === undefined || value - step >= min);
  const canIncrement = !disabled && (max === undefined || value + step <= max);

  const buttonStyle = (active: boolean): CSSProperties => ({
    width: "40px",
    height: "40px",
    borderRadius: `${radius.md}px`,
    backgroundColor: colors.surface3,
    border: `1px solid ${colors.border}`,
    color: active ? colors.lime : colors.muted,
    fontSize: `${fontSize.xl}px`,
    fontWeight: 700,
    cursor: active ? "pointer" : "not-allowed",
    opacity: active ? 1 : 0.35,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    transition: "background-color 0.15s",
    flexShrink: 0,
  });

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: `${spacing[2]}px`, ...style }}>
      {label ? (
        <span
          style={{
            fontSize: `${fontSize.sm}px`,
            color: colors.muted,
            fontWeight: 500,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      ) : null}
      <div style={{ display: "flex", alignItems: "center", gap: `${spacing[2]}px` }}>
        <button
          type="button"
          disabled={!canDecrement}
          onClick={() => canDecrement && onChange(value - step)}
          style={buttonStyle(canDecrement)}
        >
          −
        </button>
        <div
          style={{
            minWidth: "64px",
            height: "40px",
            borderRadius: `${radius.md}px`,
            backgroundColor: colors.surface2,
            border: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-space-mono, monospace)",
              fontSize: `${fontSize.lg}px`,
              color: colors.text,
              fontWeight: 700,
            }}
          >
            {value}
          </span>
        </div>
        <button
          type="button"
          disabled={!canIncrement}
          onClick={() => canIncrement && onChange(value + step)}
          style={buttonStyle(canIncrement)}
        >
          +
        </button>
      </div>
    </div>
  );
}
