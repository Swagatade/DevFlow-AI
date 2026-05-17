import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import type { WithChildren } from "@/types/ui";

export function AuthShell({ children }: WithChildren) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-aurora-mesh">
      <div className="absolute inset-0 futuristic-grid opacity-35" aria-hidden="true" />
      <div className="absolute inset-0 noise-overlay opacity-20" aria-hidden="true" />
      <Container
        className="relative flex min-h-screen items-center justify-center py-8"
        size="lg"
      >
        <div className="grid w-full gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <aside className="hidden lg:block">
            <Link href="/" className="mb-10 inline-flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-md border border-primary/30 bg-primary/12 shadow-glow">
                <Sparkles aria-hidden="true" className="size-4 text-primary" />
              </span>
              <span className="font-display text-lg font-semibold text-white">
                DevFlow AI
              </span>
            </Link>
            <p className="max-w-xl font-display text-5xl font-semibold leading-tight tracking-normal text-white">
              Build, review, deploy, and observe with one AI-native command layer.
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {["Agentic PRs", "RAG Memory", "Release Guard"].map((item) => (
                <div
                  key={item}
                  className="glass-panel rounded-card px-4 py-3 text-sm text-white/72"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>
          {children}
        </div>
      </Container>
    </main>
  );
}
