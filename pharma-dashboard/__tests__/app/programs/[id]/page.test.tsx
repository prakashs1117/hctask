import React, { Suspense } from 'react';
import { render, screen, act } from '@testing-library/react';

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
const mockUseProgram = jest.fn();
jest.mock('../../../../lib/hooks/usePrograms', () => ({
  useProgram: (...args: unknown[]) => mockUseProgram(...args)
}));

// Mock useProgramMetrics
jest.mock('../../../../lib/hooks/useProgramMetrics', () => ({
  useProgramMetrics: (program: typeof mockProgram | null | undefined) => {
    if (!program) return { totalEnrollment: 0, totalTarget: 0, enrollmentPercentage: 0 };
    const totalEnrollment = program.studies.reduce((sum: number, s: { enrollmentCount: number }) => sum + s.enrollmentCount, 0);
    const totalTarget = program.studies.reduce((sum: number, s: { targetEnrollment: number }) => sum + s.targetEnrollment, 0);
    return { totalEnrollment, totalTarget, enrollmentPercentage: totalTarget > 0 ? Math.round((totalEnrollment / totalTarget) * 100) : 0 };
  }
}));

// Mock auth store
const mockHasPermission = jest.fn();
jest.mock('../../../../lib/stores/authStore', () => ({
  useAuthStore: (selector: (state: { hasPermission: typeof mockHasPermission }) => unknown) =>
    selector({ hasPermission: mockHasPermission })
}));

// Mock i18n
jest.mock('../../../../lib/i18n', () => ({
  t: (key: string) => key,
  TRANSLATION_KEYS: {
    PROGRAM: {
      LOADING_DETAILS: 'Loading program details...',
      DETAILS: 'Program',
      BACK_TO_PROGRAMS: 'Back to Programs',
    }
  }
}));

// Mock permissions
jest.mock('../../../../lib/constants/permissions', () => ({
  PERMISSIONS: {
    EDIT_PROGRAMS: 'edit_programs',
    ADD_STUDIES: 'add_studies',
  }
}));

// Mock sub-components
jest.mock('../../../../components/atoms/loading-spinner', () => ({
  LoadingSpinner: ({ message }: { message: string }) => <div data-testid="loading-spinner">{message}</div>
}));

jest.mock('../../../../components/molecules/not-found-state', () => ({
  NotFoundState: ({ entity, backLabel, backUrl }: { entity: string; backUrl: string; backLabel: string }) => (
    <div data-testid="not-found">
      <span>{entity} not found</span>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href={backUrl}>{backLabel}</a>
    </div>
  )
}));

