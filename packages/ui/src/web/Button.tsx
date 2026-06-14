import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { colors, spacing, radius } from "../tokens";
import type { ButtonVariant, ButtonSize } from "../types";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  label: string;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: { backgroundColor: colors.lime, color: colors.black, border: "none" },
  secondary: { backgroundColor: "transparent", color: colors.white, border: `1px solid ${colors.gray700}` },
  ghost: { backgroundColor: "transparent", color: colors.lime, border: "none" },
  danger: { backgroundColor: colors.error, color: colors.white, border: "none" },
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: { padding: `${spacing[2]}px ${spacing[3]}px`, fontSize: "14px", minHeight: "36px" },
  md: { padding: `${spacing[3]}px ${spacing[4]}px`, fontSize: "16px", minHeight: "48px" },
  lg: { padding: `${spacing[4]}px ${spacing[6]}px`, fontSize: "18px", minHeight: "56px" },
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "ui-btn ui-btn--primary",
  secondary: "ui-btn ui-btn--secondary",
  ghost: "ui-btn ui-btn--ghost",
  danger: "ui-btn ui-btn--danger",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  label,
  fullWidth = false,
  disabled,
  className,
  ...rest
}: ButtonProps & { className?: string }) {
  const isDisabled = disabled ?? loading;

  return (
    <button
      disabled={isDisabled}
      className={[variantClass[variant], className].filter(Boolean).join(" ")}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        borderRadius: `${radius.md}px`,
        fontWeight: 700,
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.4 : 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: fullWidth ? "100%" : undefined,
        fontFamily: "inherit",
      }}
      {...rest}
    >
      {loading ? "..." : label}
    </button>
  );
}
