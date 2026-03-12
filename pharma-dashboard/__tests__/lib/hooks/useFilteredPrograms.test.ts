import { renderHook } from '@testing-library/react';
import { useFilteredPrograms } from '../../../lib/hooks/useFilteredPrograms';
import type { Program, ProgramFilters } from '../../../types';

const mockPrograms: Program[] = [
  {
    id: 'PROG001',
    name: "Alzheimer's Treatment",
    description: 'Novel approach targeting amyloid plaques',
    therapeuticArea: 'Neurology',
    phase: 'Phase II',
    status: 'Active',
    manager: 'Dr. Sarah Johnson',
    createdAt: new Date(),
    updatedAt: new Date(),
    studies: [],
    milestones: [],
  },
  {
    id: 'PROG002',
    name: 'CAR-T Cell Therapy',
    description: 'Chimeric antigen receptor therapy',
    therapeuticArea: 'Oncology',
    phase: 'Phase III',
    status: 'On Hold',
    manager: 'Dr. Michael Chen',
    createdAt: new Date(),
    updatedAt: new Date(),
    studies: [],
    milestones: [],
  },
  {
    id: 'PROG003',
    name: 'Cardiac Regeneration',
    therapeuticArea: 'Cardiology',
    phase: 'Phase I',
    status: 'Active',
    manager: 'Dr. Lisa Park',
    createdAt: new Date(),
    updatedAt: new Date(),
    studies: [],
    milestones: [],
  },
];

const defaultFilters: ProgramFilters = {
  search: '',
  phase: 'All',
  therapeuticArea: 'All',
  status: 'All',
};

describe('useFilteredPrograms', () => {
  it('should return all programs with no filters', () => {
    const { result } = renderHook(() =>
      useFilteredPrograms(mockPrograms, defaultFilters)
    );
    expect(result.current).toHaveLength(3);
  });

  it('should return empty array for undefined programs', () => {
    const { result } = renderHook(() =>
      useFilteredPrograms(undefined, defaultFilters)
    );
    expect(result.current).toEqual([]);
  });

  it('should filter by search term in name', () => {
    const { result } = renderHook(() =>
      useFilteredPrograms(mockPrograms, { ...defaultFilters, search: 'alzheimer' })
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('PROG001');
  });

  it('should filter by search term in description', () => {
    const { result } = renderHook(() =>
      useFilteredPrograms(mockPrograms, { ...defaultFilters, search: 'chimeric' })
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('PROG002');
  });

  it('should filter by search term in manager', () => {
    const { result } = renderHook(() =>
      useFilteredPrograms(mockPrograms, { ...defaultFilters, search: 'lisa' })
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('PROG003');
  });

  it('should filter by phase', () => {
    const { result } = renderHook(() =>
      useFilteredPrograms(mockPrograms, { ...defaultFilters, phase: 'Phase II' })
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].phase).toBe('Phase II');
  });

  it('should filter by therapeutic area', () => {
    const { result } = renderHook(() =>
      useFilteredPrograms(mockPrograms, { ...defaultFilters, therapeuticArea: 'Oncology' })
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].therapeuticArea).toBe('Oncology');
  });

  it('should filter by status', () => {
    const { result } = renderHook(() =>
      useFilteredPrograms(mockPrograms, { ...defaultFilters, status: 'On Hold' })
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].status).toBe('On Hold');
  });

  it('should apply multiple filters simultaneously', () => {
    const { result } = renderHook(() =>
      useFilteredPrograms(mockPrograms, {
        search: '',
        phase: 'All',
        therapeuticArea: 'All',
        status: 'Active',
      })
    );
    expect(result.current).toHaveLength(2);
  });

  it('should return empty when no matches', () => {
    const { result } = renderHook(() =>
      useFilteredPrograms(mockPrograms, { ...defaultFilters, search: 'nonexistent' })
    );
    expect(result.current).toHaveLength(0);
  });
});
