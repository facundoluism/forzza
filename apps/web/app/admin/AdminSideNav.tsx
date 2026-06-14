"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/coaches", label: "Coaches", icon: "🏋️" },
  { href: "/admin/usuarios", label: "Usuarios", icon: "👥" },
  { href: "/admin/pagos", label: "Pagos", icon: "💳" },
  { href: "/admin/configuracion", label: "Configuración", icon: "⚙️" },
  { href: "/admin/tickets", label: "Tickets", icon: "🎫" },
];

export function AdminSideNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#0D0D0D] border-r border-[#1E1E1E] fixed left-0 top-0 bottom-0">
        <div className="p-6 border-b border-[#1E1E1E]">
          <span style={{ color: "#C8FF00", fontWeight: 800, fontSize: "20px", letterSpacing: "5px" }}>
            FORZZA
          </span>
          <p className="text-[#555555] text-xs mt-1 uppercase tracking-wider">
            Admin Panel
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20"
                    : "text-[#888888] hover:text-[#FAFAFA] hover:bg-[#1A1A1A]"
                }`}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#1E1E1E] space-y-2">
          <div className="flex items-center gap-2 px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C8FF00]" />
            <span className="text-[#555555] text-xs">Owner</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-[#555555] hover:text-[#888888] text-xs transition-colors px-3 py-1"
          >
            ← Volver al inicio
          </Link>
        </div>
      </aside>

      {/* Mobile bottom tabs */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0D0D0D] border-t border-[#1E1E1E] flex z-10">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-2 transition-colors ${
                isActive ? "text-[#C8FF00]" : "text-[#555555] hover:text-[#C8FF00]"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-[9px] font-medium leading-tight text-center px-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
