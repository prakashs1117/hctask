"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Switch } from "@/components/atoms/switch";
import { Label } from "@/components/atoms/label";
import { RefreshCw, Settings, Eye, EyeOff } from "lucide-react";
import { featureFlags } from "@/lib/utils/featureFlags";
import { useFeatureFlags, type FeatureFlagKey } from "@/lib/contexts/feature-flags-context";

interface FeatureFlagConfig {
  key: FeatureFlagKey;
  name: string;
  description: string;
  category: "Core" | "UI/UX" | "Advanced";
  impact: "High" | "Medium" | "Low";
}

const flagConfigs: FeatureFlagConfig[] = [
  {
    key: "enableDashboard",
    name: "Dashboard Module",
    description: "Main dashboard with statistics and overview",
    category: "Core",
    impact: "High"
  },
  {
    key: "enablePrograms",
    name: "Programs Module",
    description: "Program management and CRUD operations",
    category: "Core",
    impact: "High"
  },
  {
    key: "enableIAM",
    name: "Identity & Access Management",
    description: "User management and permissions",
    category: "Core",
    impact: "Medium"
  },
  {
    key: "enableAlerts",
    name: "Alerts System",
    description: "Notifications and alert management",
    category: "Core",
    impact: "Medium"
  },
  {
    key: "enableRBAC",
    name: "Role-Based Access Control",
    description: "Permission-based feature access",
    category: "Advanced",
    impact: "High"
  },
  {
    key: "enableI18n",
    name: "Internationalization",
    description: "Multi-language support with locale switching",
    category: "UI/UX",
    impact: "Medium"
  },
  {
    key: "enableDarkMode",
    name: "Dark Mode Theme",
    description: "Dark/light theme toggle functionality",
    category: "UI/UX",
    impact: "Low"
  },
  {
    key: "enableVirtualization",
    name: "Virtual Scrolling",
    description: "Performance optimization for large lists",
    category: "Advanced",
    impact: "Medium"
  },
  {
    key: "enableAnalytics",
    name: "Analytics Tracking",
    description: "User behavior and performance tracking",
    category: "Advanced",
    impact: "Low"
  },
  {
    key: "enableBetaFeatures",
    name: "Beta Features",
    description: "Access to experimental and beta functionality",
    category: "Advanced",
    impact: "Medium"
  },
  {
    key: "enableMaintenanceMode",
    name: "Maintenance Mode",
    description: "Enable maintenance mode for the application",
    category: "Advanced",
    impact: "High"
  },
  {
    key: "enableAdvancedAnalytics",
    name: "Advanced Analytics",
    description: "Enhanced analytics with detailed insights",
    category: "Advanced",
    impact: "Medium"
  },
  {
    key: "enableExperimentalUI",
    name: "Experimental UI",
    description: "New experimental user interface components",
    category: "UI/UX",
    impact: "Medium"
  }
];

export function FeatureFlagsPanel() {
  const { flags: contextFlags } = useFeatureFlags();
  const [localFlags, setLocalFlags] = useState(contextFlags || featureFlags);
  const [changes, setChanges] = useState<Record<string, boolean>>({});

  const handleFlagChange = (flagKey: FeatureFlagKey, enabled: boolean) => {
    setLocalFlags(prev => ({ ...prev, [flagKey]: enabled }));
    setChanges(prev => ({ ...prev, [flagKey]: enabled }));
  };

  const applyChanges = () => {
    // In a real app, this would call an API to persist the changes
    console.log("Feature flag changes to apply:", changes);
    setChanges({});

    // For demo purposes, show reload message
    if (Object.keys(changes).length > 0) {
      alert("Feature flags updated! In a real app, these changes would be persisted and applied. Refresh the page to see navigation changes.");
    }
  };

  const resetChanges = () => {
    setLocalFlags(featureFlags);
    setChanges({});
  };

  const hasChanges = Object.keys(changes).length > 0;

  const groupedFlags = flagConfigs.reduce((acc, flag) => {
    if (!acc[flag.category]) acc[flag.category] = [];
    acc[flag.category].push(flag);
    return acc;
  }, {} as Record<string, FeatureFlagConfig[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Feature Flags Configuration
          </CardTitle>
          <div className="flex gap-2">
            {hasChanges && (
              <>
                <Button onClick={resetChanges} variant="outline" size="sm">
                  Reset
                </Button>
                <Button onClick={applyChanges} size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Apply Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Changes Summary */}
        {hasChanges && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-1">
              Pending Changes ({Object.keys(changes).length})
            </div>
            <div className="text-xs text-blue-600">
              Changes will be applied when you click "Apply Changes"
            </div>
          </div>
        )}

        {/* Feature Flag Groups */}
        {Object.entries(groupedFlags).map(([category, flags]) => (
          <div key={category} className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">
              {category} Features
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {flags.map((flag) => {
                const isEnabled = localFlags[flag.key];
                const hasChange = changes[flag.key] !== undefined;

                return (
                  <div
                    key={flag.key}
                    className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                      hasChange ? 'bg-yellow-50 border-yellow-200' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Label
                          htmlFor={flag.key}
                          className="font-medium cursor-pointer"
                        >
                          {flag.name}
                        </Label>
                        <Badge
                          variant={
                            flag.impact === "High" ? "destructive" :
                            flag.impact === "Medium" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {flag.impact}
                        </Badge>
                        {hasChange && (
                          <Badge variant="outline" className="text-xs">
                            Modified
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {flag.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Current: {contextFlags?.[flag.key] ? "Enabled" : "Disabled"}
                        {hasChange && (
                          <span className="ml-2 font-medium">
                            → Will be: {localFlags[flag.key] ? "Enabled" : "Disabled"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isEnabled ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                      <Switch
                        id={flag.key}
                        checked={isEnabled}
                        onCheckedChange={(checked) => handleFlagChange(flag.key, checked)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Feature Flag Status Summary */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Object.values(localFlags).filter(Boolean).length}
              </div>
              <div className="text-xs text-muted-foreground">Enabled</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-400">
                {Object.values(localFlags).filter(v => !v).length}
              </div>
              <div className="text-xs text-muted-foreground">Disabled</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(changes).length}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Object.keys(featureFlags).length}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}