"use client";

import { BarChart3, Users, X } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { useFilterStore } from "@/lib/stores/filterStore";
import { useTranslation } from "@/lib/hooks/useTranslation";

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
            {t("programs.phase")}
          </label>
          <select
            value={filters.phase}
            onChange={(e) =>
              filters.setFilters({ phase: e.target.value as typeof filters.phase })
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">{t("programs.phases.all")}</option>
            <option value="Preclinical">{t("programs.phases.preclinical")}</option>
            <option value="Phase I">{t("programs.phases.phase1")}</option>
            <option value="Phase II">{t("programs.phases.phase2")}</option>
            <option value="Phase III">{t("programs.phases.phase3")}</option>
            <option value="Phase IV">{t("programs.phases.phase4")}</option>
            <option value="Approved">{t("programs.phases.approved")}</option>
          </select>
        </div>

        {/* Therapeutic Area */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t("programs.therapeuticArea")}
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
            <option value="All">{t("programs.therapeuticAreas.all")}</option>
            <option value="Oncology">{t("programs.therapeuticAreas.oncology")}</option>
            <option value="Neurology">{t("programs.therapeuticAreas.neurology")}</option>
            <option value="Cardiology">{t("programs.therapeuticAreas.cardiology")}</option>
            <option value="Immunology">{t("programs.therapeuticAreas.immunology")}</option>
            <option value="Dermatology">{t("programs.therapeuticAreas.dermatology")}</option>
            <option value="Endocrinology">{t("programs.therapeuticAreas.endocrinology")}</option>
          </select>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">{t("filters.activeFilters")}</h4>
            <div className="flex flex-wrap gap-2">
              {filters.phase !== "All" && (
                <Badge variant="secondary" className="gap-1">
                  {t("filters.phase")}: {filters.phase}
                  <X
                    className="h-3 w-3 cursor-pointer hover:h-3.5 hover:w-3.5 transition-all"
                    onClick={() => filters.setFilters({ phase: "All" })}
                  />
                </Badge>
              )}
              {filters.therapeuticArea !== "All" && (
                <Badge variant="secondary" className="gap-1">
                  {t("filters.area")}: {filters.therapeuticArea}
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
          <h4 className="text-sm font-medium">{t("filters.filterSettings")}</h4>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>{t("filters.phase")}:</span>
              <span className="font-medium">{filters.phase}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("filters.area")}:</span>
              <span className="font-medium">{filters.therapeuticArea}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("filters.search")}:</span>
              <span className="font-medium">{filters.search || t("filters.none")}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">{t("filters.quickActions")}</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => filters.setFilters({ phase: "Phase III" })}
              className="p-2 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
            >
              {t("filters.phase3Only")}
            </button>
            <button
              onClick={() => filters.setFilters({ therapeuticArea: "Oncology" })}
              className="p-2 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
            >
              {t("filters.oncologyOnly")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
