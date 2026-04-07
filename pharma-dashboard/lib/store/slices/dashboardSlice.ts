import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface DashboardMetrics {
  totalPrograms: number;
  activeStudies: number;
  completedMilestones: number;
  upcomingMilestones: number;
  criticalAlerts: number;
  pendingApprovals: number;
  budgetUtilization: number;
  avgTimeToCompletion: number;
}

interface DashboardState {
  // Role-based metrics cache
  roleBasedMetrics: Record<string, DashboardMetrics>;

  // Dashboard preferences
  selectedTimeRange: '1M' | '3M' | '6M' | '1Y' | 'ALL';
  selectedMetrics: string[];
  chartType: 'line' | 'bar' | 'area';

  // Dashboard layout
  widgetLayout: Array<{
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }>;

  // Refresh settings
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
  lastRefresh: number;

  // Performance tracking
  loadTimes: Record<string, number>;
  errorCounts: Record<string, number>;
}

const defaultMetrics = [
  'totalPrograms',
  'activeStudies',
  'completedMilestones',
  'criticalAlerts'
];

const defaultLayout = [
  { id: 'programs', x: 0, y: 0, w: 3, h: 2 },
  { id: 'studies', x: 3, y: 0, w: 3, h: 2 },
  { id: 'milestones', x: 6, y: 0, w: 3, h: 2 },
  { id: 'alerts', x: 9, y: 0, w: 3, h: 2 },
];

const initialState: DashboardState = {
  roleBasedMetrics: {},
  selectedTimeRange: '3M',
  selectedMetrics: defaultMetrics,
  chartType: 'line',
  widgetLayout: defaultLayout,
  autoRefresh: true,
  refreshInterval: 300, // 5 minutes
  lastRefresh: Date.now(),
  loadTimes: {},
  errorCounts: {},
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Metrics caching
    setRoleBasedMetrics: (state, action: PayloadAction<{ role: string; metrics: DashboardMetrics }>) => {
      state.roleBasedMetrics[action.payload.role] = action.payload.metrics;
    },

    clearRoleMetrics: (state, action: PayloadAction<string>) => {
      delete state.roleBasedMetrics[action.payload];
    },

    // Dashboard preferences
    setTimeRange: (state, action: PayloadAction<DashboardState['selectedTimeRange']>) => {
      state.selectedTimeRange = action.payload;
    },

    toggleMetric: (state, action: PayloadAction<string>) => {
      const metric = action.payload;
      const index = state.selectedMetrics.indexOf(metric);
      if (index === -1) {
        state.selectedMetrics.push(metric);
      } else {
        state.selectedMetrics.splice(index, 1);
      }
    },

    setSelectedMetrics: (state, action: PayloadAction<string[]>) => {
      state.selectedMetrics = action.payload;
    },

    setChartType: (state, action: PayloadAction<DashboardState['chartType']>) => {
      state.chartType = action.payload;
    },

    // Layout management
    updateWidgetLayout: (state, action: PayloadAction<DashboardState['widgetLayout']>) => {
      state.widgetLayout = action.payload;
    },

    resetLayout: (state) => {
      state.widgetLayout = defaultLayout;
    },

    addWidget: (state, action: PayloadAction<{ id: string; x: number; y: number; w: number; h: number }>) => {
      state.widgetLayout.push(action.payload);
    },

    removeWidget: (state, action: PayloadAction<string>) => {
      state.widgetLayout = state.widgetLayout.filter(widget => widget.id !== action.payload);
    },

    // Refresh settings
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload;
    },

    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },

    updateLastRefresh: (state) => {
      state.lastRefresh = Date.now();
    },

    // Performance tracking
    recordLoadTime: (state, action: PayloadAction<{ component: string; time: number }>) => {
      state.loadTimes[action.payload.component] = action.payload.time;
    },

    incrementErrorCount: (state, action: PayloadAction<string>) => {
      const component = action.payload;
      state.errorCounts[component] = (state.errorCounts[component] || 0) + 1;
    },

    clearErrorCount: (state, action: PayloadAction<string>) => {
      delete state.errorCounts[action.payload];
    },

    resetPerformanceMetrics: (state) => {
      state.loadTimes = {};
      state.errorCounts = {};
    },
  },
});

// Action creators
export const {
  setRoleBasedMetrics,
  clearRoleMetrics,
  setTimeRange,
  toggleMetric,
  setSelectedMetrics,
  setChartType,
  updateWidgetLayout,
  resetLayout,
  addWidget,
  removeWidget,
  setAutoRefresh,
  setRefreshInterval,
  updateLastRefresh,
  recordLoadTime,
  incrementErrorCount,
  clearErrorCount,
  resetPerformanceMetrics,
} = dashboardSlice.actions;

// Selectors
export const selectDashboardState = (state: RootState) => state.dashboard;
export const selectRoleBasedMetrics = (state: RootState) => state.dashboard.roleBasedMetrics;
export const selectTimeRange = (state: RootState) => state.dashboard.selectedTimeRange;
export const selectSelectedMetrics = (state: RootState) => state.dashboard.selectedMetrics;
export const selectChartType = (state: RootState) => state.dashboard.chartType;
export const selectWidgetLayout = (state: RootState) => state.dashboard.widgetLayout;
export const selectAutoRefresh = (state: RootState) => state.dashboard.autoRefresh;
export const selectRefreshInterval = (state: RootState) => state.dashboard.refreshInterval;
export const selectLastRefresh = (state: RootState) => state.dashboard.lastRefresh;
export const selectLoadTimes = (state: RootState) => state.dashboard.loadTimes;
export const selectErrorCounts = (state: RootState) => state.dashboard.errorCounts;

// Complex selectors
export const selectMetricsForRole = createSelector(
  [selectRoleBasedMetrics, (_: RootState, role: string) => role],
  (roleMetrics, role) => roleMetrics[role]
);

export const selectShouldRefresh = createSelector(
  [selectAutoRefresh, selectRefreshInterval, selectLastRefresh],
  (autoRefresh, interval, lastRefresh) => {
    if (!autoRefresh) return false;
    return Date.now() - lastRefresh > interval * 1000;
  }
);

export const selectAverageLoadTime = createSelector([selectLoadTimes], (loadTimes) => {
  const times = Object.values(loadTimes) as number[];
  if (times.length === 0) return 0;
  return times.reduce((sum, time) => sum + time, 0) / times.length;
});

export const selectTotalErrors = createSelector([selectErrorCounts], (errorCounts) => {
  return (Object.values(errorCounts) as number[]).reduce((sum: number, count: number) => sum + count, 0);
});

export default dashboardSlice.reducer;