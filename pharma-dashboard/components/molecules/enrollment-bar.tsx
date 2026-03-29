import React, { useMemo } from "react";
import { calculatePercentage, formatNumber } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

/**
 * Enrollment progress bar component props
 */
interface EnrollmentBarProps {
  current: number;
  target: number;
  showLabel?: boolean;
  className?: string;
}

/**
 * Visual progress bar for enrollment status
 * @param props - Enrollment bar properties
 */
export const EnrollmentBar = React.memo(({
  current,
  target,
  showLabel = true,
  className,
}: EnrollmentBarProps) => {
  const percentage = useMemo(() => calculatePercentage(current, target), [current, target]);

  const colorClass = useMemo(() => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 75) return "bg-emerald-500";
    if (percentage >= 50) return "bg-amber-500";
    return "bg-red-500";
  }, [percentage]);

  const formattedCurrent = useMemo(() => formatNumber(current), [current]);
  const formattedTarget = useMemo(() => formatNumber(target), [target]);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>
            {formattedCurrent} / {formattedTarget} enrolled
          </span>
          <span className="font-semibold">{percentage}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            colorClass
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

EnrollmentBar.displayName = "EnrollmentBar";
