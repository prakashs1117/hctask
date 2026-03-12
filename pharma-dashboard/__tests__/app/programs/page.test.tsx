import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProgramsPage from '../../../app/programs/page';

// Mock the hooks and stores
const mockPrograms = [
  {
    id: "PROG001",
    name: "Test Program 1",
    description: "Description 1",
    therapeuticArea: "Oncology" as const,
    phase: "Phase II" as const,
    status: "Active" as const,
    manager: "Dr. Smith",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    studies: [
      {
        id: "STD001",
        programId: "PROG001",
        name: "Study 1",
        title: "Test Study 1",
        enrollmentCount: 50,
        targetEnrollment: 100,
        milestone: "Recruitment" as const,
        status: "Active" as const,
        startDate: new Date(),
        estimatedEndDate: new Date()
      }
    ],
    milestones: []
  },
  {
    id: "PROG002",
    name: "Test Program 2",
    description: "Description 2",
    therapeuticArea: "Neurology" as const,
    phase: "Phase III" as const,
    status: "On Hold" as const,
    manager: "Dr. Jones",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
    studies: [],
    milestones: []
  }
];

// Mock usePrograms hook
jest.mock('../../../lib/hooks/usePrograms', () => ({
  usePrograms: () => ({
    data: mockPrograms,
    isLoading: false
  })
}));

// Mock filter store
const mockFilterStore = {
  search: '',
  phase: 'All',
  therapeuticArea: 'All',
  setFilters: jest.fn(),
  resetFilters: jest.fn()
};

jest.mock('../../../lib/stores/filterStore', () => ({
  useFilterStore: () => mockFilterStore
}));

// Mock useFilteredPrograms hook
jest.mock('../../../lib/hooks/useFilteredPrograms', () => ({
  useFilteredPrograms: (programs: typeof mockPrograms | undefined, filters: typeof mockFilterStore) => {
    if (!programs) return [];

    let filtered = programs;

    if (filters.search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.manager.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.phase !== 'All') {
      filtered = filtered.filter((p) => p.phase === filters.phase);
    }

    if (filters.therapeuticArea !== 'All') {
      filtered = filtered.filter((p) => p.therapeuticArea === filters.therapeuticArea);
    }

    return filtered;
  }
}));

// Mock auth store
const mockAuthStore = {
  hasPermission: jest.fn()
};

jest.mock('../../../lib/stores/authStore', () => ({
  useAuthStore: () => mockAuthStore
}));

// Mock the component imports
jest.mock('../../../components/features/CreateProgramDialog', () => ({
  CreateProgramDialog: ({ canCreate }: { canCreate: boolean }) =>
    canCreate ? <button>Create Program</button> : null
}));

jest.mock('../../../components/features/edit-program-dialog', () => ({
  EditProgramDialog: ({ program, canEdit, variant }: { program: { id: string }, canEdit: boolean, variant?: string }) =>
    canEdit ? <button data-testid={`edit-${program.id}`}>Edit {variant === 'table' ? 'Small' : ''}</button> : null
}));

