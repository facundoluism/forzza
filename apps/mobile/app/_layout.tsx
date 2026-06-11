import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      // No autenticado → ir a login
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      // Autenticado → ir a tabs
      router.replace("/(tabs)");
    }
  }, [session, loading, segments]);

  if (loading) {
    return null; // Splash hasta que sepamos el estado de auth
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
        <Stack.Screen name="session" options={{ presentation: "modal" }} />
        <Stack.Screen name="routine/[id]" />
        <Stack.Screen name="upgrade" options={{ title: "Planes", presentation: "modal" }} />
        <Stack.Screen
          name="marketplace/index"
          options={{
            headerShown: true,
            title: "Coaches",
            headerStyle: { backgroundColor: "#0A0A0A" },
            headerTintColor: "#FAFAFA",
            headerTitleStyle: { fontFamily: "BebasNeue", fontSize: 20 },
          }}
        />
        <Stack.Screen
          name="marketplace/[coachId]"
          options={{
            headerShown: true,
            title: "Perfil del coach",
            headerStyle: { backgroundColor: "#0A0A0A" },
            headerTintColor: "#FAFAFA",
            headerTitleStyle: { fontFamily: "BebasNeue", fontSize: 20 },
          }}
        />
        <Stack.Screen
          name="marketplace/checkout"
          options={{
            headerShown: true,
            title: "Contratar",
            presentation: "modal",
            headerStyle: { backgroundColor: "#0A0A0A" },
            headerTintColor: "#FAFAFA",
            headerTitleStyle: { fontFamily: "BebasNeue", fontSize: 20 },
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: true,
            title: "Notificaciones",
            headerStyle: { backgroundColor: "#0A0A0A" },
            headerTintColor: "#FAFAFA",
            headerTitleStyle: { fontFamily: "BebasNeue", fontSize: 20 },
          }}
        />
        <Stack.Screen
          name="chat/[conversationId]"
          options={{
            headerShown: true,
            title: "Chat",
            headerStyle: { backgroundColor: "#0A0A0A" },
            headerTintColor: "#FAFAFA",
            headerTitleStyle: { fontFamily: "BebasNeue", fontSize: 20 },
          }}
        />
        <Stack.Screen
          name="styleguide"
          options={{
            headerShown: true,
            title: "Styleguide",
            headerStyle: { backgroundColor: "#0A0A0A" },
            headerTintColor: "#C8FF00",
            headerTitleStyle: { fontFamily: "BebasNeue", fontSize: 20 },
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </QueryClientProvider>
  );
}
