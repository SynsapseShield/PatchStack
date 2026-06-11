import type { Audience, OutputMode, Tone } from "./types";

export const demoInput = `fixed first-run privacy screen spacing
added local-only template generation
need to mention API key redaction
changed onboarding copy for clearer paste flow
bug: markdown export button looked disabled
maybe roadmap: GitHub release format presets later
cleaned up PatchStack layer icon
todo add Discord update template
updated empty state copy
fixed Windows titlebar contrast issue`;

export const demoSettings: {
  mode: OutputMode;
  tone: Tone;
  audience: Audience;
} = {
  mode: "Changelog",
  tone: "Clear",
  audience: "Users",
};
