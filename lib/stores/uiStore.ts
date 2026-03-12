import { create } from "zustand";

/**
 * UI state interface
 */
interface UIState {
  /** Currently active module */
  activeModule: "iam" | "programs" | "dashboard" | "alerts";
  /** Sidebar collapsed state */
  sidebarCollapsed: boolean;
  /** Active modal/dialog */
  activeModal: string | null;
  /** Loading states */
  isLoading: Record<string, boolean>;
  /** Set active module */
  setActiveModule: (module: UIState["activeModule"]) => void;
  /** Toggle sidebar */
  toggleSidebar: () => void;
  /** Open modal */
  openModal: (modalId: string) => void;
  /** Close modal */
  closeModal: () => void;
  /** Set loading state for a specific key */
  setLoading: (key: string, loading: boolean) => void;
}

/**
 * Global UI state store
 */
export const useUIStore = create<UIState>((set) => ({
  activeModule: "dashboard",
  sidebarCollapsed: false,
  activeModal: null,
  isLoading: {},

  setActiveModule: (module) =>
    set({ activeModule: module }),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  openModal: (modalId) =>
    set({ activeModal: modalId }),

  closeModal: () =>
    set({ activeModal: null }),

  setLoading: (key, loading) =>
    set((state) => ({
      isLoading: {
        ...state.isLoading,
        [key]: loading,
      },
    })),
}));
