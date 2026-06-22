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
import { LogBox } from "react-native";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { initSentry } from "@/lib/sentry";
// i18n — inicializar el singleton ANTES de cualquier render que use useTranslation().
// Lee el idioma persistido del store; si no hay, usa el locale del dispositivo.
import { initI18n } from "@/lib/i18n";
import { useLanguageStore } from "@/stores/languageStore";
import { AnalyticsConsentBanner } from "@/components/AnalyticsConsentBanner";
import { initAnalyticsIfAllowed } from "@/lib/analytics";
import { getConsent } from "@/stores/analyticsConsentStore";

// Leer idioma persistido SINCRÓNICAMENTE antes del primer render.
// useLanguageStore.getState() está disponible sin montar el store porque
// Zustand crea el store en el módulo (singleton).
const persistedLanguage = useLanguageStore.getState().language;
initI18n(persistedLanguage);

// Inicializar analytics SOLO si el usuario ya dio consentimiento en una sesión anterior.
// Si decided === false, el banner lo iniciará cuando el usuario acepte.
const { decided, analyticsEnabled } = getConsent();
if (decided && analyticsEnabled) {
  initAnalyticsIfAllowed();
}

LogBox.ignoreLogs([
  "The app is running using the Legacy Architecture",
]);

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
      <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
        <Stack.Screen name="session" />
        <Stack.Screen name="routine/[id]" />
        <Stack.Screen
          name="routine/new"
          options={{
            // Card push (no modal): evita que la pantalla anterior asome detras
            // y que el picker de biblioteca quede como modal-sobre-modal en iOS.
            presentation: "card",
          }}
        />
        <Stack.Screen name="upgrade" />
        <Stack.Screen name="marketplace/index" />
        <Stack.Screen name="marketplace/[coachId]" />
        <Stack.Screen name="marketplace/checkout" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="chat/[conversationId]" />
        <Stack.Screen name="styleguide" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BebasNeue_400Regular,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    SpaceMono_400Regular,
  });
  const [bootTimedOut, setBootTimedOut] = useState(false);
  const readyToRender = fontsLoaded || Boolean(fontError) || bootTimedOut;

  useEffect(() => {
    void initSentry();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setBootTimedOut(true), 2500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (readyToRender) {
      void SplashScreen.hideAsync();
    }
  }, [readyToRender]);

  // No renderizar hasta que las fuentes estén listas
  if (!readyToRender) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootLayoutNav />
          {/* Banner de consentimiento de analytics — se muestra sobre todo en la primera apertura */}
          <AnalyticsConsentBanner />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
