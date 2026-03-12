import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterSidebar } from '../../../components/organisms/filter-sidebar';

jest.mock('../../../lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'common.filters': 'Filters',
        'common.closeFilters': 'Close Filters',
        'common.clearAllFilters': 'Clear All Filters',
      };
      return t[key] || key;
    },
    locale: 'en',
    changeLocale: jest.fn(),
  }),
}));

describe('FilterSidebar', () => {
  it('should render title when open', () => {
    render(
      <FilterSidebar isOpen={true} onClose={jest.fn()} title="Program Filters">
        <div>Filter content</div>
      </FilterSidebar>
    );
    expect(screen.getByText('Program Filters')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <FilterSidebar isOpen={true} onClose={jest.fn()}>
        <div>Filter content</div>
      </FilterSidebar>
    );
    expect(screen.getByText('Filter content')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <FilterSidebar isOpen={true} onClose={onClose}>
        <div>Content</div>
      </FilterSidebar>
    );
    fireEvent.click(screen.getByTitle('Close Filters'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should show active filter count badge', () => {
    render(
      <FilterSidebar isOpen={true} onClose={jest.fn()} activeFilterCount={3}>
        <div>Content</div>
      </FilterSidebar>
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should show clear all button when filters active', () => {
    const onClear = jest.fn();
    render(
      <FilterSidebar isOpen={true} onClose={jest.fn()} activeFilterCount={2} onClearAll={onClear}>
        <div>Content</div>
      </FilterSidebar>
    );
    const clearButton = screen.getByText(/Clear All Filters/);
    fireEvent.click(clearButton);
    expect(onClear).toHaveBeenCalled();
  });

  it('should not show clear button when no active filters', () => {
    render(
      <FilterSidebar isOpen={true} onClose={jest.fn()} activeFilterCount={0} onClearAll={jest.fn()}>
        <div>Content</div>
      </FilterSidebar>
    );
    expect(screen.queryByText(/Clear All Filters/)).not.toBeInTheDocument();
  });
});
