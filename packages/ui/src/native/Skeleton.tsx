import { useEffect, useRef } from "react";
import { StyleSheet, Animated } from "react-native";
import { colors, radius } from "../tokens";

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = radius.sm }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width as number, height, borderRadius, opacity },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: { backgroundColor: colors.gray800 },
});
