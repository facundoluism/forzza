import { colors, spacing, radius } from "../tokens";
import type { PillVariant } from "../types";

export interface PillProps {
  label: string;
  variant?: PillVariant;
  /** Arbitrary background color — overrides variant when provided */
  color?: string;
}

const variantStyles: Record<PillVariant, { bg: string; text: string }> = {
  default: { bg: colors.gray800, text: colors.gray300 },
  active: { bg: colors.lime, text: colors.black },
  success: { bg: colors.success + "33", text: colors.success },
  warning: { bg: colors.warning + "33", text: colors.warning },
  error: { bg: colors.error + "33", text: colors.error },
};

export function Pill({ label, variant = "default", color }: PillProps) {
  const { bg, text } = color
    ? { bg: color + "33", text: color }
    : variantStyles[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        padding: `${spacing[1]}px ${spacing[3]}px`,
        borderRadius: `${radius.full}px`,
        backgroundColor: bg,
        color: text,
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}
