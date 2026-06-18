import { requireAdmin } from "@/lib/auth/admin";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ErrorState, EmptyState } from "@forzza/ui/web";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("auditoria.metaTitle") };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PAGE_SIZE = 25;

export default async function AuditoriaPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });
  const sp = await searchParams;

  // Filters from URL
  const filterAction = typeof sp["action"] === "string" ? sp["action"] : "";
  const filterEntity = typeof sp["entity_type"] === "string" ? sp["entity_type"] : "";
  const filterFrom = typeof sp["from"] === "string" ? sp["from"] : "";
  const filterTo = typeof sp["to"] === "string" ? sp["to"] : "";
  const page = Math.max(0, Number(sp["page"] ?? "0"));

  const { adminClient } = await requireAdmin();

  // Count query (for pagination)
  let countQuery = adminClient
    .from("audit_log")
    .select("id", { count: "exact", head: true });
  if (filterAction) countQuery = countQuery.eq("action", filterAction);
  if (filterEntity) countQuery = countQuery.eq("entity_type", filterEntity);
  if (filterFrom) countQuery = countQuery.gte("created_at", `${filterFrom}T00:00:00Z`);
  if (filterTo) countQuery = countQuery.lte("created_at", `${filterTo}T23:59:59Z`);

  // Data query
  let dataQuery = adminClient
    .from("audit_log")
    .select("id, action, entity_type, entity_id, actor_id, created_at, payload")
    .order("created_at", { ascending: false })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
  if (filterAction) dataQuery = dataQuery.eq("action", filterAction);
  if (filterEntity) dataQuery = dataQuery.eq("entity_type", filterEntity);
  if (filterFrom) dataQuery = dataQuery.gte("created_at", `${filterFrom}T00:00:00Z`);
  if (filterTo) dataQuery = dataQuery.lte("created_at", `${filterTo}T23:59:59Z`);

  const [countResult, dataResult] = await Promise.all([countQuery, dataQuery]);

  if (dataResult.error) {
    console.error("Error fetching audit_log:", dataResult.error);
    return (
      <ErrorState
        title={t("auditoria.errorTitle")}
        description={t("auditoria.errorDesc")}
      />
    );
  }

  const rows = dataResult.data ?? [];
  const totalCount = countResult.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Build filter URLs
  function buildUrl(overrides: Record<string, string>) {
    const base: Record<string, string> = {};
    if (filterAction) base["action"] = filterAction;
    if (filterEntity) base["entity_type"] = filterEntity;
    if (filterFrom) base["from"] = filterFrom;
    if (filterTo) base["to"] = filterTo;
    base["page"] = String(page);
    const merged = { ...base, ...overrides };
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(merged).filter(([, v]) => v !== ""))
    );
    return `?${params.toString()}`;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">{t("auditoria.title")}</h1>
        <p className="text-muted text-sm mt-1">{t("auditoria.subtitle")}</p>
      </div>

      {/* Mobile guard */}
      <div className="block lg:hidden mb-6 rounded-xl border border-border bg-surface p-4">
        <p className="text-muted text-sm">{t("auditoria.mobileWarning")}</p>
      </div>

      {/* Filters */}
      <form method="GET" className="hidden lg:flex flex-wrap gap-3 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted uppercase tracking-wider font-semibold">
            {t("auditoria.filterAction")}
          </label>
          <input
            type="text"
            name="action"
            defaultValue={filterAction}
            placeholder={t("auditoria.filterActionPlaceholder")}
            className="bg-surface border border-border rounded-lg text-text text-sm px-3 py-1.5 focus:outline-none focus:border-lime placeholder:text-muted w-48"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted uppercase tracking-wider font-semibold">
            {t("auditoria.filterEntity")}
          </label>
          <input
            type="text"
            name="entity_type"
            defaultValue={filterEntity}
            placeholder={t("auditoria.filterEntityPlaceholder")}
            className="bg-surface border border-border rounded-lg text-text text-sm px-3 py-1.5 focus:outline-none focus:border-lime placeholder:text-muted w-48"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted uppercase tracking-wider font-semibold">
            {t("auditoria.filterFrom")}
          </label>
          <input
            type="date"
            name="from"
            defaultValue={filterFrom}
            className="bg-surface border border-border rounded-lg text-text text-sm px-3 py-1.5 focus:outline-none focus:border-lime w-40"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted uppercase tracking-wider font-semibold">
            {t("auditoria.filterTo")}
          </label>
          <input
            type="date"
            name="to"
            defaultValue={filterTo}
            className="bg-surface border border-border rounded-lg text-text text-sm px-3 py-1.5 focus:outline-none focus:border-lime w-40"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="bg-lime text-black font-bold text-sm px-4 py-1.5 rounded-lg hover:bg-[#AADD00] transition-colors"
          >
            {t("auditoria.btnFilter")}
          </button>
          <a
            href="?"
            className="text-muted text-sm hover:text-text transition-colors py-1.5"
          >
            {t("auditoria.btnClear")}
          </a>
        </div>
        {/* Carry page=0 on filter change */}
        <input type="hidden" name="page" value="0" />
      </form>

      {/* Table */}
      <div className="hidden lg:block">
        {rows.length === 0 ? (
          <EmptyState
            title={t("auditoria.emptyTitle")}
            description={t("auditoria.emptyDesc")}
          />
        ) : (
          <div className="rounded-xl border border-border bg-surface overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">{t("auditoria.colDate")}</th>
                  <th className="text-left px-5 py-3">{t("auditoria.colAction")}</th>
                  <th className="text-left px-5 py-3">{t("auditoria.colEntityType")}</th>
                  <th className="text-left px-5 py-3 hidden xl:table-cell">{t("auditoria.colEntityId")}</th>
                  <th className="text-left px-5 py-3 hidden xl:table-cell">{t("auditoria.colActor")}</th>
                  <th className="text-left px-5 py-3">{t("auditoria.colPayload")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-2">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-2 transition-colors">
                    <td className="px-5 py-3 text-muted text-xs whitespace-nowrap">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-surface-2 text-lime border border-lime/20 font-mono">
                        {row.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted text-xs">
                      {row.entity_type}
                    </td>
                    <td className="px-5 py-3 font-mono text-muted text-xs hidden xl:table-cell">
                      {row.entity_id ? `${row.entity_id.slice(0, 8)}…` : "—"}
                    </td>
                    <td className="px-5 py-3 font-mono text-muted text-xs hidden xl:table-cell">
                      {row.actor_id ? `${row.actor_id.slice(0, 8)}…` : "—"}
                    </td>
                    <td className="px-5 py-3 text-muted text-xs max-w-xs">
                      {row.payload ? (
                        <span className="font-mono truncate block max-w-[200px]" title={JSON.stringify(row.payload)}>
                          {JSON.stringify(row.payload).slice(0, 60)}…
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm text-muted">
            <span>
              {t("auditoria.paginationInfo", {
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
                  {t("auditoria.prevPage")}
                </a>
              )}
              {page < totalPages - 1 && (
                <a
                  href={buildUrl({ page: String(page + 1) })}
                  className="px-3 py-1 rounded-lg border border-border hover:bg-surface-2 transition-colors"
                >
                  {t("auditoria.nextPage")}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
