import { useRef } from "react";
import { Animated, Pressable, View, StyleSheet, type ViewProps, type PressableProps } from "react-native";
import { colors, spacing, radius, motion } from "../tokens";

export type CardVariant = "surface" | "surface2" | "surface3";

export interface CardProps extends ViewProps {
  padding?: "sm" | "md" | "lg";
  variant?: CardVariant;
  featured?: boolean;
  onPress?: PressableProps["onPress"];
}

const variantBg: Record<CardVariant, string> = {
  surface: colors.surface,
  surface2: colors.surface2,
  surface3: colors.surface3,
};

export function Card({
  padding = "md",
  variant = "surface",
  style,
  children,
  featured = false,
  onPress,
  testID,
  accessibilityLabel,
  accessible,
  ...rest
}: CardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: motion.pressScale,
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

  const cardContent = (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: variantBg[variant] },
        styles[`padding_${padding}`],
        featured && styles.featured,
        { transform: [{ scale: onPress ? scale : 1 }] },
        style,
      ]}
      {...rest}
    >
      {featured && <View style={styles.featuredStrip} />}
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessible={accessible ?? true}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        {cardContent}
      </Pressable>
    );
  }

  return (
    <Animated.View
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessible={accessible}
      style={[
        styles.card,
        { backgroundColor: variantBg[variant] },
        styles[`padding_${padding}`],
        featured && styles.featured,
        style,
      ]}
      {...rest}
    >
      {featured && <View style={styles.featuredStrip} />}
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  featured: {
    shadowColor: colors.lime,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 10,
  },
  featuredStrip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.lime,
    zIndex: 1,
  },
  padding_sm: { padding: spacing[3] },
  padding_md: { padding: spacing[4] },
  padding_lg: { padding: spacing[6] },
});
