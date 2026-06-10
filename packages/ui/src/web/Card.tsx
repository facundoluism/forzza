import type { HTMLAttributes } from "react";
import { colors, spacing, radius } from "../tokens";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
}

const paddingMap = { sm: spacing[3], md: spacing[4], lg: spacing[6] };

export function Card({ padding = "md", style, children, ...rest }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: colors.gray900,
        borderRadius: `${radius.lg}px`,
        border: `1px solid ${colors.gray800}`,
        padding: `${paddingMap[padding]}px`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
