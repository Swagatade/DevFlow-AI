"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bug } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

type Severity = "High" | "Medium" | "Low";

const severityTone: Record<Severity, "danger" | "warning" | "info"> = {
  High: "danger",
  Medium: "warning",
  Low: "info",
};

export function DebugSessionCard({
  title,
  description,
  severity,
  timestamp,
  status,
}: {
  title: string;
  description: string;
  severity: Severity;
  timestamp: string;
  status: string;
}) {
  return (
    <motion.div
      className="group rounded-card border border-white/10 bg-white/[0.055] p-4 shadow-inner-line backdrop-blur-2xl transition duration-300 hover:border-primary/25 hover:bg-white/[0.075]"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-rose-200/20 bg-rose-300/10 text-rose-100">
            <Bug aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold text-white">
              {title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-white/54">{description}</p>
          </div>
        </div>
        <StatusBadge tone={severityTone[severity]}>{severity}</StatusBadge>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div>
          <p className="text-xs text-white/38">{timestamp}</p>
          <p className="mt-1 text-sm text-white/68">{status}</p>
        </div>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm font-medium text-white/68 transition hover:border-primary/30 hover:bg-primary/10 hover:text-white"
          type="button"
        >
          View
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </motion.div>
  );
}
