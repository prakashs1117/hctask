import { renderHook, act } from '@testing-library/react';
import { useTranslation } from '../../../lib/hooks/useTranslation';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useTranslation', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should return translation function and default locale', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.locale).toBe('en');
    expect(typeof result.current.t).toBe('function');
    expect(typeof result.current.changeLocale).toBe('function');
  });

  it('should translate known keys', () => {
    const { result } = renderHook(() => useTranslation('en'));
    const translated = result.current.t('common.appName');
    expect(typeof translated).toBe('string');
  });

  it('should return key for unknown translations', () => {
    const { result } = renderHook(() => useTranslation('en'));
    expect(result.current.t('unknown.key.path')).toBe('unknown.key.path');
  });

  it('should change locale', () => {
    const { result } = renderHook(() => useTranslation('en'));
    act(() => {
      result.current.changeLocale('es');
    });
    expect(result.current.locale).toBe('es');
    expect(localStorageMock.getItem('pharma-rcd-locale')).toBe('es');
  });

  it('should load saved locale from localStorage', () => {
    localStorageMock.setItem('pharma-rcd-locale', 'es');
    const { result } = renderHook(() => useTranslation('en'));
    expect(result.current.locale).toBe('es');
  });
});
