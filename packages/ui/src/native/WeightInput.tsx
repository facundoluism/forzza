import { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated, Easing, StyleSheet } from "react-native";
import { colors, spacing, radius, fontSize, duration, easing } from "../tokens";
import { NumInput } from "./NumInput";
import { useReducedMotion } from "./useReducedMotion";

export interface WeightInputProps {
  value: number;
  onChange: (v: number) => void;
  unit?: "kg" | "lb";
  onUnitChange?: (unit: "kg" | "lb") => void;
  disabled?: boolean;
}

const KG_TO_LB = 2.20462;
const LB_TO_KG = 0.453592;

/**
 * Botón de unidad (kg/lb). El relleno lima del seleccionado entra/sale suave
 * (opacity, driver nativo) en vez de saltar, dando continuidad espacial al toggle.
 * Reduced-motion: salta al estado final.
 */
function UnitButton({
  label,
  active,
  disabled,
  reduced,
  onPress,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  reduced: boolean;
  onPress: () => void;
}) {
  const fill = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    const to = active ? 1 : 0;
    if (reduced) {
      fill.setValue(to);
      return;
    }
    Animated.timing(fill, {
      toValue: to,
      duration: duration.dropdown,
      easing: Easing.bezier(...easing.out),
      useNativeDriver: true,
    }).start();
  }, [active, reduced, fill]);

  return (
    <Pressable onPress={onPress} disabled={disabled} style={styles.unitButton}>
      <Animated.View
        pointerEvents="none"
        style={[styles.unitFill, { opacity: fill }]}
      />
      <Text style={[styles.unitText, active && styles.unitTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function WeightInput({
  value,
  onChange,
  unit = "kg",
  onUnitChange,
  disabled = false,
}: WeightInputProps) {
  const reduced = useReducedMotion();

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
          <UnitButton
            key={u}
            label={u}
            active={unit === u}
            disabled={disabled}
            reduced={reduced}
            onPress={() => handleUnitToggle(u)}
          />
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
  // Relleno lima animado del botón activo (debajo del texto).
  unitFill: {
    ...StyleSheet.absoluteFillObject,
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
