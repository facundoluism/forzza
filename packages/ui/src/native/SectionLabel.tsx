import { Text, StyleSheet, type TextProps } from "react-native";
import { colors, fontSize } from "../tokens";

export interface SectionLabelProps extends Omit<TextProps, "style"> {
  children: string;
  style?: TextProps["style"];
}

export function SectionLabel({ children, style, ...rest }: SectionLabelProps) {
  return (
    <Text style={[styles.label, style]} {...rest}>
      {children.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSize.xs,
    color: colors.gray,
    letterSpacing: 1.5,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
