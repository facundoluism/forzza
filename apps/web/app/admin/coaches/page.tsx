import { requireAdmin } from "@/lib/auth/admin";
import type { Metadata } from "next";
import { ApproveRejectButtons } from "./ApproveRejectButtons";

export const metadata: Metadata = {
  title: "Coaches — Forzza Admin",
};

type CoachStatus = "pending" | "approved" | "rejected" | "suspended";

interface CoachRow {
  id: string;
  user_id: string;
  display_name: string;
  status: CoachStatus;
  country: string;
  constancia_path: string | null;
  created_at: string;
  billing_model: string;
}

interface CoachRowWithSignedUrl extends CoachRow {
  constanciaSignedUrl: string | null;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusLabel: Record<CoachStatus, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
  suspended: "Suspendido",
};

const statusColors: Record<CoachStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  approved: "bg-green-500/10 text-green-400 border border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  suspended: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
};

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminCoachesPage({ searchParams }: PageProps) {
  const { adminClient } = await requireAdmin();
  const params = await searchParams;
  const tab = (params.tab ?? "pending") as CoachStatus;

  const { data: coaches, error } = await adminClient
    .from("coach_profiles")
    .select(
      "id, user_id, display_name, status, country, constancia_path, created_at, billing_model"
    )
    .eq("status", tab)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching coaches:", error);
  }

  const rawRows = (coaches ?? []) as CoachRow[];

  // Generate signed URLs (TTL 1h) for coaches with constancia_path.
  // Running in parallel is acceptable for admin backoffice (few pending coaches).
  const rows: CoachRowWithSignedUrl[] = await Promise.all(
    rawRows.map(async (coach) => {
      if (!coach.constancia_path) return { ...coach, constanciaSignedUrl: null };
      const { data: signedData } = await adminClient.storage
        .from("fiscal-docs")
        .createSignedUrl(coach.constancia_path, 3600);
      return { ...coach, constanciaSignedUrl: signedData?.signedUrl ?? null };
    })
  );

  const tabs: { key: CoachStatus; label: string }[] = [
    { key: "pending", label: "Pendientes" },
    { key: "approved", label: "Aprobados" },
    { key: "rejected", label: "Rechazados" },
    { key: "suspended", label: "Suspendidos" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Coaches</h1>
        <p className="text-[#555555] text-sm mt-1">
          Gestioná las solicitudes y el estado de los coaches
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 mb-6 bg-[#111111] border border-[#1E1E1E] rounded-xl p-1">
        {tabs.map((t) => (
          <a
            key={t.key}
            href={`/admin/coaches?tab=${t.key}`}
            className={`px-2 sm:px-4 py-2 rounded-lg text-[11px] sm:text-sm font-medium transition-colors text-center truncate ${
              tab === t.key
                ? "bg-[#C8FF00] text-[#0A0A0A]"
                : "text-[#666666] hover:text-[#FAFAFA]"
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-[#1E1E1E] bg-[#111111] p-12 text-center">
          <p className="text-4xl mb-4">🏋️</p>
          <p className="text-[#FAFAFA] text-lg font-semibold">
            No hay coaches {statusLabel[tab].toLowerCase()} por ahora.
          </p>
          <p className="text-[#555555] text-sm mt-2">
            Los coaches aparecerán acá según su estado.
          </p>
        </div>
      ) : (
        <>
        {/* Mobile: card layout */}
        <div className="md:hidden space-y-3">
          {rows.map((coach) => (
            <div key={coach.id} className="rounded-xl border border-[#1E1E1E] bg-[#111111] p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-[#FAFAFA] text-sm">{coach.display_name}</p>
                  <p className="text-[#444444] font-mono text-xs">{coach.user_id.slice(0, 8)}…</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusColors[coach.status]}`}>
                  {statusLabel[coach.status]}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#666666]">
                <span>{coach.country}</span>
                <span className="capitalize">{coach.billing_model}</span>
                <span>{formatDate(coach.created_at)}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#1A1A1A]">
                {coach.constanciaSignedUrl ? (
                  <a href={coach.constanciaSignedUrl} target="_blank" rel="noopener noreferrer" className="text-[#C8FF00] hover:text-[#AADD00] text-xs transition-colors">
                    Ver doc →
                  </a>
                ) : (
                  <span className="text-[#444444] text-xs">Sin doc</span>
                )}
                <ApproveRejectButtons coachId={coach.id} currentStatus={coach.status} />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table layout */}
        <div className="hidden md:block rounded-xl border border-[#1E1E1E] bg-[#111111] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#555555] text-xs uppercase tracking-wider border-b border-[#1A1A1A]">
                <th className="text-left px-6 py-3">Coach</th>
                <th className="text-left px-6 py-3">País</th>
                <th className="text-left px-6 py-3 hidden lg:table-cell">Modelo</th>
                <th className="text-left px-6 py-3">Registro</th>
                <th className="text-left px-6 py-3">Estado</th>
                <th className="text-left px-6 py-3">Docs</th>
                <th className="text-right px-6 py-3">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {rows.map((coach) => (
                <tr key={coach.id} className="hover:bg-[#161616] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#FAFAFA]">{coach.display_name}</p>
                    <p className="text-[#444444] font-mono text-xs">{coach.user_id.slice(0, 8)}…</p>
                  </td>
                  <td className="px-6 py-4 text-[#888888]">{coach.country}</td>
                  <td className="px-6 py-4 text-[#888888] capitalize hidden lg:table-cell">{coach.billing_model}</td>
                  <td className="px-6 py-4 text-[#555555] text-xs">{formatDate(coach.created_at)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[coach.status]}`}>
                      {statusLabel[coach.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {coach.constanciaSignedUrl ? (
                      <a href={coach.constanciaSignedUrl} target="_blank" rel="noopener noreferrer" className="text-[#C8FF00] hover:text-[#AADD00] text-xs transition-colors">
                        Ver doc →
                      </a>
                    ) : (
                      <span className="text-[#444444] text-xs">Sin doc</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ApproveRejectButtons coachId={coach.id} currentStatus={coach.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
