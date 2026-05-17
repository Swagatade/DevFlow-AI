import { forwardRef, type ButtonHTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "relative overflow-hidden border border-primary/40 bg-primary text-primary-foreground shadow-glow before:absolute before:inset-y-0 before:left-[-80%] before:w-1/2 before:bg-button-shine before:opacity-70 before:transition-transform before:duration-700 hover:before:translate-x-[360%]",
  secondary:
    "border border-white/10 bg-white/[0.08] text-white shadow-inner-line backdrop-blur-xl hover:bg-white/[0.12]",
  ghost: "border border-transparent text-white/72 hover:bg-white/[0.07] hover:text-white",
  outline:
    "border border-white/15 bg-transparent text-white hover:border-primary/40 hover:bg-primary/10 hover:text-white",
  danger: "border border-rose-300/30 bg-rose-400/14 text-rose-100 hover:bg-rose-400/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 gap-2 px-3 text-sm",
  md: "h-11 gap-2.5 px-4 text-sm",
  lg: "h-12 gap-3 px-5 text-base",
  icon: "size-10 p-0",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-md font-medium tracking-normal transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      className={buttonVariants({ variant, size, className })}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      ) : null}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
