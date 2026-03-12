"use client";

import { Shield, Users, X } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface UserFiltersProps {
  roleFilter: string;
  statusFilter: string;
  setRoleFilter: (role: string) => void;
  setStatusFilter: (status: string) => void;
  searchQuery: string;
  className?: string;
}

export function UserFilters({
  roleFilter,
  statusFilter,
  setRoleFilter,
  setStatusFilter,
  searchQuery: _searchQuery,
  className
}: UserFiltersProps) {
  const { t } = useTranslation();
  const hasActiveFilters = roleFilter !== "All" || statusFilter !== "All";

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Role Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t("iam.userRole")}
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">{t("iam.roles.all")}</option>
            <option value="Manager">{t("iam.roles.manager")}</option>
            <option value="Staff">{t("iam.roles.staff")}</option>
            <option value="Viewer">{t("iam.roles.viewer")}</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t("iam.accountStatus")}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">{t("iam.statuses.all")}</option>
            <option value="Active">{t("iam.statuses.active")}</option>
            <option value="Inactive">{t("iam.statuses.inactive")}</option>
          </select>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">{t("filters.activeFilters")}</h4>
            <div className="flex flex-wrap gap-2">
              {roleFilter !== "All" && (
                <Badge variant="secondary" className="gap-1">
                  {t("filters.role")}: {roleFilter}
                  <X
                    className="h-3 w-3 cursor-pointer hover:h-3.5 hover:w-3.5 transition-all"
                    onClick={() => setRoleFilter("All")}
                  />
                </Badge>
              )}
              {statusFilter !== "All" && (
                <Badge variant="secondary" className="gap-1">
                  {t("filters.status")}: {statusFilter}
                  <X
                    className="h-3 w-3 cursor-pointer hover:h-3.5 hover:w-3.5 transition-all"
                    onClick={() => setStatusFilter("All")}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Filter Information Panel */}
        <div className="rounded-lg bg-muted/30 p-4 space-y-2">
          <h4 className="text-sm font-medium">{t("filters.currentFilters")}</h4>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>{t("filters.role")}:</span>
              <span className="font-medium">{roleFilter}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("filters.status")}:</span>
              <span className="font-medium">{statusFilter}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">{t("filters.quickFilters")}</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setRoleFilter("Manager")}
              className="p-2 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
            >
              {t("iam.quickFilters.managersOnly")}
            </button>
            <button
              onClick={() => setStatusFilter("Active")}
              className="p-2 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
            >
              {t("iam.quickFilters.activeOnly")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
