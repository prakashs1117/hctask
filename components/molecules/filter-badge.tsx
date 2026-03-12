import { Badge } from "@/components/atoms/badge";
import { X } from "lucide-react";

interface FilterBadgeProps {
  label: string;
  onRemove: () => void;
  isSearch?: boolean;
}

export function FilterBadge({ label, onRemove, isSearch }: FilterBadgeProps) {
  const displayLabel = isSearch
    ? `"${label.length > 10 ? label.slice(0, 10) + '...' : label}"`
    : label;

  return (
    <Badge variant="secondary" className="gap-1 text-xs">
      {displayLabel}
      <X
        className="h-3 w-3 cursor-pointer hover:h-3.5 hover:w-3.5 transition-all"
        onClick={onRemove}
      />
    </Badge>
  );
}
