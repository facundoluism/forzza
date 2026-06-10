import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
} from "react-native";
import { colors, spacing, radius } from "../tokens";
import type { InputState } from "../types";

export interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  hint?: string;
  error?: string;
  state?: InputState;
}

export function Input({ label, hint, error, state = "default", ...rest }: InputProps) {
  const hasError = state === "error" || !!error;
  const isDisabled = state === "disabled";

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          hasError && styles.inputError,
          state === "success" && styles.inputSuccess,
          isDisabled && styles.inputDisabled,
        ]}
        placeholderTextColor={colors.gray500}
        editable={!isDisabled}
        {...rest}
      />
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
  input: {
    backgroundColor: colors.gray900,
    borderWidth: 1,
    borderColor: colors.gray700,
    borderRadius: radius.md,
    padding: spacing[3],
    color: colors.white,
    fontSize: 16,
    marginBottom: spacing[1],
  },
  inputError: { borderColor: colors.error },
  inputSuccess: { borderColor: colors.success },
  inputDisabled: { opacity: 0.5 },
  hint: { color: colors.gray400, fontSize: 12 },
  hintError: { color: colors.error },
});
