"use client";

import { cn } from "@/lib/utils";

export function SegmentedSelector<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-md border px-3 py-2 text-xs font-medium text-muted-foreground transition",
              value === option
                ? "border-primary/80 bg-primary/14 text-foreground shadow-sm"
                : "bg-card/70 hover:border-primary/45 hover:text-foreground",
            )}
            aria-pressed={value === option}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
