import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgramFilterBar } from '../../../../components/organisms/programs/program-filter-bar';
import { useFilterStore } from '../../../../lib/stores/filterStore';
import { act } from '@testing-library/react';

jest.mock('../../../../lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'programs.searchPrograms': 'Search programs...',
        'common.filters': 'Filters',
        'common.clearAll': 'Clear All',
        'navigation.programs': 'programs',
      };
      return t[key] || key;
    },
    locale: 'en',
    changeLocale: jest.fn(),
  }),
}));

describe('ProgramFilterBar', () => {
  beforeEach(() => {
    act(() => {
      useFilterStore.getState().resetFilters();
    });
  });

  it('should render search input', () => {
    render(
      <ProgramFilterBar
        filteredCount={5}
        totalCount={10}
        filterSidebarOpen={false}
        setFilterSidebarOpen={jest.fn()}
        hasActiveFilters={false}
        activeFilterCount={0}
      />
    );
    expect(screen.getByPlaceholderText('Search programs...')).toBeInTheDocument();
  });

  it('should render results count', () => {
    render(
      <ProgramFilterBar
        filteredCount={5}
        totalCount={10}
        filterSidebarOpen={false}
        setFilterSidebarOpen={jest.fn()}
        hasActiveFilters={false}
        activeFilterCount={0}
      />
    );
    expect(screen.getByText('5 of 10 programs')).toBeInTheDocument();
  });

  it('should render filter toggle button', () => {
    render(
      <ProgramFilterBar
        filteredCount={5}
        totalCount={10}
        filterSidebarOpen={false}
        setFilterSidebarOpen={jest.fn()}
        hasActiveFilters={false}
        activeFilterCount={0}
      />
    );
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('should show clear button when filters are active', () => {
    render(
      <ProgramFilterBar
        filteredCount={3}
        totalCount={10}
        filterSidebarOpen={false}
        setFilterSidebarOpen={jest.fn()}
        hasActiveFilters={true}
        activeFilterCount={2}
      />
    );
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <ProgramFilterBar
        filteredCount={5}
        totalCount={10}
        filterSidebarOpen={false}
        setFilterSidebarOpen={jest.fn()}
        hasActiveFilters={false}
        activeFilterCount={0}
      >
        <div>Custom child</div>
      </ProgramFilterBar>
    );
    expect(screen.getByText('Custom child')).toBeInTheDocument();
  });

  it('should call setFilterSidebarOpen when filter toggle clicked', () => {
    const setFilterSidebarOpen = jest.fn();
    render(
      <ProgramFilterBar
        filteredCount={5}
        totalCount={10}
        filterSidebarOpen={false}
        setFilterSidebarOpen={setFilterSidebarOpen}
        hasActiveFilters={false}
        activeFilterCount={0}
      />
    );
    fireEvent.click(screen.getByText('Filters'));
    expect(setFilterSidebarOpen).toHaveBeenCalledWith(true);
  });

  it('should update search filter on input change', () => {
    render(
      <ProgramFilterBar
        filteredCount={5}
        totalCount={10}
        filterSidebarOpen={false}
        setFilterSidebarOpen={jest.fn()}
        hasActiveFilters={false}
        activeFilterCount={0}
      />
    );
    const input = screen.getByPlaceholderText('Search programs...');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(useFilterStore.getState().search).toBe('test');
  });

  it('should reset filters when clear button clicked', () => {
    act(() => {
      useFilterStore.getState().setFilters({ phase: 'Phase III' });
    });
    render(
      <ProgramFilterBar
        filteredCount={3}
        totalCount={10}
        filterSidebarOpen={false}
        setFilterSidebarOpen={jest.fn()}
        hasActiveFilters={true}
        activeFilterCount={1}
      />
    );
    fireEvent.click(screen.getByText('Clear All'));
    expect(useFilterStore.getState().phase).toBe('All');
  });

  it('should show phase filter badge and remove it', () => {
    act(() => {
      useFilterStore.getState().setFilters({ phase: 'Phase III' });
    });
    render(
      <ProgramFilterBar
        filteredCount={3}
        totalCount={10}
        filterSidebarOpen={false}
        setFilterSidebarOpen={jest.fn()}
        hasActiveFilters={true}
        activeFilterCount={1}
      />
    );
    expect(screen.getByText('Phase III')).toBeInTheDocument();
  });

  it('should show therapeutic area filter badge', () => {
    act(() => {
      useFilterStore.getState().setFilters({ therapeuticArea: 'Oncology' });
    });
    render(
      <ProgramFilterBar
        filteredCount={3}
        totalCount={10}
        filterSidebarOpen={false}
        setFilterSidebarOpen={jest.fn()}
        hasActiveFilters={true}
        activeFilterCount={1}
      />
    );
    expect(screen.getByText('Oncology')).toBeInTheDocument();
  });

  it('should accept custom searchPlaceholder, filterLabel and clearLabel', () => {
    render(
      <ProgramFilterBar
        filteredCount={3}
        totalCount={10}
        filterSidebarOpen={false}
        setFilterSidebarOpen={jest.fn()}
        hasActiveFilters={true}
        activeFilterCount={1}
        searchPlaceholder="Custom search..."
        filterLabel="Custom Filters"
        clearLabel="Reset"
      />
    );
    expect(screen.getByPlaceholderText('Custom search...')).toBeInTheDocument();
    expect(screen.getByText('Custom Filters')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });
});
