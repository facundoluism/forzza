import { useRef, type ReactNode } from "react";
import { Animated, View, Text, Pressable, StyleSheet, type PressableProps } from "react-native";
import { colors, spacing, radius, fontSize, motion } from "../tokens";

export interface NotificationRowProps {
  icon: ReactNode;
  title: string;
  body: string;
  time: string;
  read?: boolean;
  onPress?: PressableProps["onPress"];
}

export function NotificationRow({
  icon,
  title,
  body,
  time,
  read = false,
  onPress,
}: NotificationRowProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: motion.pressScale,
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

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={({ pressed }) => [
        styles.row,
        !read && styles.rowUnread,
        pressed && styles.rowPressed,
      ]}
    >
      <Animated.View style={[styles.inner, { transform: [{ scale }] }]}>
        <View style={styles.iconWrapper}>{icon}</View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, !read && styles.titleUnread]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <Text style={styles.body} numberOfLines={2}>
            {body}
          </Text>
        </View>
        {!read && <View style={styles.dot} />}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: "transparent",
  },
  inner: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  rowUnread: {
    backgroundColor: colors.surface2,
  },
  rowPressed: {
    opacity: 0.75,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface3,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: spacing[1],
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[2],
  },
  title: {
    fontSize: fontSize.sm,
    color: colors.muted,
    fontWeight: "500",
    flex: 1,
  },
  titleUnread: {
    color: colors.text,
    fontWeight: "700",
  },
  time: {
    fontSize: fontSize.xs,
    color: colors.gray,
    flexShrink: 0,
  },
  body: {
    fontSize: fontSize.xs,
    color: colors.muted,
    lineHeight: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.lime,
    marginTop: 6,
    flexShrink: 0,
  },
});
