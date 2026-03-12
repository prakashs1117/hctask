import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';
import { formatDate } from '@/lib/utils/formatters';
import { t, TRANSLATION_KEYS } from '@/lib/i18n';
import type { Program } from '@/types';

interface ProgramInfoCardProps {
  program: Program;
  totalEnrollment: number;
  totalTarget: number;
  enrollmentPercentage: number;
}

export function ProgramInfoCard({
  program,
  totalEnrollment,
  totalTarget,
  enrollmentPercentage
}: ProgramInfoCardProps) {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Info className="h-4 w-4" />
          {t(TRANSLATION_KEYS.PROGRAM.INFO)}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t(TRANSLATION_KEYS.COMMON.CREATED)}:</span>
            <span>{formatDate(program.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t(TRANSLATION_KEYS.COMMON.LAST_UPDATED)}:</span>
            <span>{formatDate(program.updatedAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t(TRANSLATION_KEYS.COMMON.TOTAL_ENROLLMENT)}:</span>
            <span className="font-medium">{totalEnrollment}/{totalTarget}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t(TRANSLATION_KEYS.COMMON.COMPLETION)}:</span>
            <span className="font-medium text-primary">{enrollmentPercentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}