"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { resetPasswordSchema } from "@forzza/core";

type PageState = "idle" | "loading" | "success" | "error";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  color: "var(--color-text)",
  fontSize: "16px",
  boxSizing: "border-box",
};

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState<PageState>("idle");
  const [error, setError] = useState<string | null>(null);

  // El link del email de recuperación trae un `code` (PKCE) que hay que
  // intercambiar por una sesión antes de poder actualizar la contraseña.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;
    const supabase = createClient();
    void supabase.auth.exchangeCodeForSession(code);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? "Datos inválidos");
      return;
    }

    setState("loading");
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.updateUser({ password });

    if (authError) {
      setState("error");
      setError(
        "No se pudo actualizar la contraseña. Reabrí el link del email e intentá de nuevo."
      );
      return;
    }

    setState("success");
  }

  if (state === "success") {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "48px", marginBottom: "16px" }}>✅</p>
        <h2 style={{ color: "#FAFAFA", marginBottom: "8px" }}>Contraseña actualizada</h2>
        <p style={{ color: "var(--color-muted)" }}>
          Ya podés iniciar sesión con tu nueva contraseña.
        </p>
        <a href="/login" style={{ color: "#C8FF00", display: "block", marginTop: "24px" }}>
          Ir a iniciar sesión
        </a>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: "#FAFAFA", marginBottom: "8px" }}>Nueva contraseña</h2>
      <p style={{ color: "#9898C0", marginBottom: "24px" }}>
        Elegí una contraseña nueva para tu cuenta.
      </p>

      <form onSubmit={(e) => { void handleSubmit(e); }}>
        <div style={{ marginBottom: "16px" }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nueva contraseña"
            required
            disabled={state === "loading"}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repetí la contraseña"
            required
            disabled={state === "loading"}
            style={inputStyle}
          />
        </div>

        {error && (
          <p style={{ color: "#FF4466", marginBottom: "16px", fontSize: "14px" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={state === "loading"}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: state === "loading" ? "#4A4A4A" : "#C8FF00",
            color: "#0A0A0A",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: state === "loading" ? "not-allowed" : "pointer",
          }}
        >
          {state === "loading" ? "Guardando..." : "Guardar contraseña"}
        </button>

        <a
          href="/login"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "16px",
            color: "var(--color-muted)",
            fontSize: "14px",
          }}
        >
          Volver al inicio de sesión
        </a>
      </form>
    </div>
  );
}
