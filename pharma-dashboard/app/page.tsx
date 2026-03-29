"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/api/data";
import { usePrograms } from "@/lib/hooks/usePrograms";
import { useFilterStore } from "@/lib/stores/filterStore";
import { useFilteredPrograms } from "@/lib/hooks/useFilteredPrograms";
import { useRoleBasedPrograms, useRoleBasedMetrics } from "@/lib/hooks/useRoleBasedPrograms";
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
  const { data: allPrograms, isLoading: programsLoading } = usePrograms();
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  const filters = useFilterStore();

  // Apply role-based filtering
  const roleBasedPrograms = useRoleBasedPrograms(allPrograms, undefined);
  const filteredPrograms = useFilteredPrograms(roleBasedPrograms, filters);
  const roleBasedMetrics = useRoleBasedMetrics(allPrograms);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const hasActiveFilters = useMemo(() =>
    filters.search || filters.phase !== "All" || filters.therapeuticArea !== "All",
    [filters.search, filters.phase, filters.therapeuticArea]
  );

  const activeFilterCount = useMemo(() => [
    filters.search,
    filters.phase !== "All" ? filters.phase : null,
    filters.therapeuticArea !== "All" ? filters.therapeuticArea : null,
  ].filter(Boolean).length, [filters.search, filters.phase, filters.therapeuticArea]);

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
          setFilterSidebarOpen={setFilterSidebarOpen}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          searchPlaceholder={t("programs.searchPrograms")}
          filterLabel={t("common.filters")}
          clearLabel={t("common.clearAll")}
        >
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </ProgramFilterBar>

        <ProgramPortfolio
          programs={filteredPrograms}
          isLoading={programsLoading}
          viewMode={viewMode}
          onClearFilters={hasActiveFilters ? () => filters.resetFilters() : undefined}
        />

        <FilterSidebar
          isOpen={filterSidebarOpen}
          onClose={() => setFilterSidebarOpen(false)}
          title={t("dashboard.portfolioFilters")}
          activeFilterCount={activeFilterCount}
          onClearAll={hasActiveFilters ? () => filters.resetFilters() : undefined}
        >
          <ProgramFilters />
        </FilterSidebar>
      </RoleGuard>
    </div>
  );
}
