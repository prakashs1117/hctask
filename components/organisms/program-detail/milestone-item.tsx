import { formatDate } from '@/lib/utils/formatters';
import { MILESTONE_STATUS_COLORS } from '@/lib/constants/ui';
import { cn } from '@/lib/utils';
import type { Milestone } from '@/types';

interface MilestoneItemProps {
  milestone: Milestone;
}

export function MilestoneItem({ milestone }: MilestoneItemProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
      <div
        className={cn(
          'h-2 w-2 rounded-full flex-shrink-0',
          milestone.completed
            ? MILESTONE_STATUS_COLORS.completed
            : MILESTONE_STATUS_COLORS.pending
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-xs truncate">{milestone.label}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(milestone.dueDate)}
          {milestone.completed && milestone.completedDate && (
            <span className="text-green-600 ml-1">✓</span>
          )}
        </p>
      </div>
    </div>
  );
}