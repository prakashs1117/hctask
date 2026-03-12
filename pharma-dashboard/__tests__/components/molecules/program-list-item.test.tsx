import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgramListItem } from '../../../components/molecules/program-list-item';
import type { Program } from '../../../types';

const mockProgram: Program = {
  id: 'PROG001',
  name: 'Test Program',
  description: 'A test program',
  therapeuticArea: 'Neurology',
  phase: 'Phase I',
  status: 'Active',
  manager: 'Dr. Test',
  createdAt: new Date(),
  updatedAt: new Date('2024-06-15'),
  studies: [
    { id: 'S1', programId: 'PROG001', name: 'S1', title: 'Study 1', enrollmentCount: 30, targetEnrollment: 100, milestone: 'Analysis', status: 'Active', startDate: new Date(), estimatedEndDate: new Date() },
  ],
  milestones: [],
};

describe('ProgramListItem', () => {
  it('should render program name', () => {
    render(<ProgramListItem program={mockProgram} />);
    expect(screen.getByText('Test Program')).toBeInTheDocument();
  });

  it('should render program description', () => {
    render(<ProgramListItem program={mockProgram} />);
    expect(screen.getByText('A test program')).toBeInTheDocument();
  });

  it('should render manager name', () => {
    render(<ProgramListItem program={mockProgram} />);
    expect(screen.getByText('Dr. Test')).toBeInTheDocument();
  });

  it('should link to program detail page', () => {
    render(<ProgramListItem program={mockProgram} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/programs/PROG001');
  });

  it('should show enrollment progress', () => {
    render(<ProgramListItem program={mockProgram} />);
    expect(screen.getByText('Enrollment Progress')).toBeInTheDocument();
  });
});
