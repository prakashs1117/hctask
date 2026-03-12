import React from 'react';
import { render, screen } from '@testing-library/react';
import { IAMStats } from '../../../../components/organisms/iam/iam-stats';
import type { User } from '../../../../types';

jest.mock('../../../../lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'iam.totalUsers': 'Total Users',
        'iam.managers': 'Managers',
        'iam.staff': 'Staff',
        'iam.viewers': 'Viewers',
      };
      return t[key] || key;
    },
    locale: 'en',
    changeLocale: jest.fn(),
  }),
}));

const mockUsers: User[] = [
  { id: 'U1', name: 'User 1', email: 'u1@test.com', role: 'Manager', assignedPrograms: [], status: 'Active', createdAt: new Date() },
  { id: 'U2', name: 'User 2', email: 'u2@test.com', role: 'Staff', assignedPrograms: [], status: 'Active', createdAt: new Date() },
  { id: 'U3', name: 'User 3', email: 'u3@test.com', role: 'Viewer', assignedPrograms: [], status: 'Active', createdAt: new Date() },
  { id: 'U4', name: 'User 4', email: 'u4@test.com', role: 'Staff', assignedPrograms: [], status: 'Active', createdAt: new Date() },
];

describe('IAMStats', () => {
  it('should render user role counts', () => {
    render(<IAMStats users={mockUsers} />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Managers')).toBeInTheDocument();
    expect(screen.getByText('Staff')).toBeInTheDocument();
    expect(screen.getByText('Viewers')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Staff count
  });

  it('should handle undefined users', () => {
    render(<IAMStats users={undefined} />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(3);
  });
});
