"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Users, ClipboardList, ClipboardCheck, CalendarDays, Wallet, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  labelKey: string;
  Icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/coach/alumnos", labelKey: "nav.alumnos", Icon: Users },
  { href: "/coach/rutinas", labelKey: "nav.rutinas", Icon: ClipboardList },
  { href: "/coach/checkins", labelKey: "nav.checkins", Icon: ClipboardCheck },
  { href: "/coach/calendario", labelKey: "nav.calendario", Icon: CalendarDays },
  { href: "/coach/cobros", labelKey: "nav.cobros", Icon: Wallet },
  { href: "/coach/perfil", labelKey: "nav.perfil", Icon: User },
];

export function CoachSideNav() {
  const t = useTranslations("coach");
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-surface border-r border-border fixed left-0 top-0 bottom-0">
        <div className="p-6 border-b border-border">
          <span style={{ color: "#C8FF00", fontWeight: 800, fontSize: "20px", letterSpacing: "5px" }}>
            FORZZA
          </span>
          <p className="text-muted text-xs mt-1 uppercase tracking-wider">{t("nav.roleCoach")}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, labelKey, Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`coach-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium border border-transparent ${
                  isActive
                    ? "bg-[#C8FF00]/10 text-lime !border-[#C8FF00]/20"
                    : "coach-nav-item--inactive text-muted"
                }`}
              >
                <Icon size={20} aria-hidden="true" />
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border space-y-3">
          <LanguageSwitcher />
          <Link
            href="/"
            className="flex items-center gap-2 text-muted hover:text-muted text-xs transition-colors"
          >
            ← {t("nav.backToHome")}
          </Link>
        </div>
      </aside>

      {/* Mobile bottom tabs */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex z-10">
        {navItems.map(({ href, labelKey, Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`coach-nav-item flex-1 flex flex-col items-center gap-1 py-2 ${
                isActive ? "text-lime" : "coach-nav-tab--inactive text-muted"
              }`}
            >
              <Icon size={20} aria-hidden="true" />
              <span className="text-[10px] font-medium">{t(labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
