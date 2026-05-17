"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function GradientButton({
  className,
  children,
  icon,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon?: ReactNode }) {
  return (
    <button
      className={cn(
        "group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      type="button"
      {...props}
    >
      {children}
      {icon ?? (
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition group-hover:translate-x-0.5"
        />
      )}
    </button>
  );
}
