import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors, spacing, radius, typography, easing, duration, motion } from "../tokens";
import { useReducedMotion } from "./useReducedMotion";

export interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  feature: string;
}

export function UpgradeModal({
  visible,
  onClose,
  onUpgrade,
  feature,
}: UpgradeModalProps): React.JSX.Element {
  const reducedMotion = useReducedMotion();
  // Drives both opacity and the centered scale (0.95 -> 1); never scale(0).
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: duration.sheet,
      easing: Easing.bezier(...easing.out),
      useNativeDriver: true,
    }).start();
  }, [visible, progress]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [motion.enterScale, 1],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: progress }]}>
        <Animated.View
          style={[
            styles.container,
            // Reduced motion: keep opacity, drop the scale movement.
            reducedMotion ? null : { transform: [{ scale }] },
          ]}
        >
          <Text style={styles.title}>Funcionalidad PRO</Text>
          <Text style={styles.body}>
            Para acceder a {feature}, necesitás el plan PRO.
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.laterButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.laterText}>Más tarde</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={onUpgrade}
              activeOpacity={0.8}
            >
              <Text style={styles.upgradeText}>Ver planes</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing[6],
  },
  container: {
    backgroundColor: colors.gray900,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.gray700,
    padding: spacing[6],
    width: "100%",
    maxWidth: 360,
  },
  title: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: 28,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: spacing[3],
  },
  body: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing[6],
  },
  actions: {
    flexDirection: "row",
    gap: spacing[3],
  },
  laterButton: {
    flex: 1,
    backgroundColor: colors.gray800,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    alignItems: "center",
  },
  laterText: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: 16,
    fontWeight: "600",
  },
  upgradeButton: {
    flex: 1,
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    alignItems: "center",
  },
  upgradeText: {
    fontFamily: typography.body,
    color: colors.black,
    fontSize: 16,
    fontWeight: "700",
  },
});
