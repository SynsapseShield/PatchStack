import { changeCategories, hasParsedContent, parseProgressNotes } from "./changelogParser";
import { redactSecrets } from "./redaction";
import type { Audience, ChangeCategory, OutputMode, ParsedChanges, Tone } from "./types";

export const EMPTY_INPUT_MESSAGE =
  "Add a few notes first so PatchStack has something to organize.";

export function generateUpdateMarkdown({
  input,
  mode,
  tone,
  audience,
}: {
  input: string;
  mode: OutputMode;
  tone: Tone;
  audience: Audience;
}) {
  const { input: safeInput, redacted, count } = redactSecrets(input);
  const parsed = parseProgressNotes(safeInput);

  if (!safeInput.trim() || !hasParsedContent(parsed)) {
    return {
      markdown: EMPTY_INPUT_MESSAGE,
      redacted,
      redactionCount: count,
      parsed,
    };
  }

  return {
    markdown: renderUpdateMarkdown({
      parsed,
      mode,
      tone,
      audience,
    }),
    redacted,
    redactionCount: count,
    parsed,
  };
}

export function renderUpdateMarkdown({
  parsed,
  mode,
  tone,
  audience,
}: {
  parsed: ParsedChanges;
  mode: OutputMode;
  tone: Tone;
  audience: Audience;
}) {
  if (!hasParsedContent(parsed)) {
    return EMPTY_INPUT_MESSAGE;
  }

  return renderMode(parsed, mode, tone, audience);
}

function renderMode(parsed: ParsedChanges, mode: OutputMode, tone: Tone, audience: Audience) {
  switch (mode) {
    case "Devlog":
      return renderDevlog(parsed, tone, audience);
    case "Roadmap Summary":
      return renderRoadmap(parsed);
    case "Social Post":
      return renderSocialPost(parsed, tone, audience);
    case "GitHub Release Draft":
      return renderStructured(parsed, "GitHub Release Draft", ["Added", "Changed", "Fixed", "Improved", "Removed", "Known Issues", "Next"]);
    case "Discord Update":
      return renderDiscord(parsed, tone);
    case "Release Notes":
      return renderStructured(parsed, "Release Notes", ["Added", "Changed", "Fixed", "Improved", "Removed", "Known Issues", "Next", "Notes"]);
    case "Changelog":
    default:
      return renderStructured(parsed, "Changelog", ["Added", "Changed", "Fixed", "Improved", "Removed", "Known Issues", "Next", "Notes"]);
  }
}

function renderStructured(parsed: ParsedChanges, title: string, order: ChangeCategory[]) {
  const sections = order
    .filter((category) => parsed[category].length > 0)
    .map((category) => `### ${category}\n${parsed[category].map((item) => `- ${item}`).join("\n")}`);

  return [`## ${title}`, ...sections].join("\n\n");
}

export function formatGroupedChanges(parsed: ParsedChanges) {
  return changeCategories
    .filter((category) => parsed[category].length > 0)
    .map((category) => `${category}:\n${parsed[category].map((item) => `- ${item}`).join("\n")}`)
    .join("\n\n");
}

function renderDevlog(parsed: ParsedChanges, tone: Tone, audience: Audience) {
  const changed = collect(parsed, ["Added", "Changed", "Fixed", "Improved", "Removed"]);
  const next = collect(parsed, ["Next"]);
  const notes = collect(parsed, ["Known Issues", "Notes"]);

  const sections = [
    section("What changed", changed),
    section("Why it matters", buildWhyItMatters(changed, tone, audience)),
    section("What's next", next),
    section("Notes from the build", notes),
  ].filter(Boolean);

  return ["## Devlog", ...sections].join("\n\n");
}

function renderRoadmap(parsed: ParsedChanges) {
  const completed = collect(parsed, ["Added", "Changed", "Fixed", "Improved", "Removed"]);
  const inProgress = collect(parsed, ["Known Issues", "Notes"]);
  const next = collect(parsed, ["Next"]);

  return [
    "## Roadmap Summary",
    section("Completed", completed),
    section("In Progress", inProgress),
    section("Next Up", next),
    section("Later", []),
  ]
    .filter(Boolean)
    .join("\n\n");
}

function renderSocialPost(parsed: ParsedChanges, tone: Tone, audience: Audience) {
  const items = collect(parsed, changeCategories).slice(0, 5);
  const intro = tone === "Hype-light"
    ? "Small but useful PatchStack update:"
    : `PatchStack update for ${audience.toLowerCase()}:`;

  return [`${intro}`, ...items.map((item) => `- ${item}`)].join("\n");
}

function renderDiscord(parsed: ParsedChanges, tone: Tone) {
  const items = collect(parsed, changeCategories);
  const intro = tone === "Casual" ? "Quick build update:" : "Build update:";
  return [`**${intro}**`, ...items.map((item) => `- ${item}`)].join("\n");
}

function section(title: string, items: string[] | string) {
  if (Array.isArray(items) && items.length === 0) {
    return "";
  }

  if (typeof items === "string" && !items.trim()) {
    return "";
  }

  const body = Array.isArray(items) ? items.map((item) => `- ${item}`).join("\n") : items;
  return `### ${title}\n${body}`;
}

function collect(parsed: ParsedChanges, categories: ChangeCategory[]) {
  return categories.flatMap((category) => parsed[category]);
}

function buildWhyItMatters(items: string[], tone: Tone, audience: Audience) {
  if (items.length === 0) {
    return "";
  }

  const base = audience === "Developers" || audience === "Open Source Contributors"
    ? "This keeps the project easier to test, ship, and understand without adding extra process."
    : "This makes the update clearer, more stable, and easier to use.";

  if (tone === "Technical") {
    return `${base} The changes are grouped by behavior so the update stays reviewable.`;
  }

  return base;
}
