"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function InsightCard({
  icon: Icon,
  title,
  insight,
}: {
  icon: LucideIcon;
  title: string;
  insight: string;
}) {
  return (
    <motion.div
      className="group relative h-full overflow-hidden rounded-card border border-white/10 bg-white/[0.055] p-5 shadow-inner-line backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white/[0.075]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="data-spark data-spark-hover" />
      <span className="flex size-10 items-center justify-center rounded-md border border-primary/25 bg-primary/12 text-primary">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <h3 className="mt-4 font-display text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/58">{insight}</p>
    </motion.div>
  );
}
