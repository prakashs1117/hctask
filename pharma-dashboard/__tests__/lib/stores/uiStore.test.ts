import { useUIStore } from '../../../lib/stores/uiStore';
import { act } from '@testing-library/react';

describe('uiStore', () => {
  beforeEach(() => {
    act(() => {
      const state = useUIStore.getState();
      state.setActiveModule('dashboard');
      state.closeModal();
      if (state.sidebarCollapsed) state.toggleSidebar();
    });
  });

  it('should have default values', () => {
    const state = useUIStore.getState();
    expect(state.activeModule).toBe('dashboard');
    expect(state.sidebarCollapsed).toBe(false);
    expect(state.activeModal).toBeNull();
    expect(state.isLoading).toEqual({});
  });

  it('should set active module', () => {
    act(() => {
      useUIStore.getState().setActiveModule('programs');
    });
    expect(useUIStore.getState().activeModule).toBe('programs');
  });

  it('should toggle sidebar', () => {
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
    act(() => {
      useUIStore.getState().toggleSidebar();
    });
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
    act(() => {
      useUIStore.getState().toggleSidebar();
    });
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
  });

  it('should open and close modal', () => {
    act(() => {
      useUIStore.getState().openModal('create-program');
    });
    expect(useUIStore.getState().activeModal).toBe('create-program');
    act(() => {
      useUIStore.getState().closeModal();
    });
    expect(useUIStore.getState().activeModal).toBeNull();
  });

  it('should set loading states', () => {
    act(() => {
      useUIStore.getState().setLoading('programs', true);
    });
    expect(useUIStore.getState().isLoading.programs).toBe(true);
    act(() => {
      useUIStore.getState().setLoading('programs', false);
    });
    expect(useUIStore.getState().isLoading.programs).toBe(false);
  });

  it('should handle multiple loading keys', () => {
    act(() => {
      useUIStore.getState().setLoading('programs', true);
      useUIStore.getState().setLoading('users', true);
    });
    const state = useUIStore.getState();
    expect(state.isLoading.programs).toBe(true);
    expect(state.isLoading.users).toBe(true);
  });
});
