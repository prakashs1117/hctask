"use client";

import { useState, useMemo } from "react";
import {
  usePrograms,
  useFilteredPrograms,
  useRoleBasedPrograms,
  useRoleBasedMetrics,
  useDashboardStats,
  useAppSelector,
  useAppDispatch,
  selectFilters,
  selectViewMode,
  selectActiveFilterCount,
  selectHasActiveFilters,
  resetFilters,
  setFilterSidebarOpen,
} from "@/lib/hooks/redux";
import { FilterSidebar } from "@/components/organisms/filter-sidebar";
import { ViewModeToggle } from "@/components/molecules/view-mode-toggle";
import { ProgramFilters } from "@/components/organisms/programs/program-filters";
import { DashboardHeader } from "@/components/organisms/dashboard/dashboard-header";
import { DashboardStats } from "@/components/organisms/dashboard/dashboard-stats";
import { RoleSpecificDashboard } from "@/components/organisms/dashboard/role-specific-dashboard";
import { ProgramFilterBar } from "@/components/organisms/programs/program-filter-bar";
import { ProgramPortfolio } from "@/components/organisms/programs/program-portfolio";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { useAuthStore } from "@/lib/stores/authStore";
import { RoleGuard } from "@/components/providers/role-guard";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { role } = useAuthStore();
  const dispatch = useAppDispatch();

  // Redux-based data fetching with caching
  const { data: allPrograms, isLoading: programsLoading } = usePrograms();
  const { data: stats } = useDashboardStats(role);

  // Redux selectors
  const filters = useAppSelector(selectFilters);
  const viewMode = useAppSelector(selectViewMode);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);
  const activeFilterCount = useAppSelector(selectActiveFilterCount);

  // Apply role-based filtering with caching
  const roleBasedPrograms = useRoleBasedPrograms(allPrograms, role);
  const { filteredPrograms } = useFilteredPrograms(roleBasedPrograms);
  const roleBasedMetrics = useRoleBasedMetrics(allPrograms, role);

  const [filterSidebarOpen, setFilterSidebarOpenLocal] = useState(false);

  // Enhanced stats with role-based data
  const enhancedStats = useMemo(() => ({
    ...stats,
    ...roleBasedMetrics,
  }), [stats, roleBasedMetrics]);

  return (
    <div className="space-y-6">
      {/* Role-specific Dashboard */}
      <RoleSpecificDashboard programs={roleBasedPrograms} stats={enhancedStats} />

      {/* Traditional Dashboard Stats for reference */}
      <RoleGuard requiredPermissions={["view_programs"]}>
        <DashboardStats stats={enhancedStats} />

        <ProgramFilterBar
          filteredCount={filteredPrograms.length}
          totalCount={roleBasedPrograms?.length || 0}
          filterSidebarOpen={filterSidebarOpen}
          setFilterSidebarOpen={setFilterSidebarOpenLocal}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          searchPlaceholder={t("programs.searchPrograms")}
          filterLabel={t("common.filters")}
          clearLabel={t("common.clearAll")}
        >
          <ViewModeToggle viewMode={viewMode} onViewModeChange={(mode) => dispatch({ type: 'programs/setViewMode', payload: mode })} />
        </ProgramFilterBar>

        <ProgramPortfolio
          programs={filteredPrograms}
          isLoading={programsLoading}
          viewMode={viewMode}
          onClearFilters={hasActiveFilters ? () => dispatch(resetFilters()) : undefined}
        />

        <FilterSidebar
          isOpen={filterSidebarOpen}
          onClose={() => setFilterSidebarOpenLocal(false)}
          title={t("dashboard.portfolioFilters")}
          activeFilterCount={activeFilterCount}
          onClearAll={hasActiveFilters ? () => dispatch(resetFilters()) : undefined}
        >
          <ProgramFilters />
        </FilterSidebar>
      </RoleGuard>
    </div>
  );
}
