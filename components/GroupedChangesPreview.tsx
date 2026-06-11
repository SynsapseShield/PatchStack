"use client";

import { ArrowRightLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { changeCategories, cloneParsedChanges, hasParsedContent } from "@/lib/changelogParser";
import type { ChangeCategory, ParsedChanges } from "@/lib/types";

export function GroupedChangesPreview({
  parsed,
  onChange,
}: {
  parsed: ParsedChanges;
  onChange: (parsed: ParsedChanges) => void;
}) {
  if (!hasParsedContent(parsed)) {
    return (
      <section className="rounded-lg border bg-background/38 p-3">
        <div className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Grouped Changes
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          Generate once to preview how PatchStack grouped your notes.
        </p>
      </section>
    );
  }

  function moveItem(from: ChangeCategory, index: number, to: ChangeCategory) {
    if (from === to) {
      return;
    }

    const next = cloneParsedChanges(parsed);
    const [item] = next[from].splice(index, 1);
    next[to].push(item);
    onChange(next);
  }

  function removeItem(category: ChangeCategory, index: number) {
    const next = cloneParsedChanges(parsed);
    next[category].splice(index, 1);
    onChange(next);
  }

  return (
    <section className="space-y-3 rounded-lg border bg-background/38 p-3">
      <div>
        <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Grouped Changes
        </div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Reassign anything that landed in the wrong bucket.
        </p>
      </div>

      <div className="max-h-64 space-y-3 overflow-auto pr-1">
        {changeCategories
          .filter((category) => parsed[category].length > 0)
          .map((category) => (
            <div key={category} className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                {category}
              </h3>
              <div className="space-y-2">
                {parsed[category].map((item, index) => (
                  <div
                    key={`${category}-${item}-${index}`}
                    className="rounded-md border bg-card/70 p-2"
                  >
                    <p className="text-xs leading-5 text-foreground">{item}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <ArrowRightLeft
                        className="h-3.5 w-3.5 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <select
                        value={category}
                        onChange={(event) =>
                          moveItem(category, index, event.target.value as ChangeCategory)
                        }
                        className="h-8 min-w-0 flex-1 rounded-md border bg-background px-2 text-xs text-foreground"
                        aria-label={`Move ${item}`}
                      >
                        {changeCategories.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(category, index)}
                        aria-label={`Remove ${item}`}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
