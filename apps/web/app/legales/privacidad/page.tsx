import { colors, spacing } from "@forzza/ui";

export const metadata = {
  title: "Política de privacidad — Forzza",
};

export default function PrivacidadPage() {
  return (
    <main style={{
      backgroundColor: colors.black,
      minHeight: "100vh",
      padding: `${spacing[16]}px ${spacing[6]}px`,
      maxWidth: "800px",
      margin: "0 auto",
    }}>
      <a href="/" style={{ color: colors.lime, textDecoration: "none", fontSize: "14px" }}>
        ← Volver al inicio
      </a>
      <h1 style={{ color: colors.white, fontSize: "36px", margin: `${spacing[6]}px 0` }}>
        Política de privacidad
      </h1>
      <div style={{
        backgroundColor: colors.warning + "22",
        border: `1px solid ${colors.warning}`,
        borderRadius: "8px",
        padding: `${spacing[4]}px`,
        marginBottom: `${spacing[6]}px`,
      }}>
        <p style={{ color: colors.warning, margin: 0, fontSize: "14px" }}>
          ⚠️ DRAFT — Este documento está pendiente de revisión legal.
        </p>
      </div>
      <div style={{ color: colors.gray300, lineHeight: "1.8", fontSize: "16px" }}>
        <p>TODO_COPY — Pendiente de redacción final por abogado especialista en datos personales (PDPA Argentina).</p>
        <h2 style={{ color: colors.white, marginTop: `${spacing[8]}px` }}>Datos que recopilamos</h2>
        <p>Email, nombre, fecha de nacimiento, historial de entrenamientos y datos de pago (gestionados por Mercado Pago/RevenueCat).</p>
        <h2 style={{ color: colors.white, marginTop: `${spacing[8]}px` }}>Datos sensibles</h2>
        <p>Las fotos corporales y constancias fiscales se almacenan en servidores privados con acceso restringido. No se comparten con terceros ni se usan para analytics.</p>
        <h2 style={{ color: colors.white, marginTop: `${spacing[8]}px` }}>Tus derechos</h2>
        <p>Podés solicitar la eliminación de tu cuenta y todos tus datos en cualquier momento desde la configuración de tu cuenta.</p>
      </div>
    </main>
  );
}
