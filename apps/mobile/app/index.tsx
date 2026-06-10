import { Text, View, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forzza</Text>
      <Text style={styles.subtitle}>Plataforma fitness — placeholder Fase 1</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 48,
    color: "#C8FF00",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#AAAAAA",
    marginTop: 8,
  },
});
