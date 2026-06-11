"use client";

import { Clock, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HistoryItem } from "@/lib/types";

export function HistoryPanel({
  items,
  onRestore,
  onClear,
}: {
  items: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onClear: () => void;
}) {
  return (
    <section className="space-y-3 rounded-lg border bg-background/38 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Local History
          </div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Last 5 generated updates, saved in this browser.
          </p>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onClear} disabled={!items.length}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      {items.length ? (
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onRestore(item)}
              className="w-full rounded-md border bg-card/70 p-2 text-left transition hover:border-primary/50"
            >
              <span className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {item.mode}
              </span>
              <span className="mt-1 line-clamp-2 block text-xs leading-5 text-muted-foreground">
                {item.markdown.replace(/[#*_`>-]/g, "").trim()}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-6 text-muted-foreground">
          Generated updates will appear here.
        </p>
      )}

      {items.length ? (
        <Button type="button" variant="outline" size="sm" onClick={() => onRestore(items[0])}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Restore latest
        </Button>
      ) : null}
    </section>
  );
}
