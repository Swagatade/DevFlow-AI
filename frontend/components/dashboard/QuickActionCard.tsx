"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function QuickActionCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <motion.button
      className="group relative h-full overflow-hidden rounded-card border border-white/10 bg-white/[0.055] p-5 text-left shadow-inner-line backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10"
      type="button"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="data-spark data-spark-hover" />
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/12 text-primary shadow-glow">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 text-white/32 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
        />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/56">{description}</p>
    </motion.button>
  );
}
