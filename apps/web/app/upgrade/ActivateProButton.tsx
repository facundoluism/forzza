"use client";

import { useState } from "react";
import { colors, spacing, radius } from "@forzza/ui";

export function ActivateProButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleActivate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mp-preapproval", { method: "POST" });
      if (res.status === 401) {
        // Not logged in — redirect to login
        window.location.href = "/auth/login?redirect=/upgrade";
        return;
      }
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        setError(body.error ?? "Error al iniciar el pago");
        return;
      }
      const data = (await res.json()) as { init_point?: string };
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        setError("Respuesta inesperada del servidor");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: `${spacing[2]}px` }}>
      <button
        onClick={() => { void handleActivate(); }}
        disabled={loading}
        style={{
          display: "block",
          width: "100%",
          textAlign: "center",
          padding: `${spacing[4]}px`,
          backgroundColor: loading ? colors.gray700 : colors.lime,
          color: colors.black,
          borderRadius: `${radius.md}px`,
          fontWeight: "700",
          fontSize: "16px",
          letterSpacing: "0.5px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.15s ease",
        }}
      >
        {loading ? "Procesando..." : "Activar PRO"}
      </button>
      {error && (
        <p style={{
          color: colors.error,
          fontSize: "13px",
          margin: 0,
          textAlign: "center",
        }}>
          {error}
        </p>
      )}
    </div>
  );
}
