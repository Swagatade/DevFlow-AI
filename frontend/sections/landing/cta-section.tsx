import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { Heading, Lead } from "@/components/ui/typography";
import { FadeIn } from "@/components/motion/fade-in";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 py-20 sm:py-24">
      <div
        className="absolute inset-x-0 top-0 h-80 bg-radial-cyan blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative">
        <FadeIn className="gradient-border rounded-card">
          <div className="glass-panel-strong scanline overflow-hidden rounded-card p-8 text-center sm:p-12">
            <Heading className="mx-auto max-w-3xl">
              Ready to understand your codebase in minutes?
            </Heading>
            <Lead className="mx-auto mt-5 max-w-2xl">
              Accelerate developer onboarding and debugging using AI-powered repository
              intelligence.
            </Lead>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup" className={buttonVariants({ size: "lg" })}>
                Start Free
                <ArrowRight aria-hidden="true" className="size-5" />
              </Link>
              <Link
                href="/#documentation"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                <BookOpenText aria-hidden="true" className="size-5" />
                View Documentation
              </Link>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
