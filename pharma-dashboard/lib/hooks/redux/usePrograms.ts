import { useMemo } from 'react';
import { useGetProgramsQuery, useGetProgramByIdQuery } from '@/lib/store/api/apiSlice';
import { useAppSelector } from '@/lib/store/hooks';
import { selectFilters, selectSorting, selectFavoritePrograms } from '@/lib/store/slices/programsSlice';
import type { Program } from '@/types';

/**
 * Enhanced hook to fetch all programs with RTK Query caching and filtering
 */
export function usePrograms() {
  const {
    data: response,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetProgramsQuery();

  const programs = response?.data || [];

  return {
    data: programs,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    // Additional RTK Query specific states
    isSuccess: !!response && !isError,
    isUninitialized: response === undefined && !isLoading,
  };
}

/**
 * Hook to fetch a single program by ID with caching
 */
export function useProgram(id: string) {
  const {
    data: response,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetProgramByIdQuery(id, {
    skip: !id, // Skip query if no ID provided
  });

  const program = response?.data;

  return {
    data: program,
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
 * Hook to get filtered and sorted programs based on Redux state
 */
export function useFilteredPrograms(programs?: Program[]) {
  const filters = useAppSelector(selectFilters);
  const sorting = useAppSelector(selectSorting);
  const favoritePrograms = useAppSelector(selectFavoritePrograms);

  const filteredPrograms = useMemo(() => {
    if (!programs) return [];

    let filtered = [...programs];

    // Apply search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(program =>
        program.name.toLowerCase().includes(searchTerm) ||
        program.description?.toLowerCase().includes(searchTerm) ||
        program.therapeuticArea.toLowerCase().includes(searchTerm) ||
        program.manager.toLowerCase().includes(searchTerm)
      );
    }

    // Apply phase filter
    if (filters.phase !== 'All') {
      filtered = filtered.filter(program => program.phase === filters.phase);
    }

    // Apply therapeutic area filter
    if (filters.therapeuticArea !== 'All') {
      filtered = filtered.filter(program => program.therapeuticArea === filters.therapeuticArea);
    }

    // Apply risk level filter
    if (filters.riskLevel !== 'All') {
      filtered = filtered.filter(program => program.riskLevel === filters.riskLevel);
    }

    // Apply status filter
    if (filters.status !== 'All') {
      filtered = filtered.filter(program => program.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sorting.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'phase':
          comparison = a.phase.localeCompare(b.phase);
          break;
        case 'lastUpdated':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          comparison = (priorityOrder[a.riskLevel as keyof typeof priorityOrder] || 0) -
                      (priorityOrder[b.riskLevel as keyof typeof priorityOrder] || 0);
          break;
        default:
          comparison = 0;
      }

      return sorting.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [programs, filters, sorting]);

  // Separate favorites for priority display
  const favoriteFilteredPrograms = useMemo(() => {
    return filteredPrograms.filter(program => favoritePrograms.includes(program.id));
  }, [filteredPrograms, favoritePrograms]);

  const nonFavoriteFilteredPrograms = useMemo(() => {
    return filteredPrograms.filter(program => !favoritePrograms.includes(program.id));
  }, [filteredPrograms, favoritePrograms]);

  return {
    filteredPrograms,
    favoritePrograms: favoriteFilteredPrograms,
    nonFavoritePrograms: nonFavoriteFilteredPrograms,
    totalCount: filteredPrograms.length,
    favoriteCount: favoriteFilteredPrograms.length,
  };
}

/**
 * Hook to get program statistics and metrics
 */
export function useProgramMetrics(programs?: Program[]) {
  return useMemo(() => {
    if (!programs || programs.length === 0) {
      return {
        totalPrograms: 0,
        byPhase: {},
        byTherapeuticArea: {},
        byRiskLevel: {},
        byStatus: {},
        averageProgress: 0,
        upcomingMilestones: 0,
        overdueMilestones: 0,
      };
    }

    const byPhase = programs.reduce((acc, program) => {
      acc[program.phase] = (acc[program.phase] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byTherapeuticArea = programs.reduce((acc, program) => {
      acc[program.therapeuticArea] = (acc[program.therapeuticArea] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byRiskLevel = programs.reduce((acc, program) => {
      acc[program.riskLevel] = (acc[program.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = programs.reduce((acc, program) => {
      acc[program.status] = (acc[program.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalProgress = programs.reduce((sum, program) => sum + (program.progress || 0), 0);
    const averageProgress = totalProgress / programs.length;

    // Calculate milestone statistics
    const now = new Date();
    let upcomingMilestones = 0;
    let overdueMilestones = 0;

    programs.forEach(program => {
      program.milestones?.forEach(milestone => {
        if (!milestone.completedDate) {
          const dueDate = new Date(milestone.dueDate);
          const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

          if (daysDiff < 0) {
            overdueMilestones++;
          } else if (daysDiff <= 30) {
            upcomingMilestones++;
          }
        }
      });
    });

    return {
      totalPrograms: programs.length,
      byPhase,
      byTherapeuticArea,
      byRiskLevel,
      byStatus,
      averageProgress,
      upcomingMilestones,
      overdueMilestones,
    };
  }, [programs]);
}

/**
 * Hook for role-based program filtering (maintains compatibility with existing hook)
 */
export function useRoleBasedPrograms(programs?: Program[], role?: string) {
  return useMemo(() => {
    if (!programs) return [];

    // Apply role-based filtering logic here
    // For now, return all programs (can be customized based on role)
    switch (role) {
      case 'scientist':
        return programs.filter(program => program.status !== 'Terminated');
      case 'manager':
        return programs; // Managers see all programs
      case 'executive':
        return programs.filter(program => ['Phase II', 'Phase III', 'Approved'].includes(program.phase));
      default:
        return programs;
    }
  }, [programs, role]);
}

/**
 * Hook for role-based metrics (maintains compatibility)
 */
export function useRoleBasedMetrics(programs?: Program[], role?: string) {
  const roleBasedPrograms = useRoleBasedPrograms(programs, role);
  return useProgramMetrics(roleBasedPrograms);
}