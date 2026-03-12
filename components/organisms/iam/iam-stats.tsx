"use client";

import { useMemo } from "react";
import { StatCard } from "@/components/molecules/stat-card";
import { Users, Shield, Eye } from "lucide-react";
import type { User } from "@/types";

interface IAMStatsProps {
  users: User[] | undefined;
}

export function IAMStats({ users }: IAMStatsProps) {
  const managers = useMemo(() => users?.filter((u) => u.role === "Manager") || [], [users]);
  const staff = useMemo(() => users?.filter((u) => u.role === "Staff") || [], [users]);
  const viewers = useMemo(() => users?.filter((u) => u.role === "Viewer") || [], [users]);

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Users" value={users?.length || 0} icon={Users} />
      <StatCard title="Managers" value={managers.length} icon={Shield} iconColor="text-primary" valueColor="text-primary" />
      <StatCard title="Staff" value={staff.length} icon={Users} iconColor="text-emerald-500" valueColor="text-emerald-600" />
      <StatCard title="Viewers" value={viewers.length} icon={Eye} />
    </div>
  );
}
