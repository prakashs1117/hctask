import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import type { Program } from '@/types';
import type { RootState } from '../index';

interface ProgramsState {
  // Client-side filters and selections
  selectedProgramIds: string[];
  favoritePrograms: string[];
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'phase' | 'lastUpdated' | 'priority';
  sortOrder: 'asc' | 'desc';

  // Cached computed data
  lastFilteredHash: string | null;

  // UI state
  expandedPrograms: string[];
  selectedFilters: {
    search: string;
    phase: string;
    therapeuticArea: string;
    riskLevel: string;
    status: string;
  };
}

const initialState: ProgramsState = {
  selectedProgramIds: [],
  favoritePrograms: typeof window !== 'undefined' ? JSON.parse(localStorage?.getItem('favoritePrograms') || '[]') : [],
  viewMode: 'list',
  sortBy: 'lastUpdated',
  sortOrder: 'desc',
  lastFilteredHash: null,
  expandedPrograms: [],
  selectedFilters: {
    search: '',
    phase: 'All',
    therapeuticArea: 'All',
    riskLevel: 'All',
    status: 'All',
  },
};

export const programsSlice = createSlice({
  name: 'programs',
  initialState,
  reducers: {
    // Selection actions
    selectProgram: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (!state.selectedProgramIds.includes(id)) {
        state.selectedProgramIds.push(id);
      }
    },

    deselectProgram: (state, action: PayloadAction<string>) => {
      state.selectedProgramIds = state.selectedProgramIds.filter(id => id !== action.payload);
    },

    toggleProgramSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedProgramIds.indexOf(id);
      if (index === -1) {
        state.selectedProgramIds.push(id);
      } else {
        state.selectedProgramIds.splice(index, 1);
      }
    },

    clearSelection: (state) => {
      state.selectedProgramIds = [];
    },

    selectAllPrograms: (state, action: PayloadAction<string[]>) => {
      state.selectedProgramIds = action.payload;
    },

    // Favorites actions
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.favoritePrograms.indexOf(id);
      if (index === -1) {
        state.favoritePrograms.push(id);
      } else {
        state.favoritePrograms.splice(index, 1);
      }
      // Sync to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('favoritePrograms', JSON.stringify(state.favoritePrograms));
      }
    },

    // View mode actions
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },

    // Sorting actions
    setSorting: (state, action: PayloadAction<{ sortBy: ProgramsState['sortBy']; sortOrder: ProgramsState['sortOrder'] }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },

    // Filter actions
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.selectedFilters.search = action.payload;
    },

    setPhaseFilter: (state, action: PayloadAction<string>) => {
      state.selectedFilters.phase = action.payload;
    },

    setTherapeuticAreaFilter: (state, action: PayloadAction<string>) => {
      state.selectedFilters.therapeuticArea = action.payload;
    },

    setRiskLevelFilter: (state, action: PayloadAction<string>) => {
      state.selectedFilters.riskLevel = action.payload;
    },

    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.selectedFilters.status = action.payload;
    },

    setAllFilters: (state, action: PayloadAction<Partial<ProgramsState['selectedFilters']>>) => {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },

    resetFilters: (state) => {
      state.selectedFilters = initialState.selectedFilters;
    },

    // UI state actions
    expandProgram: (state, action: PayloadAction<string>) => {
      if (!state.expandedPrograms.includes(action.payload)) {
        state.expandedPrograms.push(action.payload);
      }
    },

    collapseProgram: (state, action: PayloadAction<string>) => {
      state.expandedPrograms = state.expandedPrograms.filter(id => id !== action.payload);
    },

    toggleProgramExpansion: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.expandedPrograms.indexOf(id);
      if (index === -1) {
        state.expandedPrograms.push(id);
      } else {
        state.expandedPrograms.splice(index, 1);
      }
    },

    // Cache management
    setFilteredHash: (state, action: PayloadAction<string>) => {
      state.lastFilteredHash = action.payload;
    },
  },
});

// Action creators
export const {
  selectProgram,
  deselectProgram,
  toggleProgramSelection,
  clearSelection,
  selectAllPrograms,
  toggleFavorite,
  setViewMode,
  setSorting,
  setSearchFilter,
  setPhaseFilter,
  setTherapeuticAreaFilter,
  setRiskLevelFilter,
  setStatusFilter,
  setAllFilters,
  resetFilters,
  expandProgram,
  collapseProgram,
  toggleProgramExpansion,
  setFilteredHash,
} = programsSlice.actions;

// Selectors
export const selectProgramsState = (state: RootState) => state.programs;
export const selectSelectedProgramIds = (state: RootState) => state.programs.selectedProgramIds;
export const selectFavoritePrograms = (state: RootState) => state.programs.favoritePrograms;
export const selectViewMode = (state: RootState) => state.programs.viewMode;
export const selectSorting = (state: RootState) => ({
  sortBy: state.programs.sortBy,
  sortOrder: state.programs.sortOrder
});
export const selectFilters = (state: RootState) => state.programs.selectedFilters;
export const selectExpandedPrograms = (state: RootState) => state.programs.expandedPrograms;

// Complex selectors
export const selectActiveFilterCount = createSelector([selectFilters], (filters) => {
  return Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value.trim() !== '';
    return value !== 'All';
  }).length;
});

export const selectHasActiveFilters = createSelector([selectActiveFilterCount], (count) => count > 0);

export const selectIsProgramFavorite = createSelector(
  [selectFavoritePrograms, (_: RootState, programId: string) => programId],
  (favorites, programId) => favorites.includes(programId)
);

export const selectIsProgramSelected = createSelector(
  [selectSelectedProgramIds, (_: RootState, programId: string) => programId],
  (selectedIds, programId) => selectedIds.includes(programId)
);

export const selectIsProgramExpanded = createSelector(
  [selectExpandedPrograms, (_: RootState, programId: string) => programId],
  (expandedIds, programId) => expandedIds.includes(programId)
);

export default programsSlice.reducer;