import { describe, expect, it } from "vitest";
import { REDACTION, redactSecrets } from "@/lib/redaction";

describe("secret redaction", () => {
  it("redacts env-style secrets and bearer tokens", () => {
    const result = redactSecrets(`OPENAI_API_KEY=sk_test_abcdefghijklmnopqrstuvwxyz
Authorization: Bearer abcdefghijklmnopqrstuvwxyz123456`);

    expect(result.redacted).toBe(true);
    expect(result.count).toBe(2);
    expect(result.input).toContain(`OPENAI_API_KEY=${REDACTION}`);
    expect(result.input).toContain(`Authorization: ${REDACTION}`);
    expect(result.input).not.toContain("abcdefghijklmnopqrstuvwxyz123456");
  });

  it("redacts JSON token fields", () => {
    const result = redactSecrets(`{"apiKey":"secret_value_here","name":"demo"}`);

    expect(result.input).toContain(`"apiKey":"${REDACTION}"`);
    expect(result.input).not.toContain("secret_value_here");
  });
});
