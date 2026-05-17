"use client";

import { motion } from "framer-motion";
import { ArrowRight, GitBranch } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

type RepositoryStatus = "Analyzed" | "Docs Generated" | "Debugging Needed";

const statusTone: Record<RepositoryStatus, "success" | "violet" | "warning"> = {
  Analyzed: "success",
  "Docs Generated": "violet",
  "Debugging Needed": "warning",
};

export function RepositoryCard({
  name,
  tech,
  status,
  lastScanned,
}: {
  name: string;
  tech: string[];
  status: RepositoryStatus;
  lastScanned: string;
}) {
  return (
    <motion.div
      className="group relative grid gap-4 rounded-card border border-white/10 bg-white/[0.055] p-4 shadow-inner-line backdrop-blur-2xl transition duration-300 hover:border-primary/25 hover:bg-white/[0.075] md:grid-cols-[1fr_auto]"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
            <GitBranch aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold text-white">
              {name}
            </h3>
            <p className="text-sm text-white/42">Last scanned {lastScanned}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tech.map((item) => (
            <StatusBadge key={item} tone="neutral">
              {item}
            </StatusBadge>
          ))}
          <StatusBadge tone={statusTone[status]}>{status}</StatusBadge>
        </div>
      </div>
      <button
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm font-medium text-white/72 transition hover:border-primary/30 hover:bg-primary/10 hover:text-white"
        type="button"
      >
        View Analysis
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>
    </motion.div>
  );
}
