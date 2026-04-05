import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';
import { useMemo } from 'react';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = () => useStore<RootState>();

// Custom hooks for common patterns

/**
 * Hook to get dispatch function with proper typing
 */
export const useTypedDispatch = () => useDispatch<AppDispatch>();

/**
 * Hook to select multiple values from the store with memoization
 */
export function useAppSelectorWithMemo<T>(
  selector: (state: RootState) => T,
  dependencies?: React.DependencyList
) {
  const selected = useAppSelector(selector);
  return useMemo(() => selected, dependencies || [selected]);
}

/**
 * Hook for optimized component-specific selectors
 */
export function useShallowEqualSelector<T>(selector: (state: RootState) => T): T {
  return useAppSelector(selector);
}

/**
 * Hook to select and memoize computed values
 */
export function useComputedSelector<T, Args extends readonly unknown[]>(
  selector: (state: RootState, ...args: Args) => T,
  args: Args,
  dependencies?: React.DependencyList
): T {
  const result = useAppSelector((state) => selector(state, ...args));
  return useMemo(() => result, dependencies || [result, ...args]);
}

/**
 * Hook for conditional selectors (only run when condition is met)
 */
export function useConditionalSelector<T>(
  condition: boolean,
  selector: (state: RootState) => T,
  defaultValue: T
): T {
  return useAppSelector((state) => (condition ? selector(state) : defaultValue));
}

/**
 * Hook for throttled selectors (useful for frequently updating data)
 */
export function useThrottledSelector<T>(
  selector: (state: RootState) => T,
  delay: number = 100
): T {
  const selected = useAppSelector(selector);

  return useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    let lastValue = selected;

    const throttledValue = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastValue = selected;
      }, delay);
      return lastValue;
    };

    return throttledValue();
  }, [selected, delay]);
}

/**
 * Hook for debounced selectors (useful for search/filter inputs)
 */
export function useDebouncedSelector<T>(
  selector: (state: RootState) => T,
  delay: number = 300
): T {
  const selected = useAppSelector(selector);

  return useMemo(() => {
    const handler = setTimeout(() => selected, delay);
    return () => clearTimeout(handler);
  }, [selected, delay]) as unknown as T;
}