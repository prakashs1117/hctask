import { useMemo } from 'react';
import { useGetDashboardStatsQuery } from '@/lib/store/api/apiSlice';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import {
  selectRoleBasedMetrics,
  selectTimeRange,
  selectSelectedMetrics,
  setRoleBasedMetrics,
  updateLastRefresh
} from '@/lib/store/slices/dashboardSlice';
import type { Program } from '@/types';

/**
 * Hook to get dashboard statistics with caching and role-based filtering
 */
export function useDashboardStats(role?: string) {
  const dispatch = useAppDispatch();
  const {
    data: response,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetDashboardStatsQuery(undefined, {
    // Refetch every 2 minutes for fresh data
    pollingInterval: 2 * 60 * 1000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const stats = response?.data;
  const timeRange = useAppSelector(selectTimeRange);
  const roleBasedMetrics = useAppSelector(selectRoleBasedMetrics);

  // Get cached role-based metrics if available
  const cachedRoleMetrics = useMemo(() => {
    return role ? roleBasedMetrics[role] : null;
  }, [roleBasedMetrics, role]);

  // Update last refresh timestamp
  useMemo(() => {
    if (stats && !isLoading) {
      dispatch(updateLastRefresh());
    }
  }, [stats, isLoading, dispatch]);

  return {
    data: cachedRoleMetrics || stats,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    timeRange,
    isSuccess: !!response && !isError,
    isUninitialized: response === undefined && !isLoading,
  };
}

/**
 * Hook to compute role-based dashboard metrics from program data
 */
export function useComputedDashboardMetrics(programs?: Program[], role?: string) {
  const dispatch = useAppDispatch();

  const metrics = useMemo(() => {
    if (!programs || programs.length === 0) {
      return {
        totalPrograms: 0,
        activeStudies: 0,
        completedMilestones: 0,
        upcomingMilestones: 0,
        criticalAlerts: 0,
        pendingApprovals: 0,
        budgetUtilization: 0,
        avgTimeToCompletion: 0,
      };
    }

    // Filter programs based on role
    let filteredPrograms = programs;
    if (role === 'scientist') {
      filteredPrograms = programs.filter(p => p.status !== 'Terminated');
    } else if (role === 'executive') {
      filteredPrograms = programs.filter(p => ['Phase II', 'Phase III', 'Approved'].includes(p.phase));
    }

    const totalPrograms = filteredPrograms.length;
    const activeStudies = filteredPrograms.reduce((sum, program) => {
      return sum + (program.studies?.filter(study => study.status === 'Active').length || 0);
    }, 0);

    const now = new Date();
    let completedMilestones = 0;
    let upcomingMilestones = 0;
    let criticalAlerts = 0;
    let pendingApprovals = 0;

    filteredPrograms.forEach(program => {
      // Count milestones
      program.milestones?.forEach(milestone => {
        if (milestone.completedDate) {
          completedMilestones++;
        } else {
          const dueDate = new Date(milestone.dueDate);
          const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

          if (daysDiff <= 30 && daysDiff >= 0) {
            upcomingMilestones++;
          }

          if (daysDiff < 0) {
            criticalAlerts++;
          }
        }
      });

      // Count pending approvals (assuming studies waiting for approval)
      if (program.status === 'Pending Approval') {
        pendingApprovals++;
      }
    });

    // Calculate budget utilization (mock calculation)
    const totalBudget = filteredPrograms.reduce((sum, program) => sum + (program.budget || 0), 0);
    const utilizedBudget = filteredPrograms.reduce((sum, program) => {
      const progress = program.progress || 0;
      return sum + (program.budget || 0) * (progress / 100);
    }, 0);
    const budgetUtilization = totalBudget > 0 ? (utilizedBudget / totalBudget) * 100 : 0;

    // Calculate average enrollment percentage
    const totalEnrollment = filteredPrograms.reduce((sum, program) => {
      return sum + (program.studies?.reduce((studySum, study) => {
        const enrollmentPercentage = study.targetEnrollment > 0
          ? (study.enrollmentCount / study.targetEnrollment) * 100
          : 0;
        return studySum + enrollmentPercentage;
      }, 0) || 0);
    }, 0);

    const totalStudiesCount = filteredPrograms.reduce((sum, program) => {
      return sum + (program.studies?.length || 0);
    }, 0);

    const averageEnrollment = totalStudiesCount > 0 ? totalEnrollment / totalStudiesCount : 0;

    // Calculate average time to completion (mock calculation)
    const completedPrograms = filteredPrograms.filter(p => p.status === 'Completed');
    const avgTimeToCompletion = completedPrograms.length > 0
      ? completedPrograms.reduce((sum, program) => {
          const startDate = new Date(program.createdAt);
          const endDate = program.updatedAt;
          const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
          return sum + daysDiff;
        }, 0) / completedPrograms.length
      : 0;

    return {
      totalPrograms,
      activeStudies,
      averageEnrollment: Math.round(averageEnrollment * 10) / 10, // Round to 1 decimal place
      completedMilestones,
      upcomingMilestones,
      criticalAlerts,
      pendingApprovals,
      budgetUtilization: Math.round(budgetUtilization),
      avgTimeToCompletion: Math.round(avgTimeToCompletion),
    };
  }, [programs, role]);

  // Cache the computed metrics for the role
  useMemo(() => {
    if (role && metrics.totalPrograms > 0) {
      dispatch(setRoleBasedMetrics({ role, metrics }));
    }
  }, [dispatch, role, metrics]);

  return metrics;
}

/**
 * Hook to get dashboard performance metrics
 */
export function useDashboardPerformance() {
  const selectedMetrics = useAppSelector(selectSelectedMetrics);

  return useMemo(() => {
    const startTime = performance.now();

    return {
      selectedMetrics,
      measureRenderTime: () => performance.now() - startTime,
      isOptimized: selectedMetrics.length <= 6, // Optimal number of metrics to display
    };
  }, [selectedMetrics]);
}

/**
 * Hook for dashboard real-time updates
 */
export function useDashboardRealTime(enabled: boolean = true) {
  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useGetDashboardStatsQuery(undefined, {
    pollingInterval: enabled ? 5 * 60 * 1000 : 0, // Poll every 5 minutes when enabled
    skip: !enabled,
  });

  return {
    data: data?.data,
    isLoading,
    isFetching,
    refetch,
    isRealTimeEnabled: enabled,
  };
}

/**
 * Hook for dashboard data aggregation and caching
 */
export function useAggregatedDashboardData(programs?: Program[]) {
  return useMemo(() => {
    if (!programs || programs.length === 0) {
      return {
        programsByPhase: {},
        programsByTherapeuticArea: {},
        programsByRiskLevel: {},
        recentActivity: [],
        trends: {
          programGrowth: 0,
          completionRate: 0,
          budgetUtilization: 0,
        },
      };
    }

    const programsByPhase = programs.reduce((acc, program) => {
      acc[program.phase] = (acc[program.phase] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const programsByTherapeuticArea = programs.reduce((acc, program) => {
      acc[program.therapeuticArea] = (acc[program.therapeuticArea] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const programsByRiskLevel = programs.reduce((acc, program) => {
      acc[program.riskLevel] = (acc[program.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = programs
      .filter(program => new Date(program.updatedAt) > sevenDaysAgo)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 10);

    // Calculate trends (simplified)
    const completedPrograms = programs.filter(p => p.status === 'Completed');
    const completionRate = programs.length > 0 ? (completedPrograms.length / programs.length) * 100 : 0;

    const totalBudget = programs.reduce((sum, program) => sum + (program.budget || 0), 0);
    const utilizedBudget = programs.reduce((sum, program) => {
      const progress = program.progress || 0;
      return sum + (program.budget || 0) * (progress / 100);
    }, 0);
    const budgetUtilization = totalBudget > 0 ? (utilizedBudget / totalBudget) * 100 : 0;

    return {
      programsByPhase,
      programsByTherapeuticArea,
      programsByRiskLevel,
      recentActivity,
      trends: {
        programGrowth: 5.2, // Mock growth percentage
        completionRate: Math.round(completionRate),
        budgetUtilization: Math.round(budgetUtilization),
      },
    };
  }, [programs]);
}