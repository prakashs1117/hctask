import { renderHook } from '@testing-library/react';
import { useProgramCalculations, useProgramsCalculations } from '../../../lib/hooks/useProgramCalculations';
import type { Program } from '../../../types';

const createProgram = (id: string, studies: Array<{ enrollmentCount: number; targetEnrollment: number }>): Program => ({
  id,
  name: `Program ${id}`,
  therapeuticArea: 'Oncology',
  phase: 'Phase I',
  status: 'Active',
  manager: 'Dr. Test',
  createdAt: new Date(),
  updatedAt: new Date(),
  studies: studies.map((s, i) => ({
    id: `STD${i}`,
    programId: id,
    name: `Study ${i}`,
    title: `Study Title ${i}`,
    enrollmentCount: s.enrollmentCount,
    targetEnrollment: s.targetEnrollment,
    milestone: 'Recruitment' as const,
    status: 'Active' as const,
    startDate: new Date(),
    estimatedEndDate: new Date(),
  })),
  milestones: [],
});

describe('useProgramCalculations', () => {
  it('should calculate enrollment totals', () => {
    const program = createProgram('P1', [
      { enrollmentCount: 50, targetEnrollment: 100 },
      { enrollmentCount: 30, targetEnrollment: 200 },
    ]);
    const { result } = renderHook(() => useProgramCalculations(program));
    expect(result.current.totalEnrollment).toBe(80);
    expect(result.current.totalTarget).toBe(300);
    expect(result.current.enrollmentPercentage).toBe(27);
  });

  it('should return zeros for null program', () => {
    const { result } = renderHook(() => useProgramCalculations(null as unknown as Program));
    expect(result.current.totalEnrollment).toBe(0);
    expect(result.current.totalTarget).toBe(0);
    expect(result.current.enrollmentPercentage).toBe(0);
  });

  it('should handle empty studies', () => {
    const program = createProgram('P1', []);
    const { result } = renderHook(() => useProgramCalculations(program));
    expect(result.current.totalEnrollment).toBe(0);
    expect(result.current.totalTarget).toBe(0);
  });
});

describe('useProgramsCalculations', () => {
  it('should calculate for multiple programs', () => {
    const programs = [
      createProgram('P1', [{ enrollmentCount: 50, targetEnrollment: 100 }]),
      createProgram('P2', [{ enrollmentCount: 80, targetEnrollment: 200 }]),
    ];
    const { result } = renderHook(() => useProgramsCalculations(programs));
    expect(result.current.size).toBe(2);
    expect(result.current.get('P1')?.totalEnrollment).toBe(50);
    expect(result.current.get('P2')?.totalEnrollment).toBe(80);
  });

  it('should return empty map for undefined', () => {
    const { result } = renderHook(() => useProgramsCalculations(undefined));
    expect(result.current.size).toBe(0);
  });
});
