import { useFilterStore } from '../../../lib/stores/filterStore';
import { act } from '@testing-library/react';

describe('filterStore', () => {
  beforeEach(() => {
    act(() => {
      useFilterStore.getState().resetFilters();
    });
  });

  it('should have default filter values', () => {
    const state = useFilterStore.getState();
    expect(state.search).toBe('');
    expect(state.phase).toBe('All');
    expect(state.therapeuticArea).toBe('All');
    expect(state.status).toBe('All');
  });

  it('should update filters with setFilters', () => {
    act(() => {
      useFilterStore.getState().setFilters({ search: 'test' });
    });
    expect(useFilterStore.getState().search).toBe('test');
  });

  it('should update multiple filters', () => {
    act(() => {
      useFilterStore.getState().setFilters({
        search: 'oncology',
        phase: 'Phase I',
        status: 'Active',
      });
    });
    const state = useFilterStore.getState();
    expect(state.search).toBe('oncology');
    expect(state.phase).toBe('Phase I');
    expect(state.status).toBe('Active');
  });

  it('should reset filters to defaults', () => {
    act(() => {
      useFilterStore.getState().setFilters({
        search: 'test',
        phase: 'Phase II',
      });
    });
    act(() => {
      useFilterStore.getState().resetFilters();
    });
    const state = useFilterStore.getState();
    expect(state.search).toBe('');
    expect(state.phase).toBe('All');
    expect(state.therapeuticArea).toBe('All');
    expect(state.status).toBe('All');
  });

  it('should preserve unmodified filters when setting partial', () => {
    act(() => {
      useFilterStore.getState().setFilters({ phase: 'Phase III' });
    });
    act(() => {
      useFilterStore.getState().setFilters({ search: 'hello' });
    });
    const state = useFilterStore.getState();
    expect(state.phase).toBe('Phase III');
    expect(state.search).toBe('hello');
  });
});
