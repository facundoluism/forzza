import type { Metadata, Viewport } from "next";
import "./globals.css";

// Root layout — provides the HTML document structure.
// Locale-specific wiring (NextIntlClientProvider) lives in app/[locale]/layout.tsx.
// The lang attribute is set here to "es" as a default; next-intl injects the
// correct locale into the <html> tag via generateStaticParams + setRequestLocale
// in the [locale]/layout.tsx. suppressHydrationWarning prevents React from
// complaining when the lang attribute is patched client-side.

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
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
