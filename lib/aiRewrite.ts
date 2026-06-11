import { formatGroupedChanges } from "./markdownGenerator";
import type { AiSettings, Audience, OutputMode, ParsedChanges, Tone } from "./types";

export async function rewriteWithOptionalAi({
  settings,
  parsed,
  mode,
  tone,
  audience,
  draft,
}: {
  settings: AiSettings;
  parsed: ParsedChanges;
  mode: OutputMode;
  tone: Tone;
  audience: Audience;
  draft: string;
}) {
  if (settings.engine === "Template") {
    return draft;
  }

  const endpoint = settings.endpoint.trim();
  const model = settings.model.trim();

  if (!endpoint || !model) {
    throw new Error("Add an endpoint and model before using AI-assisted rewrite.");
  }

  if (settings.engine === "API LLM" && !settings.apiKey.trim()) {
    throw new Error("Add an API key before using API LLM mode.");
  }

  const prompt = buildRewritePrompt({
    parsed,
    mode,
    tone,
    audience,
    draft,
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(settings.apiKey.trim()
        ? { Authorization: `Bearer ${settings.apiKey.trim()}` }
        : {}),
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You rewrite development progress notes into concise updates. Do not invent features, dates, metrics, customer claims, or certainty. Preserve Markdown structure. Keep the output calm and practical.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed with ${response.status}.`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("The AI endpoint returned an empty response.");
  }

  return content.trim();
}

function buildRewritePrompt({
  parsed,
  mode,
  tone,
  audience,
  draft,
}: {
  parsed: ParsedChanges;
  mode: OutputMode;
  tone: Tone;
  audience: Audience;
  draft: string;
}) {
  return `Rewrite this PatchStack update.

Output type: ${mode}
Tone: ${tone}
Audience: ${audience}

Grouped source changes:
${formatGroupedChanges(parsed)}

Current template draft:
${draft}

Rules:
- Keep the same meaning.
- Do not add features or promises.
- Keep likely secrets redacted.
- Keep the format useful for ${mode}.
- Return only the final Markdown/text.`;
}
