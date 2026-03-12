"use client";

import { BarChart3, Users, X } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { useFilterStore } from "@/lib/stores/filterStore";
import { useTranslation, TRANSLATION_KEYS } from "@/lib/i18n";

interface ProgramFiltersProps {
  className?: string;
}

export function ProgramFilters({ className }: ProgramFiltersProps) {
  const { t } = useTranslation();
  const filters = useFilterStore();

  const hasActiveFilters = filters.phase !== "All" || filters.therapeuticArea !== "All";

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Development Phase */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t(TRANSLATION_KEYS.PROGRAM.DEVELOPMENT_PHASE)}
          </label>
          <select
            value={filters.phase}
            onChange={(e) =>
              filters.setFilters({ phase: e.target.value as typeof filters.phase })
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">All Phases</option>
            <option value="Preclinical">Preclinical</option>
            <option value="Phase I">Phase I</option>
            <option value="Phase II">Phase II</option>
            <option value="Phase III">Phase III</option>
            <option value="Phase IV">Phase IV</option>
            <option value="Approved">Approved</option>
          </select>
        </div>

        {/* Therapeutic Area */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Therapeutic Area
          </label>
          <select
            value={filters.therapeuticArea}
            onChange={(e) =>
              filters.setFilters({
                therapeuticArea: e.target.value as typeof filters.therapeuticArea,
              })
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">All Areas</option>
            <option value="Oncology">Oncology</option>
            <option value="Neurology">Neurology</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Immunology">Immunology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Endocrinology">Endocrinology</option>
          </select>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {filters.phase !== "All" && (
                <Badge variant="secondary" className="gap-1">
                  Phase: {filters.phase}
                  <X
                    className="h-3 w-3 cursor-pointer hover:h-3.5 hover:w-3.5 transition-all"
                    onClick={() => filters.setFilters({ phase: "All" })}
                  />
                </Badge>
              )}
              {filters.therapeuticArea !== "All" && (
                <Badge variant="secondary" className="gap-1">
                  Area: {filters.therapeuticArea}
                  <X
                    className="h-3 w-3 cursor-pointer hover:h-3.5 hover:w-3.5 transition-all"
                    onClick={() => filters.setFilters({ therapeuticArea: "All" })}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Filter Information Panel */}
        <div className="rounded-lg bg-muted/30 p-4 space-y-2">
          <h4 className="text-sm font-medium">Filter Settings</h4>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Phase:</span>
              <span className="font-medium">{filters.phase}</span>
            </div>
            <div className="flex justify-between">
              <span>Area:</span>
              <span className="font-medium">{filters.therapeuticArea}</span>
            </div>
            <div className="flex justify-between">
              <span>Search:</span>
              <span className="font-medium">{filters.search || 'None'}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => filters.setFilters({ phase: "Phase III" })}
              className="p-2 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
            >
              Phase III Only
            </button>
            <button
              onClick={() => filters.setFilters({ therapeuticArea: "Oncology" })}
              className="p-2 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
            >
              Oncology Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}