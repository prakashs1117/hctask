"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, BarChart3, Bell, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/lib/stores/uiStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { Button } from "@/components/atoms/button";
import { Select } from "@/components/atoms/select";
import { useTranslation } from "@/lib/hooks/useTranslation";

/**
 * Navigation item configuration
 */
interface NavItem {
  titleKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    titleKey: "navigation.dashboard",
    href: "/",
    icon: Home,
  },
  {
    titleKey: "navigation.programs",
    href: "/programs",
    icon: BarChart3,
  },
  {
    titleKey: "navigation.iam",
    href: "/iam",
    icon: Users,
  },
  {
    titleKey: "navigation.alerts",
    href: "/alerts",
    icon: Bell,
    badge: 3,
  },
];

/**
 * Application sidebar component with navigation
 */
export function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { role, setRole } = useAuthStore();

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!sidebarCollapsed && (
          <div>
            <h1 className="text-lg font-bold text-primary">{t("common.appName")}</h1>
            <p className="text-xs text-muted-foreground">{t("common.appSubtitle")}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(sidebarCollapsed && "mx-auto")}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              sidebarCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const title = t(item.titleKey);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              title={sidebarCollapsed ? title : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1">{title}</span>
                  {item.badge && (
                    <span className="rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Role Selector */}
      {!sidebarCollapsed && (
        <div className="border-t p-4">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            {t("common.viewAsRole")}
          </label>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value as typeof role)}
          >
            <option value="Manager">{t("iam.roles.manager")}</option>
            <option value="Staff">{t("iam.roles.staff")}</option>
            <option value="Viewer">{t("iam.roles.viewer")}</option>
          </Select>
        </div>
      )}
    </div>
  );
}
