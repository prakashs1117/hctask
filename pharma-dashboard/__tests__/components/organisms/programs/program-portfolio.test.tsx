import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgramPortfolio } from '../../../../components/organisms/programs/program-portfolio';
import type { Program } from '../../../../types';

jest.mock('../../../../lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'programs.programPortfolio': 'Program Portfolio',
        'navigation.programs': 'Programs',
        'dashboard.loadingPortfolio': 'Loading portfolio...',
        'dashboard.noProgramsFound': 'No programs found',
        'dashboard.noProgramsFoundDesc': 'Try adjusting your filters',
      };
      return t[key] || key;
    },
    locale: 'en',
    changeLocale: jest.fn(),
  }),
}));

const mockPrograms: Program[] = [
  {
    id: 'P1', name: 'Program 1', description: 'Desc', therapeuticArea: 'Oncology',
    phase: 'Phase I', status: 'Active', manager: 'Dr. Test',
    createdAt: new Date(), updatedAt: new Date(),
    studies: [{ id: 'S1', programId: 'P1', name: 'S1', title: 'T1', enrollmentCount: 10, targetEnrollment: 50, milestone: 'Recruitment', status: 'Active', startDate: new Date(), estimatedEndDate: new Date() }],
    milestones: [],
  },
];

describe('ProgramPortfolio', () => {
  it('should render programs in list view', () => {
    render(<ProgramPortfolio programs={mockPrograms} isLoading={false} viewMode="list" />);
    expect(screen.getByText('Program Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Program 1')).toBeInTheDocument();
  });

  it('should render programs in grid view', () => {
    render(<ProgramPortfolio programs={mockPrograms} isLoading={false} viewMode="grid" />);
    expect(screen.getByText('Program 1')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<ProgramPortfolio programs={[]} isLoading={true} viewMode="list" />);
    expect(screen.getByText('Loading portfolio...')).toBeInTheDocument();
  });

  it('should show empty state when no programs', () => {
    render(<ProgramPortfolio programs={[]} isLoading={false} viewMode="list" />);
    expect(screen.getByText('No programs found')).toBeInTheDocument();
  });

  it('should show clear filters button when onClearFilters is provided', () => {
    const onClear = jest.fn();
    render(<ProgramPortfolio programs={[]} isLoading={false} viewMode="list" onClearFilters={onClear} />);
    const clearButton = screen.getByText('Clear all filters');
    fireEvent.click(clearButton);
    expect(onClear).toHaveBeenCalled();
  });
});
