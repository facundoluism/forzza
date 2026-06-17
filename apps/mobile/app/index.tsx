import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { colors } from "@forzza/ui/tokens";

export default function IndexScreen() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.lime} />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
});
