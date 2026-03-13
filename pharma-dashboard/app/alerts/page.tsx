"use client";

import { useState, useCallback } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAlerts } from "@/lib/hooks/useAlerts";
import { toast } from "sonner";
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
import { useTranslation } from "@/lib/hooks/useTranslation";

/**
 * Alerts page
 * Manages program/study alerts and notifications
 */
export default function AlertsPage() {
  const { t } = useTranslation();
  const { data: alerts, isLoading } = useAlerts();

  const queryClient = useQueryClient();
  const { hasPermission } = useAuthStore();
  const canSetAlerts = hasPermission("set_alerts");

  // Dismiss alert mutation
  const dismissMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/v1/alerts/${alertId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Dismissed" }),
      });
      if (!response.ok) throw new Error("Failed to dismiss alert");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast.success("Alert dismissed");
    },
    onError: () => {
      toast.error("Failed to dismiss alert");
    },
  });

  // Snooze alert mutation (pushes deadline by 7 days)
  const snoozeMutation = useMutation({
    mutationFn: async (alert: { id: string; deadline: Date }) => {
      const newDeadline = new Date(alert.deadline);
      newDeadline.setDate(newDeadline.getDate() + 7);
      const response = await fetch(`/api/v1/alerts/${alert.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deadline: newDeadline.toISOString(), status: "Active" }),
      });
      if (!response.ok) throw new Error("Failed to snooze alert");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast.success("Alert snoozed by 7 days");
    },
    onError: () => {
      toast.error("Failed to snooze alert");
    },
  });

  // Delete alert mutation
  const deleteMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/v1/alerts/${alertId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete alert");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast.success("Alert deleted");
    },
    onError: () => {
      toast.error("Failed to delete alert");
    },
  });

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
    const matchesChannel = channelFilter === "All" || alert.channel.includes(channelFilter as typeof alert.channel[number]);

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
        title={t("alerts.title")}
        description={t("alerts.subtitle")}
        action={<CreateAlertDialog canCreate={canSetAlerts} />}
      />

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title={t("alerts.activeAlerts")} value={activeAlerts.length} icon={Bell} iconColor="text-primary" />
        <StatCard title={t("alerts.overdue")} value={overdueAlerts.length} icon={AlertTriangle} iconColor="text-destructive" valueColor="text-destructive" />
        <StatCard title={t("alerts.nextSevenDays")} value={upcomingAlerts.length} icon={Bell} iconColor="text-amber-500" valueColor="text-amber-500" />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          {/* Search Bar */}
          <SearchInput
            placeholder={t("alerts.searchAlerts")}
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <div className="flex items-center gap-4">
            {/* Filter Toggle */}
            <FilterToggleButton
              onClick={() => setFilterSidebarOpen(true)}
              activeCount={activeFilterCount}
              isOpen={filterSidebarOpen}
              label={t("common.filters")}
            />

            {hasActiveFilters && <ClearFiltersButton onClick={resetFilters} label={t("common.clearAll")} />}
            <ResultsCount filtered={filteredAlerts.length} total={alerts?.length || 0} label={t("alerts.xAlerts").replace("{count}", "")} />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {statusFilter !== "All" && <FilterBadge label={statusFilter} onRemove={() => setStatusFilter("All")} />}
          {channelFilter !== "All" && <FilterBadge label={channelFilter} onRemove={() => setChannelFilter("All")} />}
        </div>
      </div>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("alerts.activeAlerts")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              {t("alerts.loadingAlerts")}
            </div>
          ) : filteredAlerts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      {t("alerts.program")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      {t("alerts.study")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      {t("alerts.deadline")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      {t("alerts.channel")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      {t("common.status")}
                    </th>
                    {canSetAlerts && (
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                        {t("common.actions")}
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
                              {alert.status !== "Dismissed" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={snoozeMutation.isPending}
                                    onClick={() => snoozeMutation.mutate({ id: alert.id, deadline: alert.deadline })}
                                  >
                                    {t("common.snooze")}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={dismissMutation.isPending}
                                    onClick={() => dismissMutation.mutate(alert.id)}
                                  >
                                    {t("common.dismiss")}
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                disabled={deleteMutation.isPending}
                                onClick={() => deleteMutation.mutate(alert.id)}
                              >
                                {t("common.delete")}
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
              title={t("alerts.noAlertsConfigured")}
              message={t("alerts.noAlertsConfiguredDesc")}
            />
          ) : (
            <EmptyState
              title={t("alerts.noAlertsMatch")}
              message={t("alerts.noAlertsMatchDesc")}
              onClear={hasActiveFilters ? resetFilters : undefined}
            />
          )}
        </CardContent>
      </Card>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={filterSidebarOpen}
        onClose={() => setFilterSidebarOpen(false)}
        title={t("alerts.alertFilters")}
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
