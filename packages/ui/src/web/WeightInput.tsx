import type { CSSProperties } from "react";
import { colors, spacing, radius, fontSize } from "../tokens";
import { NumInput } from "./NumInput";

export interface WeightInputProps {
  value: number;
  onChange: (v: number) => void;
  unit?: "kg" | "lb";
  onUnitChange?: (unit: "kg" | "lb") => void;
  disabled?: boolean;
  style?: CSSProperties;
}

const KG_TO_LB = 2.20462;
const LB_TO_KG = 0.453592;

export function WeightInput({
  value,
  onChange,
  unit = "kg",
  onUnitChange,
  disabled = false,
  style,
}: WeightInputProps) {
  const handleUnitToggle = (next: "kg" | "lb") => {
    if (next === unit) return;
    if (next === "lb") {
      onChange(Math.round(value * KG_TO_LB * 10) / 10);
    } else {
      onChange(Math.round(value * LB_TO_KG * 10) / 10);
    }
    onUnitChange?.(next);
  };

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: `${spacing[3]}px`, ...style }}>
      <NumInput
        value={value}
        onChange={onChange}
        min={0}
        step={unit === "kg" ? 0.5 : 1}
        disabled={disabled}
      />
      <div
        style={{
          display: "flex",
          backgroundColor: colors.surface2,
          borderRadius: `${radius.md}px`,
          border: `1px solid ${colors.border}`,
          overflow: "hidden",
        }}
      >
        {(["kg", "lb"] as const).map((u) => (
          <button
            key={u}
            type="button"
            disabled={disabled}
            onClick={() => handleUnitToggle(u)}
            style={{
              padding: `${spacing[2]}px ${spacing[4]}px`,
              backgroundColor: unit === u ? colors.lime : "transparent",
              color: unit === u ? colors.black : colors.muted,
              border: "none",
              cursor: disabled ? "not-allowed" : "pointer",
              fontSize: `${fontSize.sm}px`,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              transition:
                "background-color var(--duration-dropdown) var(--ease-out), color var(--duration-dropdown) var(--ease-out)",
              minWidth: "48px",
            }}
          >
            {u}
          </button>
        ))}
      </div>
    </div>
  );
}
