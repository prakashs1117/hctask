import { useMemo } from 'react';
import { useGetAlertsQuery } from '@/lib/store/api/apiSlice';
import type { Alert } from '@/types';

/**
 * Hook to fetch alerts with RTK Query caching
 */
export function useAlerts() {
  const {
    data: response,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetAlertsQuery(undefined, {
    // Refresh alerts more frequently (every 2 minutes)
    pollingInterval: 2 * 60 * 1000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const alerts = response?.data || [];

  return {
    data: alerts,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    isSuccess: !!response && !isError,
    isUninitialized: response === undefined && !isLoading,
  };
}

/**
 * Hook to get filtered alerts by priority and type
 */
export function useFilteredAlerts(priority?: string, type?: string, limit?: number) {
  const { data: alerts, ...rest } = useAlerts();

  const filteredAlerts = useMemo(() => {
    let filtered = [...alerts];

    // Filter by priority
    if (priority && priority !== 'All') {
      filtered = filtered.filter(alert => alert.priority === priority);
    }

    // Filter by type
    if (type && type !== 'All') {
      filtered = filtered.filter(alert => alert.type === type);
    }

    // Sort by created date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply limit
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [alerts, priority, type, limit]);

  return {
    data: filteredAlerts,
    ...rest,
  };
}

/**
 * Hook to get critical alerts (high priority)
 */
export function useCriticalAlerts(limit: number = 5) {
  return useFilteredAlerts('High', undefined, limit);
}

/**
 * Hook to get recent alerts (last 24 hours)
 */
export function useRecentAlerts(limit: number = 10) {
  const { data: alerts, ...rest } = useAlerts();

  const recentAlerts = useMemo(() => {
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    return alerts
      .filter(alert => new Date(alert.createdAt) > oneDayAgo)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [alerts, limit]);

  return {
    data: recentAlerts,
    ...rest,
  };
}

/**
 * Hook to get alert statistics and metrics
 */
export function useAlertMetrics() {
  const { data: alerts, isLoading } = useAlerts();

  const metrics = useMemo(() => {
    if (isLoading || !alerts) {
      return {
        total: 0,
        byPriority: { High: 0, Medium: 0, Low: 0 },
        byType: {},
        byStatus: { Active: 0, Resolved: 0, Dismissed: 0 },
        recentCount: 0,
        resolvedToday: 0,
      };
    }

    const byPriority = alerts.reduce((acc, alert) => {
      acc[alert.priority] = (acc[alert.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byType = alerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = alerts.reduce((acc, alert) => {
      acc[alert.status] = (acc[alert.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count recent alerts (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    const recentCount = alerts.filter(alert => new Date(alert.createdAt) > oneDayAgo).length;

    // Count alerts resolved today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resolvedToday = alerts.filter(alert => {
      return alert.status === 'Resolved' &&
             alert.resolvedAt &&
             new Date(alert.resolvedAt) >= today;
    }).length;

    return {
      total: alerts.length,
      byPriority,
      byType,
      byStatus,
      recentCount,
      resolvedToday,
    };
  }, [alerts, isLoading]);

  return {
    metrics,
    isLoading,
  };
}

/**
 * Hook to get alert trends and patterns
 */
export function useAlertTrends(days: number = 7) {
  const { data: alerts, isLoading } = useAlerts();

  const trends = useMemo(() => {
    if (isLoading || !alerts) {
      return {
        dailyCounts: [],
        priorityTrends: [],
        typeTrends: [],
        resolutionRate: 0,
        avgResolutionTime: 0,
      };
    }

    // Calculate daily alert counts for the last N days
    const dailyCounts = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = alerts.filter(alert => {
        const alertDate = new Date(alert.createdAt);
        return alertDate >= date && alertDate < nextDate;
      }).length;

      dailyCounts.push({
        date: date.toISOString().split('T')[0],
        count,
      });
    }

    // Calculate resolution metrics
    const resolvedAlerts = alerts.filter(alert => alert.status === 'Resolved' && alert.resolvedAt);
    const resolutionRate = alerts.length > 0 ? (resolvedAlerts.length / alerts.length) * 100 : 0;

    const avgResolutionTime = resolvedAlerts.length > 0
      ? resolvedAlerts.reduce((sum, alert) => {
          const created = new Date(alert.createdAt);
          const resolved = new Date(alert.resolvedAt!);
          const hours = (resolved.getTime() - created.getTime()) / (1000 * 60 * 60);
          return sum + hours;
        }, 0) / resolvedAlerts.length
      : 0;

    return {
      dailyCounts,
      resolutionRate: Math.round(resolutionRate),
      avgResolutionTime: Math.round(avgResolutionTime),
    };
  }, [alerts, isLoading, days]);

  return {
    trends,
    isLoading,
  };
}

/**
 * Hook to get alerts by program ID
 */
export function useProgramAlerts(programId: string) {
  const { data: alerts, ...rest } = useAlerts();

  const programAlerts = useMemo(() => {
    return alerts.filter(alert => alert.programId === programId);
  }, [alerts, programId]);

  return {
    data: programAlerts,
    ...rest,
  };
}

/**
 * Hook for alert notifications and real-time updates
 */
export function useAlertNotifications() {
  const { data: alerts, isFetching } = useAlerts();

  const notifications = useMemo(() => {
    if (!alerts) return [];

    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    // Get new alerts from the last 5 minutes
    const newAlerts = alerts
      .filter(alert => new Date(alert.createdAt) > fiveMinutesAgo)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return newAlerts.map(alert => ({
      id: alert.id,
      title: `${alert.priority} Priority Alert`,
      message: alert.message,
      type: alert.priority === 'High' ? 'error' : 'warning',
      timestamp: new Date(alert.createdAt).getTime(),
    }));
  }, [alerts]);

  return {
    notifications,
    hasNewAlerts: notifications.length > 0,
    isFetching,
  };
}