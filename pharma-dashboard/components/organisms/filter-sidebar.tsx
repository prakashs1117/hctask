"use client";

import { ReactNode } from "react";
import { X, Filter } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  activeFilterCount?: number;
  onClearAll?: () => void;
  className?: string;
}

export function FilterSidebar({
  isOpen,
  onClose,
  title,
  children,
  activeFilterCount = 0,
  onClearAll,
  className
}: FilterSidebarProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-96 lg:w-80 bg-background border-l shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 lg:p-4 border-b bg-muted/20">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">{title || t("common.filters")}</h2>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="h-6 w-6 rounded-full p-0 text-xs flex items-center justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-muted"
            title={t("common.closeFilters")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-4">
          {children}
        </div>

        {/* Footer Actions */}
        {onClearAll && activeFilterCount > 0 && (
          <div className="p-4 sm:p-5 lg:p-4 border-t bg-muted/10">
            <Button
              variant="outline"
              onClick={onClearAll}
              className="w-full gap-2 hover:bg-muted"
            >
              <X className="h-4 w-4" />
              {t("common.clearAllFilters")} ({activeFilterCount})
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
