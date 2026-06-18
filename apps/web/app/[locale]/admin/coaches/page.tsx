import { requireAdmin } from "@/lib/auth/admin";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EmptyState, ErrorState } from "@forzza/ui/web";
import { ApproveRejectButtons } from "./ApproveRejectButtons";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("coaches.metaTitle") };
}

type CoachStatus = "pending" | "approved" | "rejected" | "suspended";

interface CoachRow {
  id: string;
  user_id: string;
  display_name: string;
  status: CoachStatus;
  country: string;
  constancia_path: string | null;
  created_at: string;
  billing_model: string;
}

interface CoachRowWithSignedUrl extends CoachRow {
  constanciaSignedUrl: string | null;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusColors: Record<CoachStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  approved: "bg-green-500/10 text-green-400 border border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  suspended: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
};

const PAGE_SIZE = 50;

export default async function AdminCoachesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  const { adminClient } = await requireAdmin();
  const sp = await searchParams;

  const tab = (typeof sp["tab"] === "string" ? sp["tab"] : "pending") as CoachStatus;
  const search = typeof sp["q"] === "string" ? sp["q"].trim() : "";
  const countryRaw = typeof sp["country"] === "string" ? sp["country"] : "";
  const country = (countryRaw === "AR" || countryRaw === "CL") ? countryRaw : "";
  const page = Math.max(0, Number(sp["page"] ?? "0"));

  // Build count query
  let countQuery = adminClient
    .from("coach_profiles")
    .select("id", { count: "exact", head: true })
    .eq("status", tab);
  if (search) countQuery = countQuery.ilike("display_name", `%${search}%`);
  if (country) countQuery = countQuery.eq("country", country as "AR" | "CL");

  // Build data query
  let dataQuery = adminClient
    .from("coach_profiles")
    .select("id, user_id, display_name, status, country, constancia_path, created_at, billing_model")
    .eq("status", tab)
    .order("created_at", { ascending: false })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
  if (search) dataQuery = dataQuery.ilike("display_name", `%${search}%`);
  if (country) dataQuery = dataQuery.eq("country", country as "AR" | "CL");

  const [countResult, dataResult] = await Promise.all([countQuery, dataQuery]);

  if (dataResult.error) {
    return (
      <ErrorState
        title={t("coaches.errorTitle")}
        description={t("coaches.errorDesc")}
      />
    );
  }

  const rawRows = (dataResult.data ?? []) as CoachRow[];
  const totalCount = countResult.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Generate signed URLs server-side, TTL 1h. Never logged.
  const rows: CoachRowWithSignedUrl[] = await Promise.all(
    rawRows.map(async (coach) => {
      if (!coach.constancia_path) return { ...coach, constanciaSignedUrl: null };
      const { data: signedData } = await adminClient.storage
        .from("fiscal-docs")
        .createSignedUrl(coach.constancia_path, 3600);
      return { ...coach, constanciaSignedUrl: signedData?.signedUrl ?? null };
    })
  );

  const statusLabel: Record<CoachStatus, string> = {
    pending: t("coaches.statusPending"),
    approved: t("coaches.statusApproved"),
    rejected: t("coaches.statusRejected"),
    suspended: t("coaches.statusSuspended"),
  };

  const tabs: { key: CoachStatus; label: string }[] = [
    { key: "pending", label: t("coaches.tabPending") },
    { key: "approved", label: t("coaches.tabApproved") },
    { key: "rejected", label: t("coaches.tabRejected") },
    { key: "suspended", label: t("coaches.tabSuspended") },
  ];

  function buildUrl(overrides: Record<string, string>) {
    const base: Record<string, string> = { tab };
    if (search) base["q"] = search;
    if (country) base["country"] = country;
    base["page"] = String(page);
    const merged = { ...base, ...overrides };
    const urlParams = new URLSearchParams(
      Object.fromEntries(Object.entries(merged).filter(([, v]) => v !== ""))
    );
    return `?${urlParams.toString()}`;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">{t("coaches.title")}</h1>
        <p className="text-muted text-sm mt-1">{t("coaches.subtitle")}</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 mb-6 bg-surface border border-border rounded-xl p-1">
        {tabs.map((tabItem) => (
          <a
            key={tabItem.key}
            href={buildUrl({ tab: tabItem.key, page: "0" })}
            className={`px-2 sm:px-4 py-2 rounded-lg text-[11px] sm:text-sm font-medium transition-colors text-center truncate ${
              tab === tabItem.key
                ? "bg-[#C8FF00] text-[#0A0A0A]"
                : "text-muted hover:text-text"
            }`}
          >
            {tabItem.label}
          </a>
        ))}
      </div>

      {/* Search + Country filter */}
      <form method="GET" className="mb-6 flex flex-wrap gap-3">
        <input type="hidden" name="tab" value={tab} />
        <input type="hidden" name="page" value="0" />

        <input
          type="text"
          name="q"
          defaultValue={search}
          placeholder={t("coaches.searchPlaceholder")}
          className="flex-1 min-w-[160px] max-w-sm bg-surface border border-border rounded-lg px-4 py-2.5 text-text text-sm placeholder-[var(--color-muted)] focus:outline-none focus:border-[#C8FF00]"
        />

        <select
          name="country"
          defaultValue={country}
          className="bg-surface border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-[#C8FF00]"
        >
          <option value="">{t("coaches.filterCountryAll")}</option>
          <option value="AR">{t("coaches.filterCountryAR")}</option>
          <option value="CL">{t("coaches.filterCountryCL")}</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2.5 bg-[#C8FF00] text-[#0A0A0A] text-sm font-semibold rounded-lg hover:bg-[#AADD00] transition-colors"
        >
          {t("coaches.btnSearch")}
        </button>

        {(search || country) && (
          <Link
            href={`/admin/coaches?tab=${tab}`}
            className="px-4 py-2.5 bg-surface-2 text-muted text-sm rounded-lg hover:text-text transition-colors"
          >
            {t("coaches.linkClear")}
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <EmptyState
          title={t("coaches.emptyState")}
          description={t("coaches.emptySubtitle")}
        />
      ) : (
        <>
          {/* Mobile: card layout */}
          <div className="md:hidden space-y-3">
            {rows.map((coach) => (
              <div key={coach.id} className="rounded-xl border border-border bg-surface p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/admin/coaches/${coach.id}`}
                      className="font-medium text-text text-sm hover:text-[#C8FF00] transition-colors"
                    >
                      {coach.display_name}
                    </Link>
                    <p className="text-muted font-mono text-xs">{coach.user_id.slice(0, 8)}…</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusColors[coach.status]}`}>
                    {statusLabel[coach.status]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                  <span>{coach.country}</span>
                  <span className="capitalize">{coach.billing_model}</span>
                  <span>{formatDate(coach.created_at)}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-surface-2">
                  {coach.constanciaSignedUrl ? (
                    <a
                      href={coach.constanciaSignedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C8FF00] hover:text-[#AADD00] text-xs transition-colors"
                    >
                      {t("coaches.viewDoc")}
                    </a>
                  ) : (
                    <span className="text-muted text-xs">{t("coaches.noDoc")}</span>
                  )}
                  <ApproveRejectButtons coachId={coach.id} currentStatus={coach.status} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table layout */}
          <div className="hidden md:block rounded-xl border border-border bg-surface overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted text-xs uppercase tracking-wider border-b border-surface-2">
                  <th className="text-left px-6 py-3">{t("coaches.colCoach")}</th>
                  <th className="text-left px-6 py-3">{t("coaches.colCountry")}</th>
                  <th className="text-left px-6 py-3 hidden lg:table-cell">{t("coaches.colModel")}</th>
                  <th className="text-left px-6 py-3">{t("coaches.colDate")}</th>
                  <th className="text-left px-6 py-3">{t("coaches.colStatus")}</th>
                  <th className="text-left px-6 py-3">{t("coaches.colDocs")}</th>
                  <th className="text-right px-6 py-3">{t("coaches.colAction")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-2">
                {rows.map((coach) => (
                  <tr key={coach.id} className="hover:bg-surface-2 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/coaches/${coach.id}`}
                        className="font-medium text-text hover:text-[#C8FF00] transition-colors"
                      >
                        {coach.display_name}
                      </Link>
                      <p className="text-muted font-mono text-xs">{coach.user_id.slice(0, 8)}…</p>
                    </td>
                    <td className="px-6 py-4 text-muted">{coach.country}</td>
                    <td className="px-6 py-4 text-muted capitalize hidden lg:table-cell">{coach.billing_model}</td>
                    <td className="px-6 py-4 text-muted text-xs">{formatDate(coach.created_at)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[coach.status]}`}>
                        {statusLabel[coach.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {coach.constanciaSignedUrl ? (
                        <a
                          href={coach.constanciaSignedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C8FF00] hover:text-[#AADD00] text-xs transition-colors"
                        >
                          {t("coaches.viewDoc")}
                        </a>
                      ) : (
                        <span className="text-muted text-xs">{t("coaches.noDoc")}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ApproveRejectButtons coachId={coach.id} currentStatus={coach.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-muted">
              <span>
                {t("coaches.paginationInfo", {
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
                    {t("coaches.prevPage")}
                  </a>
                )}
                {page < totalPages - 1 && (
                  <a
                    href={buildUrl({ page: String(page + 1) })}
                    className="px-3 py-1 rounded-lg border border-border hover:bg-surface-2 transition-colors"
                  >
                    {t("coaches.nextPage")}
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
