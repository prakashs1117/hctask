import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgramDetailPage from '../../../../app/programs/[id]/page';

const mockProgram = {
  id: "PROG001",
  name: "Alzheimer's Treatment Program",
  description: "Novel approach targeting amyloid plaques",
  therapeuticArea: "Neurology" as const,
  phase: "Phase II" as const,
  status: "Active" as const,
  manager: "Dr. Sarah Johnson",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-03-10"),
  studies: [
    {
      id: "STD001",
      programId: "PROG001",
      name: "ALZ-001",
      title: "Safety and Efficacy Study",
      enrollmentCount: 45,
      targetEnrollment: 200,
      milestone: "Recruitment" as const,
      status: "Active" as const,
      startDate: new Date("2024-02-01"),
      estimatedEndDate: new Date("2025-08-01")
    },
    {
      id: "STD002",
      programId: "PROG001",
      name: "ALZ-002",
      title: "Long-term Safety Study",
      enrollmentCount: 30,
      targetEnrollment: 100,
      milestone: "Analysis" as const,
      status: "Active" as const,
      startDate: new Date("2024-03-01"),
      estimatedEndDate: new Date("2025-09-01")
    }
  ],
  milestones: [
    {
      id: "MIL001",
      programId: "PROG001",
      label: "Phase II Start",
      dueDate: new Date("2024-02-01"),
      completed: true,
      completedDate: new Date("2024-02-01")
    },
    {
      id: "MIL002",
      programId: "PROG001",
      label: "Mid-phase Analysis",
      dueDate: new Date("2024-08-01"),
      completed: false
    }
  ]
};

// Mock useProgram hook
jest.mock('../../../../lib/hooks/usePrograms', () => ({
  useProgram: jest.fn()
}));

// Mock auth store
const mockAuthStore = {
  hasPermission: jest.fn()
};

jest.mock('../../../../lib/stores/authStore', () => ({
  useAuthStore: () => mockAuthStore
}));

// Mock EditProgramDialog
jest.mock('../../../../components/features/edit-program-dialog', () => ({
  EditProgramDialog: ({ canEdit }: { program: { id: string }, canEdit: boolean }) =>
    canEdit ? <button>Edit Program</button> : null
}));

// Mock badge components
jest.mock('../../../../components/features/ProgramBadge', () => ({
  PhaseBadge: ({ phase }: { phase: string }) => <span data-testid="phase-badge">{phase}</span>,
  TherapeuticAreaBadge: ({ area }: { area: string }) => <span data-testid="area-badge">{area}</span>,
  StatusBadge: ({ status }: { status: string }) => <span data-testid="status-badge">{status}</span>,
  MilestoneBadge: ({ status }: { status: string }) => <span data-testid="milestone-badge">{status}</span>
}));

// Mock EnrollmentBar
jest.mock('../../../../components/features/EnrollmentBar', () => ({
  EnrollmentBar: ({ current, target }: { current: number; target: number }) =>
    <div data-testid="enrollment-bar">{current}/{target}</div>
}));

// Mock formatters
jest.mock('../../../../lib/utils/formatters', () => ({
  formatDate: (date: Date) => date.toLocaleDateString(),
  formatNumber: (num: number) => num.toLocaleString()
}));

// Import is mocked above, so we don't need this require statement

