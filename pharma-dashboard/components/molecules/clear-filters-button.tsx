import { Button } from "@/components/atoms/button";
import { X } from "lucide-react";

interface ClearFiltersButtonProps {
  onClick: () => void;
  label?: string;
}

export function ClearFiltersButton({ onClick, label = "Clear All" }: ClearFiltersButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="gap-2"
    >
      <X className="h-4 w-4" />
      {label}
    </Button>
  );
}
