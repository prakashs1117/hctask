import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  filterSidebarOpen: boolean;

  // Modal and dialog state
  activeModal: string | null;
  modalData: Record<string, any>;

  // Loading states
  globalLoading: boolean;
  componentLoading: Record<string, boolean>;

  // Notification/toast state
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: number;
    duration?: number;
    persistent?: boolean;
  }>;

  // Theme and appearance
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  highContrast: boolean;

  // Performance optimizations
  virtualizedViews: Record<string, boolean>;
  lazyLoadingEnabled: boolean;

  // User preferences
  preferences: {
    animationsEnabled: boolean;
    soundEnabled: boolean;
    autoSaveInterval: number; // in seconds
    defaultPageSize: number;
    timezone: string;
  };

  // Navigation state
  breadcrumbs: Array<{
    label: string;
    href?: string;
  }>;

  // Search and filter UI state
  globalSearchOpen: boolean;
  globalSearchQuery: string;
  recentSearches: string[];

  // Table/list view preferences
  tableSettings: Record<string, {
    columnOrder: string[];
    hiddenColumns: string[];
    sortColumn?: string;
    sortDirection?: 'asc' | 'desc';
    pageSize: number;
  }>;
}

const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  filterSidebarOpen: false,
  activeModal: null,
  modalData: {},
  globalLoading: false,
  componentLoading: {},
  notifications: [],
  theme: 'system',
  compactMode: false,
  highContrast: false,
  virtualizedViews: {},
  lazyLoadingEnabled: true,
  preferences: {
    animationsEnabled: true,
    soundEnabled: false,
    autoSaveInterval: 30,
    defaultPageSize: 25,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  breadcrumbs: [],
  globalSearchOpen: false,
  globalSearchQuery: '',
  recentSearches: typeof window !== 'undefined' ? JSON.parse(localStorage?.getItem('recentSearches') || '[]') : [],
  tableSettings: {},
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },

    toggleFilterSidebar: (state) => {
      state.filterSidebarOpen = !state.filterSidebarOpen;
    },

    setFilterSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.filterSidebarOpen = action.payload;
    },

    // Modal actions
    openModal: (state, action: PayloadAction<{ modal: string; data?: any }>) => {
      state.activeModal = action.payload.modal;
      if (action.payload.data) {
        state.modalData[action.payload.modal] = action.payload.data;
      }
    },

    closeModal: (state) => {
      if (state.activeModal) {
        delete state.modalData[state.activeModal];
        state.activeModal = null;
      }
    },

    setModalData: (state, action: PayloadAction<{ modal: string; data: any }>) => {
      state.modalData[action.payload.modal] = action.payload.data;
    },

    // Loading actions
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },

    setComponentLoading: (state, action: PayloadAction<{ component: string; loading: boolean }>) => {
      if (action.payload.loading) {
        state.componentLoading[action.payload.component] = true;
      } else {
        delete state.componentLoading[action.payload.component];
      }
    },

    // Notification actions
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp'>>) => {
      const notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);

      // Auto-remove non-persistent notifications
      if (!notification.persistent) {
        const duration = notification.duration || (notification.type === 'error' ? 8000 : 4000);
        setTimeout(() => {
          // This would need to be handled by middleware or component effect
        }, duration);
      }
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },

    clearAllNotifications: (state) => {
      state.notifications = state.notifications.filter(n => n.persistent);
    },

    // Theme actions
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload;
    },

    toggleCompactMode: (state) => {
      state.compactMode = !state.compactMode;
    },

    setCompactMode: (state, action: PayloadAction<boolean>) => {
      state.compactMode = action.payload;
    },

    toggleHighContrast: (state) => {
      state.highContrast = !state.highContrast;
    },

    setHighContrast: (state, action: PayloadAction<boolean>) => {
      state.highContrast = action.payload;
    },

    // Performance actions
    setVirtualizedView: (state, action: PayloadAction<{ view: string; enabled: boolean }>) => {
      state.virtualizedViews[action.payload.view] = action.payload.enabled;
    },

    toggleLazyLoading: (state) => {
      state.lazyLoadingEnabled = !state.lazyLoadingEnabled;
    },

    // Preferences actions
    updatePreferences: (state, action: PayloadAction<Partial<UIState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    // Navigation actions
    setBreadcrumbs: (state, action: PayloadAction<UIState['breadcrumbs']>) => {
      state.breadcrumbs = action.payload;
    },

    addBreadcrumb: (state, action: PayloadAction<{ label: string; href?: string }>) => {
      state.breadcrumbs.push(action.payload);
    },

    // Search actions
    toggleGlobalSearch: (state) => {
      state.globalSearchOpen = !state.globalSearchOpen;
      if (!state.globalSearchOpen) {
        state.globalSearchQuery = '';
      }
    },

    setGlobalSearchQuery: (state, action: PayloadAction<string>) => {
      state.globalSearchQuery = action.payload;
    },

    addToRecentSearches: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (!query || state.recentSearches.includes(query)) return;

      state.recentSearches.unshift(query);
      state.recentSearches = state.recentSearches.slice(0, 10); // Keep last 10

      // Sync to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
      }
    },

    clearRecentSearches: (state) => {
      state.recentSearches = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('recentSearches');
      }
    },

    // Table settings actions
    updateTableSettings: (state, action: PayloadAction<{ tableId: string; settings: Partial<UIState['tableSettings'][string]> }>) => {
      const { tableId, settings } = action.payload;
      state.tableSettings[tableId] = { ...state.tableSettings[tableId], ...settings };
    },

    resetTableSettings: (state, action: PayloadAction<string>) => {
      delete state.tableSettings[action.payload];
    },
  },
});

