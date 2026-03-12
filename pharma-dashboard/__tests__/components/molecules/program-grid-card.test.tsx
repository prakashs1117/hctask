import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgramGridCard } from '../../../components/molecules/program-grid-card';
import type { Program } from '../../../types';

const mockProgram: Program = {
  id: 'PROG001',
  name: 'Test Program',
  description: 'A test program',
  therapeuticArea: 'Oncology',
  phase: 'Phase II',
  status: 'Active',
  manager: 'Dr. Test',
  createdAt: new Date(),
  updatedAt: new Date(),
  studies: [
    { id: 'S1', programId: 'PROG001', name: 'S1', title: 'Study 1', enrollmentCount: 50, targetEnrollment: 100, milestone: 'Recruitment', status: 'Active', startDate: new Date(), estimatedEndDate: new Date() },
  ],
  milestones: [],
};

describe('ProgramGridCard', () => {
  it('should render program name', () => {
    render(<ProgramGridCard program={mockProgram} />);
    expect(screen.getByText('Test Program')).toBeInTheDocument();
  });

  it('should render program description', () => {
    render(<ProgramGridCard program={mockProgram} />);
    expect(screen.getByText('A test program')).toBeInTheDocument();
  });

  it('should render phase badge', () => {
    render(<ProgramGridCard program={mockProgram} />);
    expect(screen.getByText('Phase II')).toBeInTheDocument();
  });

  it('should render therapeutic area badge', () => {
    render(<ProgramGridCard program={mockProgram} />);
    expect(screen.getByText('Oncology')).toBeInTheDocument();
  });

  it('should link to program detail page', () => {
    render(<ProgramGridCard program={mockProgram} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/programs/PROG001');
  });

  it('should show study count', () => {
    render(<ProgramGridCard program={mockProgram} />);
    expect(screen.getByText('1 studies')).toBeInTheDocument();
  });

  it('should show manager name', () => {
    render(<ProgramGridCard program={mockProgram} />);
    expect(screen.getByText('Dr. Test')).toBeInTheDocument();
  });
});
