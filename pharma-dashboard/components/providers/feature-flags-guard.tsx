"use client";

import { useFeatureFlags } from "@/lib/contexts/feature-flags-context";

interface FeatureFlagsGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Guard component that ensures feature flags are loaded before rendering children
 */
export function FeatureFlagsGuard({ children, fallback }: FeatureFlagsGuardProps) {
  const { flags, isLoading, error } = useFeatureFlags();

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <div className="text-sm text-muted-foreground">Loading feature flags...</div>
          </div>
        </div>
      )
    );
  }

  if (error) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-red-600">
            <div className="text-lg font-semibold mb-2">Feature Flags Error</div>
            <div className="text-sm">{error}</div>
            <div className="text-xs text-muted-foreground mt-2">
              Using default settings...
            </div>
          </div>
        </div>
      )
    );
  }

  // Flags are loaded successfully
  return <>{children}</>;
}