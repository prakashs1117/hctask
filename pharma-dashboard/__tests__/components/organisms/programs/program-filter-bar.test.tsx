import React from 'react';
import { render, screen } from '@testing-library/react';
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
});
