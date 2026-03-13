import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserFilters } from '../../../../components/organisms/iam/user-filters';

jest.mock('../../../../lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'iam.userRole': 'User Role',
        'iam.accountStatus': 'Account Status',
        'iam.roles.all': 'All Roles',
        'iam.roles.manager': 'Manager',
        'iam.roles.staff': 'Staff',
        'iam.roles.viewer': 'Viewer',
        'iam.statuses.all': 'All Statuses',
        'iam.statuses.active': 'Active',
        'iam.statuses.inactive': 'Inactive',
        'filters.activeFilters': 'Active Filters',
        'filters.currentFilters': 'Current Filters',
        'filters.role': 'Role',
        'filters.status': 'Status',
        'filters.quickFilters': 'Quick Filters',
        'iam.quickFilters.managersOnly': 'Managers Only',
        'iam.quickFilters.activeOnly': 'Active Only',
      };
      return t[key] || key;
    },
    locale: 'en',
    changeLocale: jest.fn(),
  }),
}));

describe('UserFilters', () => {
  const defaultProps = {
    roleFilter: 'All',
    statusFilter: 'All',
    setRoleFilter: jest.fn(),
    setStatusFilter: jest.fn(),
    searchQuery: '',
  };

  beforeEach(() => jest.clearAllMocks());

  it('should render role and status filter labels', () => {
    render(<UserFilters {...defaultProps} />);
    expect(screen.getByText('User Role')).toBeInTheDocument();
    expect(screen.getByText('Account Status')).toBeInTheDocument();
  });

  it('should render current filters panel', () => {
    render(<UserFilters {...defaultProps} />);
    expect(screen.getByText('Current Filters')).toBeInTheDocument();
  });

  it('should render quick filter buttons', () => {
    render(<UserFilters {...defaultProps} />);
    expect(screen.getByText('Managers Only')).toBeInTheDocument();
    expect(screen.getByText('Active Only')).toBeInTheDocument();
  });

  it('should call setRoleFilter when role select changes', () => {
    render(<UserFilters {...defaultProps} />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Manager' } });
    expect(defaultProps.setRoleFilter).toHaveBeenCalledWith('Manager');
  });

  it('should call setStatusFilter when status select changes', () => {
    render(<UserFilters {...defaultProps} />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'Active' } });
    expect(defaultProps.setStatusFilter).toHaveBeenCalledWith('Active');
  });

  it('should show active filters when role is not All', () => {
    render(<UserFilters {...defaultProps} roleFilter="Manager" />);
    expect(screen.getByText('Active Filters')).toBeInTheDocument();
  });

  it('should not show active filters when all defaults', () => {
    render(<UserFilters {...defaultProps} />);
    expect(screen.queryByText('Active Filters')).not.toBeInTheDocument();
  });

  it('should call setRoleFilter on Managers Only click', () => {
    render(<UserFilters {...defaultProps} />);
    fireEvent.click(screen.getByText('Managers Only'));
    expect(defaultProps.setRoleFilter).toHaveBeenCalledWith('Manager');
  });

  it('should call setStatusFilter on Active Only click', () => {
    render(<UserFilters {...defaultProps} />);
    fireEvent.click(screen.getByText('Active Only'));
    expect(defaultProps.setStatusFilter).toHaveBeenCalledWith('Active');
  });

  it('should clear role filter when X is clicked', () => {
    const { container } = render(<UserFilters {...defaultProps} roleFilter="Manager" />);
    const xIcons = container.querySelectorAll('.cursor-pointer');
    fireEvent.click(xIcons[0]);
    expect(defaultProps.setRoleFilter).toHaveBeenCalledWith('All');
  });
});
