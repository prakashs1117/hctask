"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/api/data";
import { usePrograms } from "@/lib/hooks/usePrograms";
import { useFilterStore } from "@/lib/stores/filterStore";
import { useFilteredPrograms } from "@/lib/hooks/useFilteredPrograms";
import { FilterSidebar } from "@/components/organisms/filter-sidebar";
import { ViewModeToggle } from "@/components/molecules/view-mode-toggle";
import { ProgramFilters } from "@/components/organisms/programs/program-filters";
import { DashboardHeader } from "@/components/organisms/dashboard/dashboard-header";
import { DashboardStats } from "@/components/organisms/dashboard/dashboard-stats";
import { ProgramFilterBar } from "@/components/organisms/programs/program-filter-bar";
import { ProgramPortfolio } from "@/components/organisms/programs/program-portfolio";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data: programs, isLoading: programsLoading } = usePrograms();
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  const filters = useFilterStore();
  const filteredPrograms = useFilteredPrograms(programs, filters);
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

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <DashboardStats stats={stats} />

      <ProgramFilterBar
        filteredCount={filteredPrograms.length}
        totalCount={programs?.length || 0}
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
    </div>
  );
}
