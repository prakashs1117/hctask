import React from 'react';
import { render, screen } from '@testing-library/react';
import { MetricsGrid } from '../../../../components/organisms/program-detail/metrics-grid';

// Mock i18n
jest.mock('../../../../lib/i18n', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'common.studies': 'Studies',
      'common.enrolled': 'Enrolled',
      'common.target': 'Target',
      'common.progress': 'Progress',
    };
    return translations[key] || key;
  },
  TRANSLATION_KEYS: {
    COMMON: {
      STUDIES: 'common.studies',
      ENROLLED: 'common.enrolled',
      TARGET: 'common.target',
      PROGRESS: 'common.progress',
    },
  },
}));

describe('MetricsGrid', () => {
  it('should render all four metric cards', () => {
    render(
      <MetricsGrid
        studiesCount={5}
        totalEnrollment={200}
        totalTarget={500}
        enrollmentPercentage={40}
      />
    );
    expect(screen.getByText('Studies')).toBeInTheDocument();
    expect(screen.getByText('Enrolled')).toBeInTheDocument();
    expect(screen.getByText('Target')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('should display correct values', () => {
    render(
      <MetricsGrid
        studiesCount={3}
        totalEnrollment={150}
        totalTarget={300}
        enrollmentPercentage={50}
      />
    );
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
