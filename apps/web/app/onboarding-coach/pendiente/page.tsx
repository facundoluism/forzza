export default function PendientePage() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0A0A0A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px",
    }}>
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        <p style={{ fontSize: "64px", marginBottom: "24px" }}>🕐</p>
        <h1 style={{ color: "#FAFAFA", fontSize: "28px", marginBottom: "16px" }}>
          Solicitud enviada
        </h1>
        <p style={{ color: "#AAAAAA", lineHeight: "1.6", marginBottom: "8px" }}>
          Recibimos tu solicitud. Nuestro equipo la va a revisar en las próximas <strong style={{ color: "#FAFAFA" }}>48 horas hábiles</strong>.
        </p>
        <p style={{ color: "#AAAAAA", lineHeight: "1.6" }}>
          Te avisamos por email cuando esté aprobada y podés empezar a publicar tus paquetes.
        </p>
      </div>
    </div>
  );
}
