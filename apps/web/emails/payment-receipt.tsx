export function paymentReceiptEmail({
  name,
  amount,
  currency,
  description,
  date,
}: {
  name: string;
  amount: number;
  currency: string;
  description: string;
  date?: string;
}): string {
  const formattedDate =
    date ??
    new Date().toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formattedAmount = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount / 100);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comprobante de pago — Forzza</title>
</head>
<body style="font-family: 'DM Sans', sans-serif; background: #0A0A0A; color: #FAFAFA; padding: 40px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto;">
    <h1 style="color: #C8FF00; font-family: monospace; font-size: 32px; letter-spacing: 2px; margin-bottom: 8px;">FORZZA</h1>
    <h2 style="color: #FAFAFA; font-size: 24px; margin-top: 0;">Comprobante de pago</h2>
    <p style="color: #AAAAAA; line-height: 1.6;">
      Hola ${name}, tu pago fue procesado exitosamente. A continuación encontrás el detalle:
    </p>
    <div style="background: #1A1A1A; border: 1px solid #2A2A2A; border-radius: 8px; padding: 24px; margin: 24px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="color: #AAAAAA; font-size: 13px; padding-bottom: 12px;">Descripción</td>
          <td style="color: #FAFAFA; font-size: 13px; padding-bottom: 12px; text-align: right;">${description}</td>
        </tr>
        <tr>
          <td style="color: #AAAAAA; font-size: 13px; padding-bottom: 12px;">Fecha</td>
          <td style="color: #FAFAFA; font-size: 13px; padding-bottom: 12px; text-align: right;">${formattedDate}</td>
        </tr>
        <tr style="border-top: 1px solid #2A2A2A;">
          <td style="color: #AAAAAA; font-size: 15px; font-weight: 700; padding-top: 12px;">Total</td>
          <td style="color: #C8FF00; font-size: 20px; font-weight: 700; font-family: monospace; padding-top: 12px; text-align: right;">${formattedAmount}</td>
        </tr>
      </table>
    </div>
    <a
      href="https://forzza.app"
      style="background: #C8FF00; color: #0A0A0A; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 8px; font-weight: 700; font-size: 15px;"
    >
      Ver mi cuenta
    </a>
    <p style="color: #6A6A6A; margin-top: 48px; font-size: 12px; border-top: 1px solid #2A2A2A; padding-top: 24px;">
      Si tenés alguna duda sobre este cobro, contactanos en soporte@forzza.app<br>
      — El equipo de Forzza
    </p>
  </div>
</body>
</html>`;
}
