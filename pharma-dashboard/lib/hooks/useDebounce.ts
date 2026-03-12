import { useState, useEffect } from "react";

/**
 * Custom hook for debouncing values to improve performance
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debounced search with callback
 * @param searchTerm - Current search term
 * @param onSearch - Callback function to execute with debounced search term (should be memoized with useCallback)
 * @param delay - Delay in milliseconds (default: 300ms)
 */
export function useDebouncedSearch(
  searchTerm: string,
  onSearch: (term: string) => void,
  delay: number = 300
) {
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);
}