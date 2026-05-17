import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Eyebrow({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.22em] text-primary/90",
        className,
      )}
      {...props}
    />
  );
}

export function Heading({
  level = 2,
  className,
  gradient = false,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3;
  gradient?: boolean;
}) {
  const Tag = `h${level}` as ElementType;

  return (
    <Tag
      className={cn(
        "font-display font-semibold tracking-normal text-white",
        level === 1 && "text-5xl leading-[0.96] sm:text-6xl lg:text-7xl",
        level === 2 && "text-3xl leading-tight sm:text-4xl lg:text-5xl",
        level === 3 && "text-xl leading-7 sm:text-2xl",
        gradient && "text-gradient",
        className,
      )}
      {...props}
    />
  );
}

export function Lead({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-base leading-8 text-white/66 sm:text-lg", className)}
      {...props}
    />
  );
}
