import { describe, expect, it } from "vitest";
import { classifyLine, parseProgressNotes } from "@/lib/changelogParser";

describe("changelog parser", () => {
  it("groups added, fixed, changed, and todo lines", () => {
    const parsed = parseProgressNotes(`added demo mode
fixed dmg export bug
updated onboarding copy
todo github release format`);

    expect(parsed.Added[0]).toBe("Added demo mode.");
    expect(parsed.Fixed[0]).toBe("Fixed DMG export bug.");
    expect(parsed.Changed[0]).toBe("Updated onboarding copy.");
    expect(parsed.Next[0]).toBe("Add GitHub release format.");
  });

  it("places uncertain lines in notes", () => {
    expect(classifyLine("research packaging constraints")).toBe("Notes");
  });
});
