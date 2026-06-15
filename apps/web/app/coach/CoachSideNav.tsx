"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, ClipboardList, ClipboardCheck, Wallet, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/coach/alumnos", label: "Alumnos", Icon: Users },
  { href: "/coach/rutinas", label: "Rutinas", Icon: ClipboardList },
  { href: "/coach/checkins", label: "Check-ins", Icon: ClipboardCheck },
  { href: "/coach/cobros", label: "Cobros", Icon: Wallet },
  { href: "/coach/perfil", label: "Mi perfil", Icon: User },
];

export function CoachSideNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-surface border-r border-border fixed left-0 top-0 bottom-0">
        <div className="p-6 border-b border-border">
          <span style={{ color: "#C8FF00", fontWeight: 800, fontSize: "20px", letterSpacing: "5px" }}>
            FORZZA
          </span>
          <p className="text-muted text-xs mt-1 uppercase tracking-wider">Coach</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#C8FF00]/10 text-lime border border-[#C8FF00]/20"
                    : "text-muted hover:text-text hover:bg-surface-2"
                }`}
              >
                <Icon size={20} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted hover:text-muted text-xs transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </aside>

      {/* Mobile bottom tabs */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex z-10">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-2 transition-colors ${
                isActive ? "text-lime" : "text-muted hover:text-lime"
              }`}
            >
              <Icon size={20} aria-hidden="true" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
