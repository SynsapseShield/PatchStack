import { describe, expect, it } from "vitest";
import { addHistoryItem } from "@/lib/history";
import { REDACTION } from "@/lib/redaction";
import type { HistoryItem } from "@/lib/types";

describe("local history", () => {
  it("stores generated markdown without raw secrets", () => {
    const items = addHistoryItem({
      items: [],
      markdown: "## Changelog\n\nAPI_KEY=super_secret_value_123456789",
      mode: "Changelog",
      tone: "Clear",
      audience: "Users",
    });

    expect(items).toHaveLength(1);
    expect(items[0].markdown).toContain(REDACTION);
    expect(items[0].markdown).not.toContain("super_secret_value_123456789");
  });

  it("keeps only the latest five updates", () => {
    let items: HistoryItem[] = [];

    for (let index = 0; index < 7; index += 1) {
      items = addHistoryItem({
        items,
        markdown: `## Update ${index}`,
        mode: "Changelog",
        tone: "Clear",
        audience: "Users",
      });
    }

    expect(items).toHaveLength(5);
    expect(items[0].markdown).toBe("## Update 6");
  });
});
