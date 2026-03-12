import { renderHook, act } from '@testing-library/react';
import { useOptimizedFilters } from '../../../lib/hooks/useOptimizedFilters';

const createMockFilters = (overrides = {}) => ({
  search: '',
  phase: 'All' as const,
  therapeuticArea: 'All' as const,
  status: 'All' as const,
  setFilters: jest.fn(),
  resetFilters: jest.fn(),
  ...overrides,
});

describe('useOptimizedFilters', () => {
  it('should report no active filters by default', () => {
    const filters = createMockFilters();
    const { result } = renderHook(() => useOptimizedFilters(filters));
    expect(result.current.hasActiveFilters).toBeFalsy();
    expect(result.current.activeFilterCount).toBe(0);
  });

  it('should detect active search filter', () => {
    const filters = createMockFilters({ search: 'test' });
    const { result } = renderHook(() => useOptimizedFilters(filters));
    expect(result.current.hasActiveFilters).toBeTruthy();
    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should detect active phase filter', () => {
    const filters = createMockFilters({ phase: 'Phase I' });
    const { result } = renderHook(() => useOptimizedFilters(filters));
    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should detect active therapeutic area filter', () => {
    const filters = createMockFilters({ therapeuticArea: 'Oncology' });
    const { result } = renderHook(() => useOptimizedFilters(filters));
    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should detect active status filter', () => {
    const filters = createMockFilters({ status: 'Active' });
    const { result } = renderHook(() => useOptimizedFilters(filters));
    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should count multiple active filters', () => {
    const filters = createMockFilters({
      search: 'test',
      phase: 'Phase I',
      status: 'Active',
    });
    const { result } = renderHook(() => useOptimizedFilters(filters));
    expect(result.current.activeFilterCount).toBe(3);
  });

  it('should call setFilters when clearing search', () => {
    const filters = createMockFilters({ search: 'test' });
    const { result } = renderHook(() => useOptimizedFilters(filters));
    act(() => {
      result.current.clearSearch();
    });
    expect(filters.setFilters).toHaveBeenCalledWith({ search: '' });
  });

  it('should call setFilters when clearing phase', () => {
    const filters = createMockFilters({ phase: 'Phase I' });
    const { result } = renderHook(() => useOptimizedFilters(filters));
    act(() => {
      result.current.clearPhase();
    });
    expect(filters.setFilters).toHaveBeenCalledWith({ phase: 'All' });
  });

  it('should call setFilters when clearing therapeutic area', () => {
    const filters = createMockFilters({ therapeuticArea: 'Oncology' });
    const { result } = renderHook(() => useOptimizedFilters(filters));
    act(() => {
      result.current.clearTherapeuticArea();
    });
    expect(filters.setFilters).toHaveBeenCalledWith({ therapeuticArea: 'All' });
  });

  it('should call setFilters when clearing status', () => {
    const filters = createMockFilters({ status: 'Active' });
    const { result } = renderHook(() => useOptimizedFilters(filters));
    act(() => {
      result.current.clearStatus();
    });
    expect(filters.setFilters).toHaveBeenCalledWith({ status: 'All' });
  });

  it('should call setFilters when setting search filter', () => {
    const filters = createMockFilters();
    const { result } = renderHook(() => useOptimizedFilters(filters));
    act(() => {
      result.current.setSearchFilter('new search');
    });
    expect(filters.setFilters).toHaveBeenCalledWith({ search: 'new search' });
  });

  it('should expose resetFilters', () => {
    const filters = createMockFilters();
    const { result } = renderHook(() => useOptimizedFilters(filters));
    act(() => {
      result.current.resetFilters();
    });
    expect(filters.resetFilters).toHaveBeenCalled();
  });
});
