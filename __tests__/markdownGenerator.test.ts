import { describe, expect, it } from "vitest";
import { demoInput, demoSettings } from "@/lib/demo";
import { EMPTY_INPUT_MESSAGE, generateUpdateMarkdown, renderUpdateMarkdown } from "@/lib/markdownGenerator";
import { REDACTION } from "@/lib/redaction";

describe("markdown generation", () => {
  it("generates structured changelog markdown", () => {
    const result = generateUpdateMarkdown({
      input: `fixed dmg export bug
added demo mode
updated onboarding copy
todo github release format`,
      mode: "Changelog",
      tone: "Clear",
      audience: "Users",
    });

    expect(result.markdown).toContain("## Changelog");
    expect(result.markdown).toContain("### Added");
    expect(result.markdown).toContain("- Added demo mode.");
    expect(result.markdown).toContain("### Fixed");
    expect(result.markdown).toContain("- Fixed DMG export bug.");
    expect(result.markdown).toContain("### Next");
  });

  it("does not include raw secrets in generated output", () => {
    const result = generateUpdateMarkdown({
      input: "fixed API handling\nAPI_KEY=super_secret_value_123456789",
      mode: "Changelog",
      tone: "Clear",
      audience: "Developers",
    });

    expect(result.redacted).toBe(true);
    expect(result.markdown).toContain(REDACTION);
    expect(result.markdown).not.toContain("super_secret_value_123456789");
  });

  it("handles empty input", () => {
    const result = generateUpdateMarkdown({
      input: "",
      mode: "Changelog",
      tone: "Clear",
      audience: "Users",
    });

    expect(result.markdown).toBe(EMPTY_INPUT_MESSAGE);
  });

  it("generates output from demo content", () => {
    const result = generateUpdateMarkdown({
      input: demoInput,
      ...demoSettings,
    });

    expect(result.markdown).toContain("## Changelog");
    expect(result.markdown).toContain("first-run privacy screen");
    expect(result.markdown).toContain("Discord update template");
  });

  it("renders markdown from edited grouped changes", () => {
    const parsed = generateUpdateMarkdown({
      input: "fixed export bug",
      mode: "Changelog",
      tone: "Clear",
      audience: "Users",
    }).parsed;

    parsed.Fixed = [];
    parsed.Changed = ["Updated export behavior."];

    const markdown = renderUpdateMarkdown({
      parsed,
      mode: "Release Notes",
      tone: "Clear",
      audience: "Users",
    });

    expect(markdown).toContain("## Release Notes");
    expect(markdown).toContain("### Changed");
    expect(markdown).toContain("- Updated export behavior.");
    expect(markdown).not.toContain("### Fixed");
  });
});
