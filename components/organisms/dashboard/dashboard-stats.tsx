import { useMemo } from "react";
import { StatCard } from "@/components/molecules/stat-card";
import { Beaker, TrendingUp, Bell, FileText } from "lucide-react";
import { useTranslation, TRANSLATION_KEYS } from "@/lib/i18n";
import type { DashboardStats as DashboardStatsType } from "@/types";

interface DashboardStatsProps {
  stats: DashboardStatsType | undefined;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const { t } = useTranslation();

  const statCards = useMemo(() => [
    {
      title: t(TRANSLATION_KEYS.DASHBOARD.STATS.TOTAL_PROGRAMS),
      value: stats?.totalPrograms || 0,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      description: t(TRANSLATION_KEYS.DASHBOARD.STATS.TOTAL_PROGRAMS_DESC),
    },
    {
      title: t(TRANSLATION_KEYS.DASHBOARD.STATS.ACTIVE_STUDIES),
      value: stats?.activeStudies || 0,
      icon: Beaker,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      description: t(TRANSLATION_KEYS.DASHBOARD.STATS.ACTIVE_STUDIES_DESC),
    },
    {
      title: t(TRANSLATION_KEYS.DASHBOARD.STATS.AVG_ENROLLMENT),
      value: `${stats?.averageEnrollment || 0}%`,
      icon: TrendingUp,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      description: t(TRANSLATION_KEYS.DASHBOARD.STATS.AVG_ENROLLMENT_DESC),
    },
    {
      title: t(TRANSLATION_KEYS.DASHBOARD.STATS.ACTIVE_ALERTS),
      value: stats?.activeAlerts || 0,
      icon: Bell,
      color: "text-red-500",
      bgColor: "bg-red-50",
      description: t(TRANSLATION_KEYS.DASHBOARD.STATS.ACTIVE_ALERTS_DESC),
    },
  ], [stats, t]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.color}
          bgColor={stat.bgColor}
          description={stat.description}
        />
      ))}
    </div>
  );
}
