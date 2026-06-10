import { requireCoach } from "@/lib/auth/coach";
import Link from "next/link";
import type { ReactNode } from "react";

export default async function CoachLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireCoach();

  const navItems = [
    { href: "/coach/alumnos", label: "Alumnos", icon: "👥" },
    { href: "/coach/rutinas", label: "Rutinas", icon: "📋" },
    { href: "/coach/checkins", label: "Check-ins", icon: "✅" },
    { href: "/coach/cobros", label: "Cobros", icon: "💰" },
    { href: "/coach/perfil", label: "Mi perfil", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-[#111111] border-r border-[#2A2A2A] fixed left-0 top-0 bottom-0">
        <div className="p-6 border-b border-[#2A2A2A]">
          <span className="text-[#C8FF00] text-xl font-bold">Forzza</span>
          <p className="text-[#666666] text-xs mt-1">Coach backoffice</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#AAAAAA] hover:text-[#FAFAFA] hover:bg-[#1A1A1A] transition-colors text-sm font-medium"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#2A2A2A]">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#666666] hover:text-[#AAAAAA] text-xs transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-[#111111] border-b border-[#2A2A2A] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <span className="text-[#C8FF00] font-bold">Forzza Coach</span>
        </header>

        <div className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8">{children}</div>

        {/* Mobile bottom tabs */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-[#2A2A2A] flex z-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-1 py-2 text-[#666666] hover:text-[#C8FF00] transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
