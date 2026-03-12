import { renderHook } from '@testing-library/react';
import { useProgramMetrics } from '../../../lib/hooks/useProgramMetrics';
import type { Program } from '../../../types';

describe('useProgramMetrics', () => {
  it('should return zeros for null program', () => {
    const { result } = renderHook(() => useProgramMetrics(null));
    expect(result.current).toEqual({
      totalEnrollment: 0,
      totalTarget: 0,
      enrollmentPercentage: 0,
    });
  });

  it('should return zeros for undefined program', () => {
    const { result } = renderHook(() => useProgramMetrics(undefined));
    expect(result.current).toEqual({
      totalEnrollment: 0,
      totalTarget: 0,
      enrollmentPercentage: 0,
    });
  });

  it('should calculate metrics from program studies', () => {
    const program: Program = {
      id: 'P1',
      name: 'Test Program',
      therapeuticArea: 'Oncology',
      phase: 'Phase I',
      status: 'Active',
      manager: 'Dr. Test',
      createdAt: new Date(),
      updatedAt: new Date(),
      studies: [
        {
          id: 'S1',
          programId: 'P1',
          name: 'Study 1',
          title: 'Title 1',
          enrollmentCount: 45,
          targetEnrollment: 200,
          milestone: 'Recruitment',
          status: 'Active',
          startDate: new Date(),
          estimatedEndDate: new Date(),
        },
        {
          id: 'S2',
          programId: 'P1',
          name: 'Study 2',
          title: 'Title 2',
          enrollmentCount: 30,
          targetEnrollment: 100,
          milestone: 'Analysis',
          status: 'Active',
          startDate: new Date(),
          estimatedEndDate: new Date(),
        },
      ],
      milestones: [],
    };

    const { result } = renderHook(() => useProgramMetrics(program));
    expect(result.current.totalEnrollment).toBe(75);
    expect(result.current.totalTarget).toBe(300);
    expect(result.current.enrollmentPercentage).toBe(25);
  });
});
