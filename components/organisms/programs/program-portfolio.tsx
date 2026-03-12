"use client";

import { Card, CardContent } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { EmptyState } from "@/components/molecules/empty-state";
import { ProgramListItem } from "@/components/molecules/program-list-item";
import { ProgramGridCard } from "@/components/molecules/program-grid-card";
import { FileText } from "lucide-react";
import type { Program } from "@/types";

interface ProgramPortfolioProps {
  programs: Program[];
  isLoading: boolean;
  viewMode: "list" | "grid";
  onClearFilters?: () => void;
}

export function ProgramPortfolio({ programs, isLoading, viewMode, onClearFilters }: ProgramPortfolioProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Program Portfolio
            </h3>
            <Badge variant="outline">{programs.length} programs</Badge>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <LoadingSpinner message="Loading program portfolio..." />
          ) : (
            <>
              {viewMode === "list" ? (
                <div className="space-y-4">
                  {programs.map((program) => (
                    <ProgramListItem key={program.id} program={program} />
                  ))}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {programs.map((program) => (
                    <ProgramGridCard key={program.id} program={program} />
                  ))}
                </div>
              )}

              {programs.length === 0 && (
                <EmptyState
                  title="No programs found"
                  message="No programs match your current filters. Try adjusting your search criteria."
                  onClear={onClearFilters}
                />
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
