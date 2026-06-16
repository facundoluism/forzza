/**
 * Store de idioma — Zustand + AsyncStorage (mismo patrón que workoutStore).
 *
 * Estado: `language: 'es' | 'en'`
 * Acción: `setLanguage(lang)` → persiste en AsyncStorage Y llama
 *   `i18n.changeLanguage(lang)`, lo que emite el evento `languageChanged`
 *   que `react-i18next` escucha para re-renderizar todos los componentes
 *   que usen `useTranslation()` — sin necesidad de contexto adicional.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n, { detectDeviceLanguage } from "@/lib/i18n";

export type AppLanguage = "es" | "en";

interface LanguageState {
  language: AppLanguage;
}

interface LanguageActions {
  setLanguage: (lang: AppLanguage) => void;
}

type LanguageStore = LanguageState & LanguageActions;

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      // Default PRE-hidratación = locale del dispositivo. Así el primer paint usa
      // el idioma del device; si hay valor persistido, onRehydrateStorage lo aplica.
      language: detectDeviceLanguage(),

      setLanguage: (lang: AppLanguage) => {
        set({ language: lang });
        // Emite 'languageChanged' → react-i18next re-renderiza todos los
        // componentes con useTranslation() en caliente, sin restart.
        void i18n.changeLanguage(lang);
      },
    }),
    {
      name: "forzza-language",
      storage: createJSONStorage(() => AsyncStorage),
      // La hidratación de AsyncStorage es ASÍNCRONA: al terminar, aplicamos el
      // idioma persistido a i18next (que se inicializó en module-load con el
      // default del device). Sin esto, el idioma elegido por el usuario no se
      // re-aplica tras reiniciar la app (el store hidrata pero i18next no cambia).
      onRehydrateStorage: () => (state) => {
        if (state && state.language !== i18n.language) {
          void i18n.changeLanguage(state.language);
        }
      },
    }
  )
);

/** Hook de conveniencia (igual que useLanguageStore pero más semántico) */
export function useLanguage(): {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
} {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  return { language, setLanguage };
}
