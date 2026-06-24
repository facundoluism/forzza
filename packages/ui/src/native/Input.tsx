import { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Animated,
  Easing,
  StyleSheet,
  type TextInputProps,
} from "react-native";
import { colors, spacing, radius, duration, easing } from "../tokens";
import type { InputState } from "../types";

export interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  hint?: string;
  error?: string;
  state?: InputState;
}

export function Input({ label, hint, error, state = "default", onFocus, onBlur, ...rest }: InputProps) {
  const hasError = state === "error" || !!error;
  const isSuccess = state === "success";
  const isDisabled = state === "disabled";

  // Para el estado default animamos el borde de gris→lima al foco.
  // Error/success mantienen su color fijo (no se animan).
  const focusProgress = useRef(new Animated.Value(0)).current;

  const animateFocus = (to: number) =>
    Animated.timing(focusProgress, {
      toValue: to,
      duration: duration.press,
      easing: Easing.bezier(...easing.out),
      useNativeDriver: false, // borderColor no es compatible con native driver
    }).start();

  const handleFocus: NonNullable<TextInputProps["onFocus"]> = (e) => {
    animateFocus(1);
    onFocus?.(e);
  };
  const handleBlur: NonNullable<TextInputProps["onBlur"]> = (e) => {
    animateFocus(0);
    onBlur?.(e);
  };

  const animatedBorderColor = focusProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.gray700, colors.lime],
  });

  const dynamicBorder = hasError
    ? { borderColor: colors.error }
    : isSuccess
    ? { borderColor: colors.success }
    : { borderColor: animatedBorderColor };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View style={[styles.inputWrap, dynamicBorder, isDisabled && styles.inputDisabled]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.gray500}
          editable={!isDisabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      </Animated.View>
      {(error ?? hint) ? (
        <Text style={[styles.hint, hasError && styles.hintError]}>
          {error ?? hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  label: { color: colors.gray300, fontSize: 14, marginBottom: spacing[2] },
  inputWrap: {
    backgroundColor: colors.gray900,
    borderWidth: 1,
    borderColor: colors.gray700,
    borderRadius: radius.md,
    marginBottom: spacing[1],
  },
  input: {
    padding: spacing[3],
    color: colors.white,
    fontSize: 16,
  },
  inputDisabled: { opacity: 0.5 },
  hint: { color: colors.gray400, fontSize: 12 },
  hintError: { color: colors.error },
});
