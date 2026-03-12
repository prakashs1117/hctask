import { featureFlags, isFeatureEnabled } from '../../../lib/utils/featureFlags';

describe('featureFlags', () => {
  it('should have expected feature flags defined', () => {
    expect(featureFlags.enableIAM).toBe(true);
    expect(featureFlags.enablePrograms).toBe(true);
    expect(featureFlags.enableDashboard).toBe(true);
    expect(featureFlags.enableAlerts).toBe(true);
    expect(featureFlags.enableRBAC).toBe(true);
    expect(featureFlags.enableDarkMode).toBe(true);
    expect(featureFlags.enableI18n).toBe(true);
    expect(featureFlags.enableVirtualization).toBe(true);
    expect(featureFlags.enableAnalytics).toBe(false);
  });
});

describe('isFeatureEnabled', () => {
  it('should return true for enabled features', () => {
    expect(isFeatureEnabled('enableIAM')).toBe(true);
    expect(isFeatureEnabled('enablePrograms')).toBe(true);
  });

  it('should return false for disabled features', () => {
    expect(isFeatureEnabled('enableAnalytics')).toBe(false);
  });
});
