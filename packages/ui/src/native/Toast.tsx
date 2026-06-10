import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../tokens";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
}

export function Toast({ message, type = "info" }: ToastProps) {
  const icon = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" }[type];

  return (
    <View style={[styles.toast, styles[`type_${type}`]]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[3],
    borderRadius: radius.md,
    gap: spacing[2],
    marginHorizontal: spacing[4],
  },
  icon: { fontSize: 16 },
  message: { color: colors.white, flex: 1, fontSize: 14 },
  type_success: { backgroundColor: colors.success + "CC" },
  type_error: { backgroundColor: colors.error + "CC" },
  type_warning: { backgroundColor: colors.warning + "CC" },
  type_info: { backgroundColor: colors.gray800 },
});
