"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { RefreshCw, CheckCircle, XCircle, Globe, Sun, Moon, Settings } from "lucide-react";
import { useFeatureFlags, useFeatureFlag } from "@/lib/contexts/feature-flags-context";

export default function FeatureFlagsTestPage() {
  const { flags, isLoading, error, refreshFlags } = useFeatureFlags();
  const isDarkModeEnabled = useFeatureFlag('enableDarkMode');
  const isI18nEnabled = useFeatureFlag('enableI18n');

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>🧪 Real-time Feature Flag Test</CardTitle>
            <Button onClick={refreshFlags} variant="outline" size="sm" className="gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Status */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <div className="flex-1">
              <div className="font-medium text-lg">Backend Feature Flags System</div>
              <div className="text-sm text-muted-foreground">
                Flags loaded from API • Auto-refresh every 5 minutes • Persisted across reloads
              </div>
            </div>
            <Badge variant={isLoading ? "secondary" : "default"} className="gap-2">
              {isLoading ? "🔄 Loading..." : "✅ Active"}
            </Badge>
          </div>

          {/* Header Button Tests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* I18n Test */}
            <Card className={isI18nEnabled ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  {isI18nEnabled ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  Internationalization (I18n)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Globe Button in Header:</span>
                    <Badge variant={isI18nEnabled ? "default" : "destructive"}>
                      {isI18nEnabled ? "VISIBLE 🌐" : "HIDDEN"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    When enabled: Globe button appears in header for language switching
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dark Mode Test */}
            <Card className={isDarkModeEnabled ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  {isDarkModeEnabled ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  Dark Mode Theme
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Theme Button in Header:</span>
                    <Badge variant={isDarkModeEnabled ? "default" : "destructive"}>
                      {isDarkModeEnabled ? "VISIBLE ☀️🌙" : "HIDDEN"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    When enabled: Sun/Moon button appears in header for theme switching
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Flag Status */}
          <div>
            <h3 className="font-semibold mb-3">📊 Live Feature Flag Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(flags).map(([key, enabled]) => (
                <div
                  key={key}
                  className={`p-3 rounded border text-center ${
                    enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`text-sm font-mono ${enabled ? 'text-green-800' : 'text-gray-600'}`}>
                    {key.replace('enable', '')}
                  </div>
                  <div className="text-xs mt-1">
                    {enabled ? '✅ ON' : '❌ OFF'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">🔧 How to Test:</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Check the header above - note which buttons are visible/hidden</li>
              <li>Go to <code>/feature-flags</code> to modify feature flags</li>
              <li>Toggle "Dark Mode Theme" or "Internationalization"</li>
              <li>Click "Save Changes" to persist to backend</li>
              <li>Come back here (no reload needed!) - buttons should update instantly</li>
              <li>Reload the page - settings persist because they're from the backend</li>
            </ol>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">❌ API Error:</h4>
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button asChild>
              <a href="/feature-flags">
                <Settings className="h-4 w-4 mr-2" />
                Manage Feature Flags
              </a>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Test Reload Persistence
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}