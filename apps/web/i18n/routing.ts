import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Supported locales — es is the default (no URL prefix)
  locales: ["es", "en"] as const,
  defaultLocale: "es" as const,
  // 'as-needed': default locale (es) has no prefix → /coaches stays /coaches
  // English gets prefix → /en/coaches. Existing ES URLs are never broken.
  localePrefix: "as-needed",
  // Disable automatic locale detection from Accept-Language header.
  // Forzza V1 is Argentina-first: ES is always the default.
  // EN is opt-in via the LanguageSwitcher (next-intl reads the NEXT_LOCALE
  // cookie set by the switcher and respects it on subsequent visits).
  // Without this flag, Chromium (Playwright / EN-browser users) would be
  // auto-redirected to /en, breaking e2e and mis-serving AR users.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
