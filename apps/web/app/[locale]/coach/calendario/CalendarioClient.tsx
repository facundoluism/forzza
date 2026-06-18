"use client";

import { useState, useCallback } from "react";
import { CalendarMonth } from "@forzza/ui/web";
import { colors, spacing, radius, fontSize } from "@forzza/ui/tokens";
import type { CSSProperties } from "react";

export interface ScheduleEntry {
  id: string;
  scheduled_date: string;
  notes: string | null;
  student_id: string;
  routine_id: string;
  assignment_id: string;
  routines: { id: string; title: string } | null;
  student_profiles: { display_name: string | null; user_id: string } | null;
}

export interface Student {
  assignment_id: string;
  student_id: string;
  display_name: string | null;
  routines: Array<{ id: string; title: string }>;
}

interface Props {
  year: number;
  month: number;
  initialEntries: ScheduleEntry[];
  students: Student[];
  t: {
    title: string;
    subtitle: string;
    prevMonth: string;
    nextMonth: string;
    selectDate: string;
    noSelection: string;
    assignRoutine: string;
    assignedOn: string;
    selectStudent: string;
    selectRoutine: string;
    notesLabel: string;
    notesPlaceholder: string;
    btnSave: string;
    btnSaving: string;
    btnRemove: string;
    errorSave: string;
    errorNetwork: string;
    errorRequired: string;
    emptyStudents: string;
    noRoutines: string;
  };
}

const MONTH_NAMES_ES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

