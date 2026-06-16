import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagos — Forzza Admin",
};

type PaymentStatus = "pending" | "approved" | "rejected" | "refunded" | "in_process";

interface PaymentRow {
  id: string;
  user_id: string;
  coach_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gateway: string;
  created_at: string;
}

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCents(cents: number, currency = "ARS"): string {
  return `${currency} ${(cents / 100).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const statusLabel: Record<PaymentStatus, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
  refunded: "Reembolsado",
  in_process: "En proceso",
};

const statusColors: Record<PaymentStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  approved: "bg-green-500/10 text-green-400 border border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  refunded: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  in_process: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
};

const ALL_STATUSES: PaymentStatus[] = [
  "pending",
  "approved",
  "rejected",
  "refunded",
  "in_process",
];

export default async function AdminPagosPage({ searchParams }: PageProps) {
  const { adminClient } = await requireAdmin();
  const params = await searchParams;
  const filterStatus = params.status as PaymentStatus | undefined;

  let query = adminClient
    .from("payments")
    .select(
      "id, user_id, coach_id, amount, currency, status, gateway, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (filterStatus && ALL_STATUSES.includes(filterStatus)) {
    query = query.eq("status", filterStatus);
  }

  const { data: payments, error } = await query;

  if (error) {
    console.error("Error fetching payments:", error);
  }

  const rows = (payments ?? []) as PaymentRow[];

  // Calculate totals
  const approvedRows = rows.filter((p) => p.status === "approved");
  const totalApproved = approvedRows.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  // Monthly start
  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString();
  const monthApproved = approvedRows
    .filter((p) => p.created_at >= monthStart)
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Pagos</h1>
        <p className="text-muted text-sm mt-1">
          Historial de transacciones de la plataforma
        </p>
      </div>

      {/* Summary cards — 3 col always; en mobile texto compacto */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        <div className="rounded-xl border border-border bg-surface p-3 sm:p-5">
          <p className="text-muted text-[10px] sm:text-xs uppercase tracking-wider mb-1 sm:mb-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-start">
            Revenue total
          </p>
          <p className="text-lime text-base sm:text-2xl font-bold font-mono">
            {formatCents(totalApproved)}
          </p>
          <p className="text-muted text-[10px] sm:text-xs mt-1 hidden sm:block">pagos aprobados</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3 sm:p-5">
          <p className="text-muted text-[10px] sm:text-xs uppercase tracking-wider mb-1 sm:mb-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-start">
            Este mes
          </p>
          <p className="text-text text-base sm:text-2xl font-bold font-mono">
            {formatCents(monthApproved)}
          </p>
          <p className="text-muted text-[10px] sm:text-xs mt-1 hidden sm:block">pagos aprobados</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3 sm:p-5">
          <p className="text-muted text-[10px] sm:text-xs uppercase tracking-wider mb-1 sm:mb-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-start">
            Transacciones
          </p>
          <p className="text-text text-base sm:text-2xl font-bold">{rows.length}</p>
          <p className="text-muted text-[10px] sm:text-xs mt-1 hidden sm:block">
            {filterStatus ? statusLabel[filterStatus] : "todos los estados"}
          </p>
        </div>
      </div>

      {/* Status filter — single row with horizontal scroll, scrollbar hidden */}
      <div className="overflow-x-auto scrollbar-none mb-6">
        <div className="flex flex-nowrap gap-2 min-w-max">
          <Link
            href="/admin/pagos"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              !filterStatus
                ? "bg-[#C8FF00] text-[#0A0A0A]"
                : "bg-surface border border-border text-muted hover:text-text"
            }`}
          >
            Todos
          </Link>
          {ALL_STATUSES.map((s) => (
            <Link
              key={s}
              href={`/admin/pagos?status=${s}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                filterStatus === s
                  ? "bg-[#C8FF00] text-[#0A0A0A]"
                  : "bg-surface border border-border text-muted hover:text-text"
              }`}
            >
              {statusLabel[s]}
            </Link>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-4xl mb-4">💳</p>
          <p className="text-text text-lg font-semibold">No hay pagos para mostrar.</p>
          <p className="text-muted text-sm mt-2">Las transacciones aparecerán acá una vez que se procesen.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-xs uppercase tracking-wider border-b border-surface-2">
                <th className="text-left px-6 py-3">ID</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">Pagador</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">Beneficiario</th>
                <th className="text-right px-6 py-3">Monto</th>
                <th className="text-left px-6 py-3">Estado</th>
                <th className="text-left px-6 py-3 hidden sm:table-cell">Proveedor</th>
                <th className="text-left px-6 py-3 hidden lg:table-cell">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-2">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-surface-2 transition-colors">
                  <td className="px-6 py-3 font-mono text-muted text-xs">
                    {p.id.slice(0, 8)}…
                  </td>
                  <td className="px-6 py-3 font-mono text-muted text-xs hidden md:table-cell">
                    {p.user_id.slice(0, 8)}…
                  </td>
                  <td className="px-6 py-3 font-mono text-muted text-xs hidden md:table-cell">
                    {p.coach_id.slice(0, 8)}…
                  </td>
                  <td className="px-6 py-3 text-right font-semibold text-text">
                    {formatCents(p.amount, p.currency)}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}
                    >
                      {statusLabel[p.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted text-xs capitalize hidden sm:table-cell">
                    {p.gateway}
                  </td>
                  <td className="px-6 py-3 text-muted text-xs hidden lg:table-cell">
                    {formatDate(p.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
