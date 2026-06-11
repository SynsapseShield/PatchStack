"use client";

import { SegmentedSelector } from "./SegmentedSelector";
import type { OutputMode } from "@/lib/types";

export const outputModes = [
  "Changelog",
  "Release Notes",
  "Devlog",
  "Roadmap Summary",
  "Social Post",
  "GitHub Release Draft",
  "Discord Update",
] as const;

export function OutputModeSelector({
  value,
  onChange,
}: {
  value: OutputMode;
  onChange: (value: OutputMode) => void;
}) {
  return (
    <SegmentedSelector
      label="Output"
      options={outputModes}
      value={value}
      onChange={onChange}
    />
  );
}
