"use client";

import { useTranslation } from '@/lib/i18n';

interface TranslatedTextProps {
  keyPath: string;
  params?: Record<string, string | number>;
  fallback?: string;
  className?: string;
}

export function TranslatedText({
  keyPath,
  params = {},
  fallback,
  className
}: TranslatedTextProps) {
  const { t } = useTranslation();

  const text = t(keyPath, params);

  // If translation fails and we have a fallback, use it
  if (text === keyPath && fallback) {
    return <span className={className}>{fallback}</span>;
  }

  return <span className={className}>{text}</span>;
}

// Common text components for frequently used translations
export const LoadingText = () => <TranslatedText keyPath="common.loading" fallback="Loading..." />;
export const SearchPlaceholder = () => <TranslatedText keyPath="common.search" fallback="Search..." />;
export const FiltersText = () => <TranslatedText keyPath="common.filters" fallback="Filters" />;
export const ClearAllText = () => <TranslatedText keyPath="common.clearAll" fallback="Clear All" />;