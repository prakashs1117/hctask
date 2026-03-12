import React from 'react';
import { render, screen } from '@testing-library/react';
import { StudyCard } from '../../../../components/organisms/program-detail/study-card';
import type { Study } from '../../../../types';

const mockStudy: Study = {
  id: 'STD001',
  programId: 'PROG001',
  name: 'ALZ-001',
  title: 'Safety and Efficacy Study',
  enrollmentCount: 45,
  targetEnrollment: 200,
  milestone: 'Recruitment',
  status: 'Active',
  startDate: new Date('2024-02-01'),
  estimatedEndDate: new Date('2025-08-01'),
};

describe('StudyCard', () => {
  it('should render study name', () => {
    render(<StudyCard study={mockStudy} />);
    expect(screen.getByText('ALZ-001')).toBeInTheDocument();
  });

  it('should render study title', () => {
    render(<StudyCard study={mockStudy} />);
    expect(screen.getByText('Safety and Efficacy Study')).toBeInTheDocument();
  });

  it('should render milestone badge', () => {
    render(<StudyCard study={mockStudy} />);
    expect(screen.getByText('Recruitment')).toBeInTheDocument();
  });

  it('should render enrollment count', () => {
    render(<StudyCard study={mockStudy} />);
    expect(screen.getByText('45/200')).toBeInTheDocument();
  });
});
