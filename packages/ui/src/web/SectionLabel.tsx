import type { CSSProperties } from "react";
import { colors, fontSize } from "../tokens";

export interface SectionLabelProps {
  children: string;
  style?: CSSProperties;
}

export function SectionLabel({ children, style }: SectionLabelProps) {
  return (
    <span
      style={{
        display: "block",
        fontSize: `${fontSize.xs}px`,
        color: colors.gray,
        letterSpacing: "1.5px",
        fontWeight: 600,
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
