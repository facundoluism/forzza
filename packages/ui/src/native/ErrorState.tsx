import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../tokens";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Algo salió mal",
  description = "Ocurrió un error inesperado. Intentá de nuevo.",
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onRetry && (
        <View style={styles.retryWrapper}>
          <Button
            label="Intentar de nuevo"
            variant="secondary"
            onPress={onRetry}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing[6] },
  icon: { fontSize: 48, marginBottom: spacing[4] },
  title: { color: colors.error, fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: spacing[2] },
  description: { color: colors.gray400, fontSize: 14, textAlign: "center", lineHeight: 20 },
  retryWrapper: { marginTop: spacing[4] },
});