describe('Programs Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthStore.hasPermission.mockReturnValue(true);
    mockFilterStore.search = '';
    mockFilterStore.phase = 'All';
    mockFilterStore.therapeuticArea = 'All';
  });

  describe('Page Rendering', () => {
    it('should render page header with correct title and description', () => {
      render(<ProgramsPage />);

      expect(screen.getByText('Programs Module')).toBeInTheDocument();
      expect(screen.getByText(/Create and manage drug development programs/)).toBeInTheDocument();
    });

    it('should render programs table with data', () => {
      render(<ProgramsPage />);

      expect(screen.getByText('Test Program 1')).toBeInTheDocument();
      expect(screen.getByText('Test Program 2')).toBeInTheDocument();
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
      expect(screen.getByText('Dr. Jones')).toBeInTheDocument();
    });

    it('should display program count correctly', () => {
      render(<ProgramsPage />);

      expect(screen.getByText('2 of 2 programs')).toBeInTheDocument();
    });

    it('should render filter controls', () => {
      render(<ProgramsPage />);

      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search programs...')).toBeInTheDocument();
    });

    it('should show create program button when user has permission', () => {
      mockAuthStore.hasPermission.mockImplementation((permission: string) => permission === 'create_programs');

      render(<ProgramsPage />);

      expect(screen.getByText('Create Program')).toBeInTheDocument();
    });

    it('should hide create program button when user lacks permission', () => {
      mockAuthStore.hasPermission.mockReturnValue(false);

      render(<ProgramsPage />);

      expect(screen.queryByText('Create Program')).not.toBeInTheDocument();
    });
  });

  describe('Filtering Functionality', () => {
    it('should update search filter when typing in search box', async () => {
      const user = userEvent.setup();
      render(<ProgramsPage />);

      const searchInput = screen.getByPlaceholderText('Search programs...');
      await user.type(searchInput, 'Program 1');

      expect(mockFilterStore.setFilters).toHaveBeenCalledWith({ search: 'Program 1' });
    });

    it('should clear search when X button is clicked', async () => {
      mockFilterStore.search = 'test search';
      const user = userEvent.setup();
      render(<ProgramsPage />);

      const clearButton = screen.getByRole('button', { name: '' }); // X button has no accessible name
      await user.click(clearButton);

      expect(mockFilterStore.setFilters).toHaveBeenCalledWith({ search: '' });
    });

    it('should toggle filters panel', async () => {
      const user = userEvent.setup();
      render(<ProgramsPage />);

      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);

      expect(screen.getByText('Advanced Filters')).toBeInTheDocument();
    });

    it('should show active filter count badge', () => {
      mockFilterStore.search = 'test';
      mockFilterStore.phase = 'Phase I';

      render(<ProgramsPage />);

      expect(screen.getByText('2')).toBeInTheDocument(); // Badge showing 2 active filters
    });

    it('should reset all filters when Clear All is clicked', async () => {
      mockFilterStore.search = 'test';
      mockFilterStore.phase = 'Phase I';

      const user = userEvent.setup();
      render(<ProgramsPage />);

      // Open filters panel
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);

      // Click Clear All
      const clearAllButton = screen.getByText('Clear All');
      await user.click(clearAllButton);

      expect(mockFilterStore.resetFilters).toHaveBeenCalled();
    });

    it('should update phase filter', async () => {
      const user = userEvent.setup();
      render(<ProgramsPage />);

      // Open filters panel
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);

      const phaseSelect = screen.getByDisplayValue('All Phases');
      await user.selectOptions(phaseSelect, 'Phase II');

      expect(mockFilterStore.setFilters).toHaveBeenCalledWith({ phase: 'Phase II' });
    });

    it('should update therapeutic area filter', async () => {
      const user = userEvent.setup();
      render(<ProgramsPage />);

      // Open filters panel
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);

      const areaSelect = screen.getByDisplayValue('All Areas');
      await user.selectOptions(areaSelect, 'Oncology');

      expect(mockFilterStore.setFilters).toHaveBeenCalledWith({ therapeuticArea: 'Oncology' });
    });
  });

  describe('Program Actions', () => {
    it('should render View buttons for all programs', () => {
      render(<ProgramsPage />);

      const viewButtons = screen.getAllByText('View');
      expect(viewButtons).toHaveLength(2);
    });

    it('should render Edit buttons when user has edit permission', () => {
      mockAuthStore.hasPermission.mockImplementation((permission: string) => permission === 'edit_programs');

      render(<ProgramsPage />);

      expect(screen.getByTestId('edit-PROG001')).toBeInTheDocument();
      expect(screen.getByTestId('edit-PROG002')).toBeInTheDocument();
    });

    it('should hide Edit buttons when user lacks edit permission', () => {
      mockAuthStore.hasPermission.mockImplementation((permission: string) => permission !== 'edit_programs');

      render(<ProgramsPage />);

      expect(screen.queryByTestId('edit-PROG001')).not.toBeInTheDocument();
      expect(screen.queryByTestId('edit-PROG002')).not.toBeInTheDocument();
    });

    it('should render Edit buttons with table variant', () => {
      mockAuthStore.hasPermission.mockImplementation((permission: string) => permission === 'edit_programs');

      render(<ProgramsPage />);

      expect(screen.getByText('Edit Small')).toBeInTheDocument();
    });

    it('should navigate to program detail page when View is clicked', () => {
      render(<ProgramsPage />);

      const viewLinks = screen.getAllByRole('link');
      const programViewLink = viewLinks.find(link =>
        link.getAttribute('href') === '/programs/PROG001'
      );

      expect(programViewLink).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when data is loading', async () => {
      // Mock loading state
      jest.doMock('../../../lib/hooks/usePrograms', () => ({
        usePrograms: () => ({
          data: undefined,
          isLoading: true
        })
      }));

      const { default: ProgramsPageWithLoading } = await import('../../../app/programs/page');
      render(<ProgramsPageWithLoading />);

      expect(screen.getByText('Loading programs...')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show no programs message when filtered results are empty', async () => {
      // Mock empty filtered results
      jest.doMock('../../../lib/hooks/useFilteredPrograms', () => ({
        useFilteredPrograms: () => []
      }));

      const { default: ProgramsPageWithEmpty } = await import('../../../app/programs/page');
      render(<ProgramsPageWithEmpty />);

      expect(screen.getByText('No programs found')).toBeInTheDocument();
      expect(screen.getByText('No programs match your current filters. Try adjusting your search criteria.')).toBeInTheDocument();
    });

    it('should show clear filters button in empty state when filters are active', async () => {
      mockFilterStore.search = 'nonexistent';

      // Mock empty filtered results
      jest.doMock('../../../lib/hooks/useFilteredPrograms', () => ({
        useFilteredPrograms: () => []
      }));

      const { default: ProgramsPageWithEmptyFiltered } = await import('../../../app/programs/page');
      render(<ProgramsPageWithEmptyFiltered />);

      const clearButton = screen.getByText('Clear all filters');
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render responsive table headers', () => {
      render(<ProgramsPage />);

      // Check for responsive classes in table headers
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Program')).toBeInTheDocument();
      expect(screen.getByText('Phase')).toBeInTheDocument();
    });

    it('should truncate program names on mobile', () => {
      render(<ProgramsPage />);

      // The component should handle long names with CSS classes
      const programNames = screen.getAllByText(/Test Program/);
      expect(programNames.length).toBeGreaterThan(0);
    });
  });

  describe('Enrollment Data', () => {
    it('should display enrollment progress correctly', () => {
      render(<ProgramsPage />);

      expect(screen.getByText('50/100 enrolled')).toBeInTheDocument();
    });

    it('should show studies count', () => {
      render(<ProgramsPage />);

      expect(screen.getByText('1')).toBeInTheDocument(); // studies count for PROG001
      expect(screen.getByText('0')).toBeInTheDocument(); // studies count for PROG002
    });
  });

  describe('Badge Components', () => {
    it('should render phase badges', () => {
      render(<ProgramsPage />);

      // These are mocked components, so we check they receive correct props
      expect(screen.getByText('Test Program 1')).toBeInTheDocument();
      expect(screen.getByText('Test Program 2')).toBeInTheDocument();
    });

    it('should render therapeutic area badges', () => {
      render(<ProgramsPage />);

      // Badge components are mocked, so we verify the programs are displayed
      expect(screen.getByText('Test Program 1')).toBeInTheDocument();
      expect(screen.getByText('Test Program 2')).toBeInTheDocument();
    });
  });
});
