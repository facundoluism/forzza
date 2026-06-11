"use client";

import type { CSSProperties } from "react";
import { colors, spacing, radius, fontSize } from "../tokens";

export interface CalendarEvent {
  date: string; // YYYY-MM-DD
  color: string;
  label?: string;
}

export interface CalendarMonthProps {
  year: number;
  month: number; // 1-12
  events?: CalendarEvent[];
  onDateClick?: (date: string) => void;
  style?: CSSProperties;
}

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function CalendarMonth({
  year,
  month,
  events = [],
  onDateClick,
  style,
}: CalendarMonthProps) {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  // Monday-based: 0=Mon ... 6=Sun
  const startOffset = (firstDay.getDay() + 6) % 7;

  const eventMap = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const list = eventMap.get(e.date) ?? [];
    list.push(e);
    eventMap.set(e.date, list);
  }

  const today = new Date();
  const todayStr = isoDate(today.getFullYear(), today.getMonth() + 1, today.getDate());

  // Build 6-row grid (at most)
  const cells: Array<number | null> = [
    ...(Array(startOffset).fill(null) as null[]),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full rows of 7
  while (cells.length % 7 !== 0) cells.push(null);

  const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];

  const cellBase: CSSProperties = {
    width: "36px",
    height: "36px",
    borderRadius: `${radius.md}px`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    cursor: "default",
    fontSize: `${fontSize.sm}px`,
    color: colors.text,
    transition: "background-color 0.15s",
    flexShrink: 0,
  };

  return (
    <div
      style={{
        backgroundColor: colors.surface2,
        borderRadius: `${radius.lg}px`,
        border: `1px solid ${colors.border}`,
        padding: `${spacing[4]}px`,
        display: "inline-flex",
        flexDirection: "column",
        gap: `${spacing[3]}px`,
        ...style,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", fontSize: `${fontSize.md}px`, color: colors.text, fontWeight: 700, letterSpacing: "0.5px" }}>
        {MONTH_NAMES[month - 1]} {year}
      </div>

      {/* Weekday labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 36px)", gap: "4px" }}>
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            style={{
              width: "36px",
              textAlign: "center",
              fontSize: `${fontSize.xs}px`,
              color: colors.gray,
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 36px)", gap: "4px" }}>
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} style={{ width: "36px", height: "36px" }} />;
          }
          const dateStr = isoDate(year, month, day);
          const dayEvents = eventMap.get(dateStr) ?? [];
          const isToday = dateStr === todayStr;
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={dateStr}
              onClick={() => onDateClick?.(dateStr)}
              style={{
                ...cellBase,
                cursor: onDateClick ? "pointer" : "default",
                backgroundColor: isToday ? colors.lime + "22" : "transparent",
                border: isToday ? `1px solid ${colors.lime}` : "1px solid transparent",
                color: isToday ? colors.lime : colors.text,
              }}
              title={dayEvents.map((e) => e.label).filter(Boolean).join(", ")}
            >
              <span style={{ fontWeight: isToday ? 700 : 400, lineHeight: 1 }}>{day}</span>
              {hasEvents && (
                <div style={{ display: "flex", gap: "2px", position: "absolute", bottom: "3px" }}>
                  {dayEvents.slice(0, 3).map((e, j) => (
                    <div
                      key={j}
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        backgroundColor: e.color,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
