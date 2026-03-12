import React from 'react';
import { render, screen } from '@testing-library/react';
import { MilestoneItem } from '../../../../components/organisms/program-detail/milestone-item';
import type { Milestone } from '../../../../types';

describe('MilestoneItem', () => {
  it('should render milestone label', () => {
    const milestone: Milestone = {
      id: 'MIL001',
      programId: 'PROG001',
      label: 'Phase II Start',
      dueDate: new Date('2024-02-01'),
      completed: false,
    };
    render(<MilestoneItem milestone={milestone} />);
    expect(screen.getByText('Phase II Start')).toBeInTheDocument();
  });

  it('should show check mark for completed milestone with completedDate', () => {
    const milestone: Milestone = {
      id: 'MIL001',
      programId: 'PROG001',
      label: 'Phase I Complete',
      dueDate: new Date('2024-01-01'),
      completed: true,
      completedDate: new Date('2024-01-15'),
    };
    render(<MilestoneItem milestone={milestone} />);
    expect(screen.getByText('Phase I Complete')).toBeInTheDocument();
  });

  it('should render pending milestone without check mark', () => {
    const milestone: Milestone = {
      id: 'MIL002',
      programId: 'PROG001',
      label: 'Mid-phase Analysis',
      dueDate: new Date('2024-08-01'),
      completed: false,
    };
    render(<MilestoneItem milestone={milestone} />);
    expect(screen.getByText('Mid-phase Analysis')).toBeInTheDocument();
  });
});
