import { useEffect } from "react";
import { Dimensions, Text, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { colors, spacing, radius, easing, duration, spring } from "../tokens";
import { useReducedMotion } from "./useReducedMotion";

const SCREEN_WIDTH = Dimensions.get("window").width;
// Descartar si se arrastra más de 1/4 de pantalla o se suelta con > 500 px/s.
const DISMISS_OFFSET = SCREEN_WIDTH * 0.25;
const DISMISS_VELOCITY = 500;

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
  /** Si se pasa, habilita swipe-horizontal para descartar. */
  onDismiss?: () => void;
}

export function Toast({ message, type = "info", onDismiss }: ToastProps) {
  const icon = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" }[type];
  const reducedMotion = useReducedMotion();
  // Entrada: opacity 0->1 + un pequeño slide-in vertical.
  const progress = useSharedValue(0);
  // Swipe horizontal (solo si hay onDismiss).
  const translateX = useSharedValue(0);

  useEffect(() => {
    // timing (no spring) mantiene la entrada interrumpible: un re-trigger reapunta limpio.
    progress.value = withTiming(1, {
      duration: duration.dropdown,
      easing: Easing.bezier(...easing.out),
    });
  }, [progress]);

  // Swipe-to-dismiss horizontal: translateX sigue el dedo; al soltar, si pasa el
  // umbral, sale de pantalla y dispara onDismiss; si no, vuelve con spring gentle.
  const panGesture = Gesture.Pan()
    .enabled(Boolean(onDismiss))
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      const past = Math.abs(e.translationX) > DISMISS_OFFSET || Math.abs(e.velocityX) > DISMISS_VELOCITY;
      if (past && onDismiss) {
        const dir = e.translationX >= 0 ? 1 : -1;
        translateX.value = withTiming(dir * SCREEN_WIDTH, { duration: duration.dropdown });
        runOnJS(onDismiss)();
      } else {
        translateX.value = withSpring(0, spring.gentle);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const slideY = interpolate(progress.value, [0, 1], [8, 0], Extrapolation.CLAMP);
    // La opacidad combina la entrada con el desvanecido por swipe.
    const swipeOpacity = interpolate(
      Math.abs(translateX.value),
      [0, SCREEN_WIDTH * 0.5],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity: progress.value * swipeOpacity,
      transform: reducedMotion
        ? [{ translateX: translateX.value }]
        : [{ translateX: translateX.value }, { translateY: slideY }],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.toast, styles[`type_${type}`], animatedStyle]}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[3],
    borderRadius: radius.md,
    gap: spacing[2],
    marginHorizontal: spacing[4],
  },
  icon: { fontSize: 16 },
  message: { color: colors.white, flex: 1, fontSize: 14 },
  type_success: { backgroundColor: colors.success + "CC" },
  type_error: { backgroundColor: colors.error + "CC" },
  type_warning: { backgroundColor: colors.warning + "CC" },
  type_info: { backgroundColor: colors.gray800 },
});
