import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography, fontSize } from "../tokens";

export interface HealthNoticeProps {
  text: string;
  /** Optional label for screen-reader accessibility */
  accessibilityLabel?: string;
}

/**
 * HealthNotice — aviso corto de disclaimer de salud/fitness.
 * Texto estático localizado. No intrusivo: nota al pie con borde izquierdo lime tenue.
 * API idéntica al componente web.
 */
export function HealthNotice({ text, accessibilityLabel }: HealthNoticeProps) {
  return (
    <View
      style={styles.container}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? text}
    >
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 2,
    borderLeftColor: colors.limeDim,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    marginTop: spacing[4],
    backgroundColor: "rgba(200,255,0,0.04)",
    borderRadius: radius.sm,
  },
  text: {
    fontFamily: typography.body,
    fontSize: fontSize.xs,
    color: colors.muted,
    lineHeight: 16,
  },
});
