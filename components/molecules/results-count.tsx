import { FileText } from "lucide-react";

interface ResultsCountProps {
  filtered: number;
  total: number;
  label: string;
}

export function ResultsCount({ filtered, total, label }: ResultsCountProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <FileText className="h-4 w-4" />
      <span className="hidden sm:inline">{filtered} of {total} {label}</span>
      <span className="sm:hidden">{filtered}/{total}</span>
    </div>
  );
}
