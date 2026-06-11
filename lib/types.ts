export type OutputMode =
  | "Changelog"
  | "Release Notes"
  | "Devlog"
  | "Roadmap Summary"
  | "Social Post"
  | "GitHub Release Draft"
  | "Discord Update";

export type Tone =
  | "Clear"
  | "Friendly"
  | "Technical"
  | "Casual"
  | "Polished"
  | "Hype-light";

export type Audience =
  | "Users"
  | "Developers"
  | "Open Source Contributors"
  | "Modders"
  | "Solo Creator Followers"
  | "Internal Notes";

export type ChangeCategory =
  | "Added"
  | "Changed"
  | "Fixed"
  | "Improved"
  | "Removed"
  | "Known Issues"
  | "Next"
  | "Notes";

export type ParsedChanges = Record<ChangeCategory, string[]>;

export type GenerationEngine = "Template" | "Local LLM" | "API LLM";

export type AiSettings = {
  engine: GenerationEngine;
  endpoint: string;
  model: string;
  apiKey: string;
};

export type HistoryItem = {
  id: string;
  createdAt: string;
  mode: OutputMode;
  tone: Tone;
  audience: Audience;
  markdown: string;
};
