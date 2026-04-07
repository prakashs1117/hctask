import { useState } from "react";
import en from "@/data/locales/en.json";
import es from "@/data/locales/es.json";
import { useFeatureFlag } from "@/lib/contexts/feature-flags-context";

const translations = { en, es };

export type Locale = keyof typeof translations;

/**
 * Dynamic i18n hook that respects feature flags
 * @param initialLocale - Initial locale (default: 'en')
 * @returns Translation function and current locale
 */
export function useDynamicTranslation(initialLocale: Locale = "en") {
  const isI18nEnabled = useFeatureFlag('enableI18n');

  const [locale, setLocale] = useState<Locale>(() => {
    // Only load saved locale if i18n is enabled
    if (isI18nEnabled && typeof window !== 'undefined') {
      const saved = localStorage.getItem("pharma-rcd-locale") as Locale;
      if (saved && translations[saved]) {
        return saved;
      }
    }
    return initialLocale;
  });

  const changeLocale = (newLocale: Locale) => {
    // Only allow locale changes if i18n is enabled
    if (isI18nEnabled) {
      setLocale(newLocale);
      localStorage.setItem("pharma-rcd-locale", newLocale);
    }
  };

  /**
   * Get translation by key path (e.g., 'common.appName')
   * @param key - Translation key path
   * @returns Translated string
   */
  const t = (key: string): string => {
    // If i18n is disabled, always return English translation
    const currentLocale = isI18nEnabled ? locale : 'en';
    const keys = key.split(".");
    let value: unknown = translations[currentLocale];

    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }

    return (typeof value === 'string' ? value : key);
  };

  return { t, locale: isI18nEnabled ? locale : 'en', changeLocale };
}