/**
 * i18n singleton — importar UNA sola vez desde app/_layout.tsx
 * antes del primer render de cualquier componente que use useTranslation().
 *
 * Idioma inicial:
 *  1. Si el store de idioma ya tiene un valor persistido → se usa ese.
 *  2. Si no → se deriva del locale del dispositivo vía expo-localization.
 *     Cualquier locale cuyo languageCode sea "es" → "es"; el resto → "en".
 *
 * i18next 26.x no requiere compatibilityJSON (usa plural nativo por defecto).
 * Para Hermes (JS engine de RN) funciona sin transpilación especial porque
 * el bundle de i18next se distribuye como CJS/UMD además de ESM.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import es from "@/locales/es.json";
import en from "@/locales/en.json";

// Detectar idioma del dispositivo como fallback cuando no hay preferencia guardada.
// Se lee sincrónicamente antes de montar cualquier componente.
export function detectDeviceLanguage(): "es" | "en" {
  try {
    const locales = getLocales();
    const lang = locales[0]?.languageCode;
    return lang === "es" ? "es" : "en";
  } catch {
    return "es";
  }
}

/**
 * Inicializa el singleton de i18next.
 * Llamar desde el entry point (_layout.tsx) ANTES de cualquier render.
 *
 * El idioma activo puede sobreescribirse después con:
 *   `import i18n from 'i18next'; i18n.changeLanguage('en');`
 */
export function initI18n(initialLanguage?: "es" | "en"): void {
  if (i18n.isInitialized) return;

  const lng = initialLanguage ?? detectDeviceLanguage();

  void i18n
    .use(initReactI18next)
    .init({
      resources: {
        es: { translation: es },
        en: { translation: en },
      },
      lng,
      fallbackLng: "es",
      interpolation: {
        escapeValue: false, // React Native ya escapa el output
      },
      // i18next 26 usa Intl.PluralRules nativo — compatible con Hermes ≥ RN 0.70
    });
}

export default i18n;
