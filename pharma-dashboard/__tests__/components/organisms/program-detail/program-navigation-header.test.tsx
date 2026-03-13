import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgramNavigationHeader } from '../../../../components/organisms/program-detail/program-navigation-header';

jest.mock('../../../../lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'program.backToPrograms': 'Back to Programs',
        'program.details': 'Program Details',
      };
      return translations[key] || key;
    },
    translations: {},
  }),
  TRANSLATION_KEYS: {
    PROGRAM: {
      BACK_TO_PROGRAMS: 'program.backToPrograms',
      DETAILS: 'program.details',
    },
  },
}));

jest.mock('../../../../components/organisms/programs/edit-program-dialog', () => ({
  EditProgramDialog: ({ canEdit }: { canEdit: boolean }) =>
    canEdit ? <div data-testid="edit-dialog">Edit</div> : null,
}));

const mockProgram = {
  id: 'PRG-001',
  name: 'Test Program',
  description: 'A test program',
  phase: 'Phase III' as const,
  therapeuticArea: 'Oncology' as const,
  status: 'Active' as const,
  manager: 'John Doe',
  startDate: '2024-01-01',
  lastUpdated: '2024-06-01',
  enrollment: { current: 100, target: 200 },
  studies: [],
  milestones: [],
};

describe('ProgramNavigationHeader', () => {
  it('should render back to programs link', () => {
    render(<ProgramNavigationHeader program={mockProgram} canEdit={false} />);
    expect(screen.getByText('Back to Programs')).toBeInTheDocument();
  });

  it('should render program details badge', () => {
    render(<ProgramNavigationHeader program={mockProgram} canEdit={false} />);
    expect(screen.getByText('Program Details')).toBeInTheDocument();
  });

  it('should show edit dialog when canEdit is true', () => {
    render(<ProgramNavigationHeader program={mockProgram} canEdit={true} />);
    expect(screen.getByTestId('edit-dialog')).toBeInTheDocument();
  });

  it('should not show edit dialog when canEdit is false', () => {
    render(<ProgramNavigationHeader program={mockProgram} canEdit={false} />);
    expect(screen.queryByTestId('edit-dialog')).not.toBeInTheDocument();
  });

  it('should have a link to /programs', () => {
    render(<ProgramNavigationHeader program={mockProgram} canEdit={false} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/programs');
  });
});
