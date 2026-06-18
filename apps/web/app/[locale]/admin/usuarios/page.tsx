import { requireAdmin } from "@/lib/auth/admin";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EmptyState, ErrorState } from "@forzza/ui/web";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

const PAGE_SIZE = 50;
// Maximum pages to fetch from auth.admin.listUsers to build the email map.
// 50 pages × 1000 users = up to 50 000 users — sufficient for V1.
const EMAIL_MAP_MAX_PAGES = 50;

type ValidRole = "student" | "coach" | "owner" | "promoter";
type ValidCountry = "AR" | "CL";
type ValidPlan = "free" | "pro" | "elite";

function sp(raw: string | string[] | undefined): string {
  return typeof raw === "string" ? raw.trim() : "";
}

export default async function AdminUsuariosPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  const { adminClient } = await requireAdmin();
  const rawSp = await searchParams;

  // ── URL params ──────────────────────────────────────────────────────────────
  const search = sp(rawSp["q"]);
  const filterRole = sp(rawSp["role"]) as ValidRole | "";
  const filterCountry = sp(rawSp["country"]) as ValidCountry | "";
  const filterPlan = sp(rawSp["plan"]) as ValidPlan | "";
  const page = Math.max(0, Number(rawSp["page"] ?? "0"));

  const validRoles: ValidRole[] = ["student", "coach", "owner", "promoter"];
  const validCountries: ValidCountry[] = ["AR", "CL"];
  const validPlans: ValidPlan[] = ["free", "pro", "elite"];

  const role = validRoles.includes(filterRole as ValidRole) ? filterRole : "";
  const country = validCountries.includes(filterCountry as ValidCountry) ? filterCountry : "";
  const plan = validPlans.includes(filterPlan as ValidPlan) ? filterPlan : "";

  // ── Build email map from auth.admin.listUsers ────────────────────────────────
  // Email is PII: stored only in this map (server memory), shown in UI, NEVER logged.
  const emailMap = new Map<string, string>();
  let emailFetchOk = true;

  // Type the admin auth interface we need — cast once through unknown.
  type AuthWithAdmin = {
    admin: {
      listUsers(opts: { page: number; perPage: number }): Promise<{
        data: { users: { id: string; email?: string }[] } | null;
        error: unknown;
      }>;
    };
  };

  try {
    const authAdmin = (adminClient.auth as unknown as AuthWithAdmin).admin;
    if (!authAdmin || typeof authAdmin.listUsers !== "function") {
      // Mock client in dev mode: no-op, emailMap stays empty
      emailFetchOk = false;
    } else {
      for (let pg = 1; pg <= EMAIL_MAP_MAX_PAGES; pg++) {
        const { data, error } = await authAdmin.listUsers({ page: pg, perPage: 1000 });
        if (error || !data) { emailFetchOk = false; break; }
        const users = data.users;
        for (const u of users) {
          if (u.email) emailMap.set(u.id, u.email);
        }
        // If fewer than 1000 results, we've read all pages
        if (users.length < 1000) break;
      }
    }
  } catch {
    // Non-fatal: email column will show "—" for all rows
    emailFetchOk = false;
  }

  // ── Resolve IDs matching search term by email ────────────────────────────────
  // search matches: email substring (case-insensitive) OR id prefix
  const emailMatchedIds: string[] = [];
  if (search && emailMap.size > 0) {
    const lc = search.toLowerCase();
    for (const [id, email] of emailMap.entries()) {
      if (email.toLowerCase().includes(lc)) emailMatchedIds.push(id);
    }
  }

  // ── Count query (mirrors data query filters, no range) ────────────────────────
  let countQuery = adminClient
    .from("users")
    .select("id", { count: "exact", head: true });

  if (role) countQuery = countQuery.eq("role", role);
  if (country) countQuery = countQuery.eq("country", country);
  if (search) {
    if (emailMatchedIds.length > 0) {
      // OR: id prefix match OR email match
      // Supabase doesn't support OR across .in and .ilike in one call cleanly,
      // so we use .or() with a filter string.
      countQuery = countQuery.or(
        `id.ilike.${search}%,id.in.(${emailMatchedIds.join(",")})`
      );
    } else {
      countQuery = countQuery.ilike("id", `${search}%`);
    }
  }

  // ── Data query ────────────────────────────────────────────────────────────────
  let dataQuery = adminClient
    .from("users")
    .select("id, role, country, created_at, subscriptions(plan, status)")
    .order("created_at", { ascending: false })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

  if (role) dataQuery = dataQuery.eq("role", role);
  if (country) dataQuery = dataQuery.eq("country", country);
  if (search) {
    if (emailMatchedIds.length > 0) {
      dataQuery = dataQuery.or(
        `id.ilike.${search}%,id.in.(${emailMatchedIds.join(",")})`
      );
    } else {
      dataQuery = dataQuery.ilike("id", `${search}%`);
    }
  }

  const [countResult, dataResult] = await Promise.all([countQuery, dataQuery]);

  if (dataResult.error) {
    return (
      <ErrorState
        title={t("usuarios.errorTitle")}
        description={t("usuarios.errorDesc")}
      />
    );
  }

  let rows = (dataResult.data ?? []) as unknown as UserRow[];
  const totalCount = countResult.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // ── Plan filter (in-memory, applied after DB fetch) ───────────────────────────
  // NOTE: Filtering by subscription plan in the DB would require a subquery or
  // a join with a WHERE on subscriptions, which Supabase JS client doesn't
  // support natively (only nested selects, not nested filters). We apply it
  // in-memory on the current page. This means the total count and pagination
  // boundaries are calculated before plan filter; pages may appear to have
  // fewer than PAGE_SIZE rows when a plan filter is active. Acceptable for V1.
  if (plan) {
    rows = rows.filter((u) =>
      u.subscriptions?.some((s) => s.status === "active" && s.plan === plan)
    );
  }

  // ── Labels ────────────────────────────────────────────────────────────────────
  const roleLabel: Record<string, string> = {
    student: t("dashboard.roleStudent"),
    coach: t("dashboard.roleCoach"),
    owner: t("dashboard.roleOwner"),
    promoter: t("dashboard.rolePromoter"),
  };

  // ── buildUrl helper ───────────────────────────────────────────────────────────
  function buildUrl(overrides: Record<string, string>) {
    const base: Record<string, string> = {};
    if (search) base["q"] = search;
    if (role) base["role"] = role;
    if (country) base["country"] = country;
    if (plan) base["plan"] = plan;
    base["page"] = String(page);
    const merged = { ...base, ...overrides };
    const urlParams = new URLSearchParams(
      Object.fromEntries(Object.entries(merged).filter(([, v]) => v !== ""))
    );
    const qs = urlParams.toString();
    return qs ? `?${qs}` : "?";
  }

  const hasFilters = Boolean(search || role || country || plan);

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">{t("usuarios.title")}</h1>
        <p className="text-muted text-sm mt-1">
          {t("usuarios.subtitle", { count: totalCount })}
        </p>
      </div>

      {/* Mobile guard — matches auditoria/coaches pattern */}
      <div className="block md:hidden mb-6 rounded-xl border border-border bg-surface p-4">
        <p className="text-muted text-sm">{t("usuarios.mobileWarning")}</p>
      </div>

      {/* Filters + search */}
      <form method="GET" className="mb-6 flex flex-wrap gap-3">
        {/* Search: email or id */}
        <input
          type="text"
          name="q"
          defaultValue={search}
          placeholder={t("usuarios.searchPlaceholder")}
          className="flex-1 min-w-[180px] max-w-sm bg-surface border border-border rounded-lg px-4 py-2.5 text-text text-sm placeholder-[var(--color-muted)] focus:outline-none focus:border-[#C8FF00]"
        />

        {/* Role filter */}
        <select
          name="role"
          defaultValue={role}
          className="bg-surface border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-[#C8FF00]"
        >
          <option value="">{t("usuarios.filterRoleAll")}</option>
          <option value="student">{t("dashboard.roleStudent")}</option>
          <option value="coach">{t("dashboard.roleCoach")}</option>
          <option value="owner">{t("dashboard.roleOwner")}</option>
          <option value="promoter">{t("dashboard.rolePromoter")}</option>
        </select>

        {/* Country filter */}
        <select
          name="country"
          defaultValue={country}
          className="bg-surface border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-[#C8FF00]"
        >
          <option value="">{t("usuarios.filterCountryAll")}</option>
          <option value="AR">{t("usuarios.filterCountryAR")}</option>
          <option value="CL">{t("usuarios.filterCountryCL")}</option>
        </select>

        {/* Plan filter */}
        <select
          name="plan"
          defaultValue={plan}
          className="bg-surface border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-[#C8FF00]"
        >
          <option value="">{t("usuarios.filterPlanAll")}</option>
          <option value="free">{t("usuarios.filterPlanFree")}</option>
          <option value="pro">{t("usuarios.filterPlanPro")}</option>
          <option value="elite">{t("usuarios.filterPlanElite")}</option>
        </select>

        {/* Hidden page reset on filter submit */}
        <input type="hidden" name="page" value="0" />

        <button
          type="submit"
          className="px-4 py-2.5 bg-[#C8FF00] text-[#0A0A0A] text-sm font-semibold rounded-lg hover:bg-[#AADD00] transition-colors"
        >
          {t("usuarios.btnSearch")}
        </button>

        {hasFilters && (
          <a
            href="?"
            className="px-4 py-2.5 bg-surface-2 text-muted text-sm rounded-lg hover:text-text transition-colors"
          >
            {t("usuarios.linkClear")}
          </a>
        )}
      </form>

      {!emailFetchOk && (
        <p className="text-xs text-orange-400 mb-4">{t("usuarios.emailUnavailable")}</p>
      )}

      {rows.length === 0 ? (
        <EmptyState
          title={t("usuarios.emptyTitle")}
          description={t("usuarios.emptyDesc")}
        />
      ) : (
        <>
          {/* Mobile: card layout (<md) */}
          <div className="md:hidden space-y-3">
            {rows.map((u) => {
              const activeSub = u.subscriptions?.find((s) => s.status === "active");
              const email = emailMap.get(u.id);
              return (
                <div key={u.id} className="rounded-xl border border-border bg-surface p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {email ? (
                        <p className="text-text text-sm font-medium truncate">{email}</p>
                      ) : (
                        <p className="text-muted text-sm">—</p>
                      )}
                      <p className="text-muted font-mono text-xs">{u.id.slice(0, 8)}…</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${roleColors[u.role] ?? "bg-surface-2 text-muted border border-border"}`}
                    >
                      {roleLabel[u.role] ?? u.role}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span>{u.country}</span>
                    {activeSub && (
                      <span className={`font-semibold capitalize ${planColors[activeSub.plan] ?? "text-muted"}`}>
                        {activeSub.plan}
                      </span>
                    )}
                    <span>{formatDate(u.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: table layout (>=md) */}
          <div className="hidden md:block rounded-xl border border-border bg-surface overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted text-xs uppercase tracking-wider border-b border-surface-2">
                  <th className="text-left px-6 py-3">{t("usuarios.colEmail")}</th>
                  <th className="text-left px-6 py-3">{t("usuarios.colId")}</th>
                  <th className="text-left px-6 py-3">{t("usuarios.colCountry")}</th>
                  <th className="text-left px-6 py-3">{t("usuarios.colRole")}</th>
                  <th className="text-left px-6 py-3">{t("usuarios.colPlan")}</th>
                  <th className="text-left px-6 py-3">{t("usuarios.colDate")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-2">
                {rows.map((u) => {
                  const activeSub = u.subscriptions?.find((s) => s.status === "active");
                  const email = emailMap.get(u.id);
                  return (
                    <tr key={u.id} className="hover:bg-surface-2 transition-colors">
                      {/* Email — PII, shown in UI only, never logged */}
                      <td className="px-6 py-4">
                        {email ? (
                          <span className="text-text text-sm">{email}</span>
                        ) : (
                          <span className="text-muted text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-muted text-xs" title={u.id}>
                          {u.id.slice(0, 8)}…
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted text-sm">{u.country}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role] ?? "bg-surface-2 text-muted border border-border"}`}
                        >
                          {roleLabel[u.role] ?? u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4 text-muted text-xs whitespace-nowrap">
                        {formatDate(u.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-muted">
              <span>
                {t("usuarios.paginationInfo", {
                  page: page + 1,
                  total: totalPages,
                  count: totalCount,
                })}
              </span>
              <div className="flex gap-2">
                {page > 0 && (
                  <a
                    href={buildUrl({ page: String(page - 1) })}
                    className="px-3 py-1 rounded-lg border border-border hover:bg-surface-2 transition-colors"
                  >
                    {t("usuarios.prevPage")}
                  </a>
                )}
                {page < totalPages - 1 && (
                  <a
                    href={buildUrl({ page: String(page + 1) })}
                    className="px-3 py-1 rounded-lg border border-border hover:bg-surface-2 transition-colors"
                  >
                    {t("usuarios.nextPage")}
                  </a>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
