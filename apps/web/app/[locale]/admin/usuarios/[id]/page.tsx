import { requireAdmin } from "@/lib/auth/admin";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ErrorState, EmptyState } from "@forzza/ui/web";
import { notFound } from "next/navigation";
import { UserActions } from "./UserActions";
import type { Metadata } from "next";
import { cache } from "react";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

// ── Cached helpers (one requireAdmin + one user query per request) ────────────
const getAdmin = cache(async () => requireAdmin());

const loadUser = cache(async (id: string) => {
  const { adminClient } = await getAdmin();
  return adminClient
    .from("users")
    .select("id, role, country, created_at, updated_at, deleted_at")
    .eq("id", id)
    .single();
});

// ── Types (typed from db-types but kept local to avoid re-export complexity) ─
interface UserRow {
  id: string;
  role: "student" | "coach" | "owner" | "promoter";
  country: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface StudentProfileRow {
  id: string;
  display_name: string | null;
  birth_date: string | null;
  parental_consent_at: string | null;
  goals: string[] | null;
  level: string | null;
  avatar_url: string | null;
}

interface CoachProfileRow {
  id: string;
  display_name: string;
  status: string;
}

interface SubscriptionRow {
  id: string;
  plan: string;
  status: string;
  platform: string;
  gateway: string;
  current_period_end: string | null;
  canceled_at: string | null;
}

interface CoachAssignmentRow {
  id: string;
  status: string;
  coach_id: string;
  coach_profiles: CoachProfileRow | null;
}

interface PaymentRow {
  id: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  created_at: string;
}

interface DeletionQueueRow {
  anonymize_at: string;
  processed_at: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
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

const roleColors: Record<string, string> = {
  student: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  coach: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  owner: "bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20",
  promoter: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
};

const subStatusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border border-green-500/20",
  trialing: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  past_due: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  canceled: "bg-surface-2 text-muted border border-border",
};

const paymentStatusColors: Record<string, string> = {
  approved: "bg-green-500/10 text-green-400 border border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  refunded: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  in_process: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
};

// ── Auth client type for getUserById (same cast pattern as usuarios/page.tsx) ─
type AuthWithAdmin = {
  admin: {
    getUserById(id: string): Promise<{
      data: { user: { id: string; email?: string } | null };
      error: unknown;
    }>;
  };
};

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const { data } = await loadUser(id);
  if (!data) return { title: t("usuarios.metaTitle") };
  return {
    title: t("usuarios.detail.metaTitle", { id: data.id.slice(0, 8) }),
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AdminUserDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  const { adminClient } = await getAdmin();

  const { data: userData, error: userError } = await loadUser(id);

  if (userError) {
    if (userError.code === "PGRST116") notFound();
    return (
      <ErrorState
        title={t("usuarios.detail.errorTitle")}
        description={t("usuarios.detail.errorDesc")}
      />
    );
  }
  if (!userData) notFound();

  const userRow = userData as UserRow;

  // ── Email (PII — server-side only, never logged) ──────────────────────────
  let userEmail: string | null = null;
  try {
    const authAdmin = (adminClient.auth as unknown as AuthWithAdmin).admin;
    if (typeof authAdmin?.getUserById === "function") {
      const { data: authData } = await authAdmin.getUserById(id);
      userEmail = authData?.user?.email ?? null;
    }
  } catch {
    // Non-fatal: dev mock may not support getUserById
    userEmail = null;
  }

  // ── Student profile (only if role=student) ────────────────────────────────
  let studentProfile: StudentProfileRow | null = null;
  if (userRow.role === "student") {
    const { data: sp } = await adminClient
      .from("student_profiles")
      .select(
        "id, display_name, birth_date, parental_consent_at, goals, level, avatar_url"
      )
      .eq("user_id", id)
      .maybeSingle();
    studentProfile = sp as StudentProfileRow | null;
  }

  // ── Coach profile (only if role=coach) ────────────────────────────────────
  let coachProfile: CoachProfileRow | null = null;
  if (userRow.role === "coach") {
    const { data: cp } = await adminClient
      .from("coach_profiles")
      .select("id, display_name, status")
      .eq("user_id", id)
      .maybeSingle();
    coachProfile = cp as CoachProfileRow | null;
  }

  // ── Subscriptions ─────────────────────────────────────────────────────────
  const { data: subsData } = await adminClient
    .from("subscriptions")
    .select(
      "id, plan, status, platform, gateway, current_period_end, canceled_at"
    )
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  const subscriptions = (subsData ?? []) as SubscriptionRow[];

  // ── Active coach assignment (if student) ──────────────────────────────────
  let activeAssignment: CoachAssignmentRow | null = null;
  if (userRow.role === "student") {
    const { data: ca } = await adminClient
      .from("coach_assignments")
      .select("id, status, coach_id, coach_profiles(id, display_name, status)")
      .eq("student_id", id)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();
    activeAssignment = ca as CoachAssignmentRow | null;
  }

  // ── Last 5 payments ───────────────────────────────────────────────────────
  const { data: paymentsData } = await adminClient
    .from("payments")
    .select("id, amount, currency, status, gateway, created_at")
    .eq("user_id", id)
    .order("created_at", { ascending: false })
    .limit(5);

  const payments = (paymentsData ?? []) as PaymentRow[];

  // ── Deletion queue (for restore eligibility) ──────────────────────────────
  let deletionQueue: DeletionQueueRow | null = null;
  if (userRow.deleted_at !== null) {
    const { data: dq } = await adminClient
      .from("deletion_queue")
      .select("anonymize_at, processed_at")
      .eq("user_id", id)
      .maybeSingle();
    deletionQueue = dq as DeletionQueueRow | null;
  }

  const isDeactivated = userRow.deleted_at !== null;
  // Can restore only if queue row exists AND processed_at is null
  const canRestore =
    isDeactivated &&
    deletionQueue !== null &&
    deletionQueue.processed_at === null;

  const roleLabel: Record<string, string> = {
    student: t("dashboard.roleStudent"),
    coach: t("dashboard.roleCoach"),
    owner: t("dashboard.roleOwner"),
    promoter: t("dashboard.rolePromoter"),
  };

  // ── Strings passed to client component ───────────────────────────────────
  const actionStrings = {
    setRoleTitle: t("usuarios.detail.actionSetRoleTitle"),
    roleWarning: t("usuarios.detail.actionRoleWarning"),
    roleCoachNote: t("usuarios.detail.actionRoleCoachNote"),
    rolePlaceholder: t("usuarios.detail.actionRolePlaceholder"),
    roleStudent: t("dashboard.roleStudent"),
    roleCoach: t("dashboard.roleCoach"),
    rolePromoter: t("dashboard.rolePromoter"),
    btnSetRole: t("usuarios.detail.actionBtnSetRole"),
    deactivateTitle: t("usuarios.detail.actionDeactivateTitle"),
    deactivateWarning: t("usuarios.detail.actionDeactivateWarning"),
    btnDeactivate: t("usuarios.detail.actionBtnDeactivate"),
    deactivateConfirmMsg: t("usuarios.detail.actionDeactivateConfirm"),
    restoreTitle: t("usuarios.detail.actionRestoreTitle"),
    restoreNote: t("usuarios.detail.actionRestoreNote"),
    btnRestore: t("usuarios.detail.actionBtnRestore"),
    restoreConfirmMsg: t("usuarios.detail.actionRestoreConfirm"),
    errorGeneric: t("usuarios.detail.actionErrorGeneric"),
    errorAlreadyAnonymized: t("usuarios.detail.actionErrorAlreadyAnonymized"),
    successRole: t("usuarios.detail.actionSuccessRole"),
    successDeactivate: t("usuarios.detail.actionSuccessDeactivate"),
    successRestore: t("usuarios.detail.actionSuccessRestore"),
    ownerActionDisabled: t("usuarios.detail.actionOwnerDisabled"),
  };

  return (
    <div>
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/admin/usuarios"
          className="text-muted hover:text-text text-sm transition-colors"
        >
          {t("usuarios.detail.backToList")}
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text font-mono">
            {userRow.id.slice(0, 8)}…
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {/* Role badge */}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[userRow.role] ?? "bg-surface-2 text-muted border border-border"}`}
            >
              {roleLabel[userRow.role] ?? userRow.role}
            </span>
            {/* Deactivated badge */}
            {isDeactivated && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                {t("usuarios.detail.badgeDeactivated")}
              </span>
            )}
            <span className="text-muted text-xs">{userRow.country}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: profile data ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile section */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
              {t("usuarios.detail.sectionProfile")}
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {/* Email — PII: shown in UI, NEVER logged */}
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted mb-1">{t("usuarios.detail.fieldEmail")}</dt>
                <dd className="text-text text-sm font-medium break-all">
                  {userEmail ?? <span className="text-muted">—</span>}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-1">{t("usuarios.detail.fieldRole")}</dt>
                <dd>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[userRow.role] ?? "bg-surface-2 text-muted border border-border"}`}
                  >
                    {roleLabel[userRow.role] ?? userRow.role}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-1">{t("usuarios.detail.fieldCountry")}</dt>
                <dd className="text-text text-sm font-medium">{userRow.country}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-1">{t("usuarios.detail.fieldRegistered")}</dt>
                <dd className="text-text text-sm font-medium">{formatDate(userRow.created_at)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-1">{t("usuarios.detail.fieldStatus")}</dt>
                <dd>
                  {isDeactivated ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                      {t("usuarios.detail.badgeDeactivated")}
                      {userRow.deleted_at && (
                        <span className="opacity-70">
                          {formatDate(userRow.deleted_at)}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                      {t("usuarios.detail.badgeActive")}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-1">{t("usuarios.detail.fieldUserId")}</dt>
                <dd className="text-muted font-mono text-xs">{userRow.id}</dd>
              </div>
              {/* Deletion queue info */}
              {isDeactivated && deletionQueue && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted mb-1">{t("usuarios.detail.fieldAnonymizeAt")}</dt>
                  <dd className="text-text text-sm font-medium">
                    {formatDateTime(deletionQueue.anonymize_at)}
                    {deletionQueue.processed_at !== null && (
                      <span className="ml-2 text-red-400 text-xs">
                        ({t("usuarios.detail.fieldAlreadyAnonymized")})
                      </span>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Student profile section */}
          {userRow.role === "student" && (
            <section className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
                {t("usuarios.detail.sectionStudentProfile")}
              </h2>
              {studentProfile === null ? (
                <EmptyState
                  title={t("usuarios.detail.studentProfileEmpty")}
                  description={t("usuarios.detail.studentProfileEmptySub")}
                />
              ) : (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <dt className="text-xs text-muted mb-1">{t("usuarios.detail.fieldDisplayName")}</dt>
                    <dd className="text-text text-sm font-medium">
                      {studentProfile.display_name ?? <span className="text-muted">—</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted mb-1">{t("usuarios.detail.fieldLevel")}</dt>
                    <dd className="text-text text-sm font-medium capitalize">
                      {studentProfile.level ?? <span className="text-muted">—</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted mb-1">{t("usuarios.detail.fieldBirthDate")}</dt>
                    <dd className="text-text text-sm font-medium">
                      {studentProfile.birth_date
                        ? formatDate(studentProfile.birth_date)
                        : <span className="text-muted">—</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted mb-1">{t("usuarios.detail.fieldParentalConsent")}</dt>
                    <dd className="text-text text-sm font-medium">
                      {studentProfile.parental_consent_at
                        ? formatDateTime(studentProfile.parental_consent_at)
                        : <span className="text-muted">—</span>}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-muted mb-1">{t("usuarios.detail.fieldGoals")}</dt>
                    <dd>
                      {studentProfile.goals && studentProfile.goals.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {studentProfile.goals.map((g) => (
                            <span
                              key={g}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </dd>
                  </div>
                </dl>
              )}
            </section>
          )}

          {/* Coach profile link (if role=coach) */}
          {userRow.role === "coach" && (
            <section className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
                {t("usuarios.detail.sectionCoachProfile")}
              </h2>
              {coachProfile === null ? (
                <EmptyState
                  title={t("usuarios.detail.coachProfileEmpty")}
                  description={t("usuarios.detail.coachProfileEmptySub")}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text text-sm font-medium">{coachProfile.display_name}</p>
                    <p className="text-muted text-xs mt-0.5 capitalize">
                      {t("usuarios.detail.coachStatus")}: {coachProfile.status}
                    </p>
                  </div>
                  <Link
                    href={`/admin/coaches/${coachProfile.id}`}
                    className="text-[#C8FF00] hover:text-[#AADD00] text-sm transition-colors"
                  >
                    {t("usuarios.detail.coachProfileLink")} →
                  </Link>
                </div>
              )}
            </section>
          )}

          {/* Active coach assignment (if student) */}
          {userRow.role === "student" && (
            <section className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
                {t("usuarios.detail.sectionCoachAssignment")}
              </h2>
              {activeAssignment === null ? (
                <EmptyState
                  title={t("usuarios.detail.assignmentEmpty")}
                  description={t("usuarios.detail.assignmentEmptySub")}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text text-sm font-medium">
                      {activeAssignment.coach_profiles?.display_name ?? "—"}
                    </p>
                    <p className="text-muted text-xs mt-0.5">
                      {t("usuarios.detail.assignmentStatus")}: {activeAssignment.status}
                    </p>
                  </div>
                  {activeAssignment.coach_profiles && (
                    <Link
                      href={`/admin/coaches/${activeAssignment.coach_profiles.id}`}
                      className="text-[#C8FF00] hover:text-[#AADD00] text-sm transition-colors"
                    >
                      {t("usuarios.detail.coachProfileLink")} →
                    </Link>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Subscriptions */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
              {t("usuarios.detail.sectionSubscriptions")}
            </h2>
            {subscriptions.length === 0 ? (
              <EmptyState
                title={t("usuarios.detail.subscriptionsEmpty")}
                description={t("usuarios.detail.subscriptionsEmptySub")}
              />
            ) : (
              <div className="space-y-3">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-surface-2 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subStatusColors[sub.status] ?? "bg-surface-2 text-muted border border-border"}`}
                      >
                        {sub.status}
                      </span>
                      <span className="text-text text-sm font-medium capitalize">{sub.plan}</span>
                      <span className="text-muted text-xs">{sub.platform} · {sub.gateway}</span>
                    </div>
                    <div className="text-muted text-xs text-right">
                      {sub.current_period_end && (
                        <span>{t("usuarios.detail.subPeriodEnd")}: {formatDate(sub.current_period_end)}</span>
                      )}
                      {sub.canceled_at && (
                        <span className="ml-2 text-red-400">
                          {t("usuarios.detail.subCanceledAt")}: {formatDate(sub.canceled_at)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent payments */}
          {payments.length > 0 && (
            <section className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
                {t("usuarios.detail.sectionPayments")}
              </h2>
              <div className="space-y-2">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between border border-surface-2 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[p.status] ?? "bg-surface-2 text-muted border border-border"}`}
                      >
                        {p.status}
                      </span>
                      <span className="text-muted text-xs">{p.gateway}</span>
                      <span className="text-muted text-xs">{formatDate(p.created_at)}</span>
                    </div>
                    {/* Money displayed right-aligned in Space Mono — no client-side arithmetic */}
                    <span className="font-mono text-text text-sm text-right">
                      {p.currency} {p.amount.toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Right: actions ─────────────────────────────────────────────── */}
        <div className="space-y-6">
          <UserActions
            userId={userRow.id}
            currentRole={userRow.role}
            isDeactivated={isDeactivated}
            canRestore={canRestore}
            t={actionStrings}
          />
        </div>
      </div>
    </div>
  );
}
