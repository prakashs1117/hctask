/**
 * Utility functions to hydrate initial state from localStorage
 */

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
}

export function saveToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
}

/**
 * Get initial state for programs slice from localStorage
 */
export function getInitialProgramsState() {
  const favoritePrograms = loadFromLocalStorage<string[]>('favoritePrograms', []);
  const viewMode = loadFromLocalStorage<'grid' | 'list'>('programViewMode', 'list');

  return {
    favoritePrograms,
    viewMode,
  };
}

/**
 * Get initial state for UI slice from localStorage
 */
export function getInitialUIState() {
  const recentSearches = loadFromLocalStorage<string[]>('recentSearches', []);
  const themeSettings = loadFromLocalStorage<{
    theme?: 'light' | 'dark' | 'system';
    compactMode?: boolean;
    highContrast?: boolean;
  }>('themeSettings', {});
  const userPreferences = loadFromLocalStorage<any>('userPreferences', {});

  return {
    recentSearches,
    theme: themeSettings.theme || 'system',
    compactMode: themeSettings.compactMode || false,
    highContrast: themeSettings.highContrast || false,
    preferences: {
      animationsEnabled: true,
      soundEnabled: false,
      autoSaveInterval: 30,
      defaultPageSize: 25,
      timezone: typeof Intl !== 'undefined'
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : 'UTC',
      ...userPreferences,
    },
  };
}

/**
 * Get initial state for dashboard slice from localStorage
 */
export function getInitialDashboardState() {
  const dashboardLayout = loadFromLocalStorage<any[]>('dashboardLayout', []);

  return {
    widgetLayout: dashboardLayout.length > 0 ? dashboardLayout : [
      { id: 'programs', x: 0, y: 0, w: 3, h: 2 },
      { id: 'studies', x: 3, y: 0, w: 3, h: 2 },
      { id: 'milestones', x: 6, y: 0, w: 3, h: 2 },
      { id: 'alerts', x: 9, y: 0, w: 3, h: 2 },
    ],
  };
}