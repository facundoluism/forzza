import { requireAdmin } from "@/lib/auth/admin";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ErrorState, EmptyState } from "@forzza/ui/web";
import { notFound } from "next/navigation";
import { ApproveRejectButtons } from "../ApproveRejectButtons";
import type { Metadata } from "next";
import { cache } from "react";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

interface CoachProfile {
  id: string;
  user_id: string;
  display_name: string;
  status: string;
  country: string;
  billing_model: string;
  constancia_path: string | null;
  specialties: string[] | null;
  legal_entity_type: string | null;
  fiscal_id: string | null;
  bank_account: string | null;
  active_student_count: number;
  avg_rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

interface RatingRow {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  student_id: string;
}

interface FeedbackRow {
  id: string;
  feedback_text: string;
  created_at: string;
  student_id: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  approved: "bg-green-500/10 text-green-400 border border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  suspended: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
};

// requireAdmin y la carga del coach se memoizan por request (React cache):
// generateMetadata y la página comparten una sola validación owner y un solo
// query al service role, en vez de duplicarlos.
const getAdmin = cache(async () => requireAdmin());

const loadCoach = cache(async (id: string) => {
  const { adminClient } = await getAdmin();
  return adminClient
    .from("coach_profiles")
    .select(
      "id, user_id, display_name, status, country, billing_model, constancia_path, specialties, legal_entity_type, fiscal_id, bank_account, active_student_count, avg_rating, rating_count, created_at, updated_at"
    )
    .eq("id", id)
    .single();
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const { data } = await loadCoach(id);
  if (!data) return { title: t("coaches.metaTitle") };
  return { title: t("coaches.detail.metaTitle", { name: data.display_name }) };
}

export default async function AdminCoachDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  const { adminClient } = await getAdmin();

  // Reusa el query cacheado (mismo que generateMetadata): un solo hit al service role.
  const { data: profileData, error: profileError } = await loadCoach(id);

  if (profileError) {
    if (profileError.code === "PGRST116") {
      notFound();
    }
    return (
      <ErrorState
        title={t("coaches.detail.errorTitle")}
        description={t("coaches.detail.errorDesc")}
      />
    );
  }

  if (!profileData) {
    notFound();
  }

  const coach = profileData as CoachProfile;

  // Generate signed URL server-side, TTL 1h. Sensitive: never logged.
  let constanciaSignedUrl: string | null = null;
  if (coach.constancia_path) {
    const { data: signedData } = await adminClient.storage
      .from("fiscal-docs")
      .createSignedUrl(coach.constancia_path, 3600);
    constanciaSignedUrl = signedData?.signedUrl ?? null;
  }

  // Fetch ratings (defensive — empty table or RLS block is OK)
  const { data: ratingsData } = await adminClient
    .from("coach_ratings")
    .select("id, rating, comment, created_at, student_id")
    .eq("coach_id", id)
    .order("created_at", { ascending: false })
    .limit(5);

  const ratings = (ratingsData ?? []) as RatingRow[];

  // Fetch feedback (defensive)
  const { data: feedbackData } = await adminClient
    .from("coach_feedback")
    .select("id, feedback_text, created_at, student_id")
    .eq("coach_id", id)
    .order("created_at", { ascending: false })
    .limit(5);

  const feedbacks = (feedbackData ?? []) as FeedbackRow[];

  const statusLabel: Record<string, string> = {
    pending: t("coaches.statusPending"),
    approved: t("coaches.statusApproved"),
    rejected: t("coaches.statusRejected"),
    suspended: t("coaches.statusSuspended"),
  };

  const billingLabel: Record<string, string> = {
    fixed: t("coaches.detail.fieldBillingFixed"),
    comision: t("coaches.detail.fieldBillingComision"),
  };

  // Mobile guard (backoffice admin always shows warning <1024px)
  return (
    <div>
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/admin/coaches"
          className="text-muted hover:text-text text-sm transition-colors"
        >
          {t("coaches.detail.backToList")}
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">{coach.display_name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[coach.status] ?? "bg-surface-2 text-muted border border-border"}`}
            >
              {statusLabel[coach.status] ?? coach.status}
            </span>
            <span className="text-muted text-xs font-mono">{coach.user_id.slice(0, 8)}…</span>
          </div>
        </div>
        {/* Actions */}
        <div className="shrink-0">
          <ApproveRejectButtons coachId={coach.id} currentStatus={coach.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: profile + fiscal */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile card */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
              {t("coaches.detail.sectionProfile")}
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <dt className="text-xs text-muted mb-1">{t("coaches.detail.fieldCountry")}</dt>
                <dd className="text-text text-sm font-medium">{coach.country}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-1">{t("coaches.detail.fieldBillingModel")}</dt>
                <dd className="text-text text-sm font-medium">
                  {billingLabel[coach.billing_model] ?? coach.billing_model}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-1">{t("coaches.detail.fieldRegistered")}</dt>
                <dd className="text-text text-sm font-medium">{formatDate(coach.created_at)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-1">{t("coaches.detail.fieldActiveStudents")}</dt>
                <dd className="text-text text-sm font-medium">{coach.active_student_count}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-1">{t("coaches.detail.fieldUserId")}</dt>
                <dd className="text-muted font-mono text-xs">{coach.user_id}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-1">{t("coaches.detail.fieldSpecialties")}</dt>
                <dd>
                  {coach.specialties && coach.specialties.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {coach.specialties.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted text-xs">{t("coaches.detail.fieldNoSpecialties")}</span>
                  )}
                </dd>
              </div>
            </dl>
          </section>

          {/* Fiscal data card */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
              {t("coaches.detail.sectionFiscal")}
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <dt className="text-xs text-muted mb-1">{t("coaches.detail.fieldLegalEntity")}</dt>
                <dd className="text-text text-sm font-medium">
                  {coach.legal_entity_type ?? t("coaches.detail.fieldNoData")}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-1">{t("coaches.detail.fieldFiscalId")}</dt>
                <dd className="text-text text-sm font-medium font-mono">
                  {coach.fiscal_id ?? t("coaches.detail.fieldNoData")}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted mb-1">{t("coaches.detail.fieldBankAccount")}</dt>
                <dd className="text-text text-sm font-medium font-mono">
                  {coach.bank_account ?? t("coaches.detail.fieldNoData")}
                </dd>
              </div>
            </dl>
          </section>

          {/* Constancia fiscal */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
              {t("coaches.detail.sectionConstancia")}
            </h2>
            {constanciaSignedUrl ? (
              <div className="space-y-3">
                {/* PDF preview inline — URL generated server-side, TTL 1h, never in logs */}
                <object
                  data={constanciaSignedUrl}
                  type="application/pdf"
                  className="w-full rounded-lg border border-border bg-surface-2"
                  style={{ height: "480px" }}
                >
                  {/* Fallback for browsers that don't support inline PDF */}
                  <iframe
                    src={constanciaSignedUrl}
                    className="w-full rounded-lg border border-border bg-surface-2"
                    style={{ height: "480px" }}
                    title={t("coaches.detail.sectionConstancia")}
                  />
                </object>
                <a
                  href={constanciaSignedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#C8FF00] hover:text-[#AADD00] text-sm transition-colors"
                >
                  {t("coaches.detail.constanciaOpenTab")}
                </a>
              </div>
            ) : (
              <EmptyState
                title={t("coaches.detail.constanciaEmpty")}
                description={t("coaches.detail.constanciaEmptySub")}
              />
            )}
          </section>
        </div>

        {/* Right column: rating + feedback */}
        <div className="space-y-6">

          {/* Rating summary */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
              {t("coaches.detail.sectionRating")}
            </h2>
            {coach.rating_count > 0 ? (
              <div className="flex items-end gap-3 mb-6">
                <p className="text-4xl font-bold text-[#C8FF00]">
                  {coach.avg_rating.toFixed(1)}
                </p>
                <div>
                  <p className="text-xs text-muted">{t("coaches.detail.ratingAverage")}</p>
                  <p className="text-xs text-muted">
                    {t("coaches.detail.ratingCount", { count: coach.rating_count })}
                  </p>
                </div>
              </div>
            ) : (
              <EmptyState
                title={t("coaches.detail.ratingEmpty")}
                description={t("coaches.detail.ratingEmptySub")}
              />
            )}

            {/* Recent ratings */}
            {ratings.length > 0 && (
              <div className="space-y-3">
                {ratings.map((r) => (
                  <div key={r.id} className="border-t border-surface-2 pt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#C8FF00] text-sm font-bold">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                      <span className="text-muted text-xs">{formatDateTime(r.created_at)}</span>
                    </div>
                    {r.comment && (
                      <p className="text-text text-xs leading-relaxed">{r.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Feedback */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
              {t("coaches.detail.feedbackRecent")}
            </h2>
            {feedbacks.length > 0 ? (
              <div className="space-y-3">
                {feedbacks.map((f) => (
                  <div key={f.id} className="border-t border-surface-2 pt-3 first:border-t-0 first:pt-0">
                    <p className="text-text text-xs leading-relaxed">{f.feedback_text}</p>
                    <p className="text-muted text-xs mt-1">{formatDateTime(f.created_at)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title={t("coaches.detail.feedbackEmpty")}
                description=""
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
