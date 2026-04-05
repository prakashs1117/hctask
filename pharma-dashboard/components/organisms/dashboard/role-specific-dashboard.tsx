"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { useAuthStore } from "@/lib/stores/authStore";
import { useRoleAccess } from "@/components/providers/role-guard";
import { useTranslation } from "@/lib/hooks/useTranslation";
import {
  Users,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Plus,
  Eye,
  FileText,
  Settings,
  Shield,
  Calendar
} from "lucide-react";
import Link from "next/link";
import type { Program, DashboardStats } from "@/types";

interface RoleSpecificDashboardProps {
  programs?: Program[];
  stats?: DashboardStats;
}

/**
 * Role-specific dashboard content based on user permissions
 */
export function RoleSpecificDashboard({ programs, stats }: RoleSpecificDashboardProps) {
  const { t } = useTranslation();
  const { role } = useAuthStore();
  const { checkAccess } = useRoleAccess();

  // Role-specific quick actions
  const quickActions = useMemo(() => {
    const actions = [];

    if (checkAccess(["create_programs"])) {
      actions.push({
        title: "Create New Program",
        description: "Start a new drug development program",
        icon: Plus,
        href: "/programs",
        variant: "default" as const,
      });
    }

    if (checkAccess(["manage_users"])) {
      actions.push({
        title: "Manage Users",
        description: "Add and manage team members",
        icon: Users,
        href: "/iam",
        variant: "secondary" as const,
      });
    }

    if (checkAccess(["set_alerts"])) {
      actions.push({
        title: "Configure Alerts",
        description: "Set up notifications and alerts",
        icon: AlertTriangle,
        href: "/alerts",
        variant: "outline" as const,
      });
    }

    // Always add view action
    actions.push({
      title: "View All Programs",
      description: "Browse program portfolio",
      icon: Eye,
      href: "/programs",
      variant: "outline" as const,
    });

    return actions;
  }, [checkAccess]);

  // Role-specific metrics
  const roleSpecificMetrics = useMemo(() => {
    if (!stats) return [];

    const metrics = [
      {
        title: "Total Programs",
        value: stats.totalPrograms,
        icon: FileText,
        description: "Active programs",
        trend: "+12%",
        accessible: true,
      },
      {
        title: "Active Studies",
        value: stats.activeStudies,
        icon: BarChart3,
        description: "Ongoing studies",
        trend: "+8%",
        accessible: checkAccess(["view_programs"]),
      },
      {
        title: "Avg. Enrollment",
        value: `${stats.averageEnrollment}%`,
        icon: TrendingUp,
        description: "Enrollment rate",
        trend: "+5%",
        accessible: checkAccess(["view_programs"]),
      },
      {
        title: "Active Alerts",
        value: stats.activeAlerts,
        icon: AlertTriangle,
        description: "Pending alerts",
        trend: "-2%",
        accessible: checkAccess(["view_alerts"]),
      },
    ];

    return metrics.filter(metric => metric.accessible);
  }, [stats, checkAccess]);

  // Role-specific program insights
  const programInsights = useMemo(() => {
    if (!programs || !stats) return null;

    const insights = [];

    if (role === "Manager") {
      insights.push({
        title: "Programs Requiring Attention",
        count: programs.filter(p => p.status === "On Hold").length,
        description: "Programs with issues that need management review",
        icon: AlertTriangle,
        color: "destructive",
        action: "Review Programs",
        href: "/programs?status=On Hold",
      });

      insights.push({
        title: "High-Priority Phases",
        count: programs.filter(p => ["Phase II", "Phase III"].includes(p.phase)).length,
        description: "Programs in critical development phases",
        icon: BarChart3,
        color: "default",
        action: "Monitor Progress",
        href: "/programs?phase=Phase II,Phase III",
      });
    }

    if (role === "Staff" || role === "Manager") {
      insights.push({
        title: "Studies to Review",
        count: programs.reduce((acc, p) => acc + p.studies.filter(s => s.milestone === "Analysis").length, 0),
        description: "Studies ready for analysis review",
        icon: FileText,
        color: "secondary",
        action: "Review Studies",
        href: "/programs",
      });
    }

    return insights;
  }, [programs, stats, role]);

  return (
    <div className="space-y-6">
      {/* Role-specific Welcome */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {role === "Manager" ? "Management Dashboard" :
                 role === "Staff" ? "Staff Dashboard" :
                 "Portfolio Overview"}
              </h2>
              <p className="text-muted-foreground">
                {role === "Manager" ? "Monitor and manage your drug development portfolio" :
                 role === "Staff" ? "Track your assigned studies and tasks" :
                 "View program portfolio and study progress"}
              </p>
            </div>
            <Badge variant={role === "Manager" ? "default" : role === "Staff" ? "secondary" : "outline"}>
              {role} View
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                asChild
                className="h-20 p-3 justify-start text-left hover:scale-[1.02] transition-transform duration-200"
              >
                <Link href={action.href} className="w-full h-full">
                  <div className="flex items-center gap-3 w-full h-full">
                    <action.icon className="h-5 w-5 shrink-0 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">{action.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-tight">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roleSpecificMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium truncate mr-2">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 truncate">{metric.value}</div>
              <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                {metric.description}
              </p>
              <div className="flex items-center pt-1">
                <span className="text-xs text-green-600 font-medium shrink-0">
                  {metric.trend}
                </span>
                <span className="text-xs text-muted-foreground ml-1 truncate">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role-specific Insights */}
      {programInsights && programInsights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programInsights.map((insight, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <insight.icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{insight.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{insight.count}</div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                  {insight.description}
                </p>
                <Button
                  variant={insight.color as any}
                  size="sm"
                  asChild
                  className="w-full"
                >
                  <Link href={insight.href} className="truncate">
                    {insight.action}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upcoming Schedule (Manager & Staff only) */}
      {(role === "Manager" || role === "Staff") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {role === "Manager"
                ? "Review upcoming program milestones and deadlines"
                : "Track your assigned study milestones and deliverables"
              }
            </div>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/programs">
                View Milestones
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}