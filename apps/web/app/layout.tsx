export const metadata = {
  title: "Forzza",
  description: "Tu plataforma de entrenamiento personalizado",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
