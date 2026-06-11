const REDACTION = "[REDACTED_SECRET]";

const secretPatterns: RegExp[] = [
  /\bAuthorization\s*:\s*(?:Bearer|Basic)?\s*[A-Za-z0-9._~+/=-]{12,}/gi,
  /\bBearer\s+[A-Za-z0-9._~+/=-]{12,}\b/gi,
  /\b(sk|pk|rk|ghp|github_pat|glpat|xox[baprs])_[A-Za-z0-9_=-]{12,}\b/gi,
  /\b[A-Za-z0-9._%+-]+:[A-Za-z0-9._%+-]{12,}@/g,
  /\b([A-Z0-9_]*(?:API[_-]?KEY|TOKEN|SECRET|PASSWORD|AUTH)[A-Z0-9_]*)\s*=\s*["']?[^"'\s]+["']?/gi,
  /(["'](?:apiKey|api_key|token|secret|password|authorization)["']\s*:\s*)["'][^"']+["']/gi,
];

export function redactSecrets(input: string) {
  let redacted = input;
  let count = 0;

  for (const pattern of secretPatterns) {
    redacted = redacted.replace(pattern, (match, prefix) => {
      if (match.includes(REDACTION)) {
        return match;
      }

      count += 1;

      if (typeof prefix === "string" && match.includes(":")) {
        return `${prefix}"${REDACTION}"`;
      }

      if (/=/.test(match)) {
        const [key] = match.split("=");
        return `${key}=${REDACTION}`;
      }

      if (/authorization\s*:/i.test(match)) {
        return `Authorization: ${REDACTION}`;
      }

      if (/^bearer\s+/i.test(match)) {
        return `Bearer ${REDACTION}`;
      }

      return REDACTION;
    });
  }

  return {
    input: redacted,
    redacted: redacted !== input,
    count,
  };
}

export { REDACTION };
