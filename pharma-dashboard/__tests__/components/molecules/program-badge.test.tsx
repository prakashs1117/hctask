import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  PhaseBadge,
  TherapeuticAreaBadge,
  StatusBadge,
  MilestoneBadge,
} from '../../../components/molecules/program-badge';

describe('PhaseBadge', () => {
  it('should render phase text', () => {
    render(<PhaseBadge phase="Phase I" />);
    expect(screen.getByText('Phase I')).toBeInTheDocument();
  });

  it('should render all phase variants', () => {
    const phases = ['Preclinical', 'Phase I', 'Phase II', 'Phase III', 'Phase IV', 'Approved'] as const;
    phases.forEach(phase => {
      const { unmount } = render(<PhaseBadge phase={phase} />);
      expect(screen.getByText(phase)).toBeInTheDocument();
      unmount();
    });
  });
});

describe('TherapeuticAreaBadge', () => {
  it('should render area text', () => {
    render(<TherapeuticAreaBadge area="Oncology" />);
    expect(screen.getByText('Oncology')).toBeInTheDocument();
  });

  it('should render all area variants', () => {
    const areas = ['Oncology', 'Neurology', 'Cardiology', 'Immunology', 'Dermatology', 'Endocrinology'] as const;
    areas.forEach(area => {
      const { unmount } = render(<TherapeuticAreaBadge area={area} />);
      expect(screen.getByText(area)).toBeInTheDocument();
      unmount();
    });
  });
});

describe('StatusBadge', () => {
  it('should render status text', () => {
    render(<StatusBadge status="Active" />);
    expect(screen.getByText(/Active/)).toBeInTheDocument();
  });

  it('should render all status variants', () => {
    const statuses = ['Active', 'On Hold', 'Completed', 'Discontinued'] as const;
    statuses.forEach(status => {
      const { unmount } = render(<StatusBadge status={status} />);
      expect(screen.getByText(new RegExp(status))).toBeInTheDocument();
      unmount();
    });
  });
});

describe('MilestoneBadge', () => {
  it('should render milestone text', () => {
    render(<MilestoneBadge status="Recruitment" />);
    expect(screen.getByText('Recruitment')).toBeInTheDocument();
  });

  it('should render all milestone variants', () => {
    const milestones = ['Initiation', 'Recruitment', 'Analysis', 'Complete'] as const;
    milestones.forEach(status => {
      const { unmount } = render(<MilestoneBadge status={status} />);
      expect(screen.getByText(status)).toBeInTheDocument();
      unmount();
    });
  });
});
