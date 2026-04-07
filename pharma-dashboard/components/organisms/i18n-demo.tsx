"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Globe, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { useFeatureFlag } from "@/lib/contexts/feature-flags-context";

export function I18nDemo() {
  const { t, locale, changeLocale } = useTranslation();
  const isI18nEnabled = useFeatureFlag('enableI18n');

  const testKeys = [
    "common.appName",
    "navigation.dashboard",
    "navigation.programs",
    "navigation.alerts",
    "common.save",
    "common.cancel",
    "programs.title",
    "dashboard.title"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Internationalization (i18n) Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Feature Status */}
        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            {isI18nEnabled ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="font-medium">
              I18n Feature: {isI18nEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          <Badge variant={isI18nEnabled ? "default" : "destructive"}>
            {isI18nEnabled ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Current Locale */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <div className="font-medium">Current Locale</div>
            <div className="text-sm text-muted-foreground">
              Active language setting
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {locale}
            </Badge>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={locale === 'en' ? 'default' : 'outline'}
                onClick={() => changeLocale('en')}
                disabled={!isI18nEnabled}
              >
                EN
              </Button>
              <Button
                size="sm"
                variant={locale === 'es' ? 'default' : 'outline'}
                onClick={() => changeLocale('es')}
                disabled={!isI18nEnabled}
              >
                ES
              </Button>
            </div>
          </div>
        </div>

        {/* Translation Test */}
        <div className="space-y-2">
          <h4 className="font-medium">Translation Tests</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {testKeys.map((key) => (
              <div key={key} className="p-2 border rounded text-sm">
                <div className="font-mono text-xs text-muted-foreground mb-1">
                  {key}
                </div>
                <div className="font-medium">
                  {t(key)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Behavior Info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm">
            <div className="font-medium text-blue-800 mb-1">Feature Flag Behavior:</div>
            <ul className="text-blue-700 space-y-1 text-xs">
              <li>• When <code>enableI18n</code> is <code>true</code>: Locale switching works, translations use selected language</li>
              <li>• When <code>enableI18n</code> is <code>false</code>: Always uses English, locale switching disabled</li>
              <li>• Header locale button only shows when feature is enabled</li>
              <li>• Saved locale preferences are ignored when disabled</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}