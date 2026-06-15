import { requireCoach } from "@/lib/auth/coach";
import { CoachSideNav } from "./CoachSideNav";
import type { ReactNode } from "react";

export default async function CoachLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
  const isDevMode = !supabaseUrl || supabaseUrl.includes("placeholder");

  if (!isDevMode) {
    await requireCoach();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex">
      <CoachSideNav />

      {/* Main content */}
      <main className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-[#111111] border-b border-[#2A2A2A] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <span style={{ color: "#C8FF00", fontWeight: 800, fontSize: "18px", letterSpacing: "4px" }}>FORZZA</span>
          <span className="text-[#666666] text-xs uppercase tracking-wider">Coach</span>
        </header>

        <div className="flex-1 p-4 lg:p-8 pb-28 lg:pb-8">{children}</div>
      </main>
    </div>
  );
}
