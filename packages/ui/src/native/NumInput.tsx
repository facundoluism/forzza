import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing, radius, fontSize, typography } from "../tokens";

export interface NumInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
}

export function NumInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  disabled = false,
}: NumInputProps) {
  const canDecrement = !disabled && (min === undefined || value - step >= min);
  const canIncrement = !disabled && (max === undefined || value + step <= max);

  const decrement = () => {
    if (canDecrement) onChange(value - step);
  };

  const increment = () => {
    if (canIncrement) onChange(value + step);
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        <Pressable
          onPress={decrement}
          disabled={!canDecrement}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [
            styles.button,
            !canDecrement && styles.buttonDisabled,
            pressed && canDecrement && styles.buttonPressed,
          ]}
        >
          <Text style={[styles.buttonText, !canDecrement && styles.buttonTextDisabled]}>−</Text>
        </Pressable>

        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
        </View>

        <Pressable
          onPress={increment}
          disabled={!canIncrement}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [
            styles.button,
            !canIncrement && styles.buttonDisabled,
            pressed && canIncrement && styles.buttonPressed,
          ]}
        >
          <Text style={[styles.buttonText, !canIncrement && styles.buttonTextDisabled]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing[2],
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.muted,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    backgroundColor: colors.surface4,
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  buttonText: {
    fontSize: fontSize.xl,
    color: colors.lime,
    fontWeight: "700",
    lineHeight: 22,
  },
  buttonTextDisabled: {
    color: colors.muted,
  },
  valueContainer: {
    minWidth: 64,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontFamily: typography.mono,
    fontSize: fontSize.lg,
    color: colors.text,
    fontWeight: "700",
  },
});
