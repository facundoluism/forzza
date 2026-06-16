import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Supported locales — es is the default (no URL prefix)
  locales: ["es", "en"] as const,
  defaultLocale: "es" as const,
  // 'as-needed': default locale (es) has no prefix → /coaches stays /coaches
  // English gets prefix → /en/coaches. Existing ES URLs are never broken.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
