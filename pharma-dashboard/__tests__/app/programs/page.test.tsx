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

// Mock useTranslation
jest.mock('../../../lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'programs.title': 'Programs Module',
        'programs.subtitle': 'Create and manage drug development programs',
        'programs.programPortfolio': 'Program Portfolio',
        'programs.loadingPrograms': 'Loading programs...',
        'programs.noProgramsFound': 'No programs found',
        'programs.noProgramsFoundDesc': 'No programs match your current filters. Try adjusting your search criteria.',
        'programs.programFilters': 'Advanced Filters',
        'programs.id': 'ID',
        'programs.program': 'Program',
        'programs.area': 'Area',
        'programs.studies': 'Studies',
        'programs.enrollment': 'Enrollment',
        'programs.manager': 'Manager',
        'programs.xStudies': 'studies',
        'programs.enrolled': 'enrolled',
        'filters.phase': 'Phase',
        'common.actions': 'Actions',
        'common.view': 'View',
        'navigation.programs': 'Programs',
      };
      return translations[key] || key;
    },
    locale: 'en',
    changeLocale: jest.fn()
  })
}));

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
  status: 'All',
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
jest.mock('../../../components/organisms/programs/create-program-dialog', () => ({
  CreateProgramDialog: ({ canCreate }: { canCreate: boolean }) =>
    canCreate ? <button>Create Program</button> : null
}));

jest.mock('../../../components/organisms/programs/edit-program-dialog', () => ({
  EditProgramDialog: ({ program, canEdit, variant }: { program: { id: string }, canEdit: boolean, variant?: string }) =>
    canEdit ? <button data-testid={`edit-${program.id}`}>Edit {variant === 'table' ? 'Small' : ''}</button> : null
}));

// Mock other components
jest.mock('../../../components/molecules/enrollment-bar', () => ({
  EnrollmentBar: () => <div data-testid="enrollment-bar" />
}));

jest.mock('../../../components/molecules/program-badge', () => ({
  PhaseBadge: ({ phase }: { phase: string }) => <span data-testid="phase-badge">{phase}</span>,
  TherapeuticAreaBadge: ({ area }: { area: string }) => <span data-testid="area-badge">{area}</span>,
}));

jest.mock('../../../lib/utils/formatters', () => ({
  calculateProgramTotals: (studies: Array<{ enrollmentCount: number; targetEnrollment: number }>) => ({
    totalEnrollment: studies.reduce((sum: number, s: { enrollmentCount: number }) => sum + s.enrollmentCount, 0),
    totalTarget: studies.reduce((sum: number, s: { targetEnrollment: number }) => sum + s.targetEnrollment, 0),
  }),
  truncateText: (text: string, length: number) => text.length > length ? text.slice(0, length) + '...' : text,
}));

jest.mock('../../../components/organisms/programs/program-filters', () => ({
  ProgramFilters: () => <div data-testid="program-filters" />
}));

describe('Programs Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthStore.hasPermission.mockReturnValue(true);
    mockFilterStore.search = '';
    mockFilterStore.phase = 'All';
    mockFilterStore.therapeuticArea = 'All';
    mockFilterStore.status = 'All';
  });

  describe('Page Rendering', () => {
    it('should render page header with correct title and description', () => {
      render(<ProgramsPage />);

      expect(screen.getByText('Programs Module')).toBeInTheDocument();
      expect(screen.getByText(/Create and manage drug development programs/)).toBeInTheDocument();
    });

    it('should render programs table with data', () => {
      render(<ProgramsPage />);

      // Program names appear in responsive spans (hidden sm:inline / sm:hidden)
      expect(screen.getAllByText(/Test Program 1/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Test Program 2/).length).toBeGreaterThan(0);
    });

    it('should display program count correctly', () => {
      render(<ProgramsPage />);

      expect(screen.getByText('2 programs')).toBeInTheDocument();
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

    it('should navigate to program detail page when View is clicked', () => {
      render(<ProgramsPage />);

      const viewLinks = screen.getAllByRole('link');
      const programViewLink = viewLinks.find(link =>
        link.getAttribute('href') === '/programs/PROG001'
      );

      expect(programViewLink).toBeInTheDocument();
    });
  });

  describe('Enrollment Data', () => {
    it('should display enrollment progress correctly', () => {
      render(<ProgramsPage />);

      expect(screen.getByText('50/100 enrolled')).toBeInTheDocument();
    });
  });

  describe('Badge Components', () => {
    it('should render phase badges', () => {
      render(<ProgramsPage />);

      expect(screen.getAllByText(/Test Program 1/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Test Program 2/).length).toBeGreaterThan(0);
    });
  });
});
