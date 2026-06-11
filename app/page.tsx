"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight, RotateCcw, Wand2 } from "lucide-react";
import { AiSettingsPanel } from "@/components/AiSettingsPanel";
import { AppShell } from "@/components/AppShell";
import { AudienceSelector } from "@/components/AudienceSelector";
import { ExportActions } from "@/components/ExportActions";
import { GroupedChangesPreview } from "@/components/GroupedChangesPreview";
import { HistoryPanel } from "@/components/HistoryPanel";
import { InputPanel } from "@/components/InputPanel";
import { OutputModeSelector } from "@/components/OutputModeSelector";
import { OutputPanel } from "@/components/OutputPanel";
import { SecretNotice } from "@/components/SecretNotice";
import { ToneSelector } from "@/components/ToneSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { demoInput, demoSettings } from "@/lib/demo";
import { addHistoryItem, clearHistory, loadHistory, saveHistory } from "@/lib/history";
import { EMPTY_INPUT_MESSAGE, generateUpdateMarkdown, renderUpdateMarkdown } from "@/lib/markdownGenerator";
import { rewriteWithOptionalAi } from "@/lib/aiRewrite";
import { emptyParsedChanges, hasParsedContent } from "@/lib/changelogParser";
import type { AiSettings, Audience, HistoryItem, OutputMode, ParsedChanges, Tone } from "@/lib/types";

