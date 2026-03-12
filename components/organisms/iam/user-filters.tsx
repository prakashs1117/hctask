"use client";

import { Shield, Users, X } from "lucide-react";
import { Badge } from "@/components/atoms/badge";

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
  searchQuery,
  className
}: UserFiltersProps) {
  const hasActiveFilters = roleFilter !== "All" || statusFilter !== "All";

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Role Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            User Role
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">All Roles</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Account Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {roleFilter !== "All" && (
                <Badge variant="secondary" className="gap-1">
                  Role: {roleFilter}
                  <X
                    className="h-3 w-3 cursor-pointer hover:h-3.5 hover:w-3.5 transition-all"
                    onClick={() => setRoleFilter("All")}
                  />
                </Badge>
              )}
              {statusFilter !== "All" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {statusFilter}
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
          <h4 className="text-sm font-medium">Current Filters</h4>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Role:</span>
              <span className="font-medium">{roleFilter}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium">{statusFilter}</span>
            </div>
            <div className="flex justify-between">
              <span>Search:</span>
              <span className="font-medium">{searchQuery || 'None'}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Quick Filters</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setRoleFilter("Manager")}
              className="p-2 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
            >
              Managers Only
            </button>
            <button
              onClick={() => setStatusFilter("Active")}
              className="p-2 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
            >
              Active Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}