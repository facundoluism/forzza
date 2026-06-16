import { requireAdmin } from "@/lib/auth/admin";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("dashboard.metaTitle") };
}

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
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 flex flex-col">
      <p className="text-muted text-xs uppercase tracking-wider mb-3 min-h-[2.5rem] flex items-start leading-tight">{label}</p>
      <p
        className={`text-xl sm:text-2xl font-bold font-mono mt-auto ${accent ? "text-lime" : "text-text"}`}
      >
        {value}
      </p>
      {sub && <p className="text-muted text-xs mt-1">{sub}</p>}
    </div>
  );
}

interface RecentUser {
  id: string;
  role: string;
  country: string;
  created_at: string;
}

export default async function AdminDashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

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
      .select("amount")
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
    (sum, p) => sum + (p.amount ?? 0),
    0
  );
  const recentUsers = (recentUsersResult.data ?? []) as RecentUser[];

  const roleLabel: Record<string, string> = {
    student: t("dashboard.roleStudent"),
    coach: t("dashboard.roleCoach"),
    owner: t("dashboard.roleOwner"),
    promoter: t("dashboard.rolePromoter"),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">{t("dashboard.title")}</h1>
        <p className="text-muted text-sm mt-1">
          {t("dashboard.subtitle")}
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label={t("dashboard.activeUsers")}
          value={totalUsers}
          sub={t("dashboard.registeredTotal")}
        />
        <MetricCard
          label={t("dashboard.approvedCoaches")}
          value={approvedCoaches}
          sub={t("dashboard.onPlatform")}
          accent
        />
        <MetricCard
          label={t("dashboard.pendingCoaches")}
          value={pendingCoaches}
          sub={t("dashboard.awaitingReview")}
        />
        <MetricCard
          label={t("dashboard.monthRevenue")}
          value={formatCents(revenueMonth)}
          sub={t("dashboard.approvedPayments")}
          accent
        />
      </div>

      {/* Recent signups */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-text">
            {t("dashboard.latestRegistrations")}
          </h2>
        </div>
        {recentUsers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-3xl mb-3">👥</p>
            <p className="text-muted">{t("dashboard.noUsers")}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-xs uppercase tracking-wider border-b border-surface-2">
                <th className="text-left px-6 py-3">{t("dashboard.colId")}</th>
                <th className="text-left px-6 py-3 hidden sm:table-cell">{t("dashboard.colCountry")}</th>
                <th className="text-left px-6 py-3">{t("dashboard.colRole")}</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">{t("dashboard.colDate")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-2">
              {recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-surface-2 transition-colors">
                  <td className="px-6 py-3 font-mono text-muted text-xs">
                    {u.id.slice(0, 8)}…
                  </td>
                  <td className="px-6 py-3 text-muted hidden sm:table-cell">
                    {u.country}
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-surface-2 text-muted border border-border">
                      {roleLabel[u.role] ?? u.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted text-xs hidden md:table-cell">
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
