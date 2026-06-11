"use client";

import { Clipboard, Download, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDownloadFilename, makeMarkdownBlob } from "@/lib/exportMarkdown";

export function ExportActions({
  markdown,
  onClear,
  onLoadDemo,
}: {
  markdown: string;
  onClear: () => void;
  onLoadDemo: () => void;
}) {
  const hasMarkdown = Boolean(markdown.trim());

  async function copyMarkdown() {
    if (!hasMarkdown) {
      return;
    }

    await navigator.clipboard.writeText(markdown);
  }

  function downloadMarkdown() {
    if (!hasMarkdown) {
      return;
    }

    const blob = makeMarkdownBlob(markdown);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = getDownloadFilename();
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="secondary" onClick={copyMarkdown} disabled={!hasMarkdown}>
        <Clipboard className="h-4 w-4" aria-hidden="true" />
        Copy Markdown
      </Button>
      <Button type="button" variant="secondary" onClick={downloadMarkdown} disabled={!hasMarkdown}>
        <Download className="h-4 w-4" aria-hidden="true" />
        Download .md
      </Button>
      <Button type="button" variant="outline" onClick={onClear}>
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Clear
      </Button>
      <Button type="button" variant="outline" onClick={onLoadDemo}>
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        Load Demo
      </Button>
    </div>
  );
}
