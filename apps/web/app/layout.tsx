import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s — Forzza",
    default: "Forzza — Tu plataforma de entrenamiento personalizado",
  },
  description: "Entrená con el coach correcto. Rutinas, seguimiento y resultados reales.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#0A0A0A", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
