import { View, Text, StyleSheet } from "react-native";

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Inicio</Text>
      <Text style={styles.muted}>TODO: Fase 7 — Core entrenos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A", alignItems: "center", justifyContent: "center" },
  text: { color: "#FAFAFA", fontSize: 24, fontWeight: "bold" },
  muted: { color: "#6A6A6A", marginTop: 8 },
});
