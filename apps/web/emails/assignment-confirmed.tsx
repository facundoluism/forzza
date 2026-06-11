export function assignmentConfirmedEmail({
  studentName,
  coachName,
}: {
  studentName: string;
  coachName: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Asignación confirmada — Forzza</title>
</head>
<body style="font-family: 'DM Sans', sans-serif; background: #0A0A0A; color: #FAFAFA; padding: 40px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto;">
    <h1 style="color: #C8FF00; font-family: monospace; font-size: 32px; letter-spacing: 2px; margin-bottom: 8px;">FORZZA</h1>
    <h2 style="color: #FAFAFA; font-size: 24px; margin-top: 0;">¡Asignación confirmada, ${studentName}!</h2>
    <p style="color: #AAAAAA; line-height: 1.6;">
      Quedaste asignado/a con el coach <strong style="color: #FAFAFA;">${coachName}</strong>.
      Ya podés acceder a tus rutinas, completar check-ins y comunicarte directamente con tu coach desde la app.
    </p>
    <div style="background: #1A1A1A; border: 1px solid #2A2A2A; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <p style="color: #AAAAAA; margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Tu coach</p>
      <p style="color: #C8FF00; font-size: 20px; font-weight: 700; margin: 0;">${coachName}</p>
    </div>
    <a
      href="https://forzza.app"
      style="background: #C8FF00; color: #0A0A0A; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 8px; font-weight: 700; font-size: 15px;"
    >
      Ver mi plan de entrenamiento
    </a>
    <p style="color: #6A6A6A; margin-top: 48px; font-size: 12px; border-top: 1px solid #2A2A2A; padding-top: 24px;">
      — El equipo de Forzza
    </p>
  </div>
</body>
</html>`;
}
