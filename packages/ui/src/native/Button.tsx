import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type TouchableOpacityProps,
} from "react-native";
import { colors, spacing, radius } from "../tokens";
import type { ButtonVariant, ButtonSize } from "../types";

export interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  label: string;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  label,
  fullWidth = false,
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled ?? loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[`variant_${variant}`],
        styles[`size_${size}`],
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
      ]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.black : colors.lime}
          size="small"
        />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}`], styles[`labelSize_${size}`]]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  fullWidth: { width: "100%" },
  // Variants
  variant_primary: { backgroundColor: colors.lime },
  variant_secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  variant_ghost: { backgroundColor: "transparent" },
  variant_danger: { backgroundColor: colors.error },
  // Sizes
  size_sm: { paddingHorizontal: spacing[3], paddingVertical: spacing[2], minHeight: 36 },
  size_md: { paddingHorizontal: spacing[4], paddingVertical: spacing[3], minHeight: 48 },
  size_lg: { paddingHorizontal: spacing[6], paddingVertical: spacing[4], minHeight: 56 },
  // Labels
  label: { fontWeight: "700" },
  label_primary: { color: colors.black },
  label_secondary: { color: colors.white },
  label_ghost: { color: colors.lime },
  label_danger: { color: colors.white },
  // Label sizes
  labelSize_sm: { fontSize: 14 },
  labelSize_md: { fontSize: 16 },
  labelSize_lg: { fontSize: 18 },
  // Disabled
  disabled: { opacity: 0.4 },
});
