import React, { useMemo } from "react";
import { EnrollmentBar } from "@/components/molecules/enrollment-bar";
import { PhaseBadge, TherapeuticAreaBadge } from "@/components/molecules/program-badge";
import { calculateProgramTotals } from "@/lib/utils/formatters";
import { Beaker, Users, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import type { Program } from "@/types";

interface ProgramListItemProps {
  program: Program;
}

export const ProgramListItem = React.memo(({ program }: ProgramListItemProps) => {
  const { totalEnrollment, totalTarget, enrollmentPercentage } = useMemo(
    () => calculateProgramTotals(program.studies),
    [program.studies]
  );

  const formattedUpdateDate = useMemo(
    () => new Date(program.updatedAt).toLocaleDateString(),
    [program.updatedAt]
  );

  return (
    <Link href={`/programs/${program.id}`}>
      <div className="group relative flex items-center justify-between rounded-lg border bg-card p-5 transition-all hover:shadow-md hover:border-primary/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
        <div className="relative flex-1">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Beaker className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{program.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <PhaseBadge phase={program.phase} />
                <TherapeuticAreaBadge area={program.therapeuticArea} />
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2 leading-snug">
            {program.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {program.manager}
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {program.studies.length} studies
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Updated {formattedUpdateDate}
            </div>
          </div>
        </div>
        <div className="relative ml-6 w-56">
          <div className="mb-1 text-xs text-muted-foreground">Enrollment Progress</div>
          <EnrollmentBar current={totalEnrollment} target={totalTarget} />
          <div className="mt-1 text-xs text-muted-foreground">
            {totalEnrollment}/{totalTarget} participants ({enrollmentPercentage}%)
          </div>
        </div>
      </div>
    </Link>
  );
});

ProgramListItem.displayName = "ProgramListItem";