jest.mock('../../../../components/organisms/program-detail', () => ({
  ProgramNavigationHeader: ({ program, canEdit }: { program: { name: string; id: string }; canEdit: boolean }) => (
    <div data-testid="nav-header">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/programs">Back</a>
      <span>{program.name}</span>
      {canEdit && <button>Edit Program</button>}
    </div>
  ),
  ProgramHeaderInfo: ({ program }: { program: { name: string; id: string; manager: string; description?: string } }) => (
    <div data-testid="header-info">
      <span>{program.name}</span>
      <span>ID: {program.id}</span>
      <span>Manager: {program.manager}</span>
      {program.description && <div><span>Description</span><span>{program.description}</span></div>}
    </div>
  ),
  MetricsGrid: ({ studiesCount, totalEnrollment, totalTarget }: { studiesCount: number; totalEnrollment: number; totalTarget: number; enrollmentPercentage: number }) => (
    <div data-testid="metrics-grid">
      <div>Total Studies<span>{studiesCount}</span></div>
      <div>Enrolled<span>{totalEnrollment}</span></div>
      <div>Target<span>{totalTarget}</span></div>
    </div>
  ),
  StudiesSection: ({ studies, canAddStudies }: { studies: Array<{ id: string; name: string; title: string; enrollmentCount: number; targetEnrollment: number; milestone: string }>; canAddStudies: boolean }) => (
    <div data-testid="studies-section">
      <span>Associated Studies</span>
      {canAddStudies && <button>Add Study</button>}
      {studies.length === 0 ? (
        <span>No studies added yet</span>
      ) : (
        studies.map(s => (
          <div key={s.id}>
            <span>{s.name}</span>
            <span>{s.title}</span>
            <div data-testid="enrollment-bar">{s.enrollmentCount}/{s.targetEnrollment}</div>
            <span data-testid="milestone-badge">{s.milestone}</span>
          </div>
        ))
      )}
    </div>
  ),
  MilestonesSection: ({ milestones }: { milestones: Array<{ id: string; label: string; dueDate: Date; completed: boolean; completedDate?: Date }> }) => (
    milestones.length > 0 ? (
      <div data-testid="milestones-section">
        <span>Milestones Timeline</span>
        {milestones.map(m => (
          <div key={m.id}>
            <span>{m.label}</span>
            <span>Due: {m.dueDate.toLocaleDateString()}</span>
            {m.completed ? <span>✓ Complete</span> : <span>⏳ Pending</span>}
            {m.completedDate && <span>Completed: {m.completedDate.toLocaleDateString()}</span>}
          </div>
        ))}
      </div>
    ) : null
  ),
  ProgramInfoCard: () => <div data-testid="program-info-card" />,
}));

// Helper to render page component wrapped in Suspense and wait for promise resolution
async function renderPage(params: { id: string }, ProgramDetailPage: React.ComponentType<{ params: Promise<{ id: string }> }>) {
  let result: ReturnType<typeof render>;
  await act(async () => {
    result = render(
      <Suspense fallback={<div>Loading suspense...</div>}>
        <ProgramDetailPage params={Promise.resolve(params)} />
      </Suspense>
    );
  });
  return result!;
}

