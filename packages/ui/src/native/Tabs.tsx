import { useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Animated,
  Easing,
  StyleSheet,
  type ViewProps,
} from "react-native";
import { colors, spacing, fontSize, duration, easing } from "../tokens";
import { useReducedMotion } from "./useReducedMotion";

export interface TabItem {
  key: string;
  label: string;
}

export interface TabsProps extends Omit<ViewProps, "style"> {
  tabs: TabItem[];
  activeKey: string;
  onTabChange: (key: string) => void;
  style?: ViewProps["style"];
  /**
   * Cuando `true` los tabs se distribuyen en fila ocupando el ancho completo
   * con `flex: 1` y label centrado. Útil cuando el número de tabs es fijo y
   * cabe en pantalla (ej: ficha de ejercicio con 4 tabs).
   * Cuando `false` (default) se usa el ScrollView horizontal original.
   */
  distribute?: boolean;
}

/**
 * Subrayado lima del tab activo. Se anima la `opacity` (driver nativo, barato):
 * el indicador del tab que pasa a activo aparece suave y el saliente se desvanece,
 * dando la sensación de que el subrayado se mueve sin animar layout.
 * Reduced-motion: salta al estado final sin transición.
 */
function TabUnderline({ active, reduced }: { active: boolean; reduced: boolean }) {
  const opacity = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    const to = active ? 1 : 0;
    if (reduced) {
      opacity.setValue(to);
      return;
    }
    Animated.timing(opacity, {
      toValue: to,
      duration: duration.dropdown,
      easing: Easing.bezier(...easing.out),
      useNativeDriver: true,
    }).start();
  }, [active, reduced, opacity]);

  return (
    <Animated.View pointerEvents="none" style={[styles.underline, { opacity }]} />
  );
}

export function Tabs({ tabs, activeKey, onTabChange, style, distribute = false, ...rest }: TabsProps) {
  const reduced = useReducedMotion();

  if (distribute) {
    return (
      <View style={[styles.wrapper, style]} {...rest}>
        <View style={styles.distributeRow}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeKey;
            return (
              <Pressable
                key={tab.key}
                onPress={() => onTabChange(tab.key)}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                style={styles.distributeTab}
              >
                <Text style={[styles.distributeTabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
                <TabUnderline active={isActive} reduced={reduced} />
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, style]} {...rest}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              style={styles.tab}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              <TabUnderline active={isActive} reduced={reduced} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    flexDirection: "row",
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  tab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    marginBottom: -1,
  },
  tabText: {
    fontSize: fontSize.sm,
    color: colors.muted,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: colors.lime,
  },
  // Subrayado lima animado (opacity). Ocupa el borde inferior del tab.
  underline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: colors.lime,
  },
  // ── distribute mode ──
  distributeRow: {
    flexDirection: "row",
  },
  distributeTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing[3],
    marginBottom: -1,
  },
  distributeTabText: {
    fontSize: fontSize.sm,
    color: colors.muted,
    fontWeight: "600",
    letterSpacing: 0.3,
    textAlign: "center",
  },
});
