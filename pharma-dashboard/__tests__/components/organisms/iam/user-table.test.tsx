import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserTable } from '../../../../components/organisms/iam/user-table';

jest.mock('../../../../lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'iam.userDirectory': 'User Directory',
        'iam.loadingUsers': 'Loading users...',
        'common.name': 'Name',
        'common.email': 'Email',
        'common.role': 'Role',
        'iam.programs': 'Programs',
        'common.status': 'Status',
        'common.actions': 'Actions',
        'common.noAssignments': 'No assignments',
        'navigation.iam': 'Users',
        'iam.noUsersFound': 'No users found',
        'iam.noUsersFoundDesc': 'Try adjusting your filters',
      };
      return t[key] || key;
    },
    locale: 'en',
    changeLocale: jest.fn(),
  }),
}));

jest.mock('../../../../components/organisms/iam/edit-user-dialog', () => ({
  EditUserDialog: () => <button>Edit</button>,
}));

jest.mock('../../../../components/organisms/iam/view-user-dialog', () => ({
  ViewUserDialog: () => <button>View</button>,
}));

const mockUsers = [
  {
    id: 'USR-001',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Manager' as const,
    status: 'Active' as const,
    assignedPrograms: ['PRG-001', 'PRG-002', 'PRG-003'],
    permissions: [],
    createdAt: '2024-01-01',
    lastLogin: '2024-06-01',
  },
  {
    id: 'USR-002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Staff' as const,
    status: 'Inactive' as const,
    assignedPrograms: [],
    permissions: [],
    createdAt: '2024-01-01',
    lastLogin: '2024-06-01',
  },
];

describe('UserTable', () => {
  it('should render user directory title', () => {
    render(<UserTable users={mockUsers} isLoading={false} canManageUsers={false} />);
    expect(screen.getByText('User Directory')).toBeInTheDocument();
  });

  it('should render user count badge', () => {
    render(<UserTable users={mockUsers} isLoading={false} canManageUsers={false} />);
    expect(screen.getByText('2 users')).toBeInTheDocument();
  });

  it('should render table headers', () => {
    render(<UserTable users={mockUsers} isLoading={false} canManageUsers={false} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('should show actions column when canManageUsers', () => {
    render(<UserTable users={mockUsers} isLoading={false} canManageUsers={true} />);
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should not show actions column when cannot manage users', () => {
    render(<UserTable users={mockUsers} isLoading={false} canManageUsers={false} />);
    expect(screen.queryByText('Actions')).not.toBeInTheDocument();
  });

  it('should render user names', () => {
    render(<UserTable users={mockUsers} isLoading={false} canManageUsers={false} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should render user emails', () => {
    render(<UserTable users={mockUsers} isLoading={false} canManageUsers={false} />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<UserTable users={[]} isLoading={true} canManageUsers={false} />);
    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });

  it('should show empty state when no users', () => {
    render(<UserTable users={[]} isLoading={false} canManageUsers={false} />);
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('should show truncated program badges for users with >2 programs', () => {
    render(<UserTable users={mockUsers} isLoading={false} canManageUsers={false} />);
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('should show no assignments text for users without programs', () => {
    render(<UserTable users={mockUsers} isLoading={false} canManageUsers={false} />);
    expect(screen.getByText('No assignments')).toBeInTheDocument();
  });
});
