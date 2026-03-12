"use client";

import { useState, useMemo } from "react";
import { usePrograms } from "@/lib/hooks/usePrograms";
import { useFilterStore } from "@/lib/stores/filterStore";
import { useFilteredPrograms } from "@/lib/hooks/useFilteredPrograms";
import { Card, CardContent } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { EmptyState } from "@/components/molecules/empty-state";
import { FilterSidebar } from "@/components/organisms/filter-sidebar";
import { PageHeader } from "@/components/organisms/page-header";
import { ProgramFilterBar } from "@/components/organisms/programs/program-filter-bar";
import { EnrollmentBar } from "@/components/molecules/enrollment-bar";
import { PhaseBadge, TherapeuticAreaBadge } from "@/components/molecules/program-badge";
import { CreateProgramDialog } from "@/components/organisms/programs/create-program-dialog";
import { EditProgramDialog } from "@/components/organisms/programs/edit-program-dialog";
import { ProgramFilters } from "@/components/organisms/programs/program-filters";
import { calculateProgramTotals, truncateText } from "@/lib/utils/formatters";
import { Beaker, FileText, BarChart3, Users, Eye } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/authStore";

export default function ProgramsPage() {
  const { data: programs, isLoading } = usePrograms();
  const filters = useFilterStore();
  const filteredPrograms = useFilteredPrograms(programs, filters);
  const { hasPermission } = useAuthStore();
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);

  const canCreatePrograms = hasPermission("create_programs");

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
    <div className="space-y-4">
      <PageHeader
        title="Programs Module"
        description="Create and manage drug development programs and associated studies"
        icon={Beaker}
        action={<CreateProgramDialog canCreate={canCreatePrograms} />}
      />

      <ProgramFilterBar
        filteredCount={filteredPrograms.length}
        totalCount={programs?.length || 0}
        filterSidebarOpen={filterSidebarOpen}
        setFilterSidebarOpen={setFilterSidebarOpen}
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
      />

      <Card>
        <CardContent className="p-0">
          <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Program Portfolio
              </h3>
              <Badge variant="outline">{filteredPrograms.length} programs</Badge>
            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner message="Loading programs..." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 hidden sm:block" />
                        <span className="hidden sm:inline">ID</span>
                        <span className="sm:hidden">#</span>
                      </div>
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Beaker className="h-3 w-3 hidden sm:block" />
                        Program
                      </div>
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Area
                      </div>
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3 hidden sm:block" />
                        Phase
                      </div>
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                      Studies
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden xl:table-cell">
                      Enrollment
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                      Manager
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-right text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPrograms.map((program) => {
                    const { totalEnrollment, totalTarget } = calculateProgramTotals(program.studies);

                    return (
                      <tr key={program.id} className="transition-colors hover:bg-muted/30">
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs font-mono text-muted-foreground">
                          <span className="hidden sm:inline">{program.id}</span>
                          <span className="sm:hidden">{program.id.slice(0, 6)}...</span>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <div>
                            <Link
                              href={`/programs/${program.id}`}
                              className="font-semibold text-foreground hover:text-primary transition-colors text-sm"
                            >
                              <span className="hidden sm:inline">{program.name}</span>
                              <span className="sm:hidden">{truncateText(program.name, 20)}</span>
                            </Link>
                            {program.description && (
                              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-1 hidden sm:block leading-tight">
                                {program.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
                          <TherapeuticAreaBadge area={program.therapeuticArea} />
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <PhaseBadge phase={program.phase} />
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-sm">{program.studies.length}</span>
                            <span className="text-xs text-muted-foreground hidden xl:inline">studies</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 hidden xl:table-cell">
                          <div className="w-32">
                            <EnrollmentBar current={totalEnrollment} target={totalTarget} />
                            <div className="text-[10px] text-muted-foreground mt-1">
                              {totalEnrollment}/{totalTarget} enrolled
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs text-muted-foreground hidden lg:table-cell">
                          <span className="hidden xl:inline">{program.manager}</span>
                          <span className="xl:hidden">{program.manager.split(' ')[0]}</span>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Link href={`/programs/${program.id}`}>
                              <Button variant="ghost" size="sm" className="gap-1 h-7 px-2">
                                <Eye className="h-3 w-3" />
                                <span className="hidden sm:inline text-xs">View</span>
                              </Button>
                            </Link>
                            {hasPermission("edit_programs") && (
                              <EditProgramDialog
                                program={program}
                                canEdit={hasPermission("edit_programs")}
                                variant="table"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredPrograms.length === 0 && (
                <EmptyState
                  title="No programs found"
                  message="No programs match your current filters. Try adjusting your search criteria."
                  onClear={hasActiveFilters ? () => filters.resetFilters() : undefined}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <FilterSidebar
        isOpen={filterSidebarOpen}
        onClose={() => setFilterSidebarOpen(false)}
        title="Program Filters"
        activeFilterCount={activeFilterCount}
        onClearAll={hasActiveFilters ? () => filters.resetFilters() : undefined}
      >
        <ProgramFilters />
      </FilterSidebar>
    </div>
  );
}