describe('Program Detail Page', () => {
  let ProgramDetailPage: React.ComponentType<{ params: Promise<{ id: string }> }>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockHasPermission.mockReturnValue(true);
    const mod = await import('../../../../app/programs/[id]/page');
    ProgramDetailPage = mod.default;
  });

  describe('Loading State', () => {
    it('should show loading message when data is loading', async () => {
      mockUseProgram.mockReturnValue({
        data: undefined,
        isLoading: true
      });

      await renderPage({ id: 'PROG001' }, ProgramDetailPage);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('Not Found State', () => {
    it('should show not found message when program does not exist', async () => {
      mockUseProgram.mockReturnValue({
        data: null,
        isLoading: false
      });

      await renderPage({ id: 'NONEXISTENT' }, ProgramDetailPage);

      expect(screen.getByTestId('not-found')).toBeInTheDocument();
    });

    it('should navigate back to programs list when back button is clicked', async () => {
      mockUseProgram.mockReturnValue({
        data: null,
        isLoading: false
      });

      await renderPage({ id: 'NONEXISTENT' }, ProgramDetailPage);

      const backLink = screen.getByRole('link');
      expect(backLink).toHaveAttribute('href', '/programs');
    });
  });

  describe('Program Data Display', () => {
    beforeEach(() => {
      mockUseProgram.mockReturnValue({
        data: mockProgram,
        isLoading: false
      });
    });

    it('should display program basic information', async () => {
      await renderPage({ id: 'PROG001' }, ProgramDetailPage);

      expect(screen.getAllByText("Alzheimer's Treatment Program").length).toBeGreaterThan(0);
      expect(screen.getByText(/ID: PROG001/)).toBeInTheDocument();
      expect(screen.getByText(/Manager: Dr. Sarah Johnson/)).toBeInTheDocument();
    });

    it('should display program description when available', async () => {
      await renderPage({ id: 'PROG001' }, ProgramDetailPage);

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Novel approach targeting amyloid plaques')).toBeInTheDocument();
    });

    it('should display statistics cards', async () => {
      await renderPage({ id: 'PROG001' }, ProgramDetailPage);

      expect(screen.getByText('Total Studies')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Enrolled')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
      expect(screen.getByText('Target')).toBeInTheDocument();
      expect(screen.getByText('300')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      mockUseProgram.mockReturnValue({
        data: mockProgram,
        isLoading: false
      });
    });

    it('should display back to programs button', async () => {
      await renderPage({ id: 'PROG001' }, ProgramDetailPage);

      const backButton = screen.getByText('Back');
      expect(backButton.closest('a')).toHaveAttribute('href', '/programs');
    });

    it('should show edit button when user has edit permission', async () => {
      mockHasPermission.mockImplementation((permission: string) => permission === 'edit_programs');

      await renderPage({ id: 'PROG001' }, ProgramDetailPage);

      expect(screen.getByText('Edit Program')).toBeInTheDocument();
    });

    it('should hide edit button when user lacks edit permission', async () => {
      mockHasPermission.mockReturnValue(false);

      await renderPage({ id: 'PROG001' }, ProgramDetailPage);

      expect(screen.queryByText('Edit Program')).not.toBeInTheDocument();
    });
  });

  describe('Milestones Section', () => {
    beforeEach(() => {
      mockUseProgram.mockReturnValue({
        data: mockProgram,
        isLoading: false
      });
    });

    it('should display milestones when available', async () => {
      await renderPage({ id: 'PROG001' }, ProgramDetailPage);

      expect(screen.getByText('Milestones Timeline')).toBeInTheDocument();
      expect(screen.getByText('Phase II Start')).toBeInTheDocument();
      expect(screen.getByText('Mid-phase Analysis')).toBeInTheDocument();
    });

    it('should show completed status for completed milestones', async () => {
      await renderPage({ id: 'PROG001' }, ProgramDetailPage);

      expect(screen.getByText('✓ Complete')).toBeInTheDocument();
    });

    it('should show pending status for incomplete milestones', async () => {
      await renderPage({ id: 'PROG001' }, ProgramDetailPage);

      expect(screen.getByText('⏳ Pending')).toBeInTheDocument();
    });

    it('should not display milestones section when no milestones exist', async () => {
      const programWithoutMilestones = { ...mockProgram, milestones: [] };
      mockUseProgram.mockReturnValue({
        data: programWithoutMilestones,
        isLoading: false
      });

      await renderPage({ id: 'PROG001' }, ProgramDetailPage);

      expect(screen.queryByText('Milestones Timeline')).not.toBeInTheDocument();
    });
  });

  describe('Studies Section', () => {
    beforeEach(() => {
      mockUseProgram.mockReturnValue({
        data: mockProgram,
        isLoading: false
      });
    });

    it('should display associated studies', async () => {
      await renderPage({ id: 'PROG001' }, ProgramDetailPage);

      expect(screen.getByText('Associated Studies')).toBeInTheDocument();
      expect(screen.getByText('ALZ-001')).toBeInTheDocument();
      expect(screen.getByText('ALZ-002')).toBeInTheDocument();
    });

    it('should display enrollment progress for each study', async () => {
      await renderPage({ id: 'PROG001' }, ProgramDetailPage);

      const enrollmentBars = screen.getAllByTestId('enrollment-bar');
      expect(enrollmentBars).toHaveLength(2);
      expect(enrollmentBars[0]).toHaveTextContent('45/200');
      expect(enrollmentBars[1]).toHaveTextContent('30/100');
    });

    it('should show empty state when no studies exist', async () => {
      const programWithoutStudies = { ...mockProgram, studies: [] };
      mockUseProgram.mockReturnValue({
        data: programWithoutStudies,
        isLoading: false
      });

      await renderPage({ id: 'PROG001' }, ProgramDetailPage);

      expect(screen.getByText('No studies added yet')).toBeInTheDocument();
    });
  });
});
