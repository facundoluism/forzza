/**
 * Store de consentimiento de analytics — Zustand + AsyncStorage.
 *
 * Estado:
 *   - `decided`: true si el usuario ya respondió el banner (primera vez).
 *   - `analyticsEnabled`: true si aceptó; false si rechazó.
 *
 * Al hidratar: si `decided === true && analyticsEnabled === false`, el caller
 * debe llamar posthog.optOut() antes de inicializar PostHog (analytics.ts lo
 * hace consultando getConsent() antes de crear la instancia).
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AnalyticsConsentState {
  decided: boolean;
  analyticsEnabled: boolean;
}

interface AnalyticsConsentActions {
  accept: () => void;
  reject: () => void;
  setAnalyticsEnabled: (enabled: boolean) => void;
}

type AnalyticsConsentStore = AnalyticsConsentState & AnalyticsConsentActions;

export const useAnalyticsConsentStore = create<AnalyticsConsentStore>()(
  persist(
    (set) => ({
      decided: false,
      analyticsEnabled: false,

      accept: () => set({ decided: true, analyticsEnabled: true }),
      reject: () => set({ decided: true, analyticsEnabled: false }),
      setAnalyticsEnabled: (enabled: boolean) =>
        set({ decided: true, analyticsEnabled: enabled }),
    }),
    {
      name: "forzza-analytics-consent",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/**
 * Acceso síncrono al estado de consentimiento (sin hook).
 * Usado por analytics.ts en module-load para decidir si inicializar PostHog.
 */
export function getConsent(): { decided: boolean; analyticsEnabled: boolean } {
  return useAnalyticsConsentStore.getState();
}
