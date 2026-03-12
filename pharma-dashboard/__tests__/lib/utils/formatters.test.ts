import {
  formatNumber,
  calculatePercentage,
  formatDate,
  getDaysFromToday,
  calculateProgramTotals,
  truncateText,
} from '../../../lib/utils/formatters';

describe('formatNumber', () => {
  it('should format numbers with locale separators', () => {
    expect(formatNumber(1000)).toBe((1000).toLocaleString());
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(999999)).toBe((999999).toLocaleString());
  });
});

describe('calculatePercentage', () => {
  it('should calculate percentage correctly', () => {
    expect(calculatePercentage(50, 100)).toBe(50);
    expect(calculatePercentage(75, 100)).toBe(75);
    expect(calculatePercentage(100, 100)).toBe(100);
  });

  it('should return 0 when target is 0', () => {
    expect(calculatePercentage(50, 0)).toBe(0);
  });

  it('should cap at 100%', () => {
    expect(calculatePercentage(150, 100)).toBe(100);
  });

  it('should round to nearest integer', () => {
    expect(calculatePercentage(1, 3)).toBe(33);
  });
});

describe('formatDate', () => {
  it('should format Date object', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toContain('Jan');
    expect(result).toContain('2024');
  });

  it('should format date string', () => {
    const result = formatDate('2024-06-15');
    expect(result).toContain('Jun');
    expect(result).toContain('2024');
  });

  it('should use custom locale', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date, 'en-US');
    expect(typeof result).toBe('string');
  });
});

describe('getDaysFromToday', () => {
  it('should return positive days for future date', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    expect(getDaysFromToday(futureDate)).toBeGreaterThan(0);
  });

  it('should return negative days for past date', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);
    expect(getDaysFromToday(pastDate)).toBeLessThan(0);
  });

  it('should handle string dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    expect(getDaysFromToday(futureDate.toISOString())).toBeGreaterThan(0);
  });
});

describe('calculateProgramTotals', () => {
  it('should calculate totals from studies', () => {
    const studies = [
      { enrollmentCount: 50, targetEnrollment: 100 },
      { enrollmentCount: 30, targetEnrollment: 200 },
    ];
    const result = calculateProgramTotals(studies);
    expect(result.totalEnrollment).toBe(80);
    expect(result.totalTarget).toBe(300);
    expect(result.enrollmentPercentage).toBe(27);
  });

  it('should handle empty studies array', () => {
    const result = calculateProgramTotals([]);
    expect(result.totalEnrollment).toBe(0);
    expect(result.totalTarget).toBe(0);
    expect(result.enrollmentPercentage).toBe(0);
  });
});

describe('truncateText', () => {
  it('should not truncate text shorter than maxLength', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });

  it('should truncate text longer than maxLength', () => {
    expect(truncateText('hello world', 5)).toBe('hello...');
  });

  it('should handle exact length', () => {
    expect(truncateText('hello', 5)).toBe('hello');
  });
});
