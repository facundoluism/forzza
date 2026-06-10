import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../tokens";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = "📭",
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <View style={styles.actionWrapper}>
          <Button label={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing[6] },
  icon: { fontSize: 64, marginBottom: spacing[4] },
  title: { color: colors.white, fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: spacing[2] },
  description: { color: colors.gray400, fontSize: 14, textAlign: "center", lineHeight: 20 },
  actionWrapper: { marginTop: spacing[4] },
});
