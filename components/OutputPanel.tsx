"use client";

import { motion } from "framer-motion";

export function OutputPanel({ markdown }: { markdown: string }) {
  return (
    <section className="flex h-full min-h-[24rem] flex-col space-y-2">
      <div>
        <h2 className="text-lg font-semibold">Ready-to-share update</h2>
        <p className="text-sm text-muted-foreground">
          Your ready-to-share update will appear here.
        </p>
      </div>
      <motion.div
        key={markdown || "empty"}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="min-h-[18rem] flex-1 whitespace-pre-wrap rounded-lg border bg-background/45 p-4 font-mono text-sm leading-6 text-foreground shadow-inner"
      >
        {markdown || (
          <span className="text-muted-foreground">
            Your ready-to-share update will appear here.
          </span>
        )}
      </motion.div>
    </section>
  );
}
