/**
 * Redux-based hooks barrel exports
 * These hooks provide optimized data fetching with caching,
 * real-time updates, and performance optimizations using RTK Query
 */

// Program hooks
export {
  usePrograms,
  useProgram,
  useFilteredPrograms,
  useProgramMetrics,
  useRoleBasedPrograms,
  useRoleBasedMetrics,
} from './usePrograms';

// Dashboard hooks
export {
  useDashboardStats,
  useComputedDashboardMetrics,
  useDashboardPerformance,
  useDashboardRealTime,
  useAggregatedDashboardData,
} from './useDashboard';

// Alert hooks
export {
  useAlerts,
  useFilteredAlerts,
  useCriticalAlerts,
  useRecentAlerts,
  useAlertMetrics,
  useAlertTrends,
  useProgramAlerts,
  useAlertNotifications,
} from './useAlerts';

// Re-export store hooks
export {
  useAppDispatch,
  useAppSelector,
  useAppStore,
  useTypedDispatch,
  useAppSelectorWithMemo,
  useShallowEqualSelector,
  useComputedSelector,
  useConditionalSelector,
  useThrottledSelector,
  useDebouncedSelector,
} from '../../store/hooks';

// Performance optimization hooks
export {
  useOptimizedComponent,
  withOptimization,
  useOptimizedList,
  useVirtualizedList,
  useDebouncedAction,
  useThrottledAction,
} from './useOptimizedComponent';

// Re-export RTK Query hooks for direct API access
export {
  useGetProgramsQuery,
  useGetProgramByIdQuery,
  useGetDashboardStatsQuery,
  useGetAlertsQuery,
  useGetUsersQuery,
  useUpdateProgramMutation,
  useCreateProgramMutation,
  useDeleteProgramMutation,
  useLazyGetProgramsQuery,
  useLazyGetProgramByIdQuery,
} from '../../store/api/apiSlice';

// Re-export action creators for components that need direct store updates
export {
  selectProgram,
  deselectProgram,
  toggleProgramSelection,
  clearSelection,
  selectAllPrograms,
  toggleFavorite,
  setViewMode,
  setSorting,
  setSearchFilter,
  setPhaseFilter,
  setTherapeuticAreaFilter,
  setRiskLevelFilter,
  setStatusFilter,
  setAllFilters,
  resetFilters,
  expandProgram,
  collapseProgram,
  toggleProgramExpansion,
} from '../../store/slices/programsSlice';

export {
  setTimeRange,
  toggleMetric,
  setSelectedMetrics,
  setChartType,
  updateWidgetLayout,
  resetLayout,
  setAutoRefresh,
  setRefreshInterval,
} from '../../store/slices/dashboardSlice';

export {
  toggleSidebar,
  setSidebarOpen,
  toggleFilterSidebar,
  setFilterSidebarOpen,
  openModal,
  closeModal,
  setGlobalLoading,
  setComponentLoading,
  addNotification,
  removeNotification,
  setTheme,
  toggleCompactMode,
} from '../../store/slices/uiSlice';

// Re-export selectors for components that need computed values
export {
  selectActiveFilterCount,
  selectHasActiveFilters,
  selectIsProgramFavorite,
  selectIsProgramSelected,
  selectFilters,
  selectViewMode,
  selectSorting,
} from '../../store/slices/programsSlice';

export {
  selectTimeRange,
  selectSelectedMetrics,
  selectAutoRefresh,
  selectShouldRefresh,
} from '../../store/slices/dashboardSlice';

export {
  selectSidebarState,
  selectFilterSidebarOpen,
  selectActiveModal,
  selectGlobalLoading,
  selectNotifications,
  selectTheme,
  selectCompactMode,
} from '../../store/slices/uiSlice';