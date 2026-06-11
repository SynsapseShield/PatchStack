import type { ChangeCategory, ParsedChanges } from "./types";

const categories: ChangeCategory[] = [
  "Added",
  "Changed",
  "Fixed",
  "Improved",
  "Removed",
  "Known Issues",
  "Next",
  "Notes",
];

const keywordMap: Array<[ChangeCategory, RegExp]> = [
  ["Known Issues", /\b(known issue|still broken|needs investigation|regression)\b/i],
  ["Next", /\b(next|roadmap|todo|later|maybe|planned)\b/i],
  ["Fixed", /\b(fixed|fix|bug|crash|error|broken|issue)\b/i],
  ["Added", /\b(added|add|new|created|create|demo mode)\b/i],
  ["Removed", /\b(removed|remove|deleted|delete|deprecated)\b/i],
  ["Improved", /\b(improved|improve|polish|cleaned|cleanup|faster|better)\b/i],
  ["Changed", /\b(changed|change|updated|update|refactor|rework|mention|clarified|onboarding)\b/i],
];

const acronyms = new Map([
  ["api", "API"],
  ["dmg", "DMG"],
  ["ui", "UI"],
  ["ux", "UX"],
  ["json", "JSON"],
  ["md", "Markdown"],
  ["github", "GitHub"],
  ["mac", "Mac"],
  ["windows", "Windows"],
]);

export function emptyParsedChanges(): ParsedChanges {
  return categories.reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {} as ParsedChanges);
}

export function parseProgressNotes(input: string): ParsedChanges {
  const grouped = emptyParsedChanges();
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const category = classifyLine(line);
    grouped[category].push(toReadableSentence(line, category));
  }

  return grouped;
}

export function classifyLine(line: string): ChangeCategory {
  for (const [category, pattern] of keywordMap) {
    if (pattern.test(line)) {
      return category;
    }
  }

  return "Notes";
}

export function hasParsedContent(parsed: ParsedChanges) {
  return categories.some((category) => parsed[category].length > 0);
}

export function cloneParsedChanges(parsed: ParsedChanges): ParsedChanges {
  return categories.reduce((acc, category) => {
    acc[category] = [...parsed[category]];
    return acc;
  }, {} as ParsedChanges);
}

export function toReadableSentence(line: string, category: ChangeCategory) {
  let sentence = line
    .replace(/^[-*]\s*/, "")
    .replace(/^(feat|feature|chore|fix|bugfix|bug|docs|todo)\b\s*[:\-]?\s*/i, "")
    .replace(/^(maybe\s+)?roadmap\s*[:\-]?\s*/i, "")
    .replace(/^need to mention\s+/i, "clarified ")
    .replace(/^need to\s+/i, "")
    .trim();

  sentence = sentence.replace(/\s+/g, " ");
  sentence = normalizeWords(sentence);

  if (!/^(Added|Fixed|Updated|Changed|Improved|Removed|Clarified|Created|Cleaned|Deprecated)\b/i.test(sentence)) {
    sentence = addCategoryVerb(sentence, category);
  }

  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

  if (!/[.!?]$/.test(sentence)) {
    sentence += ".";
  }

  return sentence;
}

function addCategoryVerb(sentence: string, category: ChangeCategory) {
  const trimmed = stripLeadingKeyword(sentence);

  switch (category) {
    case "Added":
      return `Added ${trimmed}`;
    case "Fixed":
      return `Fixed ${trimmed}`;
    case "Changed":
      return `Updated ${trimmed}`;
    case "Improved":
      return `Improved ${trimmed}`;
    case "Removed":
      return `Removed ${trimmed}`;
    case "Next":
      return `Add ${trimmed}`;
    case "Known Issues":
      return `Known issue: ${trimmed}`;
    default:
      return trimmed;
  }
}

function stripLeadingKeyword(sentence: string) {
  let trimmed = sentence.trim();

  for (let index = 0; index < 3; index += 1) {
    const next = trimmed
      .replace(/^(added|created|changed|updated|improved|cleaned|cleanup|removed|fixed|add|new|create|fix|bug|change|update|improve|polish|remove|todo|next|later|maybe)\s+/i, "")
      .replace(/^up\s+/i, "")
      .trim();

    if (next === trimmed) {
      break;
    }

    trimmed = next;
  }

  return trimmed;
}

function normalizeWords(sentence: string) {
  return sentence
    .split(" ")
    .map((word) => {
      const cleaned = word.replace(/[^a-z0-9]/gi, "").toLowerCase();
      return acronyms.get(cleaned) ?? word;
    })
    .join(" ");
}

export const changeCategories = categories;
