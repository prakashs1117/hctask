import { useMemo } from "react";
import { calculateProgramTotals } from "@/lib/utils/formatters";
import type { Program } from "@/types";

/**
 * Custom hook to memoize program calculations for performance
 * @param program - Program object with studies
 * @returns Memoized program calculations
 */
export function useProgramCalculations(program: Program) {
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

/**
 * Custom hook to memoize multiple program calculations
 * @param programs - Array of programs
 * @returns Memoized map of program ID to calculations
 */
export function useProgramsCalculations(programs: Program[] | undefined) {
  return useMemo(() => {
    if (!programs) return new Map();

    const calculationsMap = new Map();

    programs.forEach((program) => {
      const calculations = calculateProgramTotals(program.studies);
      calculationsMap.set(program.id, calculations);
    });

    return calculationsMap;
  }, [programs]);
}