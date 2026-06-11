import { requireAdmin } from "@/lib/auth/admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Forzza Admin",
};

function formatCents(cents: number, symbol = "$"): string {
  return `${symbol} ${(cents / 100).toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

function MetricCard({ label, value, sub, accent }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-[#1E1E1E] bg-[#111111] p-5">
      <p className="text-[#555555] text-xs uppercase tracking-wider mb-3">{label}</p>
      <p
        className={`text-2xl font-bold ${accent ? "text-[#C8FF00]" : "text-[#FAFAFA]"}`}
      >
        {value}
      </p>
      {sub && <p className="text-[#444444] text-xs mt-1">{sub}</p>}
    </div>
  );
}

interface RecentUser {
  id: string;
  role: string;
  country: string;
  created_at: string;
}

export default async function AdminDashboardPage() {
  const { adminClient } = await requireAdmin();

  // Fetch metrics in parallel
  const [
    usersResult,
    approvedCoachesResult,
    pendingCoachesResult,
    paymentsMonthResult,
    recentUsersResult,
  ] = await Promise.all([
    adminClient.from("users").select("id", { count: "exact", head: true }),
    adminClient
      .from("coach_profiles")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
    adminClient
      .from("coach_profiles")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    adminClient
      .from("payments")
      .select("amount_cents")
      .eq("status", "approved")
      .gte(
        "created_at",
        new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      ),
    adminClient
      .from("users")
      .select("id, role, country, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const totalUsers = usersResult.count ?? 0;
  const approvedCoaches = approvedCoachesResult.count ?? 0;
  const pendingCoaches = pendingCoachesResult.count ?? 0;
  const monthPayments = paymentsMonthResult.data ?? [];
  const revenueMonth = monthPayments.reduce(
    (sum, p) => sum + (p.amount_cents ?? 0),
    0
  );
  const recentUsers = (recentUsersResult.data ?? []) as RecentUser[];

  const roleLabel: Record<string, string> = {
    student: "Alumno",
    coach: "Coach",
    owner: "Owner",
    promoter: "Promotor",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Dashboard</h1>
        <p className="text-[#555555] text-sm mt-1">
          Métricas generales de la plataforma
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Usuarios activos"
          value={totalUsers}
          sub="registrados totales"
        />
        <MetricCard
          label="Coaches aprobados"
          value={approvedCoaches}
          sub="en la plataforma"
          accent
        />
        <MetricCard
          label="Coaches pendientes"
          value={pendingCoaches}
          sub="esperando revisión"
        />
        <MetricCard
          label="Revenue del mes"
          value={formatCents(revenueMonth)}
          sub="pagos aprobados"
          accent
        />
      </div>

      {/* Recent signups */}
      <div className="rounded-xl border border-[#1E1E1E] bg-[#111111] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1E1E1E]">
          <h2 className="text-sm font-semibold text-[#FAFAFA]">
            Últimos registros
          </h2>
        </div>
        {recentUsers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#555555]">No hay usuarios registrados aún.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#555555] text-xs uppercase tracking-wider border-b border-[#1A1A1A]">
                <th className="text-left px-6 py-3">ID</th>
                <th className="text-left px-6 py-3 hidden sm:table-cell">País</th>
                <th className="text-left px-6 py-3">Rol</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#161616] transition-colors">
                  <td className="px-6 py-3 font-mono text-[#888888] text-xs">
                    {u.id.slice(0, 8)}…
                  </td>
                  <td className="px-6 py-3 text-[#AAAAAA] hidden sm:table-cell">
                    {u.country}
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#1A1A1A] text-[#AAAAAA] border border-[#2A2A2A]">
                      {roleLabel[u.role] ?? u.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[#555555] text-xs hidden md:table-cell">
                    {formatDate(u.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
