import { useRef } from "react";
import { Animated, Pressable, View, StyleSheet, type ViewProps, type PressableProps } from "react-native";
import { colors, spacing, radius } from "../tokens";

export interface CardProps extends ViewProps {
  padding?: "sm" | "md" | "lg";
  featured?: boolean;
  onPress?: PressableProps["onPress"];
}

export function Card({ padding = "md", style, children, featured = false, onPress, ...rest }: CardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.99,
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
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
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
