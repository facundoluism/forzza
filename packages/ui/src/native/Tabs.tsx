import { ScrollView, View, Text, Pressable, StyleSheet, type ViewProps } from "react-native";
import { colors, spacing, fontSize } from "../tokens";

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

export function Tabs({ tabs, activeKey, onTabChange, style, distribute = false, ...rest }: TabsProps) {
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
                style={[styles.distributeTab, isActive && styles.tabActive]}
              >
                <Text style={[styles.distributeTabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
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
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
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
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginBottom: -1,
  },
  tabActive: {
    borderBottomColor: colors.lime,
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
  // ── distribute mode ──
  distributeRow: {
    flexDirection: "row",
  },
  distributeTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
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