export function CalendarioClient({ year: initYear, month: initMonth, initialEntries, students, t }: Props) {
  const [year, setYear] = useState(initYear);
  const [month, setMonth] = useState(initMonth);
  const [entries, setEntries] = useState<ScheduleEntry[]>(initialEntries);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedRoutine, setSelectedRoutine] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const entriesOnDate = selectedDate
    ? entries.filter((e) => e.scheduled_date === selectedDate)
    : [];

  const availableRoutines = selectedStudent
    ? (students.find((s) => s.assignment_id === selectedStudent)?.routines ?? [])
    : [];

  const handleDateClick = useCallback((date: string) => {
    setSelectedDate(date);
    setSelectedStudent("");
    setSelectedRoutine("");
    setNotes("");
    setError(null);
  }, []);

  const handleNavigate = useCallback(async (dir: -1 | 1) => {
    let newMonth = month + dir;
    let newYear = year;
    if (newMonth < 1) { newMonth = 12; newYear -= 1; }
    if (newMonth > 12) { newMonth = 1; newYear += 1; }

    setMonth(newMonth);
    setYear(newYear);
    setSelectedDate(null);

    try {
      const res = await fetch(`/api/coach/calendario?year=${newYear}&month=${newMonth}`);
      if (!res.ok) return;
      const json = await res.json() as { items: ScheduleEntry[] };
      setEntries(json.items ?? []);
    } catch {
      // silently fail — calendar still navigates, data may be stale
    }
  }, [month, year]);

  const handleSave = useCallback(async () => {
    if (!selectedDate || !selectedStudent || !selectedRoutine) {
      setError(t.errorRequired);
      return;
    }

    const student = students.find((s) => s.assignment_id === selectedStudent);
    if (!student) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/coach/calendario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignment_id: selectedStudent,
          student_id: student.student_id,
          routine_id: selectedRoutine,
          scheduled_date: selectedDate,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json() as { error?: string };
        setError(body.error ?? t.errorSave);
        return;
      }

      // Refresh month data
      const refreshRes = await fetch(`/api/coach/calendario?year=${year}&month=${month}`);
      if (refreshRes.ok) {
        const refreshJson = await refreshRes.json() as { items: ScheduleEntry[] };
        setEntries(refreshJson.items ?? []);
      }

      setSelectedStudent("");
      setSelectedRoutine("");
      setNotes("");
    } catch {
      setError(t.errorNetwork);
    } finally {
      setSaving(false);
    }
  }, [selectedDate, selectedStudent, selectedRoutine, notes, students, year, month, t]);

  const handleRemove = useCallback(async (id: string) => {
    try {
      await fetch(`/api/coach/calendario?id=${id}`, { method: "DELETE" });
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      // silent
    }
  }, []);

  const calendarEvents = entries.map((e) => ({
    date: e.scheduled_date,
    color: colors.lime,
    label: e.routines?.title ?? "",
  }));

  const panelStyle: CSSProperties = {
    backgroundColor: colors.surface2,
    borderRadius: `${radius.lg}px`,
    border: `1px solid ${colors.border}`,
    padding: `${spacing[5]}px`,
    display: "flex",
    flexDirection: "column",
    gap: `${spacing[4]}px`,
  };

  const labelStyle: CSSProperties = {
    fontSize: `${fontSize.xs}px`,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: 600,
    marginBottom: `${spacing[1]}px`,
  };

  const selectStyle: CSSProperties = {
    width: "100%",
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: `${radius.md}px`,
    color: colors.text,
    fontSize: `${fontSize.sm}px`,
    padding: `${spacing[2]}px ${spacing[3]}px`,
    outline: "none",
  };

  const textareaStyle: CSSProperties = {
    ...selectStyle,
    resize: "vertical",
    minHeight: "64px",
    fontFamily: "inherit",
  };

  const btnStyle: CSSProperties = {
    backgroundColor: saving ? colors.border : colors.lime,
    color: saving ? colors.muted : "#000",
    border: "none",
    borderRadius: `${radius.md}px`,
    padding: `${spacing[2]}px ${spacing[5]}px`,
    fontWeight: 700,
    fontSize: `${fontSize.sm}px`,
    cursor: saving ? "not-allowed" : "pointer",
    letterSpacing: "0.5px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: `${spacing[6]}px` }}>
      {/* Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: `${spacing[3]}px` }}>
        <button
          type="button"
          onClick={() => void handleNavigate(-1)}
          style={{
            background: "transparent",
            border: `1px solid ${colors.border}`,
            borderRadius: `${radius.md}px`,
            color: colors.muted,
            cursor: "pointer",
            padding: `${spacing[1]}px ${spacing[3]}px`,
            fontSize: `${fontSize.sm}px`,
          }}
          aria-label={t.prevMonth}
        >
          ‹
        </button>
        <span style={{ fontWeight: 700, color: colors.text, fontSize: `${fontSize.md}px`, minWidth: "180px", textAlign: "center" }}>
          {MONTH_NAMES_ES[month - 1]} {year}
        </span>
        <button
          type="button"
          onClick={() => void handleNavigate(1)}
          style={{
            background: "transparent",
            border: `1px solid ${colors.border}`,
            borderRadius: `${radius.md}px`,
            color: colors.muted,
            cursor: "pointer",
            padding: `${spacing[1]}px ${spacing[3]}px`,
            fontSize: `${fontSize.sm}px`,
          }}
          aria-label={t.nextMonth}
        >
          ›
        </button>
      </div>

      <div style={{ display: "flex", gap: `${spacing[6]}px`, flexWrap: "wrap" }}>
        {/* Calendar */}
        <CalendarMonth
          year={year}
          month={month}
          events={calendarEvents}
          onDateClick={handleDateClick}
        />

        {/* Side panel */}
        <div style={{ flex: 1, minWidth: "280px", ...panelStyle }}>
          {!selectedDate ? (
            <p style={{ color: colors.muted, fontSize: `${fontSize.sm}px` }}>{t.selectDate}</p>
          ) : (
            <>
              <p style={{ color: colors.text, fontWeight: 700, fontSize: `${fontSize.md}px` }}>
                {new Date(`${selectedDate}T00:00:00`).toLocaleDateString("es-AR", {
                  weekday: "long", day: "numeric", month: "long",
                })}
              </p>

              {/* Existing entries on this date */}
              {entriesOnDate.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: `${spacing[2]}px` }}>
                  <p style={labelStyle}>{t.assignedOn}</p>
                  {entriesOnDate.map((e) => (
                    <div
                      key={e.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: colors.surface,
                        borderRadius: `${radius.md}px`,
                        border: `1px solid ${colors.border}`,
                        padding: `${spacing[2]}px ${spacing[3]}px`,
                        gap: `${spacing[2]}px`,
                      }}
                    >
                      <div>
                        <p style={{ fontSize: `${fontSize.sm}px`, color: colors.text, fontWeight: 600 }}>
                          {e.routines?.title ?? "—"}
                        </p>
                        <p style={{ fontSize: `${fontSize.xs}px`, color: colors.muted }}>
                          {e.student_profiles?.display_name ?? "Alumno"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleRemove(e.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: colors.muted,
                          cursor: "pointer",
                          fontSize: `${fontSize.xs}px`,
                          padding: `${spacing[1]}px`,
                        }}
                        aria-label={t.btnRemove}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Assign form */}
              <div style={{ display: "flex", flexDirection: "column", gap: `${spacing[3]}px` }}>
                <p style={labelStyle}>{t.assignRoutine}</p>

                {students.length === 0 ? (
                  <p style={{ color: colors.muted, fontSize: `${fontSize.sm}px` }}>{t.emptyStudents}</p>
                ) : (
                  <>
                    <div>
                      <label style={labelStyle}>{t.selectStudent}</label>
                      <select
                        value={selectedStudent}
                        onChange={(e) => {
                          setSelectedStudent(e.target.value);
                          setSelectedRoutine("");
                        }}
                        style={selectStyle}
                      >
                        <option value="">—</option>
                        {students.map((s) => (
                          <option key={s.assignment_id} value={s.assignment_id}>
                            {s.display_name ?? s.student_id.slice(0, 8)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedStudent && (
                      <div>
                        <label style={labelStyle}>{t.selectRoutine}</label>
                        {availableRoutines.length === 0 ? (
                          <p style={{ color: colors.muted, fontSize: `${fontSize.sm}px` }}>{t.noRoutines}</p>
                        ) : (
                          <select
                            value={selectedRoutine}
                            onChange={(e) => setSelectedRoutine(e.target.value)}
                            style={selectStyle}
                          >
                            <option value="">—</option>
                            {availableRoutines.map((r) => (
                              <option key={r.id} value={r.id}>{r.title}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    )}

                    <div>
                      <label style={labelStyle}>{t.notesLabel}</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t.notesPlaceholder}
                        style={textareaStyle}
                        maxLength={500}
                      />
                    </div>

                    {error && (
                      <p style={{ color: "#f87171", fontSize: `${fontSize.xs}px` }}>{error}</p>
                    )}

                    <button type="button" onClick={() => void handleSave()} style={btnStyle} disabled={saving}>
                      {saving ? t.btnSaving : t.btnSave}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
