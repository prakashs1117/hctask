"use client";

import { SearchInput } from "@/components/molecules/search-input";
import { ClearFiltersButton } from "@/components/molecules/clear-filters-button";
import { ResultsCount } from "@/components/molecules/results-count";
import { FilterBadge } from "@/components/molecules/filter-badge";
import { FilterToggleButton } from "@/components/molecules/filter-toggle-button";

interface IAMFilterBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  filterSidebarOpen: boolean;
  setFilterSidebarOpen: (open: boolean) => void;
  activeFilterCount: number;
  hasActiveFilters: boolean | string;
  resetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export function IAMFilterBar({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  filterSidebarOpen,
  setFilterSidebarOpen,
  activeFilterCount,
  hasActiveFilters,
  resetFilters,
  filteredCount,
  totalCount,
}: IAMFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
        <SearchInput
          placeholder="Search users..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <div className="flex items-center gap-4">
          <FilterToggleButton
            onClick={() => setFilterSidebarOpen(true)}
            activeCount={activeFilterCount}
            isOpen={filterSidebarOpen}
            label="Filters"
          />
          {hasActiveFilters && <ClearFiltersButton onClick={resetFilters} />}
          <ResultsCount filtered={filteredCount} total={totalCount} label="users" />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {searchQuery && <FilterBadge label={searchQuery} onRemove={() => setSearchQuery("")} isSearch />}
        {roleFilter !== "All" && <FilterBadge label={roleFilter} onRemove={() => setRoleFilter("All")} />}
        {statusFilter !== "All" && <FilterBadge label={statusFilter} onRemove={() => setStatusFilter("All")} />}
      </div>
    </div>
  );
}
