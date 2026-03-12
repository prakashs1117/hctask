import { Plus, Activity, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';
import { Button } from '@/components/atoms/button';
import { EmptyState } from '@/components/molecules/empty-state';
import { StudyCard } from './study-card';
import { t, TRANSLATION_KEYS } from '@/lib/i18n';
import type { Study } from '@/types';

interface StudiesSectionProps {
  studies: Study[];
  canAddStudies: boolean;
}

export function StudiesSection({ studies, canAddStudies }: StudiesSectionProps) {
  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4" />
            {t(TRANSLATION_KEYS.COMMON.STUDIES)} ({studies.length})
          </CardTitle>
          {canAddStudies && (
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-3 w-3" />
              {t(TRANSLATION_KEYS.PROGRAM.ADD_STUDY)}
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {studies.length > 0 ? (
            <div className="space-y-3">
              {studies.map((study) => (
                <StudyCard key={study.id} study={study} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BarChart3}
              message={t(TRANSLATION_KEYS.PROGRAM.NO_STUDIES_YET)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}