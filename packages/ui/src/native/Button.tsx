import { useRef } from "react";
import {
  Animated,
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  type PressableProps,
} from "react-native";
import { colors, spacing, radius } from "../tokens";
import type { ButtonVariant, ButtonSize } from "../types";

export interface ButtonProps extends Omit<PressableProps, "style"> {
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
  onPress,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled ?? loading;
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();

  const onPressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 2,
    }).start();

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={isDisabled}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={fullWidth ? { width: "100%" } : undefined}
      {...rest}
    >
      <Animated.View
        style={[
          styles.base,
          styles[`variant_${variant}`],
          styles[`size_${size}`],
          isDisabled && styles.disabled,
          { transform: [{ scale }] },
        ]}
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
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  // Variants
  variant_primary: {
    backgroundColor: colors.lime,
    shadowColor: colors.lime,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  variant_secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
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
  labelSize_lg: { fontSize: 18, fontWeight: "900", letterSpacing: 0.5, textTransform: "uppercase" },
  // Disabled
  disabled: { opacity: 0.4 },
});
