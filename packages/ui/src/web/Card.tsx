import type { HTMLAttributes } from "react";
import { colors, spacing, radius } from "../tokens";

export type CardVariant = "surface" | "surface2" | "surface3";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
  variant?: CardVariant;
}

const paddingMap = { sm: spacing[3], md: spacing[4], lg: spacing[6] };

const variantBg: Record<CardVariant, string> = {
  surface: colors.surface,
  surface2: colors.surface2,
  surface3: colors.surface3,
};

export function Card({ padding = "md", variant = "surface", style, children, ...rest }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: variantBg[variant],
        borderRadius: `${radius.lg}px`,
        border: `1px solid ${colors.border}`,
        padding: `${paddingMap[padding]}px`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
