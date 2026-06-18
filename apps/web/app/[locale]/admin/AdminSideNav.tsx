"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  LayoutDashboard,
  Dumbbell,
  Users,
  CreditCard,
  HandCoins,
  ScrollText,
  Settings,
  Ticket,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  href: string;
  labelKey: string;
  Icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/admin/dashboard", labelKey: "nav.dashboard", Icon: LayoutDashboard },
  { href: "/admin/coaches", labelKey: "nav.coaches", Icon: Dumbbell },
  { href: "/admin/usuarios", labelKey: "nav.usuarios", Icon: Users },
  { href: "/admin/pagos", labelKey: "nav.pagos", Icon: CreditCard },
  { href: "/admin/liquidaciones", labelKey: "nav.liquidaciones", Icon: HandCoins },
  { href: "/admin/videos", labelKey: "nav.videos", Icon: PlayCircle },
  { href: "/admin/auditoria", labelKey: "nav.auditoria", Icon: ScrollText },
  { href: "/admin/configuracion", labelKey: "nav.configuracion", Icon: Settings },
  { href: "/admin/tickets", labelKey: "nav.tickets", Icon: Ticket },
];

export function AdminSideNav() {
  const pathname = usePathname();
  const t = useTranslations("admin");

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-surface border-r border-border fixed left-0 top-0 bottom-0">
        <div className="p-6 border-b border-border">
          <span style={{ color: "#C8FF00", fontWeight: 800, fontSize: "20px", letterSpacing: "5px" }}>
            FORZZA
          </span>
          <p className="text-muted text-xs mt-1 uppercase tracking-wider">
            {t("nav.roleOwner")}
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-0.5">
          {navItems.map(({ href, labelKey, Icon }) => {
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
                <Icon size={20} className="shrink-0" />
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border space-y-2">
          <div className="flex items-center gap-2 px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C8FF00]" />
            <span className="text-muted text-xs">{t("nav.roleOwner")}</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-muted hover:text-text text-xs transition-colors px-3 py-1"
          >
            ← {t("nav.backToHome")}
          </Link>
          <div className="px-3 pt-1">
            <LanguageSwitcher />
          </div>
        </div>
      </aside>

      {/* Mobile bottom tabs */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex z-10 pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ href, labelKey, Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-2 transition-colors ${
                isActive ? "text-lime" : "text-muted hover:text-lime"
              }`}
            >
              <Icon size={20} />
              <span className="text-[9px] font-medium leading-tight text-center px-0.5">
                {t(labelKey)}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
