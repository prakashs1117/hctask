"use client";

import { Bell, AlertTriangle, X } from "lucide-react";
import { Badge } from "@/components/atoms/badge";

interface AlertFiltersProps {
  statusFilter: string;
  channelFilter: string;
  setStatusFilter: (status: string) => void;
  setChannelFilter: (channel: string) => void;
  searchQuery: string;
  className?: string;
}

export function AlertFilters({
  statusFilter,
  channelFilter,
  setStatusFilter,
  setChannelFilter,
  searchQuery,
  className
}: AlertFiltersProps) {
  const hasActiveFilters = statusFilter !== "All" || channelFilter !== "All";

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Status Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alert Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Overdue">Overdue</option>
            <option value="Completed">Completed</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>

        {/* Channel Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Notification Channel
          </label>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">All Channels</option>
            <option value="Email">Email</option>
            <option value="SMS">SMS</option>
            <option value="Web Push">Web Push</option>
            <option value="Slack">Slack</option>
          </select>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {statusFilter !== "All" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {statusFilter}
                  <X
                    className="h-3 w-3 cursor-pointer hover:h-3.5 hover:w-3.5 transition-all"
                    onClick={() => setStatusFilter("All")}
                  />
                </Badge>
              )}
              {channelFilter !== "All" && (
                <Badge variant="secondary" className="gap-1">
                  Channel: {channelFilter}
                  <X
                    className="h-3 w-3 cursor-pointer hover:h-3.5 hover:w-3.5 transition-all"
                    onClick={() => setChannelFilter("All")}
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
              <span>Status:</span>
              <span className="font-medium">{statusFilter}</span>
            </div>
            <div className="flex justify-between">
              <span>Channel:</span>
              <span className="font-medium">{channelFilter}</span>
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
              onClick={() => setStatusFilter("Overdue")}
              className="p-2 text-xs bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md transition-colors"
            >
              Overdue Only
            </button>
            <button
              onClick={() => setStatusFilter("Active")}
              className="p-2 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            >
              Active Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}