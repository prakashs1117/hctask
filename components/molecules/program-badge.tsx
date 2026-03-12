import { memo, useMemo } from "react";
import { Badge } from "@/components/atoms/badge";
import type { Phase, TherapeuticArea, ProgramStatus, MilestoneStatus } from "@/types";
import { cn } from "@/lib/utils/cn";

// Memoize phase variants to prevent recreation on each render
const PHASE_VARIANTS: Record<Phase, string> = {
  Preclinical: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  "Phase I": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Phase II": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "Phase III": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "Phase IV": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Approved: "bg-green-500/10 text-green-500 border-green-500/20",
};

/**
 * Phase badge with appropriate styling - memoized for performance
 */
export const PhaseBadge = memo(function PhaseBadge({ phase }: { phase: Phase }) {
  const className = useMemo(() =>
    cn("font-medium text-[10px] sm:text-xs px-2 py-1 whitespace-nowrap", PHASE_VARIANTS[phase]),
    [phase]
  );

  return (
    <Badge variant="outline" className={className}>
      {phase}
    </Badge>
  );
});

// Memoize therapeutic area variants
const THERAPEUTIC_AREA_VARIANTS: Record<TherapeuticArea, string> = {
  Oncology: "bg-red-500/10 text-red-500 border-red-500/20",
  Neurology: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Cardiology: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Immunology: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Dermatology: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  Endocrinology: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

/**
 * Therapeutic area badge with appropriate styling - memoized for performance
 */
export const TherapeuticAreaBadge = memo(function TherapeuticAreaBadge({ area }: { area: TherapeuticArea }) {
  const className = useMemo(() =>
    cn("font-medium text-[10px] sm:text-xs px-2 py-1 whitespace-nowrap", THERAPEUTIC_AREA_VARIANTS[area]),
    [area]
  );

  return (
    <Badge variant="outline" className={className}>
      {area}
    </Badge>
  );
});

// Memoize status variants
const STATUS_VARIANTS: Record<ProgramStatus, { className: string; label: string }> = {
  Active: { className: "bg-green-500/10 text-green-500 border-green-500/20", label: "Active" },
  "On Hold": { className: "bg-amber-500/10 text-amber-500 border-amber-500/20", label: "On Hold" },
  Completed: { className: "bg-blue-500/10 text-blue-500 border-blue-500/20", label: "Completed" },
  Discontinued: { className: "bg-red-500/10 text-red-500 border-red-500/20", label: "Discontinued" },
};

/**
 * Program status badge - memoized for performance
 */
export const StatusBadge = memo(function StatusBadge({ status }: { status: ProgramStatus }) {
  const config = useMemo(() => STATUS_VARIANTS[status], [status]);
  const className = useMemo(() =>
    cn("font-medium text-[10px] sm:text-xs px-2 py-1 whitespace-nowrap", config.className),
    [config.className]
  );

  return (
    <Badge variant="outline" className={className}>
      ● {config.label}
    </Badge>
  );
});

// Memoize milestone variants
const MILESTONE_VARIANTS: Record<MilestoneStatus, string> = {
  Initiation: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Recruitment: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Analysis: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Complete: "bg-green-500/10 text-green-500 border-green-500/20",
};

/**
 * Milestone status badge - memoized for performance
 */
export const MilestoneBadge = memo(function MilestoneBadge({ status }: { status: MilestoneStatus }) {
  const className = useMemo(() =>
    cn("font-medium text-[10px] sm:text-xs px-2 py-1 whitespace-nowrap", MILESTONE_VARIANTS[status]),
    [status]
  );

  return (
    <Badge variant="outline" className={className}>
      {status}
    </Badge>
  );
});
