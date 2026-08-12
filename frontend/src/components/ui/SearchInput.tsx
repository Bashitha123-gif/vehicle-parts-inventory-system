import { Search, X } from "lucide-react";
import { Input } from "./Input";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search…", className }: SearchInputProps) {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={className}
      leftIcon={<Search className="h-4 w-4" />}
      rightSlot={
        value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="rounded p-1 text-ink-400 hover:text-ink-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : undefined
      }
    />
  );
}
