import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import type { Metadata } from "next";
import { TicketResolveButton } from "./TicketResolveButton";

export const metadata: Metadata = {
  title: "Tickets — Forzza Admin",
};

type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

interface TicketRow {
  id: string;
  user_id: string;
  subject: string;
  body: string | null;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusLabel: Record<TicketStatus, string> = {
  open: "Abierto",
  in_progress: "En progreso",
  resolved: "Resuelto",
  closed: "Cerrado",
};

const statusColors: Record<TicketStatus, string> = {
  open: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  in_progress: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  resolved: "bg-green-500/10 text-green-400 border border-green-500/20",
  closed: "bg-surface-2 text-muted border border-border",
};

const ALL_STATUSES: TicketStatus[] = ["open", "in_progress", "resolved", "closed"];

export default async function AdminTicketsPage({ searchParams }: PageProps) {
  const { adminClient } = await requireAdmin();
  const params = await searchParams;
  const filterStatus = params.status as TicketStatus | undefined;

  let query = adminClient
    .from("tickets")
    .select("id, user_id, subject, body, status, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (filterStatus && ALL_STATUSES.includes(filterStatus)) {
    query = query.eq("status", filterStatus);
  }

  const { data: tickets, error } = await query;

  if (error) {
    console.error("Error fetching tickets:", error);
  }

  const rows = (tickets ?? []) as TicketRow[];

  const openCount = rows.filter((t) => t.status === "open").length;
  const inProgressCount = rows.filter((t) => t.status === "in_progress").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Tickets de soporte</h1>
        <p className="text-muted text-sm mt-1">
          {openCount} abierto{openCount !== 1 ? "s" : ""},{" "}
          {inProgressCount} en progreso
        </p>
      </div>

      {/* Status filter — single row with horizontal scroll, scrollbar hidden */}
      <div className="overflow-x-auto scrollbar-none mb-6">
        <div className="flex flex-nowrap gap-2 min-w-max">
          <Link
            href="/admin/tickets"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              !filterStatus
                ? "bg-[#C8FF00] text-[#0A0A0A]"
                : "bg-surface border border-border text-muted hover:text-text"
            }`}
          >
            Todos
          </Link>
          {ALL_STATUSES.map((s) => (
            <Link
              key={s}
              href={`/admin/tickets?status=${s}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                filterStatus === s
                  ? "bg-[#C8FF00] text-[#0A0A0A]"
                  : "bg-surface border border-border text-muted hover:text-text"
              }`}
            >
              {statusLabel[s]}
            </Link>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-4xl mb-4">🎫</p>
          <p className="text-text text-lg font-semibold">No hay tickets para mostrar.</p>
          <p className="text-muted text-sm mt-2">Los tickets de soporte aparecerán acá.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}
                    >
                      {statusLabel[ticket.status]}
                    </span>
                    <span className="text-muted text-xs font-mono">
                      #{ticket.id.slice(0, 8)}
                    </span>
                    <span className="text-muted text-xs">
                      {formatDate(ticket.created_at)}
                    </span>
                  </div>

                  <h3 className="text-text font-medium text-sm mb-1 truncate">
                    {ticket.subject}
                  </h3>

                  {ticket.body && (
                    <p className="text-muted text-xs line-clamp-2">
                      {ticket.body}
                    </p>
                  )}

                  <p className="text-muted text-xs mt-2 font-mono">
                    Usuario: {ticket.user_id.slice(0, 8)}…
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <TicketResolveButton
                    ticketId={ticket.id}
                    currentStatus={ticket.status}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
