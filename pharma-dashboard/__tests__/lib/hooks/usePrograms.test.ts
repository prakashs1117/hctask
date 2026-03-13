import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePrograms, useProgram } from '../../../lib/hooks/usePrograms';

jest.mock('../../../lib/api/data', () => ({
  getPrograms: jest.fn().mockResolvedValue([
    { id: 'PRG-001', name: 'Program 1' },
    { id: 'PRG-002', name: 'Program 2' },
  ]),
  getProgramById: jest.fn().mockImplementation((id: string) =>
    Promise.resolve({ id, name: `Program ${id}` })
  ),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('usePrograms', () => {
  it('should fetch all programs', async () => {
    const { result } = renderHook(() => usePrograms(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0].name).toBe('Program 1');
  });
});

describe('useProgram', () => {
  it('should fetch a single program by ID', async () => {
    const { result } = renderHook(() => useProgram('PRG-001'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe('PRG-001');
  });

  it('should not fetch when id is empty', () => {
    const { result } = renderHook(() => useProgram(''), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});
