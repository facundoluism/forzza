import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { ReactNode } from "react";
import { colors, spacing, typography, fontSize } from "../tokens";

export interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  subtitle?: string;
  right?: ReactNode;
}

export function ScreenHeader({
  title,
  onBack,
  subtitle,
  right,
}: ScreenHeaderProps): React.JSX.Element {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.backArea}
        onPress={onBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        testID="screen-header-back"
        accessibilityLabel="Volver atrás"
        accessibilityRole="button"
      >
        <Text style={styles.chevron}>‹</Text>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle !== undefined && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
      </TouchableOpacity>

      {right !== undefined && <View style={styles.right}>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[3],
  },
  backArea: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  chevron: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: fontSize["2xl"],
    lineHeight: fontSize["2xl"] + 4,
    marginRight: spacing[2],
  },
  title: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize.xl,
    letterSpacing: 1,
    textTransform: "uppercase",
    lineHeight: fontSize.xl + 4,
  },
  subtitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  right: {
    marginLeft: "auto",
  },
});
