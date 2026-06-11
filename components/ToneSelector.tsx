"use client";

import { SegmentedSelector } from "./SegmentedSelector";
import type { Tone } from "@/lib/types";

export const tones = [
  "Clear",
  "Friendly",
  "Technical",
  "Casual",
  "Polished",
  "Hype-light",
] as const;

export function ToneSelector({
  value,
  onChange,
}: {
  value: Tone;
  onChange: (value: Tone) => void;
}) {
  return (
    <SegmentedSelector
      label="Tone"
      options={tones}
      value={value}
      onChange={onChange}
    />
  );
}
