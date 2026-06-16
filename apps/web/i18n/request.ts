import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale is the locale extracted by next-intl middleware from the URL.
  // Fall back to default locale if undefined (e.g. static generation).
  let locale = await requestLocale;

  // Validate that the locale is one we support, fall back to default otherwise.
  if (!locale || !routing.locales.includes(locale as "es" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (
      await import(`../messages/${locale}.json`)
    ).default,
  };
});
