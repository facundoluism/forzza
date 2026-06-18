import { requireAdmin } from "@/lib/auth/admin";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EmptyState, ErrorState } from "@forzza/ui/web";
import { Link } from "@/i18n/navigation";
import { VideoReviewActions } from "./VideoReviewActions";
import type { Metadata } from "next";
import type { Database } from "@forzza/db-types";

type VideoRow = Database["public"]["Tables"]["exercise_videos"]["Row"] & {
  exercise_library: { name: string; name_en: string | null } | null;
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("videos.metaTitle") };
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getExerciseName(video: VideoRow): string {
  if (video.lang === "en") {
    return (
      video.exercise_library?.name_en ??
      video.exercise_library?.name ??
      "—"
    );
  }
  return video.exercise_library?.name ?? "—";
}

export default async function VideosPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  const { status: rawStatus } = await searchParams;
  const activeStatus =
    rawStatus === "published" ? "published" : "needs_review";

  const { adminClient } = await requireAdmin();

  const { data, error } = await adminClient
    .from("exercise_videos")
    .select("*, exercise_library(name, name_en)")
    .eq("status", activeStatus)
    .order("exercise_id")
    .order("lang");

  if (error) {
    return (
      <ErrorState
        title={t("videos.errorTitle")}
        description={error.message}
      />
    );
  }

  const videos = (data ?? []) as VideoRow[];

  const needsReviewHref = "?status=needs_review";
  const publishedHref = "?status=published";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">{t("videos.title")}</h1>
        {activeStatus === "needs_review" && videos.length > 0 && (
          <p className="text-muted text-sm mt-1">
            {t("videos.pendingCount", { count: videos.length })}
          </p>
        )}
      </div>

      {/* Mobile guard */}
      <div className="block lg:hidden mb-6 rounded-xl border border-border bg-surface p-4">
        <p className="text-muted text-sm">{t("auditoria.mobileWarning")}</p>
      </div>

      {/* Tabs */}
      <div className="hidden lg:flex gap-1 mb-6 border-b border-border">
        <Link
          href={needsReviewHref}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeStatus === "needs_review"
              ? "border-[#C8FF00] text-[#C8FF00]"
              : "border-transparent text-muted hover:text-text"
          }`}
        >
          {t("videos.tabNeedsReview")}
        </Link>
        <Link
          href={publishedHref}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeStatus === "published"
              ? "border-[#C8FF00] text-[#C8FF00]"
              : "border-transparent text-muted hover:text-text"
          }`}
        >
          {t("videos.tabPublished")}
        </Link>
      </div>

      {/* Content */}
      <div className="hidden lg:block">
        {videos.length === 0 ? (
          <EmptyState
            title={
              activeStatus === "needs_review"
                ? t("videos.emptyNeedsReview")
                : t("videos.emptyPublished")
            }
          />
        ) : (
          <div className="rounded-xl border border-border bg-surface overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">{t("videos.exercise")}</th>
                  <th className="text-left px-4 py-3">{t("videos.language")}</th>
                  <th className="text-left px-4 py-3">{t("videos.videoTitle")}</th>
                  <th className="text-left px-4 py-3 hidden xl:table-cell">
                    {t("videos.channel")}
                  </th>
                  <th className="text-left px-4 py-3">{t("videos.duration")}</th>
                  <th className="text-right px-4 py-3">{t("videos.score")}</th>
                  <th className="text-left px-4 py-3">{t("videos.statusLabel")}</th>
                  <th className="text-left px-4 py-3">{t("videos.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-2">
                {videos.map((video) => (
                  <tr
                    key={video.id}
                    className="hover:bg-surface-2 transition-colors"
                  >
                    {/* Exercise name */}
                    <td className="px-4 py-3 font-medium text-text text-sm">
                      {getExerciseName(video)}
                    </td>

                    {/* Lang badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          video.lang === "es"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {video.lang === "es"
                          ? t("videos.langEs")
                          : t("videos.langEn")}
                      </span>
                    </td>

                    {/* Video title with thumbnail link */}
                    <td className="px-4 py-3 max-w-xs">
                      <a
                        href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-[#C8FF00] transition-colors group"
                      >
                        {/* Thumbnail */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://img.youtube.com/vi/${video.youtube_id}/default.jpg`}
                          alt={video.title}
                          width={80}
                          height={45}
                          className="rounded shrink-0 object-cover"
                        />
                        <span className="text-xs text-muted group-hover:text-[#C8FF00] line-clamp-2 transition-colors">
                          {video.title}
                        </span>
                      </a>
                    </td>

                    {/* Channel */}
                    <td className="px-4 py-3 text-muted text-xs hidden xl:table-cell">
                      {video.channel_title}
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-3 text-muted text-xs tabular-nums">
                      {formatDuration(video.duration_seconds)}
                    </td>

                    {/* Score */}
                    <td className="px-4 py-3 text-right tabular-nums font-mono text-xs text-text">
                      {video.score}
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3">
                      {video.status === "published" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          {t("videos.statusPublished")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                          {t("videos.statusNeedsReview")}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <VideoReviewActions
                        videoId={video.id}
                        currentStatus={video.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
