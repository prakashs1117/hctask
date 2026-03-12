import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';
import { EmptyState } from '@/components/molecules/empty-state';
import { MilestoneItem } from './milestone-item';
import { t, TRANSLATION_KEYS } from '@/lib/i18n';
import type { Milestone } from '@/types';

interface MilestonesSectionProps {
  milestones: Milestone[];
}

export function MilestonesSection({ milestones }: MilestonesSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckCircle className="h-4 w-4" />
          {t(TRANSLATION_KEYS.COMMON.MILESTONES)} ({milestones.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {milestones.length > 0 ? (
          <div className="space-y-2">
            {milestones.map((milestone) => (
              <MilestoneItem key={milestone.id} milestone={milestone} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CheckCircle}
            message={t(TRANSLATION_KEYS.PROGRAM.NO_MILESTONES_SET)}
            size="sm"
          />
        )}
      </CardContent>
    </Card>
  );
}