export function welcomeStudentEmail({ name }: { name: string }): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido/a a Forzza</title>
</head>
<body style="font-family: 'DM Sans', sans-serif; background: #0A0A0A; color: #FAFAFA; padding: 40px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto;">
    <h1 style="color: #C8FF00; font-family: monospace; font-size: 32px; letter-spacing: 2px; margin-bottom: 8px;">FORZZA</h1>
    <h2 style="color: #FAFAFA; font-size: 24px; margin-top: 0;">¡Bienvenido/a, ${name}!</h2>
    <p style="color: #AAAAAA; line-height: 1.6;">
      Ya podés empezar a entrenar. Explorá los coaches disponibles o iniciá tu primera rutina directamente desde la app.
    </p>
    <a
      href="https://forzza.app"
      style="background: #C8FF00; color: #0A0A0A; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px; font-weight: 700; font-size: 15px;"
    >
      Ir a Forzza
    </a>
    <p style="color: #6A6A6A; margin-top: 48px; font-size: 12px; border-top: 1px solid #2A2A2A; padding-top: 24px;">
      Si no creaste esta cuenta, podés ignorar este email tranquilamente.
    </p>
  </div>
</body>
</html>`;
}
