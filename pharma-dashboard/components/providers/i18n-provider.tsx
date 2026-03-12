"use client";

import { useEffect } from 'react';
import { loadTranslations } from '@/lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Load translations when the app starts
    loadTranslations('en').catch(console.error);
  }, []);

  return <>{children}</>;
}