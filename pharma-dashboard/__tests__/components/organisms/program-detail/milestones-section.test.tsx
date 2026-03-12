import React from 'react';
import { render, screen } from '@testing-library/react';
import { MilestonesSection } from '../../../../components/organisms/program-detail/milestones-section';
import type { Milestone } from '../../../../types';

jest.mock('../../../../lib/i18n', () => ({
  t: (key: string) => {
    const t: Record<string, string> = {
      'common.milestones': 'Milestones',
      'program.noMilestonesSet': 'No milestones set',
    };
    return t[key] || key;
  },
  TRANSLATION_KEYS: {
    COMMON: { MILESTONES: 'common.milestones' },
    PROGRAM: { NO_MILESTONES_SET: 'program.noMilestonesSet' },
  },
}));

const mockMilestones: Milestone[] = [
  { id: 'M1', programId: 'P1', label: 'Phase Start', dueDate: new Date('2024-02-01'), completed: true, completedDate: new Date('2024-02-01') },
  { id: 'M2', programId: 'P1', label: 'Mid Analysis', dueDate: new Date('2024-08-01'), completed: false },
];

describe('MilestonesSection', () => {
  it('should render milestones with count', () => {
    render(<MilestonesSection milestones={mockMilestones} />);
    expect(screen.getByText(/Milestones/)).toBeInTheDocument();
    expect(screen.getByText('Phase Start')).toBeInTheDocument();
    expect(screen.getByText('Mid Analysis')).toBeInTheDocument();
  });

  it('should show empty state when no milestones', () => {
    render(<MilestonesSection milestones={[]} />);
    expect(screen.getByText('No milestones set')).toBeInTheDocument();
  });
});
