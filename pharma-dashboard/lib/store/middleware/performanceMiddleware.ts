import type { Middleware, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface PerformanceMetrics {
  actionType: string;
  duration: number;
  timestamp: number;
  stateSize: number;
}

/**
 * Middleware to track Redux performance metrics
 */
export const performanceMiddleware: Middleware<{}, RootState> = (storeApi) => (next) => (action) => {
  if (process.env.NODE_ENV !== 'production') {
    const startTime = performance.now();
    const stateBefore = storeApi.getState();

    const result = next(action);

    const endTime = performance.now();
    const stateAfter = storeApi.getState();
    const duration = endTime - startTime;

    // Track slow actions (> 16ms could affect 60fps)
    if (duration > 16) {
      console.warn(`Slow Redux action: ${action.type} took ${duration.toFixed(2)}ms`);
    }

    // Calculate state size (rough estimate)
    const stateSize = JSON.stringify(stateAfter).length;

    // Store performance metrics
    const metrics: PerformanceMetrics = {
      actionType: action.type,
      duration,
      timestamp: Date.now(),
      stateSize,
    };

    // Dispatch to dashboard slice for tracking
    if (action.type !== 'dashboard/recordLoadTime') {
      storeApi.dispatch({
        type: 'dashboard/recordLoadTime',
        payload: {
          component: `redux_${action.type}`,
          time: duration,
        },
      });
    }

    return result;
  }

  return next(action);
};

/**
 * Middleware to prevent excessive re-renders by batching actions
 */
export const batchingMiddleware: Middleware<{}, RootState> = (storeApi) => (next) => {
  let isBatching = false;
  let batchedActions: any[] = [];

  return (action) => {
    // Add action to batch if currently batching
    if (isBatching && action.type !== 'FLUSH_BATCH') {
      batchedActions.push(action);
      return;
    }

    // Start batching for filter actions
    if (action.type?.startsWith('programs/set') && action.type.includes('Filter')) {
      if (!isBatching) {
        isBatching = true;
        batchedActions = [action];

        // Flush batch after a short delay
        setTimeout(() => {
          if (batchedActions.length > 0) {
            batchedActions.forEach(batchedAction => next(batchedAction));
            batchedActions = [];
            isBatching = false;
          }
        }, 10);

        return;
      }
    }

    return next(action);
  };
};