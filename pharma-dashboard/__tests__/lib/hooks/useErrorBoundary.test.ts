import { renderHook, act } from '@testing-library/react';
import { useErrorBoundary, useFormErrorHandling } from '../../../lib/hooks/useErrorBoundary';

describe('useErrorBoundary', () => {
  it('should have no error initially', () => {
    const { result } = renderHook(() => useErrorBoundary());
    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
  });

  it('should capture error', () => {
    const { result } = renderHook(() => useErrorBoundary());
    const testError = new Error('Test error');

    act(() => {
      result.current.captureError(testError);
    });

    expect(result.current.error).toBe(testError);
    expect(result.current.hasError).toBe(true);
  });

  it('should reset error', () => {
    const { result } = renderHook(() => useErrorBoundary());

    act(() => {
      result.current.captureError(new Error('Test'));
    });
    expect(result.current.hasError).toBe(true);

    act(() => {
      result.current.resetError();
    });
    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
  });

  it('should handle async operations with tryAsync', async () => {
    const { result } = renderHook(() => useErrorBoundary());

    let value: string | undefined;
    await act(async () => {
      value = await result.current.tryAsync(async () => 'success');
    });
    expect(value).toBe('success');
    expect(result.current.hasError).toBe(false);
  });

  it('should catch async errors and return fallback', async () => {
    const { result } = renderHook(() => useErrorBoundary());

    let value: string | undefined;
    await act(async () => {
      value = await result.current.tryAsync(
        async () => { throw new Error('Async fail'); },
        'fallback'
      );
    });
    expect(value).toBe('fallback');
    expect(result.current.hasError).toBe(true);
  });

  it('should handle sync operations with trySync', () => {
    const { result } = renderHook(() => useErrorBoundary());

    let value: number | undefined;
    act(() => {
      value = result.current.trySync(() => 42);
    });
    expect(value).toBe(42);
    expect(result.current.hasError).toBe(false);
  });

  it('should catch sync errors and return fallback', () => {
    const { result } = renderHook(() => useErrorBoundary());

    let value: number | undefined;
    act(() => {
      value = result.current.trySync(
        () => { throw new Error('Sync fail'); },
        99
      );
    });
    expect(value).toBe(99);
    expect(result.current.hasError).toBe(true);
  });
});

describe('useFormErrorHandling', () => {
  it('should have no errors initially', () => {
    const { result } = renderHook(() => useFormErrorHandling());
    expect(result.current.errors).toEqual({});
    expect(result.current.hasError()).toBe(false);
  });

  it('should set field errors', () => {
    const { result } = renderHook(() => useFormErrorHandling());

    act(() => {
      result.current.setError('name', 'Name is required');
    });
    expect(result.current.errors.name).toBe('Name is required');
    expect(result.current.hasError('name')).toBe(true);
    expect(result.current.hasError()).toBe(true);
  });

  it('should clear specific field error', () => {
    const { result } = renderHook(() => useFormErrorHandling());

    act(() => {
      result.current.setError('name', 'Required');
      result.current.setError('email', 'Invalid');
    });
    act(() => {
      result.current.clearError('name');
    });
    expect(result.current.hasError('name')).toBe(false);
    expect(result.current.hasError('email')).toBe(true);
  });

  it('should clear all errors', () => {
    const { result } = renderHook(() => useFormErrorHandling());

    act(() => {
      result.current.setError('name', 'Required');
      result.current.setError('email', 'Invalid');
    });
    act(() => {
      result.current.clearAllErrors();
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.hasError()).toBe(false);
  });

  it('should check specific field error', () => {
    const { result } = renderHook(() => useFormErrorHandling());

    expect(result.current.hasError('name')).toBe(false);
    act(() => {
      result.current.setError('name', 'Required');
    });
    expect(result.current.hasError('name')).toBe(true);
    expect(result.current.hasError('email')).toBe(false);
  });
});
