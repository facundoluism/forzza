import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { InstallPrompt } from "@/components/InstallPrompt";

export const dynamic = "force-dynamic";

// metadata and viewport are defined in the root layout (app/layout.tsx) — a
// single source of truth. Per-page overrides still work via generateMetadata.

// Generate static params so the [locale] segment is known to Next.js during build.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate the locale — return 404 if unsupported (e.g. /fr/...).
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering for this locale. Must be called before any
  // async operations that read the locale (getMessages, getTranslations, etc.).
  setRequestLocale(locale);

  // Load all messages for the active locale and pass to client components.
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
      <InstallPrompt />
    </NextIntlClientProvider>
  );
}
