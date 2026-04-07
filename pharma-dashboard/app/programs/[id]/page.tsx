"use client";

import { use, useMemo } from "react";
import { useProgram } from "@/lib/hooks/usePrograms";
import { useAuthStore } from "@/lib/stores/authStore";
import { useProgramMetrics } from "@/lib/hooks/useProgramMetrics";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { NotFoundState } from "@/components/molecules/not-found-state";
import {
  ProgramNavigationHeader,
  ProgramHeaderInfo,
  MetricsGrid,
  StudiesSection,
  MilestonesSection,
  ProgramInfoCard,
} from "@/components/organisms/program-detail";
import { t, TRANSLATION_KEYS } from "@/lib/i18n";
import { PERMISSIONS } from "@/lib/constants/permissions";

/**
 * Program detail page - Optimized component-based architecture with internationalization
 */
export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: program, isLoading } = useProgram(id);

  // Optimized store subscription - only subscribe to hasPermission function
  const hasPermission = useAuthStore(state => state.hasPermission);

  // Memoized permission checks to avoid repeated calls
  const permissions = useMemo(() => ({
    canEdit: hasPermission(PERMISSIONS.EDIT_PROGRAMS),
    canDelete: hasPermission(PERMISSIONS.DELETE_PROGRAMS),
    canAddStudies: hasPermission(PERMISSIONS.ADD_STUDIES),
    canEditStudies: hasPermission(PERMISSIONS.EDIT_STUDIES),
  }), [hasPermission]);

  // Memoized program metrics calculation
  const { totalEnrollment, totalTarget, enrollmentPercentage } = useProgramMetrics(program);

  if (isLoading) {
    return (
      <LoadingSpinner message={t(TRANSLATION_KEYS.PROGRAM.LOADING_DETAILS)} />
    );
  }

  if (!program) {
    return (
      <NotFoundState
        entity={t(TRANSLATION_KEYS.PROGRAM.DETAILS)}
        backUrl="/programs"
        backLabel={t(TRANSLATION_KEYS.PROGRAM.BACK_TO_PROGRAMS)}
      />
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Navigation Header */}
      <ProgramNavigationHeader
        program={program}
        canEdit={permissions.canEdit}
        canDelete={permissions.canDelete}
      />

      {/* Program Header Info */}
      <ProgramHeaderInfo program={program} />

      {/* Key Metrics Grid */}
      <MetricsGrid
        studiesCount={program.studies.length}
        totalEnrollment={totalEnrollment}
        totalTarget={totalTarget}
        enrollmentPercentage={enrollmentPercentage}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Studies Section */}
        <StudiesSection
          studies={program.studies}
          programId={program.id}
          canAddStudies={permissions.canAddStudies}
          canEditStudies={permissions.canEditStudies}
        />

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <MilestonesSection milestones={program.milestones} />

          <ProgramInfoCard
            program={program}
            totalEnrollment={totalEnrollment}
            totalTarget={totalTarget}
            enrollmentPercentage={enrollmentPercentage}
          />
        </div>
      </div>
    </div>
  );
}