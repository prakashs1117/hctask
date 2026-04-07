"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Switch } from "@/components/atoms/switch";
import { Label } from "@/components/atoms/label";
import { RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { useFeatureFlags, useFeatureFlag } from "@/lib/contexts/feature-flags-context";

export default function FeatureTestPage() {
  const { flags } = useFeatureFlags();
  const isDarkModeEnabled = useFeatureFlag('enableDarkMode');
  const isI18nEnabled = useFeatureFlag('enableI18n');

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags Live Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {isI18nEnabled ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">Internationalization (i18n)</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Status: <Badge variant={isI18nEnabled ? 'default' : 'destructive'}>
                  {isI18nEnabled ? 'ENABLED' : 'DISABLED'}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                When disabled: Globe button should disappear from header
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {isDarkModeEnabled ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">Dark Mode Toggle</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Status: <Badge variant={isDarkModeEnabled ? 'default' : 'destructive'}>
                  {isDarkModeEnabled ? 'ENABLED' : 'DISABLED'}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                When disabled: Sun/Moon button should disappear from header
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm">
              <div className="font-medium text-blue-800 mb-2">🧪 How to Test Feature Flags:</div>
              <ol className="text-blue-700 space-y-1 list-decimal list-inside text-sm">
                <li>Check the current header - both buttons should be <strong>HIDDEN</strong> (currently disabled)</li>
                <li>Go to <code>/feature-flags</code> page to toggle features</li>
                <li>Toggle "Dark Mode Theme" and "Internationalization" to ON</li>
                <li>Refresh the page or navigate back here</li>
                <li>Check the header - both buttons should now be <strong>VISIBLE</strong></li>
              </ol>
            </div>
          </div>

          {/* Debug Info */}
          <div className="p-4 bg-gray-50 border rounded-lg">
            <div className="text-sm font-mono">
              <div className="font-medium mb-2">Debug Information:</div>
              <div>enableDarkMode: <code>{isDarkModeEnabled ? 'true' : 'false'}</code></div>
              <div>enableI18n: <code>{isI18nEnabled ? 'true' : 'false'}</code></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button onClick={reloadPage} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Page
            </Button>
            <Button asChild variant="outline">
              <a href="/feature-flags">Configure Feature Flags</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}