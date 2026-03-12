import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole, User, Permission } from "@/types";
import { rolePermissions } from "@/types";

/**
 * Authentication store state interface
 */
interface AuthState {
  /** Current user */
  currentUser: User | null;
  /** Current user role */
  role: UserRole;
  /** Set current user and role */
  setUser: (user: User) => void;
  /** Set role (for demo/testing) */
  setRole: (role: UserRole) => void;
  /** Check if user has specific permission */
  hasPermission: (permission: Permission) => boolean;
  /** Logout current user */
  logout: () => void;
}

/**
 * Global authentication store using Zustand
 * Persists to localStorage for demo purposes
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      role: "Viewer",

      setUser: (user) =>
        set({
          currentUser: user,
          role: user.role,
        }),

      setRole: (role) =>
        set({ role }),

      hasPermission: (permission) => {
        const { role } = get();
        return rolePermissions[role].includes(permission);
      },

      logout: () =>
        set({
          currentUser: null,
          role: "Viewer",
        }),
    }),
    {
      name: "pharma-rcd-auth",
    }
  )
);
