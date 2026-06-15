import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { SpaceMono_400Regular } from "@expo-google-fonts/space-mono";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { initSentry } from "@/lib/sentry";
import { colors } from "@forzza/ui/tokens";

// Evitar que el splash se oculte antes de que las fuentes carguen
void SplashScreen.preventAutoHideAsync();

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
        <Stack.Screen
          name="routine/new"
          options={{
            headerShown: false,
            // Card push (no modal): evita que la pantalla anterior asome detrás
            // y que el picker de biblioteca quede como modal-sobre-modal en iOS.
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="upgrade"
          options={{ title: "Planes", presentation: "modal" }}
        />
        <Stack.Screen
          name="marketplace/index"
          options={{
            headerShown: true,
            title: "Coaches",
            headerStyle: { backgroundColor: colors.black },
            headerTintColor: colors.white,
            headerTitleStyle: {
              fontFamily: "BebasNeue_400Regular",
              fontSize: 20,
            },
          }}
        />
        <Stack.Screen
          name="marketplace/[coachId]"
          options={{
            headerShown: true,
            title: "Perfil del coach",
            headerStyle: { backgroundColor: colors.black },
            headerTintColor: colors.white,
            headerTitleStyle: {
              fontFamily: "BebasNeue_400Regular",
              fontSize: 20,
            },
          }}
        />
        <Stack.Screen
          name="marketplace/checkout"
          options={{
            headerShown: true,
            title: "Contratar",
            presentation: "modal",
            headerStyle: { backgroundColor: colors.black },
            headerTintColor: colors.white,
            headerTitleStyle: {
              fontFamily: "BebasNeue_400Regular",
              fontSize: 20,
            },
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: true,
            title: "Notificaciones",
            headerStyle: { backgroundColor: colors.black },
            headerTintColor: colors.white,
            headerTitleStyle: {
              fontFamily: "BebasNeue_400Regular",
              fontSize: 20,
            },
          }}
        />
        <Stack.Screen
          name="chat/[conversationId]"
          options={{
            headerShown: true,
            title: "Chat",
            headerStyle: { backgroundColor: colors.black },
            headerTintColor: colors.white,
            headerTitleStyle: {
              fontFamily: "BebasNeue_400Regular",
              fontSize: 20,
            },
          }}
        />
        <Stack.Screen
          name="styleguide"
          options={{
            headerShown: true,
            title: "Styleguide",
            headerStyle: { backgroundColor: colors.black },
            headerTintColor: colors.lime,
            headerTitleStyle: {
              fontFamily: "BebasNeue_400Regular",
              fontSize: 20,
            },
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    SpaceMono_400Regular,
  });
  const [sentryReady, setSentryReady] = useState(false);

  useEffect(() => {
    void initSentry().then(() => setSentryReady(true));
  }, []);

  useEffect(() => {
    if (fontsLoaded && sentryReady) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, sentryReady]);

  // No renderizar hasta que las fuentes estén listas
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
