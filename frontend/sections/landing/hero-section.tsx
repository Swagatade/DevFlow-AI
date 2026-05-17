import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Bug,
  Command,
  GitBranch,
  Network,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Heading, Lead } from "@/components/ui/typography";
import { FadeIn } from "@/components/motion/fade-in";
import { HeroScene } from "@/sections/landing/hero-scene";

const insights = [
  { label: "Files indexed", value: "12,482" },
  { label: "Dependency edges", value: "38,910" },
  { label: "Potential bugs", value: "24" },
];

const analysisRows = [
  ["parse", "Tree-sitter extracted ASTs across TypeScript, Python, and Go"],
  ["embed", "ChromaDB clustered services, APIs, config, and docs semantically"],
  ["agent", "LangGraph traced auth failure from route handler to cache adapter"],
];

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[96svh] items-center overflow-hidden pt-28">
      <HeroScene />
      <Container className="relative z-20 pb-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <FadeIn className="flex flex-col items-center">
            <Badge tone="cyan" className="mb-6">
              Open-source AI codebase intelligence
            </Badge>
            <Heading level={1} gradient className="max-w-5xl">
              Understand, Debug, and Improve Any Codebase with AI
            </Heading>
            <Lead className="mt-6 max-w-3xl">
              DevFlow AI uses AI agents, repository intelligence, and semantic code analysis
              to help developers instantly understand unfamiliar repositories, debug issues,
              generate documentation, and accelerate onboarding.
            </Lead>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup" className={buttonVariants({ size: "lg" })}>
                Start Free
                <ArrowRight aria-hidden="true" className="size-5" />
              </Link>
              <Link
                href="/#demo"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                Watch Demo
              </Link>
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mx-auto mt-14 max-w-6xl">
          <div className="gradient-border rounded-card">
            <div className="glass-panel-strong overflow-hidden rounded-card bg-surface-50/85 text-left">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-rose-300/80" />
                  <span className="size-2.5 rounded-full bg-amber-300/80" />
                  <span className="size-2.5 rounded-full bg-emerald-300/80" />
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/55">
                  <span className="size-1.5 rounded-full bg-primary status-pulse" />
                  <Command aria-hidden="true" className="size-3.5" />
                  devflow analyze github.com/acme/platform
                </div>
              </div>
              <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="scanline border-b border-white/10 p-5 lg:border-b-0 lg:border-r lg:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-md border border-cyan-200/20 bg-cyan-300/10">
                      <BrainCircuit aria-hidden="true" className="size-5 text-cyan-100" />
                    </div>
                    <div>
                      <p className="font-display text-base font-semibold text-white">
                        Repository intelligence dashboard
                      </p>
                      <p className="text-sm text-white/52">
                        Architecture, execution flow, dependencies, and bug context in one
                        view
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 font-mono text-sm">
                    {analysisRows.map(([label, text]) => (
                      <div
                        key={label}
                        className="relative overflow-hidden rounded-md border border-white/10 bg-black/24 px-4 py-3 transition duration-300 hover:border-primary/25 hover:bg-primary/10"
                      >
                        <span className="data-spark" />
                        <span className="text-primary">{label}</span>
                        <span className="text-white/36"> / </span>
                        <span className="text-white/72">{text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {insights.map((signal) => (
                      <div
                        key={signal.label}
                        className="relative overflow-hidden rounded-md border border-white/10 bg-white/[0.055] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white/[0.075]"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                          {signal.label}
                        </p>
                        <p className="mt-2 font-display text-xl font-semibold text-white">
                          {signal.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative p-5 lg:p-6">
                  <div className="absolute inset-6 rounded-full bg-radial-cyan blur-3xl" />
                  <div className="relative grid gap-3">
                    {[
                      {
                        icon: GitBranch,
                        title: "Dependency visualization",
                        text: "Maps route handlers, services, background jobs, and database access.",
                      },
                      {
                        icon: Bug,
                        title: "AI debugging cards",
                        text: "Explains stack traces, likely root causes, and files to inspect first.",
                      },
                      {
                        icon: Bot,
                        title: "Repository-aware chat",
                        text: "Answers questions with semantic search and indexed code context.",
                      },
                      {
                        icon: Network,
                        title: "Architecture intelligence",
                        text: "Summarizes modules, ownership boundaries, and execution paths.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="group relative overflow-hidden rounded-md border border-white/10 bg-white/[0.06] p-4 shadow-inner-line backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white/[0.085]"
                      >
                        <span className="data-spark data-spark-hover" />
                        <div className="flex items-start gap-3">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/12 transition duration-300 group-hover:shadow-glow">
                            <item.icon aria-hidden="true" className="size-5 text-primary" />
                          </span>
                          <div>
                            <p className="font-medium text-white">{item.title}</p>
                            <p className="mt-1 text-sm leading-6 text-white/56">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
