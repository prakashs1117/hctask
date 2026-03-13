import React from 'react';
import { render, screen } from '@testing-library/react';
import IAMPage from '../../../app/iam/page';

const mockUsers = [
  {
    id: 'USR-001',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Manager',
    status: 'Active',
    assignedPrograms: ['PRG-001'],
    permissions: [],
    createdAt: '2024-01-01',
    lastLogin: '2024-06-01',
  },
];

jest.mock('../../../lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'iam.title': 'Identity & Access Management',
        'iam.subtitle': 'Manage users and permissions',
        'iam.addUser': 'Add User',
        'iam.userFilters': 'User Filters',
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

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn().mockReturnValue({
    data: [
      {
        id: 'USR-001',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Manager',
        status: 'Active',
        assignedPrograms: ['PRG-001'],
        permissions: [],
        createdAt: '2024-01-01',
        lastLogin: '2024-06-01',
      },
    ],
    isLoading: false,
  }),
}));

jest.mock('../../../lib/stores/authStore', () => ({
  useAuthStore: () => ({
    hasPermission: (perm: string) => perm === 'manage_users',
  }),
}));

jest.mock('../../../components/organisms/iam/iam-stats', () => ({
  IAMStats: () => <div data-testid="iam-stats">IAM Stats</div>,
}));

jest.mock('../../../components/organisms/iam/iam-filter-bar', () => ({
  IAMFilterBar: () => <div data-testid="iam-filter-bar">Filter Bar</div>,
}));

jest.mock('../../../components/organisms/iam/user-table', () => ({
  UserTable: () => <div data-testid="user-table">User Table</div>,
}));

jest.mock('../../../components/organisms/filter-sidebar', () => ({
  FilterSidebar: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="filter-sidebar">{children}</div>
  ),
}));

jest.mock('../../../components/organisms/iam/user-filters', () => ({
  UserFilters: () => <div data-testid="user-filters">User Filters</div>,
}));

describe('IAMPage', () => {
  it('should render page header with title', () => {
    render(<IAMPage />);
    expect(screen.getByText('Identity & Access Management')).toBeInTheDocument();
  });

  it('should render add user button when has permission', () => {
    render(<IAMPage />);
    expect(screen.getByText('Add User')).toBeInTheDocument();
  });

  it('should render IAM stats', () => {
    render(<IAMPage />);
    expect(screen.getByTestId('iam-stats')).toBeInTheDocument();
  });

  it('should render filter bar', () => {
    render(<IAMPage />);
    expect(screen.getByTestId('iam-filter-bar')).toBeInTheDocument();
  });

  it('should render user table', () => {
    render(<IAMPage />);
    expect(screen.getByTestId('user-table')).toBeInTheDocument();
  });

  it('should render filter sidebar', () => {
    render(<IAMPage />);
    expect(screen.getByTestId('filter-sidebar')).toBeInTheDocument();
  });
});
