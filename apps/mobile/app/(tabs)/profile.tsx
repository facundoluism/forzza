import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

export default function ProfileTab() {
  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  }

  async function handleDeleteAccount() {
    Alert.alert(
      "Eliminar cuenta",
      "¿Estás seguro? Esta acción no se puede deshacer. Se cancelarán todas tus suscripciones.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            // TODO: llamar a Edge Function delete-account (Fase 3 completa)
            // Por ahora: solo sign out
            await supabase.auth.signOut();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Perfil</Text>
      <Text style={styles.muted}>TODO: Fase 3 completa</Text>

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={() => { void handleSignOut(); }}
      >
        <Text style={styles.signOutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => { void handleDeleteAccount(); }}
      >
        <Text style={styles.deleteText}>Eliminar cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A", alignItems: "center", justifyContent: "center", padding: 24 },
  text: { color: "#FAFAFA", fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  muted: { color: "#6A6A6A", marginBottom: 32 },
  signOutButton: {
    width: "100%",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    alignItems: "center",
    marginBottom: 12,
  },
  signOutText: { color: "#FAFAFA", fontSize: 16 },
  deleteButton: {
    width: "100%",
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#2A0000",
    borderWidth: 1,
    borderColor: "#FF4444",
    alignItems: "center",
  },
  deleteText: { color: "#FF4444", fontSize: 16 },
});
