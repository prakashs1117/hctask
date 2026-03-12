import { useMemo, useCallback } from "react";
import type { ProgramFilters } from "@/types";

/**
 * Filter store state interface
 */
interface FilterStore extends ProgramFilters {
  setFilters: (filters: Partial<ProgramFilters>) => void;
  resetFilters: () => void;
}

/**
 * Custom hook for optimized filter calculations and handlers
 * @param filters - Current filter state
 * @returns Memoized filter calculations and handlers
 */
export function useOptimizedFilters(filters: FilterStore) {
  // Memoize active filter status
  const hasActiveFilters = useMemo(() =>
    filters.search ||
    filters.phase !== "All" ||
    filters.therapeuticArea !== "All" ||
    filters.status !== "All",
    [filters.search, filters.phase, filters.therapeuticArea, filters.status]
  );

  // Memoize active filter count
  const activeFilterCount = useMemo(() => [
    filters.search,
    filters.phase !== "All" ? filters.phase : null,
    filters.therapeuticArea !== "All" ? filters.therapeuticArea : null,
    filters.status !== "All" ? filters.status : null,
  ].filter(Boolean).length, [filters.search, filters.phase, filters.therapeuticArea, filters.status]);

  // Memoize filter handler functions
  const clearSearch = useCallback(() => {
    filters.setFilters({ search: "" });
  }, [filters]);

  const clearPhase = useCallback(() => {
    filters.setFilters({ phase: "All" });
  }, [filters]);

  const clearTherapeuticArea = useCallback(() => {
    filters.setFilters({ therapeuticArea: "All" });
  }, [filters]);

  const clearStatus = useCallback(() => {
    filters.setFilters({ status: "All" });
  }, [filters]);

  const setSearchFilter = useCallback((search: string) => {
    filters.setFilters({ search });
  }, [filters]);

  return {
    hasActiveFilters,
    activeFilterCount,
    clearSearch,
    clearPhase,
    clearTherapeuticArea,
    clearStatus,
    setSearchFilter,
    resetFilters: filters.resetFilters,
  };
}