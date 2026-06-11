import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";

export default function ProfileTab() {
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.replace("/(auth)/login");
  }

  function handleDeleteAccount() {
    Alert.alert(
      "Eliminar cuenta",
      "¿Estás seguro? Esta acción no se puede deshacer. Se cancelarán todas tus suscripciones.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            // TODO: Edge Function delete-account (Fase 3 completa)
            await signOut();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      {user && (
        <Text style={styles.email}>{user.email}</Text>
      )}

      <Text style={styles.muted}>TODO: completar en Fase 3 con perfil completo</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => { void handleSignOut(); }}
        >
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteText}>Eliminar cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    padding: 24,
    paddingTop: 64,
  },
  title: {
    color: "#FAFAFA",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  email: {
    color: "#AAAAAA",
    fontSize: 14,
    marginBottom: 8,
  },
  muted: {
    color: "#6A6A6A",
    marginBottom: 48,
  },
  actions: {
    gap: 12,
  },
  signOutButton: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    alignItems: "center",
  },
  signOutText: { color: "#FAFAFA", fontSize: 16 },
  deleteButton: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#2A0000",
    borderWidth: 1,
    borderColor: "#FF4444",
    alignItems: "center",
  },
  deleteText: { color: "#FF4444", fontSize: 16 },
});
