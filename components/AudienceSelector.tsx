"use client";

import { SegmentedSelector } from "./SegmentedSelector";
import type { Audience } from "@/lib/types";

export const audiences = [
  "Users",
  "Developers",
  "Open Source Contributors",
  "Modders",
  "Solo Creator Followers",
  "Internal Notes",
] as const;

export function AudienceSelector({
  value,
  onChange,
}: {
  value: Audience;
  onChange: (value: Audience) => void;
}) {
  return (
    <SegmentedSelector
      label="Audience"
      options={audiences}
      value={value}
      onChange={onChange}
    />
  );
}
