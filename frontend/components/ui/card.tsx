import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import type { StatusTone } from "@/types/ui";

const toneClass: Record<StatusTone, string> = {
  cyan: "from-cyan-300/18 to-cyan-300/0 text-cyan-100",
  mint: "from-emerald-300/18 to-emerald-300/0 text-emerald-100",
  violet: "from-violet-300/18 to-violet-300/0 text-violet-100",
  amber: "from-amber-300/18 to-amber-300/0 text-amber-100",
  rose: "from-rose-300/18 to-rose-300/0 text-rose-100",
};

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass-panel rounded-card", className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2 p-5 sm:p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-display text-base font-semibold leading-6 tracking-normal text-white",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-6 text-white/62", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5 sm:px-6 sm:pb-6", className)} {...props} />;
}

export function MetricCard({
  label,
  value,
  meta,
  tone = "cyan",
}: {
  label: string;
  value: string;
  meta: string;
  tone?: StatusTone;
}) {
  return (
    <Card className={cn("overflow-hidden bg-gradient-to-br", toneClass[tone])}>
      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/46">
          {label}
        </p>
        <p className="mt-4 font-display text-3xl font-semibold tracking-normal text-white">
          {value}
        </p>
        <p className="mt-2 text-sm text-white/58">{meta}</p>
      </div>
    </Card>
  );
}
