import { colors, spacing } from "@forzza/ui";

export const metadata = {
  title: "Términos y condiciones — Forzza",
};

export default function TerminosPage() {
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
        Términos y condiciones
      </h1>
      <div style={{
        backgroundColor: colors.warning + "22",
        border: `1px solid ${colors.warning}`,
        borderRadius: "8px",
        padding: `${spacing[4]}px`,
        marginBottom: `${spacing[6]}px`,
      }}>
        <p style={{ color: colors.warning, margin: 0, fontSize: "14px" }}>
          ⚠️ DRAFT — Este documento está pendiente de revisión legal. No es vinculante hasta su publicación oficial.
        </p>
      </div>
      <div style={{ color: colors.gray300, lineHeight: "1.8", fontSize: "16px" }}>
        <p>TODO_COPY — Contenido pendiente de revisión legal por abogado. Ver §23 del master doc para el checklist legal completo.</p>
        <h2 style={{ color: colors.white, marginTop: `${spacing[8]}px` }}>1. Aceptación de los términos</h2>
        <p>Al usar Forzza, aceptás estos términos. Si sos menor de 18 años, necesitás el consentimiento de un adulto responsable.</p>
        <h2 style={{ color: colors.white, marginTop: `${spacing[8]}px` }}>2. Servicio</h2>
        <p>Forzza es una plataforma que conecta alumnos con coaches independientes. Forzza actúa como intermediario y cobra una comisión del 20% sobre las transacciones.</p>
        <h2 style={{ color: colors.white, marginTop: `${spacing[8]}px` }}>3. Pagos</h2>
        <p>Los pagos se procesan a través de Mercado Pago y RevenueCat. Forzza no almacena datos de tarjetas.</p>
      </div>
    </main>
  );
}
