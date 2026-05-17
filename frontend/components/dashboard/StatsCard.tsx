"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";

const toneClasses = {
  cyan: "from-cyan-300/18 text-cyan-100",
  mint: "from-emerald-300/18 text-emerald-100",
  violet: "from-violet-300/18 text-violet-100",
  amber: "from-amber-300/18 text-amber-100",
} as const;

export function StatsCard({
  icon: Icon,
  value,
  label,
  trend,
  tone = "cyan",
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  trend: string;
  tone?: keyof typeof toneClasses;
}) {
  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-card border border-white/10 bg-gradient-to-br to-transparent p-5 shadow-inner-line backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.075]",
        toneClasses[tone],
      )}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="data-spark data-spark-hover" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white/48">{label}</p>
          <p className="mt-3 font-display text-4xl font-semibold text-white">{value}</p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.07] shadow-glow">
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs font-medium text-emerald-100/86">
        <TrendingUp aria-hidden="true" className="size-3.5" />
        {trend}
      </div>
    </motion.div>
  );
}
