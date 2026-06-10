"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { loginSchema } from "@forzza/core";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? "Datos inválidos");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Email o contraseña incorrectos"
          : "Error al iniciar sesión. Intentá de nuevo."
      );
      setLoading(false);
      return;
    }

    window.location.href = "/coach";
  }

  return (
    <div>
      <h1 style={{ color: "#C8FF00", fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>
        Forzza
      </h1>
      <p style={{ color: "#AAAAAA", marginBottom: "32px" }}>
        Iniciá sesión en tu cuenta
      </p>

      <form onSubmit={(e) => { void handleSubmit(e); }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", color: "#FAFAFA", marginBottom: "8px" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#1A1A1A",
              border: "1px solid #3A3A3A",
              borderRadius: "8px",
              color: "#FAFAFA",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", color: "#FAFAFA", marginBottom: "8px" }}>
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#1A1A1A",
              border: "1px solid #3A3A3A",
              borderRadius: "8px",
              color: "#FAFAFA",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {error && (
          <p style={{ color: "#FF4444", marginBottom: "16px", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: loading ? "#4A4A4A" : "#C8FF00",
            color: "#0A0A0A",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>

        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <a
            href="/auth/forgot-password"
            style={{ color: "#AAAAAA", fontSize: "14px" }}
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </form>
    </div>
  );
}
