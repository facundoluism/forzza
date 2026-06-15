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
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Pagos</h1>
        <p className="text-[#555555] text-sm mt-1">
          Historial de transacciones de la plataforma
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-[#1E1E1E] bg-[#111111] p-5">
          <p className="text-[#555555] text-xs uppercase tracking-wider mb-2">
            Revenue total
          </p>
          <p className="text-[#C8FF00] text-2xl font-bold">
            {formatCents(totalApproved)}
          </p>
          <p className="text-[#9898C0] text-xs mt-1">pagos aprobados</p>
        </div>
        <div className="rounded-xl border border-[#1E1E1E] bg-[#111111] p-5">
          <p className="text-[#555555] text-xs uppercase tracking-wider mb-2">
            Este mes
          </p>
          <p className="text-[#FAFAFA] text-2xl font-bold">
            {formatCents(monthApproved)}
          </p>
          <p className="text-[#9898C0] text-xs mt-1">pagos aprobados</p>
        </div>
        <div className="rounded-xl border border-[#1E1E1E] bg-[#111111] p-5">
          <p className="text-[#555555] text-xs uppercase tracking-wider mb-2">
            Transacciones
          </p>
          <p className="text-[#FAFAFA] text-2xl font-bold">{rows.length}</p>
          <p className="text-[#9898C0] text-xs mt-1">
            {filterStatus ? statusLabel[filterStatus] : "todos los estados"}
          </p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href="/admin/pagos"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !filterStatus
              ? "bg-[#C8FF00] text-[#0A0A0A]"
              : "bg-[#111111] border border-[#1E1E1E] text-[#666666] hover:text-[#FAFAFA]"
          }`}
        >
          Todos
        </a>
        {ALL_STATUSES.map((s) => (
          <a
            key={s}
            href={`/admin/pagos?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === s
                ? "bg-[#C8FF00] text-[#0A0A0A]"
                : "bg-[#111111] border border-[#1E1E1E] text-[#666666] hover:text-[#FAFAFA]"
            }`}
          >
            {statusLabel[s]}
          </a>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-[#1E1E1E] bg-[#111111] p-12 text-center">
          <p className="text-4xl mb-4">💳</p>
          <p className="text-[#FAFAFA] text-lg font-semibold">No hay pagos para mostrar.</p>
          <p className="text-[#555555] text-sm mt-2">Las transacciones aparecerán acá una vez que se procesen.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-[#1E1E1E] bg-[#111111] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#555555] text-xs uppercase tracking-wider border-b border-[#1A1A1A]">
                <th className="text-left px-6 py-3">ID</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">Pagador</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">Beneficiario</th>
                <th className="text-right px-6 py-3">Monto</th>
                <th className="text-left px-6 py-3">Estado</th>
                <th className="text-left px-6 py-3 hidden sm:table-cell">Proveedor</th>
                <th className="text-left px-6 py-3 hidden lg:table-cell">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-[#161616] transition-colors">
                  <td className="px-6 py-3 font-mono text-[#9898C0] text-xs">
                    {p.id.slice(0, 8)}…
                  </td>
                  <td className="px-6 py-3 font-mono text-[#888888] text-xs hidden md:table-cell">
                    {p.user_id.slice(0, 8)}…
                  </td>
                  <td className="px-6 py-3 font-mono text-[#888888] text-xs hidden md:table-cell">
                    {p.coach_id.slice(0, 8)}…
                  </td>
                  <td className="px-6 py-3 text-right font-semibold text-[#FAFAFA]">
                    {formatCents(p.amount, p.currency)}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}
                    >
                      {statusLabel[p.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[#666666] text-xs capitalize hidden sm:table-cell">
                    {p.gateway}
                  </td>
                  <td className="px-6 py-3 text-[#9898C0] text-xs hidden lg:table-cell">
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
