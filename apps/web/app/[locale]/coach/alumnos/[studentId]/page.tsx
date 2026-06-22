import { requireCoach } from "@/lib/auth/coach";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { LineChart } from "@forzza/ui/web";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FeedbackForm } from "./FeedbackForm";
import { LiveSessionForm } from "./LiveSessionForm";
import { LiveSessionStatusButton } from "./LiveSessionStatusButton";

type TaxConditionKey =
  | "consumidor_final"
  | "monotributo"
  | "responsable_inscripto"
  | "exento";

interface BillingProfile {
  legal_name: string;
  tax_condition: string;
  doc_type: string;
  doc_number: string;
  address: string | null;
}

type Props = { params: Promise<{ locale: string; studentId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "coach" });
  return { title: t("alumnos.metaTitle") };
}

type WorkoutStatus = "in_progress" | "completed" | "abandoned";
type LiveSessionStatus = "scheduled" | "completed" | "canceled";
type PackageTier = "starter" | "pro" | "elite";

interface WorkoutSession {
  id: string;
  status: WorkoutStatus;
  started_at: string;
  completed_at: string | null;
  routines: { title: string } | null;
}

interface CheckinResponse {
  id: string;
  submitted_at: string;
  answers: Record<string, unknown>;
  checkin_templates: { title: string } | null;
}

interface BodyMetric {
  id: string;
  recorded_at: string;
  weight_g: number | null;
  body_fat_pct: number | null;
}

interface ProgressPhoto {
  id: string;
  recorded_at: string;
  storage_path: string;
  notes: string | null;
  signedUrl?: string | null;
}

interface FeedbackItem {
  id: string;
  target_type: string;
  target_id: string;
  feedback_text: string;
  created_at: string;
}

interface LiveSession {
  id: string;
  title: string;
  scheduled_at: string;
  room_url: string;
  status: LiveSessionStatus;
  created_at: string;
}

const workoutStatusColor: Record<WorkoutStatus, string> = {
  in_progress: "text-yellow-400",
  completed: "text-green-400",
  abandoned: "text-red-400",
};

