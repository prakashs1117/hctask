import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { EnrollmentBar } from "@/components/molecules/enrollment-bar";
import { PhaseBadge, TherapeuticAreaBadge } from "@/components/molecules/program-badge";
import { calculateProgramTotals } from "@/lib/utils/formatters";
import { Beaker, Users, FileText } from "lucide-react";
import Link from "next/link";
import type { Program } from "@/types";

interface ProgramGridCardProps {
  program: Program;
}

export function ProgramGridCard({ program }: ProgramGridCardProps) {
  const { totalEnrollment, totalTarget, enrollmentPercentage } = calculateProgramTotals(program.studies);

  return (
    <Link href={`/programs/${program.id}`}>
      <Card className="group h-full transition-all hover:shadow-lg hover:border-primary/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Beaker className="h-6 w-6" />
            </div>
            <PhaseBadge phase={program.phase} />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {program.name}
            </CardTitle>
            <TherapeuticAreaBadge area={program.therapeuticArea} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-snug">
            {program.description}
          </p>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Enrollment</span>
                <span className="font-medium">{enrollmentPercentage}%</span>
              </div>
              <EnrollmentBar current={totalEnrollment} target={totalTarget} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {program.manager}
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {program.studies.length} studies
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
