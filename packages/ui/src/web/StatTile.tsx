import type { CSSProperties } from "react";
import { colors, spacing, radius, fontSize } from "../tokens";

export interface StatTileProps {
  value: string | number;
  label: string;
  color?: string;
  style?: CSSProperties;
}

export function StatTile({ value, label, color = colors.lime, style }: StatTileProps) {
  return (
    <div
      style={{
        backgroundColor: colors.surface2,
        borderRadius: `${radius.lg}px`,
        border: `1px solid ${colors.border}`,
        padding: `${spacing[4]}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        minWidth: "80px",
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-space-mono, monospace)",
          fontSize: `${fontSize["2xl"]}px`,
          fontWeight: 700,
          color,
          marginBottom: `${spacing[1]}px`,
          lineHeight: 1.2,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: `${fontSize.xs}px`,
          color: colors.muted,
          textAlign: "center",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  );
}
