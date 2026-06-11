"use client";

import { ArrowDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const placeholder = `fixed installer crash on mac
added local-only mode
need to mention API key redaction
changed onboarding copy
bug: export button looked broken
maybe roadmap: GitHub release format later
cleaned up ReThread icon
added first-run privacy screen`;

export function InputPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Paste your progress here</h2>
          <p className="text-sm text-muted-foreground">
            Paste commits, notes, TODOs, or rough progress scraps.
          </p>
        </div>
        <ArrowDown className="hidden h-5 w-5 text-primary lg:block" aria-hidden="true" />
      </div>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Messy progress input"
      />
    </section>
  );
}