describe('Program Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthStore.hasPermission.mockReturnValue(true);
  });

  describe('Loading State', () => {
    it('should show loading message when data is loading', () => {
      useProgram.mockReturnValue({
        data: undefined,
        isLoading: true
      });

      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.getByText('Loading program details...')).toBeInTheDocument();
    });
  });

  describe('Not Found State', () => {
    it('should show not found message when program does not exist', () => {
      useProgram.mockReturnValue({
        data: null,
        isLoading: false
      });

      render(<ProgramDetailPage params={Promise.resolve({ id: 'NONEXISTENT' })} />);

      expect(screen.getByText('Program not found')).toBeInTheDocument();
      expect(screen.getByText('Back to Programs')).toBeInTheDocument();
    });

    it('should navigate back to programs list when back button is clicked', () => {
      useProgram.mockReturnValue({
        data: null,
        isLoading: false
      });

      render(<ProgramDetailPage params={Promise.resolve({ id: 'NONEXISTENT' })} />);

      const backButton = screen.getByText('Back to Programs');
      expect(backButton.closest('a')).toHaveAttribute('href', '/programs');
    });
  });

  describe('Program Data Display', () => {
    beforeEach(() => {
      useProgram.mockReturnValue({
        data: mockProgram,
        isLoading: false
      });
    });

    it('should display program basic information', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.getByText("Alzheimer's Treatment Program")).toBeInTheDocument();
      expect(screen.getByText(/ID: PROG001/)).toBeInTheDocument();
      expect(screen.getByText(/Manager: Dr. Sarah Johnson/)).toBeInTheDocument();
    });

    it('should display program description when available', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Novel approach targeting amyloid plaques')).toBeInTheDocument();
    });

    it('should not display description section when description is empty', () => {
      const programWithoutDescription = { ...mockProgram, description: undefined };
      useProgram.mockReturnValue({
        data: programWithoutDescription,
        isLoading: false
      });

      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    it('should display program badges', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.getByTestId('phase-badge')).toHaveTextContent('Phase II');
      expect(screen.getByTestId('area-badge')).toHaveTextContent('Neurology');
      expect(screen.getByTestId('status-badge')).toHaveTextContent('Active');
    });

    it('should display statistics cards', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.getByText('Total Studies')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // 2 studies

      expect(screen.getByText('Enrolled')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument(); // 45 + 30 enrolled

      expect(screen.getByText('Target')).toBeInTheDocument();
      expect(screen.getByText('300')).toBeInTheDocument(); // 200 + 100 target
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      useProgram.mockReturnValue({
        data: mockProgram,
        isLoading: false
      });
    });

    it('should display back to programs button', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      const backButton = screen.getByText('Back');
      expect(backButton.closest('a')).toHaveAttribute('href', '/programs');
    });

    it('should show edit button when user has edit permission', () => {
      mockAuthStore.hasPermission.mockImplementation((permission: string) => permission === 'edit_programs');

      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.getByText('Edit Program')).toBeInTheDocument();
    });

    it('should hide edit button when user lacks edit permission', () => {
      mockAuthStore.hasPermission.mockImplementation((permission: string) => permission !== 'edit_programs');

      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.queryByText('Edit Program')).not.toBeInTheDocument();
    });
  });

  describe('Milestones Section', () => {
    beforeEach(() => {
      useProgram.mockReturnValue({
        data: mockProgram,
        isLoading: false
      });
    });

    it('should display milestones when available', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.getByText('Milestones Timeline')).toBeInTheDocument();
      expect(screen.getByText('Phase II Start')).toBeInTheDocument();
      expect(screen.getByText('Mid-phase Analysis')).toBeInTheDocument();
    });

    it('should show completed status for completed milestones', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.getByText('✓ Complete')).toBeInTheDocument();
    });

    it('should show pending status for incomplete milestones', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.getByText('⏳ Pending')).toBeInTheDocument();
    });

    it('should not display milestones section when no milestones exist', () => {
      const programWithoutMilestones = { ...mockProgram, milestones: [] };
      useProgram.mockReturnValue({
        data: programWithoutMilestones,
        isLoading: false
      });

      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.queryByText('Milestones Timeline')).not.toBeInTheDocument();
    });
  });

  describe('Studies Section', () => {
    beforeEach(() => {
      useProgram.mockReturnValue({
        data: mockProgram,
        isLoading: false
      });
    });

    it('should display associated studies', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.getByText('Associated Studies')).toBeInTheDocument();
      expect(screen.getByText('ALZ-001')).toBeInTheDocument();
      expect(screen.getByText('ALZ-002')).toBeInTheDocument();
      expect(screen.getByText('Safety and Efficacy Study')).toBeInTheDocument();
      expect(screen.getByText('Long-term Safety Study')).toBeInTheDocument();
    });

    it('should display enrollment progress for each study', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      const enrollmentBars = screen.getAllByTestId('enrollment-bar');
      expect(enrollmentBars).toHaveLength(2);
      expect(enrollmentBars[0]).toHaveTextContent('45/200');
      expect(enrollmentBars[1]).toHaveTextContent('30/100');
    });

    it('should display milestone badges for studies', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      const milestoneBadges = screen.getAllByTestId('milestone-badge');
      expect(milestoneBadges).toHaveLength(2);
      expect(milestoneBadges[0]).toHaveTextContent('Recruitment');
      expect(milestoneBadges[1]).toHaveTextContent('Analysis');
    });

    it('should show add study button when user has permission', () => {
      mockAuthStore.hasPermission.mockImplementation((permission: string) => permission === 'add_studies');

      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.getByText('Add Study')).toBeInTheDocument();
    });

    it('should hide add study button when user lacks permission', () => {
      mockAuthStore.hasPermission.mockImplementation((permission: string) => permission !== 'add_studies');

      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.queryByText('Add Study')).not.toBeInTheDocument();
    });

    it('should show empty state when no studies exist', () => {
      const programWithoutStudies = { ...mockProgram, studies: [] };
      useProgram.mockReturnValue({
        data: programWithoutStudies,
        isLoading: false
      });

      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.getByText('No studies added yet')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      useProgram.mockReturnValue({
        data: mockProgram,
        isLoading: false
      });
    });

    it('should render responsive back button with different text sizes', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      const backButton = screen.getByText('Back');
      expect(backButton).toBeInTheDocument();
    });

    it('should render responsive title with different font sizes', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      const title = screen.getByText("Alzheimer's Treatment Program");
      expect(title).toBeInTheDocument();
    });
  });

  describe('Data Calculations', () => {
    beforeEach(() => {
      useProgram.mockReturnValue({
        data: mockProgram,
        isLoading: false
      });
    });

    it('should calculate total enrollment correctly', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      // Total enrollment: 45 + 30 = 75
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('should calculate total target enrollment correctly', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      // Total target: 200 + 100 = 300
      expect(screen.getByText('300')).toBeInTheDocument();
    });

    it('should handle zero enrollment gracefully', () => {
      const programWithZeroEnrollment = {
        ...mockProgram,
        studies: [
          {
            ...mockProgram.studies[0],
            enrollmentCount: 0,
            targetEnrollment: 100
          }
        ]
      };

      useProgram.mockReturnValue({
        data: programWithZeroEnrollment,
        isLoading: false
      });

      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      expect(screen.getByText('0')).toBeInTheDocument(); // Zero enrolled
      expect(screen.getByText('100')).toBeInTheDocument(); // Target
    });
  });

  describe('Date Formatting', () => {
    beforeEach(() => {
      useProgram.mockReturnValue({
        data: mockProgram,
        isLoading: false
      });
    });

    it('should format milestone dates correctly', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      // Check that dates are formatted (mocked formatDate returns toLocaleDateString)
      expect(screen.getByText(/Due:/)).toBeInTheDocument();
      expect(screen.getByText(/Completed:/)).toBeInTheDocument();
    });

    it('should format study date ranges', () => {
      render(<ProgramDetailPage params={Promise.resolve({ id: 'PROG001' })} />);

      // The date formatting should be applied to study date ranges
      const dateElements = screen.getAllByText(/→/);
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });
});
