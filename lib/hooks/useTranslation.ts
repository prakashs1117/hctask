import { useState } from "react";
import en from "@/data/locales/en.json";
import es from "@/data/locales/es.json";

const translations = { en, es };

export type Locale = keyof typeof translations;

/**
 * Simple i18n hook for translations
 * @param initialLocale - Initial locale (default: 'en')
 * @returns Translation function and current locale
 */
export function useTranslation(initialLocale: Locale = "en") {
  const [locale, setLocale] = useState<Locale>(() => {
    // Load saved locale from localStorage during initialization
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("pharma-rcd-locale") as Locale;
      if (saved && translations[saved]) {
        return saved;
      }
    }
    return initialLocale;
  });

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("pharma-rcd-locale", newLocale);
  };

  /**
   * Get translation by key path (e.g., 'common.appName')
   * @param key - Translation key path
   * @returns Translated string
   */
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: unknown = translations[locale];

    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }

    return (typeof value === 'string' ? value : key);
  };

  return { t, locale, changeLocale };
}
