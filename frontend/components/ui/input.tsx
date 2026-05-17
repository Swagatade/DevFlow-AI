import { forwardRef, type InputHTMLAttributes, type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-sm font-medium text-white/82", className)} {...props} />
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm text-white placeholder:text-white/35 shadow-inner-line transition duration-200 hover:border-white/16 focus:border-primary/55 focus:ring-primary/30",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
