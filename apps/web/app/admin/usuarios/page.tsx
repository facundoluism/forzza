import { requireAdmin } from "@/lib/auth/admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usuarios — Forzza Admin",
};

interface UserRow {
  id: string;
  role: string;
  country: string;
  created_at: string;
  subscriptions: {
    plan: string;
    status: string;
  }[];
}

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const roleLabel: Record<string, string> = {
  student: "Alumno",
  coach: "Coach",
  owner: "Owner",
  promoter: "Promotor",
};

const roleColors: Record<string, string> = {
  student: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  coach: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  owner: "bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20",
  promoter: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
};

const planColors: Record<string, string> = {
  free: "text-[#555555]",
  pro: "text-[#C8FF00]",
  elite: "text-purple-400",
};

export default async function AdminUsuariosPage({ searchParams }: PageProps) {
  const { adminClient } = await requireAdmin();
  const params = await searchParams;
  const search = params.q?.trim() ?? "";

  let query = adminClient
    .from("users")
    .select(
      `
      id,
      role,
      country,
      created_at,
      subscriptions(plan, status)
    `
    )
    .order("created_at", { ascending: false })
    .limit(100);

  // Note: users table only has id, role, country — email is in auth.users.
  // We filter by id prefix when a search is provided.
  if (search) {
    query = query.ilike("id", `${search}%`);
  }

  const { data: users, error } = await query;

  if (error) {
    console.error("Error fetching users:", error);
  }

  const rows = (users ?? []) as unknown as UserRow[];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Usuarios</h1>
        <p className="text-[#555555] text-sm mt-1">
          {rows.length} usuario{rows.length !== 1 ? "s" : ""} mostrados
        </p>
      </div>

      {/* Search */}
      <form method="GET" className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Buscar por ID de usuario…"
            className="flex-1 max-w-sm bg-[#111111] border border-[#1E1E1E] rounded-lg px-4 py-2.5 text-[#FAFAFA] text-sm placeholder-[#444444] focus:outline-none focus:border-[#C8FF00]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#C8FF00] text-[#0A0A0A] text-sm font-semibold rounded-lg hover:bg-[#AADD00] transition-colors"
          >
            Buscar
          </button>
          {search && (
            <a
              href="/admin/usuarios"
              className="px-4 py-2.5 bg-[#1A1A1A] text-[#888888] text-sm rounded-lg hover:text-[#FAFAFA] transition-colors"
            >
              Limpiar
            </a>
          )}
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-[#1E1E1E] bg-[#111111] p-12 text-center">
          <p className="text-[#555555] text-lg">No se encontraron usuarios.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-[#1E1E1E] bg-[#111111] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#555555] text-xs uppercase tracking-wider border-b border-[#1A1A1A]">
                <th className="text-left px-6 py-3">ID</th>
                <th className="text-left px-6 py-3 hidden sm:table-cell">País</th>
                <th className="text-left px-6 py-3">Rol</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">Plan</th>
                <th className="text-left px-6 py-3 hidden lg:table-cell">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {rows.map((u) => {
                const activeSub = u.subscriptions?.find(
                  (s) => s.status === "active"
                );
                return (
                  <tr key={u.id} className="hover:bg-[#161616] transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-[#888888] text-xs">
                        {u.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#888888] hidden sm:table-cell">
                      {u.country}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role] ?? "bg-[#1A1A1A] text-[#888888] border border-[#2A2A2A]"}`}
                      >
                        {roleLabel[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {activeSub ? (
                        <span
                          className={`text-sm font-semibold capitalize ${planColors[activeSub.plan] ?? "text-[#888888]"}`}
                        >
                          {activeSub.plan}
                        </span>
                      ) : (
                        <span className="text-[#444444] text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#555555] text-xs hidden lg:table-cell">
                      {formatDate(u.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
