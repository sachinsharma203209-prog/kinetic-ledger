"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBoxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void;
  debounceMs?: number;
}

export const SearchBox = React.forwardRef<HTMLInputElement, SearchBoxProps>(
  ({ className, onSearch, debounceMs = 300, ...props }, ref) => {
    const [value, setValue] = React.useState(props.defaultValue || "");

    React.useEffect(() => {
      const timer = setTimeout(() => {
        onSearch(String(value));
      }, debounceMs);
      return () => clearTimeout(timer);
    }, [value, debounceMs, onSearch]);

    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        <input
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={cn(
            "h-10 w-full rounded-lg border border-outline-variant bg-surface pl-9 pr-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60",
            "focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
SearchBox.displayName = "SearchBox";
