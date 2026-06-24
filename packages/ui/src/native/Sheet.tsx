import { useEffect, type ReactNode } from "react";
import { Dimensions, Modal, Pressable, View, StyleSheet, Platform } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { colors, spacing, radius, duration, spring } from "../tokens";
import { useReducedMotion } from "./useReducedMotion";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const DEFAULT_SNAP = SCREEN_HEIGHT * 0.5;
// Umbral de descarte: arrastrar más de 80px hacia abajo, o soltar con velocidad
// > 500 px/s (Gesture Handler reporta velocity en px/s, no px/ms). Igual criterio
// que la versión previa con PanResponder.
const DISMISS_OFFSET = 80;
const DISMISS_VELOCITY = 500;

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: number[];
  testID?: string;
}

export function Sheet({ visible, onClose, children, snapPoints, testID }: SheetProps) {
  const snap = snapPoints?.[0] ?? DEFAULT_SNAP;
  const reducedMotion = useReducedMotion();

  // translateY: posición vertical del panel (snap = oculto abajo, 0 = abierto).
  const translateY = useSharedValue(snap);
  const backdropOpacity = useSharedValue(0);
  // Opacidad del panel: la única "transición" que queda bajo reduced-motion.
  const sheetOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Entrada: spring gentle (momentum sutil, interrumpible). Con reduced-motion,
      // sin slide — la opacidad carga la transición.
      translateY.value = reducedMotion
        ? withTiming(0, { duration: duration.sheet })
        : withSpring(0, spring.gentle);
      backdropOpacity.value = withTiming(1, { duration: duration.dropdown });
      sheetOpacity.value = withTiming(1, { duration: duration.dropdown });
    } else {
      translateY.value = withTiming(reducedMotion ? 0 : snap, { duration: duration.sheet });
      backdropOpacity.value = withTiming(0, { duration: duration.dropdown });
      sheetOpacity.value = withTiming(0, { duration: duration.dropdown });
    }
  }, [visible, snap, reducedMotion, translateY, backdropOpacity, sheetOpacity]);

  // Swipe-to-dismiss: drag del handle. withSpring con velocity inicial = momentum
  // del gesto, interrumpible (un nuevo toque retoma el valor en curso).
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      // Solo permitir arrastrar hacia abajo.
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_OFFSET || e.velocityY > DISMISS_VELOCITY) {
        translateY.value = withSpring(snap, { ...spring.gentle, velocity: e.velocityY });
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, spring.gentle);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: sheetOpacity.value,
  }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === "android"}
    >
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        <Animated.View
          testID={testID}
          style={[styles.sheet, sheetStyle, { height: snap }]}
        >
          <GestureDetector gesture={panGesture}>
            <View style={styles.handleArea}>
              <View style={styles.handle} />
            </View>
          </GestureDetector>
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: colors.surface2,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
    overflow: "hidden",
  },
  handleArea: {
    alignItems: "center",
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.gray,
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
});
