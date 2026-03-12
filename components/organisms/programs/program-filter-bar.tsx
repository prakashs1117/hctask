"use client";

import { SearchInput } from "@/components/molecules/search-input";
import { ClearFiltersButton } from "@/components/molecules/clear-filters-button";
import { ResultsCount } from "@/components/molecules/results-count";
import { FilterBadge } from "@/components/molecules/filter-badge";
import { FilterToggleButton } from "@/components/molecules/filter-toggle-button";
import { useFilterStore } from "@/lib/stores/filterStore";

interface ProgramFilterBarProps {
  filteredCount: number;
  totalCount: number;
  filterSidebarOpen: boolean;
  setFilterSidebarOpen: (open: boolean) => void;
  hasActiveFilters: boolean | string;
  activeFilterCount: number;
  searchPlaceholder?: string;
  filterLabel?: string;
  clearLabel?: string;
  children?: React.ReactNode;
}

export function ProgramFilterBar({
  filteredCount,
  totalCount,
  filterSidebarOpen,
  setFilterSidebarOpen,
  hasActiveFilters,
  activeFilterCount,
  searchPlaceholder = "Search programs...",
  filterLabel = "Filters",
  clearLabel,
  children,
}: ProgramFilterBarProps) {
  const filters = useFilterStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
        <SearchInput
          placeholder={searchPlaceholder}
          value={filters.search}
          onChange={(value) => filters.setFilters({ search: value })}
        />

        <div className="flex items-center gap-4">
          <FilterToggleButton
            onClick={() => setFilterSidebarOpen(true)}
            activeCount={activeFilterCount}
            isOpen={filterSidebarOpen}
            label={filterLabel}
          />
          {hasActiveFilters && (
            <ClearFiltersButton onClick={() => filters.resetFilters()} label={clearLabel} />
          )}
          <ResultsCount filtered={filteredCount} total={totalCount} label="programs" />
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {filters.search && <FilterBadge label={filters.search} onRemove={() => filters.setFilters({ search: "" })} isSearch />}
          {filters.phase !== "All" && <FilterBadge label={filters.phase} onRemove={() => filters.setFilters({ phase: "All" })} />}
          {filters.therapeuticArea !== "All" && (
            <FilterBadge label={filters.therapeuticArea} onRemove={() => filters.setFilters({ therapeuticArea: "All" })} />
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
