"use client";

/**
 * MpConnectButton — Botón de vinculación de Mercado Pago para el coach.
 *
 * Muestra el estado de conexión (conectado / no conectado) y permite al coach
 * iniciar el flujo OAuth de MP para vincular su cuenta al Split de Pagos.
 *
 * Seguridad:
 *   - Solo muestra si el coach está conectado o no — NUNCA expone tokens.
 *   - El flujo OAuth ocurre en el servidor (redirect → /api/coach/mp-oauth).
 *   - Los tokens los maneja exclusivamente la Edge Function mp-oauth-connect.
 */

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface MpConnectButtonProps {
  /** null = no vinculado aún; string = mp_user_id del coach (conexión existente) */
  mpUserId: string | null;
  /** Indica si la conexión está activa */
  connected: boolean;
}

function MpConnectButtonInner({ mpUserId, connected }: MpConnectButtonProps) {
  const searchParams = useSearchParams();
  const mpConnectedParam = searchParams.get("mp_connected");

  // Determinar estado efectivo (puede venir de redirect post-OAuth)
  const isConnected =
    connected ||
    (mpConnectedParam === "true" && !mpConnectedParam.includes("error"));
  const justConnected = mpConnectedParam === "true" && !connected;
  const oauthError = mpConnectedParam === "error";
  const errorReason = searchParams.get("reason");

  return (
    <div
      style={{
        marginTop: "32px",
        border: "1px solid #242436",
        borderRadius: "12px",
        padding: "20px 24px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            backgroundColor: "rgba(0, 158, 227, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {/* MP icon simplified */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#009EE3" strokeWidth="2" />
            <path
              d="M8 12h8M12 8v8"
              stroke="#009EE3"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2
          style={{
            color: "var(--color-text)",
            fontSize: "15px",
            fontWeight: 700,
            margin: 0,
          }}
        >
          Mercado Pago
        </h2>
        {/* Badge de estado */}
        <span
          style={{
            marginLeft: "auto",
            padding: "3px 10px",
            borderRadius: "99px",
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            backgroundColor: isConnected
              ? "rgba(200, 255, 0, 0.12)"
              : "rgba(106, 106, 106, 0.15)",
            color: isConnected ? "#C8FF00" : "#6A6A6A",
          }}
        >
          {isConnected ? "CONECTADO" : "NO CONECTADO"}
        </span>
      </div>

      {/* Descripción */}
      <p
        style={{
          color: "var(--color-muted)",
          fontSize: "13px",
          lineHeight: 1.6,
          marginBottom: "16px",
          marginTop: "4px",
        }}
      >
        {isConnected
          ? `Tu cuenta de Mercado Pago (ID ${mpUserId ?? "—"}) está vinculada. Los pagos de tus alumnos irán directamente a tu cuenta.`
          : "Vinculá tu cuenta de Mercado Pago para recibir los pagos de tus alumnos directamente, sin que pasen por Forzza."}
      </p>

      {/* Feedback post-OAuth */}
      {justConnected && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            backgroundColor: "rgba(200, 255, 0, 0.08)",
            border: "1px solid rgba(200, 255, 0, 0.25)",
            marginBottom: "16px",
          }}
        >
          <p style={{ color: "#C8FF00", fontSize: "13px", margin: 0 }}>
            Cuenta vinculada correctamente. Ya podés recibir pagos con split.
          </p>
        </div>
      )}

      {oauthError && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            marginBottom: "16px",
          }}
        >
          <p style={{ color: "#EF4444", fontSize: "13px", margin: 0 }}>
            {errorReason === "mp_oauth_not_configured"
              ? "La integración con Mercado Pago aún no está activa. Contactá al soporte de Forzza."
              : errorReason === "state_mismatch" || errorReason === "state_expired"
              ? "La sesión de conexión venció. Volvé a intentarlo."
              : "Hubo un error al conectar tu cuenta. Volvé a intentarlo o contactá soporte."}
          </p>
        </div>
      )}

      {/* CTA */}
      {!isConnected ? (
        // Ruta /api/ (redirect OAuth server-side), no una página: <Link> de next/link
        // no aplica. La regla no-html-link-for-pages es falso positivo acá.
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a
          href="/api/coach/mp-oauth"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#009EE3",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Conectar Mercado Pago
        </a>
      ) : (
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a
          href="/api/coach/mp-oauth"
          style={{
            display: "inline-block",
            padding: "8px 16px",
            backgroundColor: "transparent",
            color: "var(--color-muted)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            fontSize: "13px",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Reconectar
        </a>
      )}
    </div>
  );
}

// Wrapper con Suspense requerido por useSearchParams en Next.js App Router
export function MpConnectButton(props: MpConnectButtonProps) {
  return (
    <Suspense fallback={<MpConnectButtonSkeleton />}>
      <MpConnectButtonInner {...props} />
    </Suspense>
  );
}

function MpConnectButtonSkeleton() {
  return (
    <div
      style={{
        marginTop: "32px",
        border: "1px solid #242436",
        borderRadius: "12px",
        padding: "20px 24px",
        opacity: 0.5,
        minHeight: "120px",
      }}
    />
  );
}
