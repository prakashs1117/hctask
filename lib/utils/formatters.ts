/**
 * Format a number with thousands separator
 * @param num - Number to format
 * @returns Formatted string
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Calculate percentage
 * @param current - Current value
 * @param target - Target value
 * @returns Percentage as number
 */
export function calculatePercentage(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

/**
 * Format date to locale string
 * @param date - Date to format
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, locale = "en-US"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Calculate days difference from today
 * @param targetDate - Target date
 * @returns Number of days (negative if overdue)
 */
export function getDaysFromToday(targetDate: Date | string): number {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const today = new Date();
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate program enrollment totals from studies
 * @param studies - Array of studies with enrollment data
 * @returns Object with total enrollment, target, and percentage
 */
export function calculateProgramTotals(studies: Array<{ enrollmentCount: number; targetEnrollment: number }>) {
  const totalEnrollment = studies.reduce((sum, s) => sum + s.enrollmentCount, 0);
  const totalTarget = studies.reduce((sum, s) => sum + s.targetEnrollment, 0);
  const enrollmentPercentage = calculatePercentage(totalEnrollment, totalTarget);

  return {
    totalEnrollment,
    totalTarget,
    enrollmentPercentage,
  };
}

/**
 * Truncates text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
