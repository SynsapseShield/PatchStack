"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DemoButton({ onLoadDemo }: { onLoadDemo: () => void }) {
  return (
    <Button type="button" variant="outline" onClick={onLoadDemo}>
      <Sparkles className="h-4 w-4" aria-hidden="true" />
      Load Demo
    </Button>
  );
}
