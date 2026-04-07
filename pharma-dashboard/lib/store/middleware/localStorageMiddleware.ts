import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../index';

/**
 * Middleware to sync specific state to localStorage
 */
export const localStorageMiddleware: Middleware<{}, RootState> = (storeApi) => (next) => (action) => {
  const result = next(action);

  // Only run in browser environment
  if (typeof window === 'undefined') return result;

  const state = storeApi.getState();

  try {
    // Sync favorite programs to localStorage
    if (action.type?.startsWith('programs/') && action.type.includes('favorite')) {
      localStorage.setItem('favoritePrograms', JSON.stringify(state.programs.favoritePrograms));
    }

    // Sync view preferences
    if (action.type === 'programs/setViewMode') {
      localStorage.setItem('programViewMode', state.programs.viewMode);
    }

    // Sync UI preferences
    if (action.type?.startsWith('ui/updatePreferences')) {
      localStorage.setItem('userPreferences', JSON.stringify(state.ui.preferences));
    }

    // Sync recent searches
    if (action.type === 'ui/addToRecentSearches') {
      localStorage.setItem('recentSearches', JSON.stringify(state.ui.recentSearches));
    }

    // Sync dashboard layout
    if (action.type === 'dashboard/updateWidgetLayout') {
      localStorage.setItem('dashboardLayout', JSON.stringify(state.dashboard.widgetLayout));
    }

    // Sync theme settings
    if (action.type === 'ui/setTheme' || action.type === 'ui/setCompactMode') {
      localStorage.setItem('themeSettings', JSON.stringify({
        theme: state.ui.theme,
        compactMode: state.ui.compactMode,
        highContrast: state.ui.highContrast,
      }));
    }
  } catch (error) {
    console.warn('Failed to sync state to localStorage:', error);
  }

  return result;
};