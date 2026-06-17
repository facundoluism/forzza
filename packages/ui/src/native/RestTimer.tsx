import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { colors, typography, fontSize, radius } from "../tokens";

export interface RestTimerProps {
  seconds: number;
  onComplete?: () => void;
  /** Called when user taps the skip button. If omitted, no skip button is rendered. */
  onSkip?: () => void;
  /** Accessible label for the skip button */
  skipLabel?: string;
  size?: number;
  color?: string;
}

export function RestTimer({
  seconds,
  onComplete,
  onSkip,
  skipLabel = "Saltar",
  size = 160,
  color = colors.lime,
}: RestTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const totalRef = useRef(seconds);
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    totalRef.current = seconds;
    setRemaining(seconds);
    progressAnim.setValue(1);
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: seconds * 1000,
      useNativeDriver: false,
    }).start();
  }, [seconds, progressAnim]);

  useEffect(() => {
    if (remaining <= 0) {
      onCompleteRef.current?.();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeStr = `${minutes}:${String(secs).padStart(2, "0")}`;
  const done = remaining <= 0;

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.container, { width: size }]}>
      {/* Circular outer ring using border */}
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: color + "22",
          },
        ]}
      >
        {/* Center text */}
        <View style={styles.center}>
          <Text style={[styles.time, { color, fontSize: size * 0.22 }]}>
            {done ? "00:00" : timeStr}
          </Text>
          {done && (
            <Text style={[styles.doneLabel, { color }]}>Listo</Text>
          )}
        </View>
      </View>
      {/* Linear progress bar below as progress indicator */}
      <View style={[styles.trackBar, { borderColor: color + "22" }]}>
        <Animated.View
          style={[
            styles.fillBar,
            { backgroundColor: color, width: barWidth },
          ]}
        />
      </View>
      {/* Optional skip button */}
      {onSkip && (
        <Pressable
          testID="skip-rest-button"
          accessibilityLabel={skipLabel}
          onPress={onSkip}
          style={styles.skipBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.skipText, { color }]}>{skipLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
  },
  ring: {
    borderWidth: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
  },
  time: {
    fontFamily: typography.mono,
    fontWeight: "700",
    letterSpacing: 2,
  },
  doneLabel: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 4,
  },
  trackBar: {
    width: "100%",
    height: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  fillBar: {
    height: "100%",
    borderRadius: radius.full,
  },
  skipBtn: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  skipText: {
    fontSize: fontSize.sm,
    fontFamily: typography.body,
    textDecorationLine: "underline",
  },
});
