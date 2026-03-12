import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgramInfoCard } from '../../../../components/organisms/program-detail/program-info-card';
import type { Program } from '../../../../types';

// Mock i18n
jest.mock('../../../../lib/i18n', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'program.info': 'Program Info',
      'common.created': 'Created',
      'common.lastUpdated': 'Last Updated',
      'common.totalEnrollment': 'Total Enrollment',
      'common.completion': 'Completion',
    };
    return translations[key] || key;
  },
  TRANSLATION_KEYS: {
    PROGRAM: { INFO: 'program.info' },
    COMMON: {
      CREATED: 'common.created',
      LAST_UPDATED: 'common.lastUpdated',
      TOTAL_ENROLLMENT: 'common.totalEnrollment',
      COMPLETION: 'common.completion',
    },
  },
}));

const mockProgram: Program = {
  id: 'PROG001',
  name: 'Test Program',
  therapeuticArea: 'Oncology',
  phase: 'Phase II',
  status: 'Active',
  manager: 'Dr. Test',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-03-10'),
  studies: [],
  milestones: [],
};

describe('ProgramInfoCard', () => {
  it('should render info card title', () => {
    render(
      <ProgramInfoCard
        program={mockProgram}
        totalEnrollment={75}
        totalTarget={300}
        enrollmentPercentage={25}
      />
    );
    expect(screen.getByText('Program Info')).toBeInTheDocument();
  });

  it('should display enrollment info', () => {
    render(
      <ProgramInfoCard
        program={mockProgram}
        totalEnrollment={75}
        totalTarget={300}
        enrollmentPercentage={25}
      />
    );
    expect(screen.getByText('75/300')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('should display labels', () => {
    render(
      <ProgramInfoCard
        program={mockProgram}
        totalEnrollment={0}
        totalTarget={0}
        enrollmentPercentage={0}
      />
    );
    expect(screen.getByText('Created:')).toBeInTheDocument();
    expect(screen.getByText('Last Updated:')).toBeInTheDocument();
    expect(screen.getByText('Total Enrollment:')).toBeInTheDocument();
    expect(screen.getByText('Completion:')).toBeInTheDocument();
  });
});
