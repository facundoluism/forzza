import { useEffect, useRef } from "react";
import { StyleSheet, Animated, Easing } from "react-native";
import { colors, radius, easing } from "../tokens";
import { useReducedMotion } from "./useReducedMotion";

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = radius.sm }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();

  useEffect(() => {
    // Reduced-motion: opacity fija, sin loop.
    if (reduced) {
      opacity.setValue(0.6);
      return;
    }
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.bezier(...easing.out),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.bezier(...easing.out),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity, reduced]);

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
