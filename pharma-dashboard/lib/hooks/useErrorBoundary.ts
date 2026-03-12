import { useCallback, useState } from "react";

/**
 * Custom hook for error boundary functionality
 * Based on React documentation for error handling best practices
 */
export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  // Reset error state
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // Capture and handle errors
  const captureError = useCallback((error: Error) => {
    console.error("Error captured:", error);
    setError(error);
  }, []);

  // Try-catch wrapper for async operations
  const tryAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    fallback?: T
  ): Promise<T | undefined> => {
    try {
      return await asyncFn();
    } catch (error) {
      captureError(error as Error);
      return fallback;
    }
  }, [captureError]);

  // Try-catch wrapper for sync operations
  const trySync = useCallback(<T>(
    syncFn: () => T,
    fallback?: T
  ): T | undefined => {
    try {
      return syncFn();
    } catch (error) {
      captureError(error as Error);
      return fallback;
    }
  }, [captureError]);

  return {
    error,
    resetError,
    captureError,
    tryAsync,
    trySync,
    hasError: error !== null,
  };
}

/**
 * Custom hook for form error handling
 */
export function useFormErrorHandling() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasError = useCallback((field?: string) => {
    if (field) {
      return Boolean(errors[field]);
    }
    return Object.keys(errors).length > 0;
  }, [errors]);

  return {
    errors,
    setError,
    clearError,
    clearAllErrors,
    hasError,
  };
}