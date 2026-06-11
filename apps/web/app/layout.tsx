import type { Metadata, Viewport } from "next";
import { InstallPrompt } from "../components/InstallPrompt";

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
    <html lang="es">
      <head>
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link
            rel="preconnect"
            href={process.env.NEXT_PUBLIC_SUPABASE_URL}
          />
        )}
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#0A0A0A",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
