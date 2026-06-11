"use client";

import { KeyRound, Laptop, Sparkles } from "lucide-react";
import { SegmentedSelector } from "@/components/SegmentedSelector";
import { Button } from "@/components/ui/button";
import type { AiSettings, GenerationEngine } from "@/lib/types";

const engines = ["Template", "Local LLM", "API LLM"] as const;

export function AiSettingsPanel({
  settings,
  onChange,
  isGenerating,
}: {
  settings: AiSettings;
  onChange: (settings: AiSettings) => void;
  isGenerating: boolean;
}) {
  function update(patch: Partial<AiSettings>) {
    onChange({ ...settings, ...patch });
  }

  function useLocalDefaults() {
    update({
      engine: "Local LLM",
      endpoint: "http://localhost:11434/v1/chat/completions",
      model: settings.model || "llama3.1",
      apiKey: "",
    });
  }

  function useApiDefaults() {
    update({
      engine: "API LLM",
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: settings.model || "gpt-4.1-mini",
    });
  }

  function changeEngine(engine: GenerationEngine) {
    if (engine === "Local LLM") {
      update({
        engine,
        endpoint: settings.endpoint || "http://localhost:11434/v1/chat/completions",
        model: settings.model || "llama3.1",
        apiKey: "",
      });
      return;
    }

    if (engine === "API LLM") {
      update({
        engine,
        endpoint:
          settings.endpoint === "http://localhost:11434/v1/chat/completions"
            ? "https://api.openai.com/v1/chat/completions"
            : settings.endpoint,
        model: settings.model === "llama3.1" ? "gpt-4.1-mini" : settings.model,
      });
      return;
    }

    update({ engine });
  }

  return (
    <section className="space-y-3 rounded-lg border bg-background/38 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Rewrite Engine
          </div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Template mode is local. LLM modes send the redacted draft to the
            endpoint you choose.
          </p>
        </div>
        <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      </div>

      <SegmentedSelector
        label="Engine"
        options={engines}
        value={settings.engine}
        onChange={changeEngine}
      />

      {settings.engine !== "Template" ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={useLocalDefaults}>
              <Laptop className="h-4 w-4" aria-hidden="true" />
              Local
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={useApiDefaults}>
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              API
            </Button>
          </div>

          <label className="block space-y-1 text-xs text-muted-foreground">
            <span>Endpoint</span>
            <input
              value={settings.endpoint}
              onChange={(event) => update({ endpoint: event.target.value })}
              className="h-9 w-full rounded-md border bg-background px-3 text-xs text-foreground"
              placeholder="http://localhost:11434/v1/chat/completions"
              disabled={isGenerating}
            />
          </label>

          <label className="block space-y-1 text-xs text-muted-foreground">
            <span>Model</span>
            <input
              value={settings.model}
              onChange={(event) => update({ model: event.target.value })}
              className="h-9 w-full rounded-md border bg-background px-3 text-xs text-foreground"
              placeholder="llama3.1 or provider model"
              disabled={isGenerating}
            />
          </label>

          {settings.engine === "API LLM" ? (
            <label className="block space-y-1 text-xs text-muted-foreground">
              <span>API key</span>
              <input
                value={settings.apiKey}
                onChange={(event) => update({ apiKey: event.target.value })}
                className="h-9 w-full rounded-md border bg-background px-3 text-xs text-foreground"
                placeholder="Stored in memory only"
                type="password"
                disabled={isGenerating}
              />
            </label>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
