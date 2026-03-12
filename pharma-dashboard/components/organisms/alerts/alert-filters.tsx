"use client";

import { Bell, AlertTriangle, X } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { useTranslation } from "@/lib/hooks/useTranslation";

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
  className
}: AlertFiltersProps) {
  const { t } = useTranslation();
  const hasActiveFilters = statusFilter !== "All" || channelFilter !== "All";

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Status Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t("alerts.alertStatus")}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">{t("alerts.statuses.all")}</option>
            <option value="Active">{t("alerts.statuses.active")}</option>
            <option value="Overdue">{t("alerts.statuses.overdue")}</option>
            <option value="Completed">{t("alerts.statuses.completed")}</option>
            <option value="Dismissed">{t("alerts.statuses.dismissed")}</option>
          </select>
        </div>

        {/* Channel Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {t("alerts.notificationChannel")}
          </label>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">{t("alerts.channels.all")}</option>
            <option value="Email">{t("alerts.channels.email")}</option>
            <option value="SMS">{t("alerts.channels.sms")}</option>
            <option value="Web Push">{t("alerts.channels.webPush")}</option>
            <option value="Slack">{t("alerts.channels.slack")}</option>
          </select>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">{t("filters.activeFilters")}</h4>
            <div className="flex flex-wrap gap-2">
              {statusFilter !== "All" && (
                <Badge variant="secondary" className="gap-1">
                  {t("filters.status")}: {statusFilter}
                  <X
                    className="h-3 w-3 cursor-pointer hover:h-3.5 hover:w-3.5 transition-all"
                    onClick={() => setStatusFilter("All")}
                  />
                </Badge>
              )}
              {channelFilter !== "All" && (
                <Badge variant="secondary" className="gap-1">
                  {t("filters.channel")}: {channelFilter}
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
          <h4 className="text-sm font-medium">{t("filters.filterSettings")}</h4>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>{t("filters.status")}:</span>
              <span className="font-medium">{statusFilter}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("filters.channel")}:</span>
              <span className="font-medium">{channelFilter}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">{t("filters.quickFilters")}</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setStatusFilter("Overdue")}
              className="p-2 text-xs bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md transition-colors"
            >
              {t("alerts.quickFilters.overdueOnly")}
            </button>
            <button
              onClick={() => setStatusFilter("Active")}
              className="p-2 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            >
              {t("alerts.quickFilters.activeOnly")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
