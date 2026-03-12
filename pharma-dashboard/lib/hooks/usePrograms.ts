import { useQuery } from "@tanstack/react-query";
import { getPrograms, getProgramById } from "@/lib/api/data";

/**
 * Hook to fetch all programs with React Query
 * @returns Query result with programs data
 */
export function usePrograms() {
  return useQuery({
    queryKey: ["programs"],
    queryFn: getPrograms,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single program by ID
 * @param id - Program ID
 * @returns Query result with program data
 */
export function useProgram(id: string) {
  return useQuery({
    queryKey: ["program", id],
    queryFn: () => getProgramById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
