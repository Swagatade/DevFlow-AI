"use client";

import { Menu, Server, Sparkles } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export function Topbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-background/78 backdrop-blur-2xl">
      <div className="flex min-h-16 flex-wrap items-center gap-3 px-4 py-3 sm:px-6 xl:px-8">
        <button
          type="button"
          aria-label="Open sidebar"
          className="flex size-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-white/70 lg:hidden"
          onClick={onOpenMobile}
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
            <Sparkles aria-hidden="true" className="size-3.5" />
            DevFlow AI
          </p>
          <h1 className="truncate font-display text-lg font-semibold text-white">
            Repository Analyzer
          </h1>
        </div>

        <StatusBadge tone="info" className="gap-1.5">
          <Server aria-hidden="true" className="size-3.5" />
          Local backend
        </StatusBadge>
      </div>
    </header>
  );
}
