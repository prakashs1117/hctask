import { useMemo } from "react";
import type { Program, ProgramFilters } from "@/types";

/**
 * Hook to filter programs based on filter criteria
 * @param programs - Array of programs to filter
 * @param filters - Filter criteria
 * @returns Filtered programs array
 */
export function useFilteredPrograms(
  programs: Program[] | undefined,
  filters: ProgramFilters
) {
  return useMemo(() => {
    if (!programs) return [];

    return programs.filter((program) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          program.name.toLowerCase().includes(searchLower) ||
          program.description?.toLowerCase().includes(searchLower) ||
          program.manager.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Phase filter
      if (filters.phase !== "All" && program.phase !== filters.phase) {
        return false;
      }

      // Therapeutic area filter
      if (
        filters.therapeuticArea !== "All" &&
        program.therapeuticArea !== filters.therapeuticArea
      ) {
        return false;
      }

      // Status filter
      if (filters.status !== "All" && program.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [programs, filters]);
}
