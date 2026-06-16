import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";
import "./globals.css";

// Root layout — provides the HTML document structure.
// Locale-specific wiring (NextIntlClientProvider) lives in app/[locale]/layout.tsx.
// getLocale() reads the locale injected by next-intl middleware into the request
// headers; it works in all runtime RSC contexts. No suppressHydrationWarning
// needed because the lang attribute is set server-side to the correct value.
// metadata/viewport are defined HERE only (removed duplicate from [locale]/layout.tsx).

export const metadata: Metadata = {
  title: {
    template: "%s — Forzza",
    default: "Forzza — Tu plataforma de entrenamiento personalizado",
  },
  description:
    "Entrená con el coach correcto. Rutinas, seguimiento y resultados reales.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Forzza",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#C8FF00",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // getLocale() is provided by next-intl/server and reads the locale from the
  // middleware-injected request context. Falls back to "es" (default locale)
  // during build-time prerender passes where no request context exists.
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <head>
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link
            rel="preconnect"
            href={process.env.NEXT_PUBLIC_SUPABASE_URL}
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
