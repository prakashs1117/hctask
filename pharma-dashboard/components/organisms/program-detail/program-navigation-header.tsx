import Link from 'next/link';
import { Button } from '@/components/atoms/button';
import { Badge } from '@/components/atoms/badge';
import { ArrowLeft, Building } from 'lucide-react';
import { EditProgramDialog } from '@/components/organisms/programs/edit-program-dialog';
import { DeleteProgramDialog } from '@/components/organisms/programs/delete-program-dialog';
import { useTranslation, TRANSLATION_KEYS } from '@/lib/i18n';
import type { Program } from '@/types';

interface ProgramNavigationHeaderProps {
  program: Program;
  canEdit: boolean;
  canDelete?: boolean;
}

export function ProgramNavigationHeader({
  program,
  canEdit,
  canDelete = false
}: ProgramNavigationHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between border-b pb-3">
      <div className="flex items-center gap-3">
        <Link href="/programs">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t(TRANSLATION_KEYS.PROGRAM.BACK_TO_PROGRAMS)}
          </Button>
        </Link>
        <div className="h-4 w-px bg-border" />
        <Badge variant="outline" className="gap-1">
          <Building className="h-3 w-3" />
          {t(TRANSLATION_KEYS.PROGRAM.DETAILS)}
        </Badge>
      </div>
      <div className="flex gap-2">
        {canEdit && (
          <EditProgramDialog
            program={program}
            canEdit={canEdit}
          />
        )}
        {canDelete && (
          <DeleteProgramDialog
            program={program}
            canDelete={canDelete}
            variant="detail"
          />
        )}
      </div>
    </div>
  );
}