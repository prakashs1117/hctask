"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

// Feature flag type definition
export interface FeatureFlags {
  enableIAM: boolean;
  enablePrograms: boolean;
  enableDashboard: boolean;
  enableAlerts: boolean;
  enableRBAC: boolean;
  enableDarkMode: boolean;
  enableI18n: boolean;
  enableVirtualization: boolean;
  enableAnalytics: boolean;
  enableBetaFeatures: boolean;
  enableMaintenanceMode: boolean;
  enableAdvancedAnalytics: boolean;
  enableExperimentalUI: boolean;
}

export type FeatureFlagKey = keyof FeatureFlags;

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  isLoading: boolean;
  error: string | null;
  isFeatureEnabled: (feature: FeatureFlagKey) => boolean;
  refreshFlags: () => Promise<void>;
  updateFlags: (updates: Partial<FeatureFlags>) => Promise<boolean>;
  resetFlags: () => Promise<boolean>;
}

// Default feature flags (fallback)
const defaultFlags: FeatureFlags = {
  enableIAM: true,
  enablePrograms: true,
  enableDashboard: true,
  enableAlerts: true,
  enableRBAC: true,
  enableDarkMode: true,
  enableI18n: true,
  enableVirtualization: true,
  enableAnalytics: false,
  enableBetaFeatures: false,
  enableMaintenanceMode: false,
  enableAdvancedAnalytics: false,
  enableExperimentalUI: false,
};

const FeatureFlagsContext = createContext<FeatureFlagsContextType | null>(null);

interface FeatureFlagsProviderProps {
  children: React.ReactNode;
  userId?: string;
  environment?: string;
}

export function FeatureFlagsProvider({
  children,
  userId = "guest",
  environment = "production"
}: FeatureFlagsProviderProps) {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlags = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        userId,
        env: environment,
      });

      const response = await fetch(`/api/v1/feature-flags?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setFlags(result.data);
        console.log("✅ Feature flags loaded:", result.data);
      } else {
        throw new Error(result.error || "Invalid response format");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ Failed to fetch feature flags:", errorMessage);
      setError(errorMessage);
      // Keep using default flags on error
      setFlags(defaultFlags);
    } finally {
      setIsLoading(false);
    }
  }, [userId, environment]);

  const updateFlags = useCallback(async (updates: Partial<FeatureFlags>): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch("/api/v1/feature-flags", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flags: updates,
          adminKey: "admin123", // In production, use proper authentication
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setFlags(result.data);
        console.log("✅ Feature flags updated:", result.data);
        return true;
      } else {
        throw new Error(result.error || "Failed to update flags");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ Failed to update feature flags:", errorMessage);
      setError(errorMessage);
      return false;
    }
  }, []);

  const resetFlags = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch("/api/v1/feature-flags/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminKey: "admin123",
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setFlags(result.data);
        console.log("✅ Feature flags reset:", result.data);
        return true;
      } else {
        throw new Error(result.error || "Failed to reset flags");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ Failed to reset feature flags:", errorMessage);
      setError(errorMessage);
      return false;
    }
  }, []);

  const isFeatureEnabled = useCallback((feature: FeatureFlagKey): boolean => {
    return flags[feature] ?? defaultFlags[feature];
  }, [flags]);

  // Load flags on mount and when dependencies change
  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  // Auto-refresh flags periodically (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFlags();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [fetchFlags]);

  const value: FeatureFlagsContextType = {
    flags,
    isLoading,
    error,
    isFeatureEnabled,
    refreshFlags: fetchFlags,
    updateFlags,
    resetFlags,
  };

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

// Hook to use feature flags
export function useFeatureFlags(): FeatureFlagsContextType {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagsProvider");
  }
  return context;
}

// Convenience hook for checking if a single feature is enabled
export function useFeatureFlag(feature: FeatureFlagKey): boolean {
  const { isFeatureEnabled } = useFeatureFlags();
  return isFeatureEnabled(feature);
}