import { getTranslations } from "next-intl/server";
import { EmptyState, ErrorState } from "@forzza/ui/web";
import type { Database } from "@forzza/db-types";
import type { SupabaseClient } from "@supabase/supabase-js";

type RequestCountRow =
  Database["public"]["Views"]["exercise_video_request_counts"]["Row"];

const TOP_N = 50;

interface Props {
  adminClient: SupabaseClient<Database>;
  locale: string;
}

export async function VideoRequestRanking({ adminClient, locale }: Props) {
  const t = await getTranslations({ locale, namespace: "admin.videos" });

  const { data, error, count } = await adminClient
    .from("exercise_video_request_counts")
    .select("*", { count: "exact" })
    .eq("has_published_video", false)
    .order("request_count", { ascending: false })
    .limit(TOP_N);

  if (error) {
    return (
      <ErrorState
        title={t("rankingErrorTitle")}
        description={error.message}
      />
    );
  }

  const rows = (data ?? []) as RequestCountRow[];
  const totalWithoutVideo = count ?? rows.length;

  return (
    <section className="mt-10">
      {/* Section header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text">{t("rankingTitle")}</h2>
        <p className="text-muted text-sm mt-0.5">{t("rankingSubtitle")}</p>
      </div>

      {/* Mobile guard — consistent with the rest of the admin */}
      <div className="block lg:hidden rounded-xl border border-border bg-surface p-4">
        <p className="text-muted text-sm">{t("rankingSubtitle")}</p>
      </div>

      {/* Desktop content */}
      <div className="hidden lg:block">
        {rows.length === 0 ? (
          <EmptyState
            title={t("rankingEmpty")}
            description={t("rankingEmptyDesc")}
          />
        ) : (
          <>
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              <ul className="divide-y divide-surface-2">
                {rows.map((row, index) => (
                  <li
                    key={row.exercise_id ?? index}
                    className="flex items-center justify-between px-4 py-3 hover:bg-surface-2 transition-colors"
                  >
                    {/* Rank + name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs tabular-nums font-mono text-muted w-6 shrink-0 text-right">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-text truncate">
                        {row.exercise_name ?? "—"}
                      </span>
                    </div>

                    {/* Request count badge */}
                    <span className="ml-4 shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-lime-glow text-lime border border-lime/30 tabular-nums">
                      {t("rankingRequests", {
                        count: row.request_count ?? 0,
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Truncation notice */}
            {totalWithoutVideo > TOP_N && (
              <p className="mt-2 text-xs text-muted text-right">
                {t("rankingShowing", {
                  shown: TOP_N,
                  total: totalWithoutVideo,
                })}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
