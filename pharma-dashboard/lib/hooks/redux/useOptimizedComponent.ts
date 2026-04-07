import React, { memo, useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { recordLoadTime, incrementErrorCount } from '@/lib/store/slices/dashboardSlice';

/**
 * Hook for optimized component rendering with performance tracking
 */
export function useOptimizedComponent(componentName: string) {
  const dispatch = useAppDispatch();

  const startTime = useMemo(() => performance.now(), []);

  const recordRenderTime = useCallback(() => {
    const renderTime = performance.now() - startTime;
    dispatch(recordLoadTime({ component: componentName, time: renderTime }));
  }, [dispatch, componentName, startTime]);

  const handleError = useCallback((error: Error) => {
    console.error(`Error in ${componentName}:`, error);
    dispatch(incrementErrorCount(componentName));
  }, [dispatch, componentName]);

  const memoizedCallback = useCallback((callback: () => void, deps: any[]) => {
    return useCallback(callback, deps);
  }, []);

  const memoizedValue = useCallback(<T>(factory: () => T, deps: any[]): T => {
    return useMemo(factory, deps);
  }, []);

  return {
    recordRenderTime,
    handleError,
    memoizedCallback,
    memoizedValue,
  };
}

/**
 * HOC for optimizing component performance
 */
export function withOptimization<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  const OptimizedComponent = memo((props: P) => {
    const { recordRenderTime, handleError } = useOptimizedComponent(componentName);

    try {
      recordRenderTime();
      return React.createElement(WrappedComponent, props);
    } catch (error) {
      handleError(error as Error);
      return null; // Return null instead of JSX to avoid parsing issues
    }
  });

  OptimizedComponent.displayName = `withOptimization(${componentName})`;
  return OptimizedComponent;
}

/**
 * Hook for optimized list rendering
 */
export function useOptimizedList<T>(
  items: T[],
  keyExtractor: (item: T, index: number) => string,
  renderItem: (item: T, index: number) => React.ReactNode,
  dependencies: any[] = []
) {
  const memoizedItems = useMemo(() => {
    return items.map((item, index) => ({
      key: keyExtractor(item, index),
      item,
      index,
    }));
  }, [items, keyExtractor, ...dependencies]);

  const renderedItems = useMemo(() => {
    return memoizedItems.map(({ key, item, index }) => ({
      key,
      node: renderItem(item, index),
    }));
  }, [memoizedItems, renderItem]);

  return {
    items: memoizedItems,
    renderedItems,
    totalCount: items.length,
  };
}

/**
 * Hook for virtualized list performance
 */
export function useVirtualizedList<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  overscan: number = 3
) {
  const visibleItemCount = Math.ceil(containerHeight / itemHeight);

  return useMemo(() => {
    const startIndex = Math.max(0, Math.floor(0 - overscan));
    const endIndex = Math.min(items.length - 1, startIndex + visibleItemCount + 2 * overscan);

    const visibleItems = items.slice(startIndex, endIndex + 1);

    return {
      visibleItems,
      startIndex,
      endIndex,
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, containerHeight, itemHeight, overscan, visibleItemCount]);
}

/**
 * Hook for debounced actions to prevent excessive API calls
 */
export function useDebouncedAction(action: () => void, delay: number = 300) {
  const timeoutRef = useMemo(() => ({ current: null as NodeJS.Timeout | null }), []);

  return useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      action();
      timeoutRef.current = null;
    }, delay);
  }, [action, delay, timeoutRef]);
}

/**
 * Hook for throttled actions to limit frequency
 */
export function useThrottledAction(action: () => void, limit: number = 100) {
  const lastRunRef = useMemo(() => ({ current: 0 }), []);

  return useCallback(() => {
    const now = Date.now();

    if (now - lastRunRef.current >= limit) {
      action();
      lastRunRef.current = now;
    }
  }, [action, limit, lastRunRef]);
}