import { useQuery } from "@tanstack/react-query";
import { getAlerts } from "@/lib/api/data";

/**
 * Hook to fetch all alerts with React Query.
 * Shared across components — the sidebar badge and alerts page
 * both read from the same ["alerts"] cache key.
 */
export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook that returns just the active (non-dismissed) alert count.
 * Uses the same cached query as useAlerts — zero extra network requests.
 */
export function useActiveAlertCount(): number {
  const { data: alerts } = useAlerts();

  if (!alerts) return 0;

  return alerts.filter((a) => a.status === "Active" || a.status === "Overdue").length;
}