const liveSessionStatusColor: Record<LiveSessionStatus, string> = {
  scheduled: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  completed: "bg-green-500/10 text-green-400 border border-green-500/20",
  canceled: "bg-red-500/10 text-red-400 border border-red-500/20",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatWeight(weightG: number | null): string {
  if (weightG === null) return "—";
  return `${(weightG / 1000).toFixed(1)} kg`;
}

function formatBodyFat(pct: number | null): string {
  if (pct === null) return "—";
  return `${pct.toFixed(1)}%`;
}

export default async function StudentDetailPage({ params }: Props) {
  const { locale, studentId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "coach" });

  const { supabase, coachProfileId } = await requireCoach();

  // Verify coach has an assignment with this student
  const { data: assignment } = await supabase
    .from("coach_assignments")
    .select(
      `
      id,
      status,
      routine_id,
      routines!coach_assignments_routine_id_fkey(title),
      coach_packages!coach_assignments_package_id_fkey(tier)
    `
    )
    .eq("coach_id", coachProfileId)
    .eq("student_id", studentId)
    .single();

  if (!assignment) notFound();

  // Determine if student has a PRO/elite package (feedback is only available for those)
  const pkg = assignment.coach_packages as { tier: PackageTier } | null;
  const canLeaveFeedback = pkg?.tier === "pro" || pkg?.tier === "elite";

  // Fetch student profile
  const { data: studentProfile } = await supabase
    .from("student_profiles")
    .select("display_name, goals, level, birth_date, avatar_url")
    .eq("user_id", studentId)
    .single();

  // Last 5 workout sessions
  const { data: sessions } = await supabase
    .from("workout_sessions")
    .select(
      `
      id,
      status,
      started_at,
      completed_at,
      routines!workout_sessions_routine_id_fkey(title)
    `
    )
    .eq("student_id", studentId)
    .order("started_at", { ascending: false })
    .limit(5);

  // Last 28 days of workout sessions for chart (sessions per day)
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const { data: chartSessions } = await supabase
    .from("workout_sessions")
    .select("started_at")
    .eq("student_id", studentId)
    .gte("started_at", fourWeeksAgo.toISOString())
    .order("started_at", { ascending: true });

  // Build array of 28 daily counts (index 0 = oldest day)
  const sessionCountsByDay: number[] = Array(28).fill(0);
  for (const s of chartSessions ?? []) {
    const sessionDate = new Date((s as { started_at: string }).started_at);
    const diffMs = Date.now() - sessionDate.getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    if (diffDays >= 0 && diffDays < 28) {
      // diffDays 0 = today, 27 = oldest; invert for chart (left=oldest)
      const idx = 27 - diffDays;
      sessionCountsByDay[idx] = (sessionCountsByDay[idx] ?? 0) + 1;
    }
  }
  const hasChartData = sessionCountsByDay.some((v) => v > 0);

  // Last check-in response
  const { data: lastCheckin } = await supabase
    .from("checkin_responses")
    .select(
      `
      id,
      submitted_at,
      answers,
      checkin_templates!checkin_responses_template_id_fkey(title)
    `
    )
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .single();

  // Body metrics (last 5)
  const { data: metricsRaw } = await supabase
    .from("body_metrics")
    .select("id, recorded_at, weight_g, body_fat_pct")
    .eq("student_id", studentId)
    .order("recorded_at", { ascending: false })
    .limit(5);

  const metrics = (metricsRaw ?? []) as BodyMetric[];

  // Progress photos (last 6)
  const { data: photosRaw } = await supabase
    .from("progress_photos")
    .select("id, recorded_at, storage_path, notes")
    .eq("student_id", studentId)
    .order("recorded_at", { ascending: false })
    .limit(6);

  // Generate signed URLs for photos (TTL 1h, private bucket — never logged)
  const photos: ProgressPhoto[] = await Promise.all(
    (photosRaw ?? []).map(async (p) => {
      const photo = p as ProgressPhoto;
      if (!photo.storage_path) return { ...photo, signedUrl: null };
      const { data: signedData } = await supabase.storage
        .from("progress-photos")
        .createSignedUrl(photo.storage_path, 3600);
      return { ...photo, signedUrl: signedData?.signedUrl ?? null };
    })
  );

  // Existing coach_feedback for this student by this coach
  const { data: feedbackRaw } = await supabase
    .from("coach_feedback")
    .select("id, target_type, target_id, feedback_text, created_at")
    .eq("coach_id", coachProfileId)
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(20);

  const feedbackItems = (feedbackRaw ?? []) as FeedbackItem[];

  // Build a lookup map: targetId -> feedback list
  const feedbackByTarget = new Map<string, FeedbackItem[]>();
  for (const fb of feedbackItems) {
    const existing = feedbackByTarget.get(fb.target_id) ?? [];
    existing.push(fb);
    feedbackByTarget.set(fb.target_id, existing);
  }

  // Billing profile del alumno (accesible por RLS para el coach asignado)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: billingProfileRaw } = await (supabase as any)
    .from("billing_profiles")
    .select("legal_name, tax_condition, doc_type, doc_number, address")
    .eq("user_id", studentId)
    .single();

  const billingProfile = billingProfileRaw as BillingProfile | null;

  // Live sessions for this student (by this coach), ordered newest first
  const { data: liveSessionsRaw } = await supabase
    .from("live_sessions")
    .select("id, title, scheduled_at, room_url, status, created_at")
    .eq("coach_id", coachProfileId)
    .eq("student_id", studentId)
    .order("scheduled_at", { ascending: false })
    .limit(10);

  const liveSessions = (liveSessionsRaw ?? []) as LiveSession[];

  const workoutSessions = (sessions ?? []) as unknown as WorkoutSession[];
  const checkin = lastCheckin as unknown as CheckinResponse | null;
  const assignmentData = assignment as unknown as {
    id: string;
    status: string;
    routine_id: string | null;
    routines: { title: string } | null;
    coach_packages: { tier: PackageTier } | null;
  };

  const workoutStatusLabel: Record<WorkoutStatus, string> = {
    in_progress: t("alumnos.statusPaused"),
    completed: t("alumnos.statusActive"),
    abandoned: t("alumnos.statusCancelled"),
  };

  const liveSessionStatusLabel: Record<LiveSessionStatus, string> = {
    scheduled: t("alumnos.detail.liveSessions.statusScheduled"),
    completed: t("alumnos.detail.liveSessions.statusCompleted"),
    canceled: t("alumnos.detail.liveSessions.statusCanceled"),
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/coach/alumnos"
            className="text-muted hover:text-muted text-sm transition-colors"
          >
            ← {t("alumnos.title")}
          </Link>
          <h1 className="text-2xl font-bold text-text mt-2">
            {studentProfile?.display_name ?? t("alumnos.detail.notFound")}
          </h1>
          {studentProfile?.level && (
            <p className="text-muted text-sm mt-1">
              {studentProfile.level}
            </p>
          )}
          {pkg && (
            <span className="mt-2 inline-flex items-center rounded-full bg-lime/10 border border-lime/20 px-2.5 py-0.5 text-xs font-medium text-lime">
              {pkg.tier.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Goals & profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-xs uppercase tracking-wider text-muted mb-3">
            {t("alumnos.detail.goals")}
          </h2>
          {studentProfile?.goals && studentProfile.goals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {studentProfile.goals.map((goal, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-surface-2 border border-border text-xs text-muted"
                >
                  {goal}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm opacity-50">{t("alumnos.detail.noGoals")}</p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-xs uppercase tracking-wider text-muted mb-3">
            {t("alumnos.detail.assignedRoutine")}
          </h2>
          {assignmentData.routines ? (
            <div className="flex items-center justify-between">
              <span className="text-text font-medium">
                {assignmentData.routines.title}
              </span>
              <Link
                href="/coach/rutinas"
                className="text-lime hover:text-[#AADD00] text-xs transition-colors"
              >
                {t("alumnos.detail.viewRoutine")} →
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-muted text-sm opacity-50">{t("alumnos.detail.noRoutine")}</span>
              <Link
                href="/coach/rutinas/nueva"
                className="text-lime hover:text-[#AADD00] text-xs transition-colors"
              >
                {t("alumnos.detail.viewRoutine")} →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Body metrics */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-xs uppercase tracking-wider text-muted mb-4">
          {t("alumnos.detail.bodyMetrics")}
        </h2>
        {metrics.length === 0 ? (
          <p className="text-muted text-sm opacity-50">{t("alumnos.detail.noMetrics")}</p>
        ) : (
          <div className="space-y-3">
            {metrics.map((metric) => {
              const metricFeedback = feedbackByTarget.get(metric.id) ?? [];
              const metricLabel = formatDateShort(metric.recorded_at);
              return (
                <div
                  key={metric.id}
                  className="rounded-lg border border-surface-2 bg-surface-2 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-muted text-xs">{metricLabel}</span>
                    <div className="flex gap-4 text-right">
                      <span className="text-text text-sm font-mono">
                        {formatWeight(metric.weight_g)}
                      </span>
                      <span className="text-muted text-sm font-mono">
                        {formatBodyFat(metric.body_fat_pct)}
                      </span>
                    </div>
                  </div>
                  {/* Existing feedback */}
                  {metricFeedback.length > 0 && (
                    <div className="mt-2 space-y-1 border-t border-border pt-2">
                      {metricFeedback.map((fb) => (
                        <p key={fb.id} className="text-muted text-xs italic">
                          {fb.feedback_text}
                          <span className="ml-2 not-italic opacity-50">
                            — {formatDate(fb.created_at)}
                          </span>
                        </p>
                      ))}
                    </div>
                  )}
                  {/* Feedback form (only for PRO/elite) */}
                  {canLeaveFeedback && (
                    <FeedbackForm
                      studentId={studentId}
                      targetType="metric"
                      targetId={metric.id}
                      targetLabel={metricLabel}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
        {!canLeaveFeedback && metrics.length > 0 && (
          <p className="mt-3 text-muted text-xs opacity-60">
            {t("alumnos.detail.feedback.proOnly")}
          </p>
        )}
      </div>

      {/* Progress photos */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-xs uppercase tracking-wider text-muted mb-4">
          {t("alumnos.detail.progressPhotos")}
        </h2>
        {photos.length === 0 ? (
          <p className="text-muted text-sm opacity-50">{t("alumnos.detail.noPhotos")}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((photo) => {
              const photoFeedback = feedbackByTarget.get(photo.id) ?? [];
              const photoLabel = formatDateShort(photo.recorded_at);
              return (
                <div key={photo.id} className="flex flex-col gap-2">
                  <div className="relative aspect-square rounded-lg overflow-hidden border border-border bg-surface-2">
                    {photo.signedUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={photo.signedUrl}
                        alt={t("alumnos.detail.photoAlt", { date: photoLabel })}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-muted text-xs opacity-50">
                          {t("alumnos.detail.photoUnavailable")}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-muted text-xs">{photoLabel}</p>
                  {photo.notes && (
                    <p className="text-muted text-xs italic">{photo.notes}</p>
                  )}
                  {/* Existing feedback on photo */}
                  {photoFeedback.length > 0 && (
                    <div className="space-y-1">
                      {photoFeedback.map((fb) => (
                        <p key={fb.id} className="text-muted text-xs italic">
                          {fb.feedback_text}
                        </p>
                      ))}
                    </div>
                  )}
                  {/* Feedback form (PRO/elite only) */}
                  {canLeaveFeedback && (
                    <FeedbackForm
                      studentId={studentId}
                      targetType="photo"
                      targetId={photo.id}
                      targetLabel={photoLabel}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
        {!canLeaveFeedback && photos.length > 0 && (
          <p className="mt-3 text-muted text-xs opacity-60">
            {t("alumnos.detail.feedback.proOnly")}
          </p>
        )}
      </div>

      {/* Last check-in */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-xs uppercase tracking-wider text-muted mb-3">
          {t("alumnos.detail.lastCheckin")}
        </h2>
        {checkin ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted text-sm">
                {checkin.checkin_templates?.title ?? "Check-in"}
              </span>
              <span className="text-muted text-xs">
                {formatDate(checkin.submitted_at)}
              </span>
            </div>
            <div className="space-y-2">
              {Object.entries(checkin.answers ?? {})
                .slice(0, 3)
                .map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-sm">
                    <span className="text-muted">{key}:</span>
                    <span className="text-text">{String(value)}</span>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <p className="text-muted text-sm opacity-50">{t("alumnos.detail.noCheckin")}</p>
        )}
      </div>

      {/* Last 5 workout sessions */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-xs uppercase tracking-wider text-muted mb-4">
          {t("alumnos.detail.recentSessions")}
        </h2>
        {workoutSessions.length === 0 ? (
          <p className="text-muted text-sm opacity-50">{t("alumnos.detail.noSessions")}</p>
        ) : (
          <div className="space-y-2">
            {workoutSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between py-2 border-b border-surface-2 last:border-0"
              >
                <div>
                  <p className="text-text text-sm font-medium">
                    {session.routines?.title ?? "Entrenamiento libre"}
                  </p>
                  <p className="text-muted text-xs mt-0.5">
                    {formatDate(session.started_at)}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium ${workoutStatusColor[session.status]}`}
                >
                  {workoutStatusLabel[session.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sesiones por día — últimas 4 semanas */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs uppercase tracking-wider text-muted">
            {t("alumnos.detail.sessions28")}
          </h2>
        </div>
        {hasChartData ? (
          <div className="w-full overflow-hidden">
            <LineChart
              data={sessionCountsByDay}
              width={600}
              height={80}
              showDots
              style={{ width: "100%", height: "80px" }}
            />
            <div className="flex justify-between mt-2 text-muted text-xs opacity-50">
              <span>Hace 4 semanas</span>
              <span>Hoy</span>
            </div>
          </div>
        ) : (
          <div className="h-20 rounded-lg bg-surface-2 border border-border flex items-center justify-center">
            <p className="text-muted text-sm opacity-50">
              {t("alumnos.detail.noSessions")}
            </p>
          </div>
        )}
      </div>

      {/* Datos de facturación del alumno */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-xs uppercase tracking-wider text-muted mb-4">
          {t("alumnos.detail.billingProfile.sectionTitle")}
        </h2>

        {billingProfile ? (
          <div className="flex flex-col gap-4">
            {/* Datos fiscales */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <dt className="text-muted text-xs uppercase tracking-wider mb-1">
                  {t("alumnos.detail.billingProfile.legalNameLabel")}
                </dt>
                <dd className="text-text text-sm font-medium">
                  {billingProfile.legal_name}
                </dd>
              </div>
              <div>
                <dt className="text-muted text-xs uppercase tracking-wider mb-1">
                  {t("alumnos.detail.billingProfile.taxConditionLabel")}
                </dt>
                <dd className="text-text text-sm font-medium">
                  {billingProfile.tax_condition === "consumidor_final"
                    ? t("alumnos.detail.billingProfile.taxConditionConsumidorFinal")
                    : billingProfile.tax_condition === "monotributo"
                      ? t("alumnos.detail.billingProfile.taxConditionMonotributo")
                      : billingProfile.tax_condition === "responsable_inscripto"
                        ? t("alumnos.detail.billingProfile.taxConditionResponsableInscripto")
                        : t("alumnos.detail.billingProfile.taxConditionExento")}
                </dd>
              </div>
              <div>
                <dt className="text-muted text-xs uppercase tracking-wider mb-1">
                  {t("alumnos.detail.billingProfile.docLabel")}
                </dt>
                <dd className="text-text text-sm font-medium font-mono">
                  {billingProfile.doc_type} {billingProfile.doc_number}
                </dd>
              </div>
              <div>
                <dt className="text-muted text-xs uppercase tracking-wider mb-1">
                  {t("alumnos.detail.billingProfile.addressLabel")}
                </dt>
                <dd className="text-text text-sm">
                  {billingProfile.address ??
                    t("alumnos.detail.billingProfile.noAddress")}
                </dd>
              </div>
            </dl>

            {/* Instructivo de facturación — BORRADOR */}
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 mt-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-semibold text-yellow-400">
                  {t("alumnos.detail.billingProfile.draftBadge")}
                </span>
              </div>
              <h3 className="text-text text-sm font-semibold mb-3">
                {t("alumnos.detail.billingProfile.instructivoTitle")}
              </h3>
              {(() => {
                const tc = billingProfile.tax_condition as TaxConditionKey;
                const taxLabel =
                  tc === "consumidor_final"
                    ? t("alumnos.detail.billingProfile.taxConditionConsumidorFinal")
                    : tc === "monotributo"
                      ? t("alumnos.detail.billingProfile.taxConditionMonotributo")
                      : tc === "responsable_inscripto"
                        ? t("alumnos.detail.billingProfile.taxConditionResponsableInscripto")
                        : t("alumnos.detail.billingProfile.taxConditionExento");

                const steps: string[] = [
                  t("alumnos.detail.billingProfile.step1"),
                  t("alumnos.detail.billingProfile.step2", {
                    legal_name: billingProfile.legal_name,
                    tax_condition: taxLabel,
                    doc_type: billingProfile.doc_type,
                    doc_number: billingProfile.doc_number,
                  }),
                  t("alumnos.detail.billingProfile.step3"),
                  t("alumnos.detail.billingProfile.step4"),
                ];

                return (
                  <ol className="flex flex-col gap-2 list-none">
                    {steps.map((step, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-muted text-sm leading-relaxed">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                );
              })()}
            </div>
          </div>
        ) : (
          <p className="text-muted text-sm opacity-50">
            {t("alumnos.detail.billingProfile.empty")}
          </p>
        )}
      </div>

      {/* Live sessions section */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-xs uppercase tracking-wider text-muted mb-4">
          {t("alumnos.detail.liveSessions.title")}
        </h2>

        {/* Schedule new session form */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-text mb-3">
            {t("alumnos.detail.liveSessions.newSession")}
          </h3>
          <LiveSessionForm
            studentId={studentId}
            assignmentId={assignmentData.id}
          />
        </div>

        {/* List of sessions */}
        {liveSessions.length === 0 ? (
          <p className="text-muted text-sm opacity-50">{t("alumnos.detail.liveSessions.empty")}</p>
        ) : (
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-muted">
              {t("alumnos.detail.liveSessions.scheduled")}
            </h3>
            {liveSessions.map((ls) => (
              <div
                key={ls.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-surface-2 bg-surface-2 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-text text-sm font-medium truncate">{ls.title}</p>
                  <p className="text-muted text-xs mt-0.5">{formatDate(ls.scheduled_at)}</p>
                  <a
                    href={ls.room_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lime hover:text-[#AADD00] text-xs mt-1 inline-block truncate max-w-xs transition-colors"
                  >
                    {ls.room_url}
                  </a>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${liveSessionStatusColor[ls.status]}`}
                  >
                    {liveSessionStatusLabel[ls.status]}
                  </span>
                  {ls.status === "scheduled" && (
                    <div className="flex gap-3">
                      <LiveSessionStatusButton
                        sessionId={ls.id}
                        newStatus="completed"
                      />
                      <LiveSessionStatusButton
                        sessionId={ls.id}
                        newStatus="canceled"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
