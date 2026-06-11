import { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors, spacing, radius, typography } from "../tokens";

export interface AutopromoOverlayProps {
  visible: boolean;
  onDismiss: () => void;
  secondsLeft: number;
}

export function AutopromoOverlay({
  visible,
  onDismiss,
  secondsLeft,
}: AutopromoOverlayProps): React.JSX.Element {
  const TOTAL_SECONDS = 10;
  const progress = secondsLeft / TOTAL_SECONDS;
  const showSkip = secondsLeft <= 5;

  useEffect(() => {
    if (secondsLeft <= 0) {
      onDismiss();
    }
  }, [secondsLeft, onDismiss]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Logo */}
          <Text style={styles.logo}>FORZZA</Text>
          <Text style={styles.tagline}>Entrenás mejor con un coach</Text>
          <Text style={styles.countdown}>{secondsLeft}</Text>
        </View>

        {/* Bottom section */}
        <View style={styles.bottom}>
          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          {/* Skip button — appears after 5s (when secondsLeft <= 5) */}
          {showSkip && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={onDismiss}
              activeOpacity={0.8}
            >
              <Text style={styles.skipText}>Saltar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: `rgba(10, 10, 10, 0.85)`,
    justifyContent: "space-between",
    paddingTop: spacing[20],
    paddingBottom: spacing[12],
    paddingHorizontal: spacing[6],
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: 72,
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  tagline: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: 18,
    marginTop: spacing[3],
    textAlign: "center",
  },
  countdown: {
    fontFamily: typography.mono,
    color: colors.gray600,
    fontSize: 48,
    fontWeight: "700",
    marginTop: spacing[8],
  },
  bottom: {
    gap: spacing[4],
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.gray800,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.lime,
    borderRadius: radius.full,
  },
  skipButton: {
    alignSelf: "center",
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  skipText: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: 16,
    fontWeight: "600",
  },
});
