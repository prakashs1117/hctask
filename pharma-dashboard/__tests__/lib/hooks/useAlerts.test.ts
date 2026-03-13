import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAlerts, useActiveAlertCount } from '../../../lib/hooks/useAlerts';

jest.mock('../../../lib/api/data', () => ({
  getAlerts: jest.fn().mockResolvedValue([
    { id: 'ALT-001', status: 'Active', program: 'P1', study: 'S1', deadline: '2026-04-01', channel: ['Email'], recurring: 'One-time', notifyBefore: [7], createdAt: '2024-01-01' },
    { id: 'ALT-002', status: 'Overdue', program: 'P2', study: 'S2', deadline: '2024-01-01', channel: ['SMS'], recurring: 'Weekly', notifyBefore: [3], createdAt: '2024-01-01' },
    { id: 'ALT-003', status: 'Completed', program: 'P3', study: 'S3', deadline: '2025-01-01', channel: ['Email'], recurring: 'Monthly', notifyBefore: [7], createdAt: '2024-01-01' },
  ]),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useAlerts', () => {
  it('should fetch all alerts', async () => {
    const { result } = renderHook(() => useAlerts(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(3);
  });
});

describe('useActiveAlertCount', () => {
  it('should return count of active and overdue alerts', async () => {
    const { result } = renderHook(() => useActiveAlertCount(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current).toBe(2));
  });
});
