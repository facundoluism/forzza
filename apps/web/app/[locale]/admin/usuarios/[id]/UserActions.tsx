"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "student" | "coach" | "owner" | "promoter";

interface Props {
  userId: string;
  currentRole: UserRole;
  isDeactivated: boolean;
  canRestore: boolean; // false when deletion_queue.processed_at is not null
  // Translated strings (injected from server component to keep client bundle thin)
  t: {
    setRoleTitle: string;
    roleWarning: string;
    roleCoachNote: string;
    rolePlaceholder: string;
    roleStudent: string;
    roleCoach: string;
    rolePromoter: string;
    btnSetRole: string;
    deactivateTitle: string;
    deactivateWarning: string;
    btnDeactivate: string;
    deactivateConfirmMsg: string;
    restoreTitle: string;
    restoreNote: string;
    btnRestore: string;
    restoreConfirmMsg: string;
    errorGeneric: string;
    errorAlreadyAnonymized: string;
    successRole: string;
    successDeactivate: string;
    successRestore: string;
    ownerActionDisabled: string;
  };
}

export function UserActions({
  userId,
  currentRole,
  isDeactivated,
  canRestore,
  t,
}: Props) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isOwner = currentRole === "owner";

  async function callApi(body: Record<string, string>) {
    setError(null);
    setSuccess(null);
    setLoading(body.action ?? "");

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !json.ok) {
        setError(json.error ?? t.errorGeneric);
        return false;
      }
      return true;
    } catch {
      setError(t.errorGeneric);
      return false;
    } finally {
      setLoading(null);
    }
  }

  async function handleSetRole() {
    if (!selectedRole) return;
    const ok = await callApi({ action: "set_role", role: selectedRole });
    if (ok) {
      setSuccess(t.successRole);
      setSelectedRole("");
      router.refresh();
    }
  }

  async function handleDeactivate() {
    if (!window.confirm(t.deactivateConfirmMsg)) return;
    const ok = await callApi({ action: "deactivate" });
    if (ok) {
      setSuccess(t.successDeactivate);
      router.refresh();
    }
  }

  async function handleRestore() {
    if (!window.confirm(t.restoreConfirmMsg)) return;
    const ok = await callApi({ action: "restore" });
    if (ok) {
      setSuccess(t.successRestore);
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      {/* Feedback bar */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400 text-sm">
          {success}
        </div>
      )}

      {/*
        Change role:
        - Hidden entirely when user is already deactivated (only Restore is relevant).
        - Disabled with tooltip when target is owner (immutable from UI).
      */}
      {!isDeactivated && (
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
            {t.setRoleTitle}
          </h2>

          {isOwner ? (
            <p className="text-xs text-orange-400 mt-1">
              {t.ownerActionDisabled}
            </p>
          ) : (
            <>
              <p className="text-xs text-orange-400 mb-4">{t.roleWarning}</p>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-surface-2 border border-border rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-[#C8FF00]"
                  disabled={loading !== null}
                >
                  <option value="">{t.rolePlaceholder}</option>
                  {/* owner deliberately omitted */}
                  {currentRole !== "student" && (
                    <option value="student">{t.roleStudent}</option>
                  )}
                  {currentRole !== "coach" && (
                    <option value="coach">{t.roleCoach}</option>
                  )}
                  {currentRole !== "promoter" && (
                    <option value="promoter">{t.rolePromoter}</option>
                  )}
                </select>
                <button
                  onClick={() => void handleSetRole()}
                  disabled={!selectedRole || loading !== null}
                  className="px-4 py-2 bg-[#C8FF00] text-[#0A0A0A] text-sm font-semibold rounded-lg hover:bg-[#AADD00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === "set_role" ? "…" : t.btnSetRole}
                </button>
              </div>
              {currentRole === "coach" && (
                <p className="text-xs text-muted mt-3">{t.roleCoachNote}</p>
              )}
            </>
          )}
        </section>
      )}

      {/*
        Deactivate / Restore:
        - When deactivated: show only Restore (or the anonymized message).
        - When active + owner: show disabled deactivate with tooltip.
        - When active + non-owner: show full deactivate action.
      */}
      <section className="rounded-xl border border-border bg-surface p-6">
        {!isDeactivated ? (
          <>
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
              {t.deactivateTitle}
            </h2>

            {isOwner ? (
              <p className="text-xs text-orange-400 mt-1">
                {t.ownerActionDisabled}
              </p>
            ) : (
              <>
                <p className="text-xs text-orange-400 mb-4">
                  {t.deactivateWarning}
                </p>
                <button
                  onClick={() => void handleDeactivate()}
                  disabled={loading !== null}
                  className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 text-sm font-semibold rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === "deactivate" ? "…" : t.btnDeactivate}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
              {t.restoreTitle}
            </h2>
            {canRestore ? (
              <>
                <p className="text-xs text-muted mb-4">{t.restoreNote}</p>
                <button
                  onClick={() => void handleRestore()}
                  disabled={loading !== null}
                  className="px-4 py-2 bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/30 text-sm font-semibold rounded-lg hover:bg-[#C8FF00]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === "restore" ? "…" : t.btnRestore}
                </button>
              </>
            ) : (
              <p className="text-xs text-red-400 mt-2">
                {t.errorAlreadyAnonymized}
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
