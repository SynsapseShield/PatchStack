"use client";

import { motion } from "framer-motion";
import { Layers3 } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
      <header className="mb-4 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-md border bg-card/70 px-3 py-1 text-xs text-muted-foreground">
            <Layers3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Local-first MVP
          </div>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
            PatchStack
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Turn development chaos into shippable updates.
          </p>
        </div>
        <div className="max-w-md text-xs leading-5 text-muted-foreground">
          PatchStack runs locally for this MVP. Review notes before using any
          future AI-assisted mode, especially if they include private, client,
          workplace, legal, medical, financial, or security-sensitive
          information.
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="flex-1"
      >
        {children}
      </motion.div>
    </main>
  );
}
