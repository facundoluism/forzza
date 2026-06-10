import { View, StyleSheet, type ViewProps } from "react-native";
import { colors, spacing, radius } from "../tokens";

export interface CardProps extends ViewProps {
  padding?: "sm" | "md" | "lg";
}

export function Card({ padding = "md", style, children, ...rest }: CardProps) {
  return (
    <View
      style={[styles.card, styles[`padding_${padding}`], style]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.gray900,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray800,
  },
  padding_sm: { padding: spacing[3] },
  padding_md: { padding: spacing[4] },
  padding_lg: { padding: spacing[6] },
});
