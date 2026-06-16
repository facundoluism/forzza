"use client";

import { useState } from "react";
import { TRACKED_EVENTS } from "@forzza/core";
import { track } from "@/lib/analytics";

export function ActivateProButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleActivate() {
    track(TRACKED_EVENTS.UPGRADE_CTA_TAPPED);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mp-preapproval", { method: "POST" });
      if (res.status === 401) {
        window.location.href = "/login?redirect=/upgrade";
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
    <div className="flex flex-col gap-2">
      <button
        onClick={() => { void handleActivate(); }}
        disabled={loading}
        className={`block w-full text-center py-4 rounded-xl font-bold text-base tracking-wide border-none cursor-pointer transition-colors ${
          loading
            ? "bg-[#3A3A3A] text-[#6A6A6A] cursor-not-allowed"
            : "bg-[#C8FF00] text-black hover:bg-[#b8ef00]"
        }`}
      >
        {loading ? "Procesando..." : "Activar PRO"}
      </button>
      {error && (
        <p className="text-[#FF4466] text-[13px] m-0 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
