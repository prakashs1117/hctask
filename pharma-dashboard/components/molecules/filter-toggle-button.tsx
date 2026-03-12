import { memo } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";

interface FilterToggleButtonProps {
  onClick: () => void;
  activeCount?: number;
  isOpen?: boolean;
  label?: string;
}

// Memoize FilterToggleButton to prevent unnecessary re-renders
export const FilterToggleButton = memo(function FilterToggleButton({
  onClick,
  activeCount = 0,
  isOpen = false,
  label = "Filters"
}: FilterToggleButtonProps) {
  return (
    <Button
      variant={isOpen || activeCount > 0 ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="gap-2"
    >
      <Filter className="h-4 w-4" />
      {label}
      {activeCount > 0 && (
        <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
          {activeCount}
        </Badge>
      )}
    </Button>
  );
});