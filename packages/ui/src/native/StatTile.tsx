import { View, Text, StyleSheet, type ViewProps } from "react-native";
import { colors, spacing, radius, fontSize, typography } from "../tokens";

export interface StatTileProps extends Omit<ViewProps, "style"> {
  value: string | number;
  label: string;
  color?: string;
  style?: ViewProps["style"];
}

export function StatTile({ value, label, color = colors.lime, style, ...rest }: StatTileProps) {
  return (
    <View style={[styles.tile, style]} {...rest}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minWidth: 80,
  },
  value: {
    fontFamily: typography.mono,
    fontSize: fontSize["2xl"],
    fontWeight: "700",
    color: colors.lime,
    marginBottom: spacing[1],
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.muted,
    textAlign: "center",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontWeight: "500",
  },
});
