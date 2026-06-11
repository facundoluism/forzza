import type { CSSProperties } from "react";
import { colors, spacing, radius, fontSize } from "../tokens";

export interface PaymentSummaryProps {
  bruto: number;
  comision: number;
  neto: number;
  currency?: string;
  style?: CSSProperties;
}

function formatAmount(amount: number, currency: string): string {
  return `${currency} ${(amount / 100).toFixed(2)}`;
}

export function PaymentSummary({
  bruto,
  comision,
  neto,
  currency = "ARS",
  style,
}: PaymentSummaryProps) {
  const comisionPct = bruto > 0 ? Math.round((comision / bruto) * 100) : 20;

  const rowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${spacing[3]}px ${spacing[4]}px`,
  };

  const labelStyle: CSSProperties = {
    fontSize: `${fontSize.sm}px`,
    color: colors.muted,
    fontWeight: 500,
  };

  const valueStyle: CSSProperties = {
    fontFamily: "var(--font-space-mono, monospace)",
    fontSize: `${fontSize.sm}px`,
    fontWeight: 600,
  };

  const dividerStyle: CSSProperties = {
    height: "1px",
    backgroundColor: colors.border,
  };

  return (
    <div
      style={{
        backgroundColor: colors.surface2,
        borderRadius: `${radius.lg}px`,
        border: `1px solid ${colors.border}`,
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={rowStyle}>
        <span style={labelStyle}>Bruto</span>
        <span style={{ ...valueStyle, color: colors.text }}>
          {formatAmount(bruto, currency)}
        </span>
      </div>
      <div style={dividerStyle} />
      <div style={rowStyle}>
        <span style={labelStyle}>Comisión ({comisionPct}%)</span>
        <span style={{ ...valueStyle, color: colors.error }}>
          - {formatAmount(comision, currency)}
        </span>
      </div>
      <div style={dividerStyle} />
      <div style={{ ...rowStyle, padding: `${spacing[4]}px` }}>
        <span style={{ ...labelStyle, fontSize: `${fontSize.md}px`, color: colors.text, fontWeight: 700 }}>
          Neto
        </span>
        <span style={{ ...valueStyle, fontSize: `${fontSize.md}px`, color: colors.lime, fontWeight: 700 }}>
          {formatAmount(neto, currency)}
        </span>
      </div>
    </div>
  );
}
