/**
 * Feature flags configuration
 * Centralized feature flag management for toggling features
 */
export const featureFlags = {
  /** Enable IAM module */
  enableIAM: true,
  /** Enable Programs module */
  enablePrograms: true,
  /** Enable Dashboard module */
  enableDashboard: true,
  /** Enable Alerts module */
  enableAlerts: true,
  /** Enable role-based permissions */
  enableRBAC: true,
  /** Enable dark mode theme */
  enableDarkMode: false,
  /** Enable internationalization */
  enableI18n: false,
  /** Enable virtual scrolling for large lists */
  enableVirtualization: true,
  /** Enable analytics tracking */
  enableAnalytics: false,
} as const;

/**
 * Check if a feature is enabled
 * @param feature - Feature flag key
 * @returns True if feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof featureFlags): boolean {
  return featureFlags[feature];
}
