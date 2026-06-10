import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../tokens";
import type { PillVariant } from "../types";

export interface PillProps {
  label: string;
  variant?: PillVariant;
}

export function Pill({ label, variant = "default" }: PillProps) {
  return (
    <View style={[styles.pill, styles[`variant_${variant}`]]}>
      <Text style={[styles.label, styles[`label_${variant}`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
  label: { fontSize: 12, fontWeight: "600" },
  variant_default: { backgroundColor: colors.gray800 },
  label_default: { color: colors.gray300 },
  variant_active: { backgroundColor: colors.lime },
  label_active: { color: colors.black },
  variant_success: { backgroundColor: colors.success + "33" },
  label_success: { color: colors.success },
  variant_warning: { backgroundColor: colors.warning + "33" },
  label_warning: { color: colors.warning },
  variant_error: { backgroundColor: colors.error + "33" },
  label_error: { color: colors.error },
});
