import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IAMFilterBar } from '../../../../components/organisms/iam/iam-filter-bar';

jest.mock('../../../../lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'iam.searchUsers': 'Search users...',
        'common.filters': 'Filters',
        'common.clearAll': 'Clear All',
        'navigation.iam': 'Users',
      };
      return t[key] || key;
    },
    locale: 'en',
    changeLocale: jest.fn(),
  }),
}));

describe('IAMFilterBar', () => {
  const defaultProps = {
    searchQuery: '',
    setSearchQuery: jest.fn(),
    roleFilter: 'All',
    setRoleFilter: jest.fn(),
    statusFilter: 'All',
    setStatusFilter: jest.fn(),
    filterSidebarOpen: false,
    setFilterSidebarOpen: jest.fn(),
    activeFilterCount: 0,
    hasActiveFilters: false as boolean | string,
    resetFilters: jest.fn(),
    filteredCount: 5,
    totalCount: 10,
  };

  beforeEach(() => jest.clearAllMocks());

  it('should render search input', () => {
    render(<IAMFilterBar {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
  });

  it('should render filter toggle button', () => {
    render(<IAMFilterBar {...defaultProps} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('should render results count', () => {
    render(<IAMFilterBar {...defaultProps} />);
    expect(screen.getByText('5 of 10 users')).toBeInTheDocument();
  });

  it('should show clear button when filters are active', () => {
    render(<IAMFilterBar {...defaultProps} hasActiveFilters={true} />);
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('should not show clear button when no active filters', () => {
    render(<IAMFilterBar {...defaultProps} />);
    expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
  });

  it('should show role filter badge when role is not All', () => {
    render(<IAMFilterBar {...defaultProps} roleFilter="Manager" />);
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('should show status filter badge when status is not All', () => {
    render(<IAMFilterBar {...defaultProps} statusFilter="Active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should call resetFilters when clear all is clicked', () => {
    render(<IAMFilterBar {...defaultProps} hasActiveFilters={true} />);
    fireEvent.click(screen.getByText('Clear All'));
    expect(defaultProps.resetFilters).toHaveBeenCalled();
  });
});
