import { Calendar, Edit } from 'lucide-react';
import { MilestoneBadge } from '@/components/molecules/program-badge';
import { EnrollmentBar } from '@/components/molecules/enrollment-bar';
import { EditStudyDialog } from './edit-study-dialog';
import { Button } from '@/components/atoms/button';
import { formatDate } from '@/lib/utils/formatters';
import type { Study } from '@/types';

interface StudyCardProps {
  study: Study;
  canEdit?: boolean;
}

export function StudyCard({ study, canEdit = false }: StudyCardProps) {
  return (
    <div className="group rounded-lg border bg-card p-3 hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm truncate">{study.name}</h4>
              <MilestoneBadge status={study.milestone} />
            </div>
            {canEdit && (
              <EditStudyDialog
                study={study}
                trigger={
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit className="h-3 w-3" />
                    <span className="sr-only">Edit {study.name}</span>
                  </Button>
                }
              />
            )}
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