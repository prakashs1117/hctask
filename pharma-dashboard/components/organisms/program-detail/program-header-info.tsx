import { Beaker, FileText, Users, Clock } from 'lucide-react';
import {
  PhaseBadge,
  TherapeuticAreaBadge,
  StatusBadge,
} from '@/components/molecules/program-badge';
import { formatDate } from '@/lib/utils/formatters';
import { t, TRANSLATION_KEYS } from '@/lib/i18n';
import type { Program } from '@/types';

interface ProgramHeaderInfoProps {
  program: Program;
}

export function ProgramHeaderInfo({ program }: ProgramHeaderInfoProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Beaker className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">{program.name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {program.id}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {program.manager}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {t(TRANSLATION_KEYS.COMMON.UPDATED)} {formatDate(program.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {program.description && (
          <p className="text-sm text-muted-foreground bg-muted/30 rounded-md p-2 line-clamp-2">
            {program.description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-start">
        <PhaseBadge phase={program.phase} />
        <TherapeuticAreaBadge area={program.therapeuticArea} />
        <StatusBadge status={program.status} />
      </div>
    </div>
  );
}