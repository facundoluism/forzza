"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { forgotPasswordSchema } from "@forzza/core";

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<PageState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? "Email inválido");
      return;
    }

    setState("loading");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (authError) {
      setState("error");
      setError("No se pudo enviar el email. Intentá de nuevo.");
      return;
    }

    setState("success");
  }

  if (state === "success") {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "48px", marginBottom: "16px" }}>✅</p>
        <h2 style={{ color: "#FAFAFA", marginBottom: "8px" }}>
          Email enviado
        </h2>
        <p style={{ color: "var(--color-muted)" }}>
          Revisá tu bandeja de entrada y seguí las instrucciones para restablecer tu contraseña.
        </p>
        <Link href="/login" style={{ color: "#C8FF00", display: "block", marginTop: "24px" }}>
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: "#FAFAFA", marginBottom: "8px" }}>Recuperar contraseña</h2>
      <p style={{ color: "var(--color-muted)", marginBottom: "24px" }}>
        Ingresá tu email y te enviamos un link para restablecer tu contraseña.
      </p>

      <form onSubmit={(e) => { void handleSubmit(e); }}>
        <div style={{ marginBottom: "16px" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
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
          {state === "loading" ? "Enviando..." : "Enviar link de recuperación"}
        </button>

        <Link href="/login" style={{ display: "block", textAlign: "center", marginTop: "16px", color: "var(--color-muted)", fontSize: "14px" }}>
          Volver al inicio de sesión
        </Link>
      </form>
    </div>
  );
}
