import { useMemo } from 'react';
import { calculateProgramTotals } from '@/lib/utils/formatters';
import type { Program } from '@/types';

/**
 * Custom hook to calculate and memoize program metrics
 * @param program - Program object with studies data
 * @returns Memoized program metrics
 */
export function useProgramMetrics(program: Program | null | undefined) {
  return useMemo(() => {
    if (!program?.studies) {
      return {
        totalEnrollment: 0,
        totalTarget: 0,
        enrollmentPercentage: 0,
      };
    }

    return calculateProgramTotals(program.studies);
  }, [program]);
}