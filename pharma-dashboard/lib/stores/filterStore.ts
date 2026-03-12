import { create } from "zustand";
import type { ProgramFilters } from "@/types";

/**
 * Filter state interface
 */
interface FilterState extends ProgramFilters {
  /** Update filters */
  setFilters: (filters: Partial<ProgramFilters>) => void;
  /** Reset filters to default */
  resetFilters: () => void;
}

const defaultFilters: ProgramFilters = {
  search: "",
  phase: "All",
  therapeuticArea: "All",
  status: "All",
};

/**
 * Global filter state store for program list
 */
export const useFilterStore = create<FilterState>((set) => ({
  ...defaultFilters,

  setFilters: (filters) =>
    set((state) => ({
      ...state,
      ...filters,
    })),

  resetFilters: () =>
    set(defaultFilters),
}));
