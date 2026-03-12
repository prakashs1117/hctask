import React from 'react';
import { render, screen } from '@testing-library/react';
import { StudiesSection } from '../../../../components/organisms/program-detail/studies-section';
import type { Study } from '../../../../types';

jest.mock('../../../../lib/i18n', () => ({
  t: (key: string) => {
    const t: Record<string, string> = {
      'common.studies': 'Studies',
      'program.addStudy': 'Add Study',
      'program.noStudiesYet': 'No studies yet',
    };
    return t[key] || key;
  },
  TRANSLATION_KEYS: {
    COMMON: { STUDIES: 'common.studies' },
    PROGRAM: { ADD_STUDY: 'program.addStudy', NO_STUDIES_YET: 'program.noStudiesYet' },
  },
}));

const mockStudies: Study[] = [
  {
    id: 'S1', programId: 'P1', name: 'ALZ-001', title: 'Safety Study',
    enrollmentCount: 45, targetEnrollment: 200, milestone: 'Recruitment',
    status: 'Active', startDate: new Date(), estimatedEndDate: new Date(),
  },
];

describe('StudiesSection', () => {
  it('should render studies with count', () => {
    render(<StudiesSection studies={mockStudies} canAddStudies={false} />);
    expect(screen.getByText(/Studies/)).toBeInTheDocument();
    expect(screen.getByText('ALZ-001')).toBeInTheDocument();
  });

  it('should show add button when canAddStudies is true', () => {
    render(<StudiesSection studies={mockStudies} canAddStudies={true} />);
    expect(screen.getByText('Add Study')).toBeInTheDocument();
  });

  it('should hide add button when canAddStudies is false', () => {
    render(<StudiesSection studies={mockStudies} canAddStudies={false} />);
    expect(screen.queryByText('Add Study')).not.toBeInTheDocument();
  });

  it('should show empty state when no studies', () => {
    render(<StudiesSection studies={[]} canAddStudies={false} />);
    expect(screen.getByText('No studies yet')).toBeInTheDocument();
  });
});
