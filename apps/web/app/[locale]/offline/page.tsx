"use client";

export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg)",
        color: "#FFFFFF",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "0 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: "#1A1A1A",
          border: "2px solid #C8FF00",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          fontSize: 28,
        }}
      >
        ⚡
      </div>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          margin: "0 0 12px",
          color: "#FFFFFF",
        }}
      >
        Sin conexión
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--color-muted)",
          margin: 0,
          maxWidth: 320,
          lineHeight: 1.5,
        }}
      >
        Revisá tu conexión a internet y volvé a intentarlo.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: 32,
          background: "#C8FF00",
          color: "#000000",
          border: "none",
          borderRadius: 8,
          padding: "12px 24px",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        Reintentar
      </button>
    </div>
  );
}
