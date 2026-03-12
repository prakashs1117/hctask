import { useAuthStore } from '../../../lib/stores/authStore';
import { act } from '@testing-library/react';
import type { User } from '../../../types';

describe('authStore', () => {
  beforeEach(() => {
    act(() => {
      useAuthStore.getState().logout();
    });
  });

  it('should have default values', () => {
    const state = useAuthStore.getState();
    expect(state.currentUser).toBeNull();
    expect(state.role).toBe('Viewer');
  });

  it('should set user and role', () => {
    const mockUser: User = {
      id: 'USR001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah@pharma.com',
      role: 'Manager',
      assignedPrograms: ['PROG001'],
      status: 'Active',
      createdAt: new Date(),
    };
    act(() => {
      useAuthStore.getState().setUser(mockUser);
    });
    const state = useAuthStore.getState();
    expect(state.currentUser).toEqual(mockUser);
    expect(state.role).toBe('Manager');
  });

  it('should set role independently', () => {
    act(() => {
      useAuthStore.getState().setRole('Staff');
    });
    expect(useAuthStore.getState().role).toBe('Staff');
  });

  it('should check permissions for Manager role', () => {
    act(() => {
      useAuthStore.getState().setRole('Manager');
    });
    const state = useAuthStore.getState();
    expect(state.hasPermission('create_programs')).toBe(true);
    expect(state.hasPermission('edit_programs')).toBe(true);
    expect(state.hasPermission('delete_programs')).toBe(true);
    expect(state.hasPermission('manage_users')).toBe(true);
  });

  it('should check permissions for Staff role', () => {
    act(() => {
      useAuthStore.getState().setRole('Staff');
    });
    const state = useAuthStore.getState();
    expect(state.hasPermission('view_programs')).toBe(true);
    expect(state.hasPermission('add_studies')).toBe(true);
    expect(state.hasPermission('create_programs')).toBe(false);
    expect(state.hasPermission('manage_users')).toBe(false);
  });

  it('should check permissions for Viewer role', () => {
    act(() => {
      useAuthStore.getState().setRole('Viewer');
    });
    const state = useAuthStore.getState();
    expect(state.hasPermission('view_programs')).toBe(true);
    expect(state.hasPermission('view_alerts')).toBe(true);
    expect(state.hasPermission('create_programs')).toBe(false);
    expect(state.hasPermission('edit_programs')).toBe(false);
  });

  it('should logout and reset state', () => {
    const mockUser: User = {
      id: 'USR001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah@pharma.com',
      role: 'Manager',
      assignedPrograms: ['PROG001'],
      status: 'Active',
      createdAt: new Date(),
    };
    act(() => {
      useAuthStore.getState().setUser(mockUser);
    });
    act(() => {
      useAuthStore.getState().logout();
    });
    const state = useAuthStore.getState();
    expect(state.currentUser).toBeNull();
    expect(state.role).toBe('Viewer');
  });
});
