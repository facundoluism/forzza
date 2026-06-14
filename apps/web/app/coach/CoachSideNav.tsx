"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/coach/alumnos", label: "Alumnos", icon: "👥" },
  { href: "/coach/rutinas", label: "Rutinas", icon: "📋" },
  { href: "/coach/checkins", label: "Check-ins", icon: "✅" },
  { href: "/coach/cobros", label: "Cobros", icon: "💰" },
  { href: "/coach/perfil", label: "Mi perfil", icon: "👤" },
];

export function CoachSideNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-[#111111] border-r border-[#2A2A2A] fixed left-0 top-0 bottom-0">
        <div className="p-6 border-b border-[#2A2A2A]">
          <span style={{ color: "#C8FF00", fontWeight: 800, fontSize: "20px", letterSpacing: "5px" }}>
            FORZZA
          </span>
          <p className="text-[#555555] text-xs mt-1 uppercase tracking-wider">Coach</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20"
                    : "text-[#AAAAAA] hover:text-[#FAFAFA] hover:bg-[#1A1A1A]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#2A2A2A]">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#555555] hover:text-[#AAAAAA] text-xs transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </aside>

      {/* Mobile bottom tabs */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-[#2A2A2A] flex z-10">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-2 transition-colors ${
                isActive ? "text-[#C8FF00]" : "text-[#666666] hover:text-[#C8FF00]"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
