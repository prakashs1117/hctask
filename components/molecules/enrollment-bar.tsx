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
export function EnrollmentBar({
  current,
  target,
  showLabel = true,
  className,
}: EnrollmentBarProps) {
  const percentage = calculatePercentage(current, target);

  const getColorClass = (pct: number) => {
    if (pct >= 90) return "bg-green-500";
    if (pct >= 75) return "bg-emerald-500";
    if (pct >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>
            {formatNumber(current)} / {formatNumber(target)} enrolled
          </span>
          <span className="font-semibold">{percentage}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            getColorClass(percentage)
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
