import { REDACTION, redactSecrets } from "./redaction";
import type { Audience, HistoryItem, OutputMode, Tone } from "./types";

const HISTORY_KEY = "patchstack.history.v1";
const HISTORY_LIMIT = 5;

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    return stored ? (JSON.parse(stored) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, HISTORY_LIMIT)));
}

export function clearHistory() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(HISTORY_KEY);
}

export function addHistoryItem({
  items,
  markdown,
  mode,
  tone,
  audience,
}: {
  items: HistoryItem[];
  markdown: string;
  mode: OutputMode;
  tone: Tone;
  audience: Audience;
}) {
  const safeMarkdown = redactSecrets(markdown).input;

  if (!safeMarkdown.trim() || !safeMarkdown.includes(REDACTION) && safeMarkdown.length < 8) {
    return items;
  }

  const next: HistoryItem = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    mode,
    tone,
    audience,
    markdown: safeMarkdown,
  };

  return [next, ...items].slice(0, HISTORY_LIMIT);
}
