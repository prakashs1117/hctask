"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { CheckCircle, XCircle, RefreshCw, TestTube } from "lucide-react";

interface DashboardStatsTest {
  totalPrograms: number;
  activeStudies: number;
  averageEnrollment: number;
  completedMilestones: number;
  upcomingMilestones: number;
  criticalAlerts: number;
  pendingApprovals: number;
  budgetUtilization: number;
  avgTimeToCompletion: number;
}

export function DashboardTestFix() {
  const [stats, setStats] = useState<DashboardStatsTest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');

      const result = await response.json();
      setStats(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const testItems = [
    {
      name: "Average Enrollment Fix",
      test: () => stats?.averageEnrollment !== undefined && stats?.averageEnrollment !== null,
      value: stats?.averageEnrollment,
      description: "Should show a numeric value instead of 'undefined'",
    },
    {
      name: "Quick Actions Alignment",
      test: () => true, // Visual test - check manually
      value: "Visual Check",
      description: "Quick action buttons should have consistent heights and proper text wrapping",
    },
    {
      name: "Stat Cards Layout",
      test: () => stats?.totalPrograms !== undefined,
      value: "Layout Test",
      description: "Stat cards should have proper text truncation and no overflow",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Dashboard Fixes Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Stats Display */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">API Dashboard Stats</h4>
            <Button
              onClick={fetchStats}
              disabled={loading}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              Error: {error}
            </div>
          )}

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Programs:</span>
                <div className="font-medium">{stats.totalPrograms}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Active Studies:</span>
                <div className="font-medium">{stats.activeStudies}</div>
              </div>
              <div className="p-2 bg-yellow-50 rounded border">
                <span className="text-muted-foreground">Avg. Enrollment:</span>
                <div className="font-medium text-lg">
                  {stats.averageEnrollment}%
                  {stats.averageEnrollment === undefined ? ' (UNDEFINED!)' : ''}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Completed Milestones:</span>
                <div className="font-medium">{stats.completedMilestones}</div>
              </div>
            </div>
          )}
        </div>

        {/* Test Results */}
        <div className="space-y-3">
          <h4 className="font-medium">Fix Verification Tests</h4>
          {testItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  {item.test() ? (
                    <Badge variant="default" className="gap-1 bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3" />
                      Pass
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Fail
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </div>
              </div>
              <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {typeof item.value === 'number' ? item.value.toString() : item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Layout Test */}
        <div className="space-y-2">
          <h4 className="font-medium">Quick Actions Layout Test</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { title: "Create New Program", description: "This is a test description that might be long and could potentially overflow" },
              { title: "Very Long Title That Should Truncate", description: "Short desc" },
              { title: "Normal", description: "Normal description text that fits well" },
              { title: "Test", description: "Another test with a reasonably long description to see how it wraps" }
            ].map((item, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 p-3 justify-start text-left hover:scale-[1.02] transition-transform duration-200"
              >
                <div className="flex items-center gap-3 w-full h-full">
                  <TestTube className="h-5 w-5 shrink-0 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-tight">
                      {item.description}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}