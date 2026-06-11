"use client";

import { useState, type CSSProperties } from "react";
import { colors, spacing, radius, fontSize } from "../tokens";

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

type CellValue = string | number | boolean | null | undefined;

export interface DataTableProps {
  columns: DataTableColumn[];
  data: Record<string, CellValue>[];
  onSort?: (key: string, dir: "asc" | "desc") => void;
  pageSize?: number;
  style?: CSSProperties;
}

export function DataTable({
  columns,
  data,
  onSort,
  pageSize,
  style,
}: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  const handleSort = (col: DataTableColumn) => {
    if (!col.sortable) return;
    const nextDir: "asc" | "desc" =
      sortKey === col.key && sortDir === "asc" ? "desc" : "asc";
    setSortKey(col.key);
    setSortDir(nextDir);
    onSort?.(col.key, nextDir);
    setPage(0);
  };

  const sorted = [...data];
  if (sortKey && !onSort) {
    sorted.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : `${av ?? ""}`.localeCompare(`${bv ?? ""}`);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }

  const totalPages = pageSize ? Math.ceil(sorted.length / pageSize) : 1;
  const rows = pageSize ? sorted.slice(page * pageSize, page * pageSize + pageSize) : sorted;

  const cellStyle: CSSProperties = {
    padding: `${spacing[3]}px ${spacing[4]}px`,
    fontSize: `${fontSize.sm}px`,
    color: colors.text,
    borderBottom: `1px solid ${colors.border}`,
    textAlign: "left",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  };

  const headCellStyle: CSSProperties = {
    ...cellStyle,
    color: colors.muted,
    fontWeight: 600,
    fontSize: `${fontSize.xs}px`,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    backgroundColor: colors.surface2,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: `${spacing[3]}px`, ...style }}>
      <div style={{ overflowX: "auto", borderRadius: `${radius.lg}px`, border: `1px solid ${colors.border}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    ...headCellStyle,
                    cursor: col.sortable ? "pointer" : "default",
                    userSelect: "none",
                  }}
                  onClick={() => handleSort(col)}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    {col.label}
                    {col.sortable && (
                      <span style={{ fontSize: "10px", opacity: sortKey === col.key ? 1 : 0.3 }}>
                        {sortKey === col.key && sortDir === "desc" ? "▼" : "▲"}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ ...cellStyle, textAlign: "center", color: colors.muted, padding: `${spacing[8]}px` }}
                >
                  Sin datos
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    backgroundColor: i % 2 === 1 ? colors.surface2 : "transparent",
                    transition: "background-color 0.1s",
                  }}
                >
                  {columns.map((col) => (
                    <td key={col.key} style={cellStyle}>
                      {`${row[col.key] ?? ""}`}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageSize && totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: `${spacing[2]}px` }}>
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            style={pagerBtn(page !== 0)}
          >
            ‹
          </button>
          <span style={{ fontSize: `${fontSize.sm}px`, color: colors.muted }}>
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            style={pagerBtn(page < totalPages - 1)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

function pagerBtn(active: boolean): CSSProperties {
  return {
    width: "32px",
    height: "32px",
    borderRadius: `${radius.md}px`,
    backgroundColor: colors.surface2,
    border: `1px solid ${colors.border}`,
    color: active ? colors.text : colors.muted,
    cursor: active ? "pointer" : "not-allowed",
    opacity: active ? 1 : 0.4,
    fontSize: "18px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  };
}
