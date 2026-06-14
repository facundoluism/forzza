import { requireAdmin } from "@/lib/auth/admin";
import { AdminSideNav } from "./AdminSideNav";
import type { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
  const isDevMode = !supabaseUrl || supabaseUrl.includes("placeholder");

  if (!isDevMode) {
    await requireAdmin();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex">
      <AdminSideNav />

      {/* Main content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-[#0D0D0D] border-b border-[#1E1E1E] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <span style={{ color: "#C8FF00", fontWeight: 800, fontSize: "16px", letterSpacing: "4px" }}>FORZZA</span>
          <span className="text-[#555555] text-xs uppercase tracking-wider">Owner</span>
        </header>

        <div className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">{children}</div>
      </main>
    </div>
  );
}
