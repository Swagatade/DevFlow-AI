import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type StatusTone = "success" | "warning" | "danger" | "info" | "violet" | "neutral";

const toneClasses: Record<StatusTone, string> = {
  success: "border-emerald-200/20 bg-emerald-300/10 text-emerald-100",
  warning: "border-amber-200/20 bg-amber-300/10 text-amber-100",
  danger: "border-rose-200/20 bg-rose-300/10 text-rose-100",
  info: "border-cyan-200/20 bg-cyan-300/10 text-cyan-100",
  violet: "border-violet-200/20 bg-violet-300/10 text-violet-100",
  neutral: "border-white/10 bg-white/[0.07] text-white/64",
};

export function StatusBadge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: StatusTone }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
