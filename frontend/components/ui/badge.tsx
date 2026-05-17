import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "cyan" | "mint" | "violet" | "amber" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  cyan: "border-cyan-200/20 bg-cyan-300/10 text-cyan-100",
  mint: "border-emerald-200/20 bg-emerald-300/10 text-emerald-100",
  violet: "border-violet-200/20 bg-violet-300/10 text-violet-100",
  amber: "border-amber-200/20 bg-amber-300/10 text-amber-100",
  neutral: "border-white/10 bg-white/[0.07] text-white/72",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
