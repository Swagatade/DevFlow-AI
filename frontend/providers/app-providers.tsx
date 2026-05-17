"use client";

import { MotionConfig } from "framer-motion";
import type { WithChildren } from "@/types/ui";

export function AppProviders({ children }: WithChildren) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    >
      {children}
    </MotionConfig>
  );
}
