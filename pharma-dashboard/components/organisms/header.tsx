"use client";

import { Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/atoms/button";
import { useTranslation } from "@/lib/hooks/useTranslation";

/**
 * Application header with theme toggle and locale switcher
 */
export function Header() {
  const { theme, setTheme } = useTheme();
  const { locale, changeLocale } = useTranslation();

  return (
    <header className="flex h-12 sm:h-14 md:h-16 items-center justify-between border-b bg-card px-3 sm:px-4 md:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="rounded-md bg-primary/10 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-primary">
          <span className="hidden sm:inline">MFE Architecture • Module Federation</span>
          <span className="sm:hidden">MFE • Module Federation</span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Locale Switcher */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => changeLocale(locale === "en" ? "es" : "en")}
          title="Change language"
          className="h-8 w-8 p-0 sm:h-9 sm:w-9"
        >
          <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Toggle language</span>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle theme"
          className="h-8 w-8 p-0 sm:h-9 sm:w-9"
        >
          <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
