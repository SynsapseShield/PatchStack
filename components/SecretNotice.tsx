import { ShieldCheck } from "lucide-react";

export function SecretNotice({ count }: { count: number }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-xs leading-5 text-foreground">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      <span>
        PatchStack redacted {count} possible {count === 1 ? "secret" : "secrets"} before
        generating your update.
      </span>
    </div>
  );
}
