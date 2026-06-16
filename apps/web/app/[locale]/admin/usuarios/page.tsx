import { Link } from "@/i18n/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("usuarios.metaTitle") };
}

interface UserRow {
  id: string;
  role: string;
  country: string;
  created_at: string;
  subscriptions: {
    plan: string;
    status: string;
  }[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const roleColors: Record<string, string> = {
  student: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  coach: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  owner: "bg-[#C8FF00]/10 text-lime border border-[#C8FF00]/20",
  promoter: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
};

const planColors: Record<string, string> = {
  free: "text-muted",
  pro: "text-[#C8FF00]",
  elite: "text-purple-400",
};

export default async function AdminUsuariosPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  const { adminClient } = await requireAdmin();
  const sp = await searchParams;
  const search = sp.q?.trim() ?? "";

  let query = adminClient
    .from("users")
    .select(
      `
      id,
      role,
      country,
      created_at,
      subscriptions(plan, status)
    `
    )
    .order("created_at", { ascending: false })
    .limit(100);

  // Note: users table only has id, role, country — email is in auth.users.
  // We filter by id prefix when a search is provided.
  if (search) {
    query = query.ilike("id", `${search}%`);
  }

  const { data: users, error } = await query;

  if (error) {
    console.error("Error fetching users:", error);
  }

  const rows = (users ?? []) as unknown as UserRow[];

  const roleLabel: Record<string, string> = {
    student: t("dashboard.roleStudent"),
    coach: t("dashboard.roleCoach"),
    owner: t("dashboard.roleOwner"),
    promoter: t("dashboard.rolePromoter"),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">{t("usuarios.title")}</h1>
        <p className="text-muted text-sm mt-1">
          {t("usuarios.subtitle", { count: rows.length })}
        </p>
      </div>

      {/* Search */}
      <form method="GET" className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder={t("usuarios.searchPlaceholder")}
            className="flex-1 max-w-sm bg-surface border border-border rounded-lg px-4 py-2.5 text-text text-sm placeholder-[var(--color-muted)] focus:outline-none focus:border-[#C8FF00]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#C8FF00] text-[#0A0A0A] text-sm font-semibold rounded-lg hover:bg-[#AADD00] transition-colors"
          >
            {t("usuarios.btnSearch")}
          </button>
          {search && (
            <Link
              href="/admin/usuarios"
              className="px-4 py-2.5 bg-surface-2 text-muted text-sm rounded-lg hover:text-text transition-colors"
            >
              {t("usuarios.linkClear")}
            </Link>
          )}
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-muted text-lg">{t("usuarios.emptyState")}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-xs uppercase tracking-wider border-b border-surface-2">
                <th className="text-left px-6 py-3">{t("usuarios.colId")}</th>
                <th className="text-left px-6 py-3 hidden sm:table-cell">{t("usuarios.colCountry")}</th>
                <th className="text-left px-6 py-3">{t("usuarios.colRole")}</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">{t("usuarios.colPlan")}</th>
                <th className="text-left px-6 py-3 hidden lg:table-cell">{t("usuarios.colDate")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-2">
              {rows.map((u) => {
                const activeSub = u.subscriptions?.find(
                  (s) => s.status === "active"
                );
                return (
                  <tr key={u.id} className="hover:bg-surface-2 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-muted text-xs">
                        {`${u.id.slice(0, 8)}…`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted hidden sm:table-cell">
                      {u.country}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role] ?? "bg-surface-2 text-muted border border-border"}`}
                      >
                        {roleLabel[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {activeSub ? (
                        <span
                          className={`text-sm font-semibold capitalize ${planColors[activeSub.plan] ?? "text-muted"}`}
                        >
                          {activeSub.plan}
                        </span>
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted text-xs hidden lg:table-cell">
                      {formatDate(u.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
