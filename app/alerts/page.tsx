"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAlerts } from "@/lib/api/data";
import { PageHeader } from "@/components/organisms/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { SearchInput } from "@/components/molecules/search-input";
import { StatCard } from "@/components/molecules/stat-card";
import { ClearFiltersButton } from "@/components/molecules/clear-filters-button";
import { ResultsCount } from "@/components/molecules/results-count";
import { EmptyState } from "@/components/molecules/empty-state";
import { FilterBadge } from "@/components/molecules/filter-badge";
import { CreateAlertDialog } from "@/components/organisms/alerts/create-alert-dialog";
import { FilterSidebar } from "@/components/organisms/filter-sidebar";
import { FilterToggleButton } from "@/components/molecules/filter-toggle-button";
import { AlertFilters } from "@/components/organisms/alerts/alert-filters";
import { Bell, AlertTriangle } from "lucide-react";
import { formatDate, getDaysFromToday } from "@/lib/utils/formatters";
import { useAuthStore } from "@/lib/stores/authStore";

/**
 * Alerts page
 * Manages program/study alerts and notifications
 */
export default function AlertsPage() {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts,
  });

  const { hasPermission } = useAuthStore();
  const canSetAlerts = hasPermission("set_alerts");

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [channelFilter, setChannelFilter] = useState("All");
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);

  // Filter alerts based on current filters
  const filteredAlerts = alerts?.filter((alert) => {
    const matchesSearch = searchQuery === "" ||
      alert.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.study.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || alert.status === statusFilter;
    const matchesChannel = channelFilter === "All" || alert.channel.includes(channelFilter);

    return matchesSearch && matchesStatus && matchesChannel;
  }) || [];

  const hasActiveFilters = searchQuery || statusFilter !== "All" || channelFilter !== "All";
  const activeFilterCount = [
    searchQuery,
    statusFilter !== "All" ? statusFilter : null,
    channelFilter !== "All" ? channelFilter : null,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setChannelFilter("All");
  };

  const activeAlerts = filteredAlerts.filter((a) => a.status === "Active") || [];
  const overdueAlerts = filteredAlerts.filter((a) => a.status === "Overdue") || [];
  const upcomingAlerts =
    filteredAlerts.filter((a) => {
      const days = getDaysFromToday(a.deadline);
      return days >= 0 && days <= 7 && a.status === "Active";
    }) || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alert & Notification System"
        description="Set program/study timelines • Web Push + Email + SMS notifications"
        action={<CreateAlertDialog canCreate={canSetAlerts} />}
      />

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Active Alerts" value={activeAlerts.length} icon={Bell} iconColor="text-primary" />
        <StatCard title="Overdue" value={overdueAlerts.length} icon={AlertTriangle} iconColor="text-destructive" valueColor="text-destructive" />
        <StatCard title="Next 7 Days" value={upcomingAlerts.length} icon={Bell} iconColor="text-amber-500" valueColor="text-amber-500" />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          {/* Search Bar */}
          <SearchInput
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <div className="flex items-center gap-4">
            {/* Filter Toggle */}
            <FilterToggleButton
              onClick={() => setFilterSidebarOpen(true)}
              activeCount={activeFilterCount}
              isOpen={filterSidebarOpen}
              label="Filters"
            />

            {hasActiveFilters && <ClearFiltersButton onClick={resetFilters} />}
            <ResultsCount filtered={filteredAlerts.length} total={alerts?.length || 0} label="alerts" />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {searchQuery && <FilterBadge label={searchQuery} onRemove={() => setSearchQuery("")} isSearch />}
          {statusFilter !== "All" && <FilterBadge label={statusFilter} onRemove={() => setStatusFilter("All")} />}
          {channelFilter !== "All" && <FilterBadge label={channelFilter} onRemove={() => setChannelFilter("All")} />}
        </div>
      </div>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              Loading alerts...
            </div>
          ) : filteredAlerts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Program
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Study
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Deadline
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Channel
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    {canSetAlerts && (
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredAlerts.map((alert) => {
                    const daysLeft = getDaysFromToday(alert.deadline);

                    return (
                      <tr
                        key={alert.id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="px-4 py-3 font-medium">{alert.program}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {alert.study}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {formatDate(alert.deadline)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {alert.channel.map((ch) => (
                              <Badge key={ch} variant="outline">
                                {ch}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-medium ${
                                alert.status === "Overdue"
                                  ? "text-destructive"
                                  : "text-green-500"
                              }`}
                            >
                              ● {alert.status}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {daysLeft > 0
                                ? `${daysLeft}d left`
                                : `${Math.abs(daysLeft)}d overdue`}
                            </span>
                          </div>
                        </td>
                        {canSetAlerts && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                Snooze
                              </Button>
                              <Button variant="outline" size="sm">
                                Dismiss
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : alerts && alerts.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No alerts configured"
              message="Create your first alert to stay notified about important program milestones."
            />
          ) : (
            <EmptyState
              title="No alerts match your filters"
              message="Try adjusting your search criteria or clearing filters."
              onClear={hasActiveFilters ? resetFilters : undefined}
            />
          )}
        </CardContent>
      </Card>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={filterSidebarOpen}
        onClose={() => setFilterSidebarOpen(false)}
        title="Alert Filters"
        activeFilterCount={activeFilterCount}
        onClearAll={hasActiveFilters ? resetFilters : undefined}
      >
        <AlertFilters
          statusFilter={statusFilter}
          channelFilter={channelFilter}
          setStatusFilter={setStatusFilter}
          setChannelFilter={setChannelFilter}
          searchQuery={searchQuery}
        />
      </FilterSidebar>
    </div>
  );
}
