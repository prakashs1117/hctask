import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgramFilters } from '../../../../components/organisms/programs/program-filters';
import { useFilterStore } from '../../../../lib/stores/filterStore';
import { act } from '@testing-library/react';

jest.mock('../../../../lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'programs.phase': 'Development Phase',
        'programs.therapeuticArea': 'Therapeutic Area',
        'programs.phases.all': 'All Phases',
        'programs.phases.preclinical': 'Preclinical',
        'programs.phases.phase1': 'Phase I',
        'programs.phases.phase2': 'Phase II',
        'programs.phases.phase3': 'Phase III',
        'programs.phases.phase4': 'Phase IV',
        'programs.phases.approved': 'Approved',
        'programs.therapeuticAreas.all': 'All Areas',
        'programs.therapeuticAreas.oncology': 'Oncology',
        'programs.therapeuticAreas.neurology': 'Neurology',
        'programs.therapeuticAreas.cardiology': 'Cardiology',
        'programs.therapeuticAreas.immunology': 'Immunology',
        'programs.therapeuticAreas.dermatology': 'Dermatology',
        'programs.therapeuticAreas.endocrinology': 'Endocrinology',
        'filters.activeFilters': 'Active Filters',
        'filters.filterSettings': 'Filter Settings',
        'filters.phase': 'Phase',
        'filters.area': 'Area',
        'filters.search': 'Search',
        'filters.none': 'None',
        'filters.quickActions': 'Quick Actions',
        'filters.phase3Only': 'Phase III Only',
        'filters.oncologyOnly': 'Oncology Only',
      };
      return t[key] || key;
    },
    locale: 'en',
    changeLocale: jest.fn(),
  }),
}));

describe('ProgramFilters', () => {
  beforeEach(() => {
    act(() => {
      useFilterStore.getState().resetFilters();
    });
  });

  it('should render phase and therapeutic area filters', () => {
    render(<ProgramFilters />);
    expect(screen.getByText('Development Phase')).toBeInTheDocument();
    expect(screen.getByText('Therapeutic Area')).toBeInTheDocument();
  });

  it('should render filter settings panel', () => {
    render(<ProgramFilters />);
    expect(screen.getByText('Filter Settings')).toBeInTheDocument();
  });

  it('should render quick action buttons', () => {
    render(<ProgramFilters />);
    expect(screen.getByText('Phase III Only')).toBeInTheDocument();
    expect(screen.getByText('Oncology Only')).toBeInTheDocument();
  });

  it('should apply quick filter when clicked', () => {
    render(<ProgramFilters />);
    fireEvent.click(screen.getByText('Phase III Only'));
    expect(useFilterStore.getState().phase).toBe('Phase III');
  });

  it('should change phase filter via select', () => {
    render(<ProgramFilters />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Phase II' } });
    expect(useFilterStore.getState().phase).toBe('Phase II');
  });

  it('should show active filters when phase is set', () => {
    act(() => {
      useFilterStore.getState().setFilters({ phase: 'Phase I' });
    });
    render(<ProgramFilters />);
    expect(screen.getByText('Active Filters')).toBeInTheDocument();
  });

  it('should change therapeutic area filter via select', () => {
    render(<ProgramFilters />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'Oncology' } });
    expect(useFilterStore.getState().therapeuticArea).toBe('Oncology');
  });

  it('should apply Oncology quick filter', () => {
    render(<ProgramFilters />);
    fireEvent.click(screen.getByText('Oncology Only'));
    expect(useFilterStore.getState().therapeuticArea).toBe('Oncology');
  });

  it('should clear phase filter when X is clicked', () => {
    act(() => {
      useFilterStore.getState().setFilters({ phase: 'Phase III' });
    });
    const { container } = render(<ProgramFilters />);
    const xIcons = container.querySelectorAll('.cursor-pointer');
    fireEvent.click(xIcons[0]);
    expect(useFilterStore.getState().phase).toBe('All');
  });

  it('should clear therapeutic area filter when X is clicked', () => {
    act(() => {
      useFilterStore.getState().setFilters({ therapeuticArea: 'Oncology' });
    });
    const { container } = render(<ProgramFilters />);
    const xIcons = container.querySelectorAll('.cursor-pointer');
    fireEvent.click(xIcons[0]);
    expect(useFilterStore.getState().therapeuticArea).toBe('All');
  });
});