// Action creators
export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  toggleFilterSidebar,
  setFilterSidebarOpen,
  openModal,
  closeModal,
  setModalData,
  setGlobalLoading,
  setComponentLoading,
  addNotification,
  removeNotification,
  clearAllNotifications,
  setTheme,
  toggleCompactMode,
  setCompactMode,
  toggleHighContrast,
  setHighContrast,
  setVirtualizedView,
  toggleLazyLoading,
  updatePreferences,
  setBreadcrumbs,
  addBreadcrumb,
  toggleGlobalSearch,
  setGlobalSearchQuery,
  addToRecentSearches,
  clearRecentSearches,
  updateTableSettings,
  resetTableSettings,
} = uiSlice.actions;

// Selectors
export const selectUIState = (state: RootState) => state.ui;
export const selectSidebarState = (state: RootState) => ({
  open: state.ui.sidebarOpen,
  collapsed: state.ui.sidebarCollapsed,
});
export const selectFilterSidebarOpen = (state: RootState) => state.ui.filterSidebarOpen;
export const selectActiveModal = (state: RootState) => state.ui.activeModal;
export const selectModalData = (state: RootState, modal: string) => state.ui.modalData[modal];
export const selectGlobalLoading = (state: RootState) => state.ui.globalLoading;
export const selectComponentLoading = (state: RootState, component: string) => state.ui.componentLoading[component];
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectCompactMode = (state: RootState) => state.ui.compactMode;
export const selectHighContrast = (state: RootState) => state.ui.highContrast;
export const selectPreferences = (state: RootState) => state.ui.preferences;
export const selectBreadcrumbs = (state: RootState) => state.ui.breadcrumbs;
export const selectGlobalSearchState = (state: RootState) => ({
  open: state.ui.globalSearchOpen,
  query: state.ui.globalSearchQuery,
});
export const selectRecentSearches = (state: RootState) => state.ui.recentSearches;
export const selectTableSettings = (state: RootState, tableId: string) =>
  state.ui.tableSettings[tableId] || {
    columnOrder: [],
    hiddenColumns: [],
    pageSize: state.ui.preferences.defaultPageSize,
  };

// Complex selectors
export const selectHasNotifications = createSelector([selectNotifications], (notifications) =>
  notifications.length > 0
);

export const selectUnreadNotifications = createSelector([selectNotifications], (notifications) =>
  notifications.filter(n => !n.persistent)
);

export const selectIsAnyComponentLoading = createSelector([selectUIState], (ui) =>
  Object.keys(ui.componentLoading).length > 0
);

export default uiSlice.reducer;