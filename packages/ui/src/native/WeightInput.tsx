import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing, radius, fontSize } from "../tokens";
import { NumInput } from "./NumInput";

export interface WeightInputProps {
  value: number;
  onChange: (v: number) => void;
  unit?: "kg" | "lb";
  onUnitChange?: (unit: "kg" | "lb") => void;
  disabled?: boolean;
}

const KG_TO_LB = 2.20462;
const LB_TO_KG = 0.453592;

export function WeightInput({
  value,
  onChange,
  unit = "kg",
  onUnitChange,
  disabled = false,
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
    <View style={styles.container}>
      <NumInput
        value={value}
        onChange={onChange}
        min={0}
        step={unit === "kg" ? 0.5 : 1}
        disabled={disabled}
      />
      <View style={styles.unitToggle}>
        {(["kg", "lb"] as const).map((u) => (
          <Pressable
            key={u}
            onPress={() => handleUnitToggle(u)}
            disabled={disabled}
            style={[styles.unitButton, unit === u && styles.unitButtonActive]}
          >
            <Text style={[styles.unitText, unit === u && styles.unitTextActive]}>
              {u}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing[3],
  },
  unitToggle: {
    flexDirection: "row",
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  unitButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    alignItems: "center",
    justifyContent: "center",
    minWidth: 48,
  },
  unitButtonActive: {
    backgroundColor: colors.lime,
  },
  unitText: {
    fontSize: fontSize.sm,
    color: colors.muted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  unitTextActive: {
    color: colors.black,
  },
});
