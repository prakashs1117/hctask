import { Calendar } from 'lucide-react';
import { MilestoneBadge } from '@/components/molecules/program-badge';
import { EnrollmentBar } from '@/components/molecules/enrollment-bar';
import { formatDate } from '@/lib/utils/formatters';
import type { Study } from '@/types';

interface StudyCardProps {
  study: Study;
}

export function StudyCard({ study }: StudyCardProps) {
  return (
    <div className="rounded-lg border bg-card p-3 hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{study.name}</h4>
            <MilestoneBadge status={study.milestone} />
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
            {study.title}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(study.startDate)}
            </span>
            <span>→</span>
            <span>{formatDate(study.estimatedEndDate)}</span>
          </div>
        </div>
        <div className="w-24 flex-shrink-0">
          <EnrollmentBar
            current={study.enrollmentCount}
            target={study.targetEnrollment}
          />
          <p className="text-xs text-muted-foreground text-center mt-1">
            {study.enrollmentCount}/{study.targetEnrollment}
          </p>
        </div>
      </div>
    </div>
  );
}