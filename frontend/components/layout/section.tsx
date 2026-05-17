import type { HTMLAttributes } from "react";
import { Container } from "@/components/layout/container";
import { Eyebrow, Heading, Lead } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

type SectionProps = HTMLAttributes<HTMLElement> & {
  contained?: boolean;
};

export function Section({ className, contained = true, children, ...props }: SectionProps) {
  const content = contained ? <Container>{children}</Container> : children;

  return (
    <section className={cn("relative py-24 sm:py-28", className)} {...props}>
      {content}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading className="mt-4">{title}</Heading>
      <Lead className="mt-5">{description}</Lead>
    </div>
  );
}
