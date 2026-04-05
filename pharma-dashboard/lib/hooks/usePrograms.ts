/**
 * DEPRECATED: This hook is maintained for backward compatibility.
 * Please use the new Redux-based hooks from @/lib/hooks/redux
 */

import { usePrograms as useReduxPrograms, useProgram as useReduxProgram } from './redux';

/**
 * @deprecated Use usePrograms from @/lib/hooks/redux instead
 * Hook to fetch all programs with React Query (now uses Redux under the hood)
 */
export function usePrograms() {
  if (process.env.NODE_ENV === 'development') {
    console.warn('usePrograms from @/lib/hooks/usePrograms is deprecated. Use @/lib/hooks/redux instead.');
  }
  return useReduxPrograms();
}

/**
 * @deprecated Use useProgram from @/lib/hooks/redux instead
 * Hook to fetch a single program by ID
 */
export function useProgram(id: string) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('useProgram from @/lib/hooks/usePrograms is deprecated. Use @/lib/hooks/redux instead.');
  }
  return useReduxProgram(id);
}