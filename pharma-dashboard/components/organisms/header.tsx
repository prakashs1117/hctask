"use client";

import { useState } from "react";
import { Moon, Sun, Globe, FileText, User, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/atoms/dialog";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { useAuthStore } from "@/lib/stores/authStore";
import { UserProfile } from "@/components/organisms/user-profile";

/**
 * Application header with theme toggle and locale switcher
 */
export function Header() {
  const { theme, setTheme } = useTheme();
  const { t, locale, changeLocale } = useTranslation();
  const { role } = useAuthStore();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  return (
    <header className="flex h-12 sm:h-14 md:h-16 items-center justify-between border-b bg-card px-3 sm:px-4 md:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="rounded-md bg-primary/10 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-primary">
          <span className="hidden sm:inline">{t("common.mfeArchitecture")}</span>
          <span className="sm:hidden">{t("common.mfeShort")}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* User Role Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <Badge
            variant={role === "Manager" ? "default" : role === "Staff" ? "secondary" : "outline"}
            className="text-xs"
          >
            {role}
          </Badge>
        </div>

        {/* API Docs Link */}
        <Button variant="ghost" size="sm" asChild className="h-8 px-2 sm:h-9 sm:px-3">
          <Link href="/api-docs">
            <FileText className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline text-xs">API Docs</span>
          </Link>
        </Button>

        {/* User Profile */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          title="User Profile"
          className="h-8 px-2 sm:h-9 sm:px-3"
        >
          <Link href="/profile">
            <User className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline text-xs">Profile</span>
          </Link>
        </Button>

        {/* Locale Switcher */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => changeLocale(locale === "en" ? "es" : "en")}
          title={t("common.changeLanguage")}
          className="h-8 w-8 p-0 sm:h-9 sm:w-9"
        >
          <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">{t("common.toggleLanguage")}</span>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={t("common.toggleTheme")}
          className="h-8 w-8 p-0 sm:h-9 sm:w-9"
        >
          <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t("common.toggleTheme")}</span>
        </Button>
      </div>

      {/* User Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          <UserProfile onLogout={() => setProfileDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
