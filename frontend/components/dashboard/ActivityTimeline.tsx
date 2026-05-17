"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function ActivityTimeline({
  activities,
}: {
  activities: Array<{
    title: string;
    time: string;
    icon: LucideIcon;
  }>;
}) {
  return (
    <div className="relative space-y-5">
      <div
        className="absolute left-4 top-4 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-cyan-200/60 via-violet-200/30 to-emerald-200/50"
        aria-hidden="true"
      />
      {activities.map((activity, index) => (
        <motion.div
          key={activity.title}
          className="relative flex gap-4"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.22, delay: index * 0.02, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="z-10 flex size-8 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-background text-primary shadow-glow">
            <activity.icon aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.045] px-4 py-3 shadow-inner-line">
            <p className="text-sm font-medium text-white/82">{activity.title}</p>
            <p className="mt-1 text-xs text-white/42">{activity.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
