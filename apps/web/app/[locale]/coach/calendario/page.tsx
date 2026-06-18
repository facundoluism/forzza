import { requireCoach } from "@/lib/auth/coach";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ErrorState } from "@forzza/ui/web";
import { CalendarioClient } from "./CalendarioClient";
import type { Student, ScheduleEntry } from "./CalendarioClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "coach" });
  return { title: t("calendario.metaTitle") };
}

export default async function CalendarioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "coach" });

  const { supabase, coachProfileId } = await requireCoach();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  function pad(n: number): string {
    return String(n).padStart(2, "0");
  }
  const from = `${year}-${pad(month)}-01`;
  const toDate = new Date(year, month, 0);
  const to = `${year}-${pad(month)}-${pad(toDate.getDate())}`;

  const [scheduleResult, assignmentsResult] = await Promise.all([
    supabase
      .from("routine_schedule")
      .select(`
        id,
        scheduled_date,
        notes,
        student_id,
        routine_id,
        assignment_id,
        routines!routine_schedule_routine_id_fkey(id, title),
        student_profiles!routine_schedule_student_id_fkey(display_name, user_id)
      `)
      .eq("coach_id", coachProfileId)
      .gte("scheduled_date", from)
      .lte("scheduled_date", to)
      .order("scheduled_date", { ascending: true }),

    // Active assignments + routines the coach has for each student
    supabase
      .from("coach_assignments")
      .select(`
        id,
        student_id,
        student_profiles!coach_assignments_student_id_fkey(display_name, user_id)
      `)
      .eq("coach_id", coachProfileId)
      .eq("status", "active"),
  ]);

  if (scheduleResult.error) {
    console.error("Error fetching routine_schedule:", scheduleResult.error);
    return (
      <ErrorState
        title={t("calendario.errorTitle")}
        description={t("calendario.errorDesc")}
      />
    );
  }

  // For each active student, fetch their routines from this coach
  const activeAssignments = assignmentsResult.data ?? [];
  const studentIds = activeAssignments.map((a) => a.student_id);

  const routinesResult =
    studentIds.length > 0
      ? await supabase
          .from("routines")
          .select("id, title, student_id")
          .eq("coach_id", coachProfileId)
          .in("student_id", studentIds)
          .eq("active", true)
      : { data: [], error: null };

  const routinesByStudent = new Map<string, Array<{ id: string; title: string }>>();
  for (const r of routinesResult.data ?? []) {
    const list = routinesByStudent.get(r.student_id) ?? [];
    list.push({ id: r.id, title: r.title });
    routinesByStudent.set(r.student_id, list);
  }

  type RawAssignment = {
    id: string;
    student_id: string;
    student_profiles: { display_name: string | null; user_id: string } | null;
  };

  const students: Student[] = (activeAssignments as unknown as RawAssignment[]).map((a) => ({
    assignment_id: a.id,
    student_id: a.student_id,
    display_name: a.student_profiles?.display_name ?? null,
    routines: routinesByStudent.get(a.student_id) ?? [],
  }));

  const translations = {
    title: t("calendario.title"),
    subtitle: t("calendario.subtitle"),
    prevMonth: t("calendario.prevMonth"),
    nextMonth: t("calendario.nextMonth"),
    selectDate: t("calendario.selectDate"),
    noSelection: t("calendario.noSelection"),
    assignRoutine: t("calendario.assignRoutine"),
    assignedOn: t("calendario.assignedOn"),
    selectStudent: t("calendario.selectStudent"),
    selectRoutine: t("calendario.selectRoutine"),
    notesLabel: t("calendario.notesLabel"),
    notesPlaceholder: t("calendario.notesPlaceholder"),
    btnSave: t("calendario.btnSave"),
    btnSaving: t("calendario.btnSaving"),
    btnRemove: t("calendario.btnRemove"),
    errorSave: t("calendario.errorSave"),
    errorNetwork: t("calendario.errorNetwork"),
    errorRequired: t("calendario.errorRequired"),
    emptyStudents: t("calendario.emptyStudents"),
    noRoutines: t("calendario.noRoutines"),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">{t("calendario.title")}</h1>
        <p className="text-muted text-sm mt-1">{t("calendario.subtitle")}</p>
      </div>

      {/* Mobile guard */}
      <div className="block lg:hidden mb-6 rounded-xl border border-border bg-surface p-4">
        <p className="text-muted text-sm">{t("calendario.mobileWarning")}</p>
      </div>

      <div className="hidden lg:block">
        <CalendarioClient
          year={year}
          month={month}
          initialEntries={(scheduleResult.data ?? []) as unknown as ScheduleEntry[]}
          students={students}
          t={translations}
        />
      </div>
    </div>
  );
}
