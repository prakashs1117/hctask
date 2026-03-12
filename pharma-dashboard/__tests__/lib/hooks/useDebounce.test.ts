import { renderHook, act } from '@testing-library/react';
import { useDebounce, useDebouncedSearch } from '../../../lib/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } }
    );

    rerender({ value: 'world' });
    expect(result.current).toBe('hello');

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('world');
  });

  it('should cancel previous timeout on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'ab' });
    act(() => { jest.advanceTimersByTime(100); });
    rerender({ value: 'abc' });
    act(() => { jest.advanceTimersByTime(100); });
    rerender({ value: 'abcd' });

    act(() => { jest.advanceTimersByTime(300); });
    expect(result.current).toBe('abcd');
  });

  it('should use default delay of 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    act(() => { jest.advanceTimersByTime(299); });
    expect(result.current).toBe('initial');
    act(() => { jest.advanceTimersByTime(1); });
    expect(result.current).toBe('updated');
  });
});

describe('useDebouncedSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call onSearch with debounced value', () => {
    const onSearch = jest.fn();
    const { rerender } = renderHook(
      ({ searchTerm }) => useDebouncedSearch(searchTerm, onSearch, 300),
      { initialProps: { searchTerm: '' } }
    );

    rerender({ searchTerm: 'test' });
    act(() => { jest.advanceTimersByTime(300); });
    expect(onSearch).toHaveBeenCalledWith('test');
  });

  it('should not call onSearch before delay', () => {
    const onSearch = jest.fn();
    const { rerender } = renderHook(
      ({ searchTerm }) => useDebouncedSearch(searchTerm, onSearch, 300),
      { initialProps: { searchTerm: '' } }
    );

    onSearch.mockClear();
    rerender({ searchTerm: 'test' });
    act(() => { jest.advanceTimersByTime(100); });
    // onSearch should not have been called with 'test' yet
    expect(onSearch).not.toHaveBeenCalledWith('test');
  });
});
