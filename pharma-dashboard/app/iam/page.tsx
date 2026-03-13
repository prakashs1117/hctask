"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/atoms/button";
import { FilterSidebar } from "@/components/organisms/filter-sidebar";
import { PageHeader } from "@/components/organisms/page-header";
import { UserFilters } from "@/components/organisms/iam/user-filters";
import { IAMStats } from "@/components/organisms/iam/iam-stats";
import { IAMFilterBar } from "@/components/organisms/iam/iam-filter-bar";
import { UserTable } from "@/components/organisms/iam/user-table";
import { Plus, Shield } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function IAMPage() {
  const { t } = useTranslation();
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/v1/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const json = await response.json();
      return json.data;
    },
  });

  const { hasPermission } = useAuthStore();
  const canManageUsers = hasPermission("manage_users");

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return users?.filter((user: { name: string; email: string; role: string; status: string }) => {
      const matchesSearch = searchQuery === "" ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesStatus = statusFilter === "All" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    }) || [];
  }, [users, searchQuery, roleFilter, statusFilter]);

  const hasActiveFilters = useMemo(() =>
    searchQuery || roleFilter !== "All" || statusFilter !== "All",
    [searchQuery, roleFilter, statusFilter]
  );

  const activeFilterCount = useMemo(() => [
    searchQuery,
    roleFilter !== "All" ? roleFilter : null,
    statusFilter !== "All" ? statusFilter : null,
  ].filter(Boolean).length, [searchQuery, roleFilter, statusFilter]);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setRoleFilter("All");
    setStatusFilter("All");
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader
        title={t("iam.title")}
        description={t("iam.subtitle")}
        icon={Shield}
        action={canManageUsers ? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("iam.addUser")}
          </Button>
        ) : undefined}
      />

      <IAMFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        filterSidebarOpen={filterSidebarOpen}
        setFilterSidebarOpen={setFilterSidebarOpen}
        activeFilterCount={activeFilterCount}
        hasActiveFilters={hasActiveFilters}
        resetFilters={resetFilters}
        filteredCount={filteredUsers.length}
        totalCount={users?.length || 0}
      />

      <IAMStats users={users} />

      <UserTable
        users={filteredUsers}
        isLoading={isLoading}
        canManageUsers={canManageUsers}
        onClearFilters={hasActiveFilters ? resetFilters : undefined}
      />

      <FilterSidebar
        isOpen={filterSidebarOpen}
        onClose={() => setFilterSidebarOpen(false)}
        title={t("iam.userFilters")}
        activeFilterCount={activeFilterCount}
        onClearAll={hasActiveFilters ? resetFilters : undefined}
      >
        <UserFilters
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          setRoleFilter={setRoleFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
        />
      </FilterSidebar>
    </div>
  );
}
