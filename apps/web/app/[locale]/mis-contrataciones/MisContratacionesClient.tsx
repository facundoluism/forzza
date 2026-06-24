"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AssignmentRow } from "./page";

const REVOCATION_WINDOW_DAYS = 10;

function formatPrice(cents: number, symbol: string): string {
  return `${symbol} ${(cents / 100).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function daysRemaining(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const elapsed = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(REVOCATION_WINDOW_DAYS - elapsed));
}

// ── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }): React.JSX.Element {
  const t = useTranslations("misContrataciones");

  const map: Record<string, { label: string; className: string }> = {
    active: {
      label: t("statusActive"),
      className: "bg-lime/10 text-lime border border-lime/20",
    },
    pending: {
      label: t("statusPending"),
      className: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    },
    completed: {
      label: t("statusCompleted"),
      className: "bg-surface-2 text-muted border border-surface-3",
    },
    canceled: {
      label: t("statusCanceled"),
      className: "bg-red-500/10 text-red-400 border border-red-500/20",
    },
    refunded: {
      label: t("statusRefunded"),
      className: "bg-surface-2 text-muted border border-surface-3",
    },
  };

  const badge = map[status] ?? {
    label: status,
    className: "bg-surface-2 text-muted border border-surface-3",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}

// ── Revocation modal ─────────────────────────────────────────────────────────
interface RevocationModalProps {
  assignment: AssignmentRow;
  onClose: () => void;
  onSuccess: (assignmentId: string) => void;
}

function RevocationModal({
  assignment,
  onClose,
  onSuccess,
}: RevocationModalProps): React.JSX.Element {
  const t = useTranslations("misContrataciones");
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleConfirm() {
    setState("loading");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/coach-assignments/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignment_id: assignment.id }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        refund_note?: string;
      };

      if (!res.ok || !data.ok) {
        setErrorMsg(data.error ?? t("revokeErrorGeneric"));
        setState("error");
        return;
      }

      setState("success");
      // Notificar al padre para actualizar la lista
      setTimeout(() => {
        onSuccess(assignment.id);
        onClose();
      }, 2000);
    } catch {
      setErrorMsg(t("revokeErrorNetwork"));
      setState("error");
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="revoke-modal-title"
    >
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 max-w-md w-full flex flex-col gap-5">
        {state === "success" ? (
          /* Estado success */
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-lime/10 border border-lime/20 flex items-center justify-center text-lime text-2xl">
              ✓
            </div>
            <h2 className="text-[#FAFAFA] font-bold text-lg">
              {t("revokeSuccessTitle")}
            </h2>
            <p className="text-[#6A6A6A] text-sm leading-relaxed">
              {t("revokeSuccessBody")}
            </p>
          </div>
        ) : (
          <>
            {/* Encabezado */}
            <div>
              <h2
                id="revoke-modal-title"
                className="text-[#FAFAFA] text-lg font-bold"
              >
                {t("revokeModalTitle")}
              </h2>
              <p className="text-[#6A6A6A] text-sm mt-1 leading-relaxed">
                {t("revokeModalBody", {
                  coachName: assignment.coach_name,
                  packageTitle: assignment.package_title,
                  price: formatPrice(
                    assignment.package_price,
                    assignment.currency_symbol
                  ),
                })}
              </p>
            </div>

            {/* Aviso legal */}
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3">
              <p className="text-yellow-300 text-xs leading-relaxed">
                {t("revokeModalLegalNote")}
              </p>
            </div>

            {/* Error */}
            {state === "error" && errorMsg && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
                <p className="text-red-400 text-sm">{errorMsg}</p>
              </div>
            )}

            {/* Acciones */}
            <div className="flex flex-col gap-2 sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => void handleConfirm()}
                disabled={state === "loading"}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl py-3 transition-colors"
              >
                {state === "loading" ? t("revokeConfirmLoading") : t("revokeConfirm")}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={state === "loading"}
                className="flex-1 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] disabled:opacity-60 text-[#FAFAFA] font-medium text-sm rounded-xl py-3 transition-colors"
              >
                {t("revokeCancel")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Assignment card ──────────────────────────────────────────────────────────
interface AssignmentCardProps {
  assignment: AssignmentRow;
  onRevoke: (a: AssignmentRow) => void;
}

function AssignmentCard({
  assignment,
  onRevoke,
}: AssignmentCardProps): React.JSX.Element {
  const t = useTranslations("misContrataciones");
  const remaining = daysRemaining(assignment.created_at);

  return (
    <article className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[#6A6A6A] text-xs uppercase tracking-wider mb-0.5">
            {t("labelCoach")}
          </p>
          <p className="text-[#FAFAFA] font-semibold">{assignment.coach_name}</p>
        </div>
        <StatusBadge status={assignment.status} />
      </div>

      {/* Paquete y precio */}
      <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-3">
        <div>
          <p className="text-[#6A6A6A] text-xs uppercase tracking-wider mb-0.5">
            {t("labelPackage")}
          </p>
          <p className="text-[#FAFAFA] text-sm">{assignment.package_title}</p>
        </div>
        <p className="text-[#C8FF00] font-black font-mono text-lg">
          {formatPrice(assignment.package_price, assignment.currency_symbol)}
        </p>
      </div>

      {/* Fecha */}
      <div className="flex items-center justify-between text-xs text-[#6A6A6A]">
        <span>
          {t("labelHiredOn")} {formatDate(assignment.created_at)}
        </span>
        {assignment.refunded_at && (
          <span>
            {t("labelRefundedOn")} {formatDate(assignment.refunded_at)}
          </span>
        )}
      </div>

      {/* Botón de arrepentimiento */}
      {assignment.eligible_for_revocation && (
        <div className="border-t border-[#2A2A2A] pt-3 flex flex-col gap-2">
          <p className="text-[#6A6A6A] text-xs">
            {t("revocationWindowLabel", { days: remaining })}
          </p>
          <button
            type="button"
            onClick={() => onRevoke(assignment)}
            className="w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium text-sm rounded-xl py-2.5 transition-colors"
          >
            {t("revokeBtn")}
          </button>
        </div>
      )}
    </article>
  );
}

// ── Main client component ────────────────────────────────────────────────────
interface Props {
  assignments: AssignmentRow[];
  errorMessage: string | null;
}

export function MisContratacionesClient({
  assignments: initialAssignments,
  errorMessage,
}: Props): React.JSX.Element {
  const t = useTranslations("misContrataciones");
  const [assignments, setAssignments] =
    useState<AssignmentRow[]>(initialAssignments);
  const [revoking, setRevoking] = useState<AssignmentRow | null>(null);

  function handleRevokeSuccess(assignmentId: string) {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              status: "canceled",
              eligible_for_revocation: false,
            }
          : a
      )
    );
  }

  return (
    <main className="bg-[#0A0A0A] min-h-screen text-[#FAFAFA] px-6 py-12">
      <div className="max-w-[640px] mx-auto flex flex-col gap-8">
        {/* Back link */}
        <Link
          href="/"
          className="text-[#6A6A6A] text-sm hover:text-[#FAFAFA] transition-colors"
        >
          {t("backToHome")}
        </Link>

        {/* Heading */}
        <div>
          <h1 className="text-[#FAFAFA] text-3xl font-black tracking-tight">
            {t("heading")}
          </h1>
          <p className="text-[#6A6A6A] text-sm mt-2">{t("subheading")}</p>
        </div>

        {/* Error de entorno */}
        {errorMessage && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-4">
            <p className="text-red-400 text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Estado vacío */}
        {!errorMessage && assignments.length === 0 && (
          <div className="rounded-2xl border border-[#2A2A2A] bg-[#111111] px-6 py-12 text-center">
            <p className="text-[#FAFAFA] font-semibold text-lg mb-2">
              {t("emptyTitle")}
            </p>
            <p className="text-[#6A6A6A] text-sm mb-6">{t("emptyBody")}</p>
            <Link
              href="/coaches"
              className="inline-flex items-center gap-2 bg-[#C8FF00] hover:bg-[#b8ef00] text-black font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              {t("emptyCtaCoaches")}
            </Link>
          </div>
        )}

        {/* Lista de contrataciones */}
        {!errorMessage && assignments.length > 0 && (
          <div className="flex flex-col gap-4">
            {assignments.map((a) => (
              <AssignmentCard
                key={a.id}
                assignment={a}
                onRevoke={(assignment) => setRevoking(assignment)}
              />
            ))}
          </div>
        )}

        {/* Nota legal sobre arrepentimiento */}
        {!errorMessage && assignments.length > 0 && (
          <p className="text-[#444444] text-xs text-center leading-relaxed">
            {t("legalNote")}
          </p>
        )}
      </div>

      {/* Modal de confirmación de revocación */}
      {revoking && (
        <RevocationModal
          assignment={revoking}
          onClose={() => setRevoking(null)}
          onSuccess={handleRevokeSuccess}
        />
      )}
    </main>
  );
}
