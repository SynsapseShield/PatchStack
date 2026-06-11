import { redactSecrets } from "./redaction";

export function makeMarkdownBlob(markdown: string) {
  const { input } = redactSecrets(markdown);
  return new Blob([input], { type: "text/markdown;charset=utf-8" });
}

export function getDownloadFilename() {
  const date = new Date().toISOString().slice(0, 10);
  return `patchstack-update-${date}.md`;
}
