"use client";

import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ placeholder = "Search...", value, onChange }: SearchInputProps) {
  return (
    <div className="relative flex-1 max-w-md">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={value ? "pr-16" : "pr-10"}
      />
      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-9 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          onClick={() => onChange("")}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