export default function Home() {
  const [input, setInput] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [parsed, setParsed] = useState<ParsedChanges>(() => emptyParsedChanges());
  const [mode, setMode] = useState<OutputMode>("Changelog");
  const [tone, setTone] = useState<Tone>("Clear");
  const [audience, setAudience] = useState<Audience>("Users");
  const [redacted, setRedacted] = useState(false);
  const [redactionCount, setRedactionCount] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [aiSettings, setAiSettings] = useState<AiSettings>({
    engine: "Template",
    endpoint: "http://localhost:11434/v1/chat/completions",
    model: "llama3.1",
    apiKey: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");
  const [readingDirection, setReadingDirection] = useState<"ltr" | "rtl">("ltr");

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  async function generate(nextInput = input) {
    setStatus("");
    setIsGenerating(true);
    const result = generateUpdateMarkdown({
      input: nextInput,
      mode,
      tone,
      audience,
    });
    setParsed(result.parsed);
    setRedacted(result.redacted);
    setRedactionCount(result.redactionCount);

    const finalMarkdown = await completeGeneration({
      draft: result.markdown,
      nextParsed: result.parsed,
      nextMode: mode,
      nextTone: tone,
      nextAudience: audience,
    });

    setMarkdown(finalMarkdown);
    remember(finalMarkdown, mode, tone, audience);
    setIsGenerating(false);
  }

  async function loadDemo() {
    setInput(demoInput);
    setMode(demoSettings.mode);
    setTone(demoSettings.tone);
    setAudience(demoSettings.audience);
    const result = generateUpdateMarkdown({
      input: demoInput,
      mode: demoSettings.mode,
      tone: demoSettings.tone,
      audience: demoSettings.audience,
    });
    setParsed(result.parsed);
    setRedacted(result.redacted);
    setRedactionCount(result.redactionCount);

    const finalMarkdown = await completeGeneration({
      draft: result.markdown,
      nextParsed: result.parsed,
      nextMode: demoSettings.mode,
      nextTone: demoSettings.tone,
      nextAudience: demoSettings.audience,
    });

    setMarkdown(finalMarkdown);
    remember(finalMarkdown, demoSettings.mode, demoSettings.tone, demoSettings.audience);
  }

  async function regenerateFromGrouped() {
    setStatus("");
    const draft = renderUpdateMarkdown({
      parsed,
      mode,
      tone,
      audience,
    });
    setIsGenerating(true);
    const finalMarkdown = await completeGeneration({
      draft,
      nextParsed: parsed,
      nextMode: mode,
      nextTone: tone,
      nextAudience: audience,
    });
    setMarkdown(finalMarkdown);
    remember(finalMarkdown, mode, tone, audience);
    setIsGenerating(false);
  }

  async function completeGeneration({
    draft,
    nextParsed,
    nextMode,
    nextTone,
    nextAudience,
  }: {
    draft: string;
    nextParsed: ParsedChanges;
    nextMode: OutputMode;
    nextTone: Tone;
    nextAudience: Audience;
  }) {
    if (draft === EMPTY_INPUT_MESSAGE || !hasParsedContent(nextParsed)) {
      return draft;
    }

    try {
      return await rewriteWithOptionalAi({
        settings: aiSettings,
        parsed: nextParsed,
        mode: nextMode,
        tone: nextTone,
        audience: nextAudience,
        draft,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI rewrite failed.";
      setStatus(`${message} Showing the local template output instead.`);
      return draft;
    }
  }

  function remember(nextMarkdown: string, nextMode: OutputMode, nextTone: Tone, nextAudience: Audience) {
    if (!nextMarkdown.trim() || nextMarkdown === EMPTY_INPUT_MESSAGE) {
      return;
    }

    const nextHistory = addHistoryItem({
      items: history,
      markdown: nextMarkdown,
      mode: nextMode,
      tone: nextTone,
      audience: nextAudience,
    });
    setHistory(nextHistory);
    saveHistory(nextHistory);
  }

  function restoreHistory(item: HistoryItem) {
    setMarkdown(item.markdown);
    setMode(item.mode);
    setTone(item.tone);
    setAudience(item.audience);
    setStatus("Restored a local history item.");
  }

  function clearLocalHistory() {
    clearHistory();
    setHistory([]);
  }

  function clearAll() {
    setInput("");
    setMarkdown("");
    setParsed(emptyParsedChanges());
    setRedacted(false);
    setRedactionCount(0);
    setStatus("");
  }

  return (
    <AppShell>
      <div className="mb-3 flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setReadingDirection((value) => (value === "ltr" ? "rtl" : "ltr"))}
        >
          <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
          {readingDirection === "ltr" ? "Left to right" : "Right to left"}
        </Button>
      </div>

      <div
        className="grid gap-4 lg:grid-cols-[22rem_minmax(0,1fr)_minmax(0,1fr)]"
        dir={readingDirection}
      >
        <Card className={readingDirection === "ltr" ? "space-y-4 p-4 lg:order-1" : "space-y-4 p-4 lg:order-3"}>
          <div>
            <h2 className="text-lg font-semibold">Select your update</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Choose the format, tone, audience, and rewrite path.
            </p>
          </div>

          <div className="rounded-lg border bg-background/38 p-3">
            <div className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Flow
            </div>
            <div className="grid gap-2 text-sm">
              <div className="rounded-md bg-muted/65 px-3 py-2">Select input</div>
              <div className="rounded-md bg-muted/65 px-3 py-2">Paste progress</div>
              <div className="rounded-md bg-primary/15 px-3 py-2 text-foreground">
                Get update
              </div>
            </div>
          </div>

          <OutputModeSelector value={mode} onChange={setMode} />
          <ToneSelector value={tone} onChange={setTone} />
          <AudienceSelector value={audience} onChange={setAudience} />

          <GroupedChangesPreview parsed={parsed} onChange={setParsed} />

          <AiSettingsPanel
            settings={aiSettings}
            onChange={setAiSettings}
            isGenerating={isGenerating}
          />

          {redacted ? <SecretNotice count={redactionCount} /> : null}
          {status ? (
            <div className="rounded-md border bg-muted/45 px-3 py-2 text-xs leading-5 text-muted-foreground">
              {status}
            </div>
          ) : null}

          <Button type="button" className="w-full" onClick={() => generate()} disabled={isGenerating}>
            <Wand2 className="h-4 w-4" aria-hidden="true" />
            {isGenerating ? "Stacking..." : "Stack Update"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={regenerateFromGrouped}
            disabled={isGenerating || !hasParsedContent(parsed)}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Regenerate as {mode}
          </Button>

          <ExportActions markdown={markdown} onClear={clearAll} onLoadDemo={loadDemo} />

          <HistoryPanel items={history} onRestore={restoreHistory} onClear={clearLocalHistory} />
        </Card>

        <Card className="p-4 lg:order-2">
          <InputPanel value={input} onChange={setInput} />
        </Card>

        <Card className={readingDirection === "ltr" ? "p-4 lg:order-3" : "p-4 lg:order-1"}>
          <OutputPanel markdown={markdown} />
        </Card>
      </div>
    </AppShell>
  );
}
