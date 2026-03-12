import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgramHeaderInfo } from '../../../../components/organisms/program-detail/program-header-info';
import type { Program } from '../../../../types';

// Mock i18n
jest.mock('../../../../lib/i18n', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'common.updated': 'Updated',
    };
    return translations[key] || key;
  },
  TRANSLATION_KEYS: {
    COMMON: { UPDATED: 'common.updated' },
  },
}));

const mockProgram: Program = {
  id: 'PROG001',
  name: "Alzheimer's Treatment Program",
  description: 'Novel approach targeting amyloid plaques',
  therapeuticArea: 'Neurology',
  phase: 'Phase II',
  status: 'Active',
  manager: 'Dr. Sarah Johnson',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-03-10'),
  studies: [],
  milestones: [],
};

describe('ProgramHeaderInfo', () => {
  it('should render program name', () => {
    render(<ProgramHeaderInfo program={mockProgram} />);
    expect(screen.getByText("Alzheimer's Treatment Program")).toBeInTheDocument();
  });

  it('should render program ID', () => {
    render(<ProgramHeaderInfo program={mockProgram} />);
    expect(screen.getByText('PROG001')).toBeInTheDocument();
  });

  it('should render manager name', () => {
    render(<ProgramHeaderInfo program={mockProgram} />);
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<ProgramHeaderInfo program={mockProgram} />);
    expect(screen.getByText('Novel approach targeting amyloid plaques')).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    const programWithoutDesc = { ...mockProgram, description: undefined };
    render(<ProgramHeaderInfo program={programWithoutDesc} />);
    expect(screen.queryByText('Novel approach targeting amyloid plaques')).not.toBeInTheDocument();
  });

  it('should render phase badge', () => {
    render(<ProgramHeaderInfo program={mockProgram} />);
    expect(screen.getByText('Phase II')).toBeInTheDocument();
  });

  it('should render therapeutic area badge', () => {
    render(<ProgramHeaderInfo program={mockProgram} />);
    expect(screen.getByText('Neurology')).toBeInTheDocument();
  });

  it('should render status badge', () => {
    render(<ProgramHeaderInfo program={mockProgram} />);
    expect(screen.getByText(/Active/)).toBeInTheDocument();
  });
});
