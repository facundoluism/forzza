"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  settlementId: string;
  status: string;
}

type Action = "approve" | "reject" | "transfer";

export function SettlementActionButtons({ settlementId, status }: Props) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<Action | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function runAction(action: Action, rejectionReason?: string) {
    setLoadingAction(action);
    setError(null);
    try {
      const res = await fetch(`/api/admin/settlements/${settlementId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, rejection_reason: rejectionReason }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "No se pudo actualizar la liquidacion.");
        return;
      }

      setShowReject(false);
      setReason("");
      router.refresh();
    } catch {
      setError("Error de red.");
    } finally {
      setLoadingAction(null);
    }
  }

  if (status === "pending" || status === "pending_invoice") {
    return <span className="text-muted text-xs">Esperando factura</span>;
  }

  if (status === "rejected") {
    return <span className="text-red-400 text-xs font-medium">Rechazada</span>;
  }

  if (status === "transferred") {
    return <span className="text-green-400 text-xs font-medium">Transferida</span>;
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {error && <p className="max-w-48 text-right text-red-400 text-xs">{error}</p>}

      {status === "invoiced" && (
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => void runAction("approve")}
            disabled={loadingAction !== null}
            className="rounded-lg bg-[#C8FF00] px-3 py-1.5 text-xs font-semibold text-[#0A0A0A] transition-colors hover:bg-[#AADD00] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingAction === "approve" ? "Aprobando..." : "Aprobar"}
          </button>
          <button
            type="button"
            onClick={() => setShowReject(true)}
            disabled={loadingAction !== null}
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Rechazar
          </button>
        </div>
      )}

      {status === "approved" && (
        <button
          type="button"
          onClick={() => void runAction("transfer")}
          disabled={loadingAction !== null}
          className="rounded-lg bg-[#C8FF00] px-3 py-1.5 text-xs font-semibold text-[#0A0A0A] transition-colors hover:bg-[#AADD00] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "transfer" ? "Marcando..." : "Marcar transferido"}
        </button>
      )}

      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl">
            <h3 className="mb-2 text-text font-semibold">Rechazar factura</h3>
            <p className="mb-4 text-muted text-sm">
              El motivo queda visible para operacion y registrado en auditoria.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: el monto no coincide con la liquidacion."
              rows={3}
              className="mb-4 w-full resize-none rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-muted focus:border-[#C8FF00] focus:outline-none"
            />
            {error && <p className="mb-3 text-red-400 text-xs">{error}</p>}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowReject(false);
                  setReason("");
                  setError(null);
                }}
                disabled={loadingAction !== null}
                className="rounded-lg border border-border px-4 py-2 text-muted text-sm transition-colors hover:text-text"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void runAction("reject", reason.trim())}
                disabled={loadingAction !== null || reason.trim().length === 0}
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-400 text-sm font-semibold transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingAction === "reject" ? "Rechazando..." : "Confirmar rechazo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
