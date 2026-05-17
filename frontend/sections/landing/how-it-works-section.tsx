import { Bot, Braces, DatabaseZap, GitPullRequest, MessagesSquare } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/section";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    icon: GitPullRequest,
    title: "Connect a repository",
    description:
      "Upload a GitHub repository or ZIP project. DevFlow AI builds a workspace snapshot with files, languages, config, package manifests, and project metadata.",
    signal: "GitHub or ZIP",
  },
  {
    number: "02",
    icon: Braces,
    title: "Parse code with Tree-sitter",
    description:
      "The analyzer extracts syntax trees, symbols, imports, routes, functions, classes, and cross-file relationships using language-aware parsing.",
    signal: "AST intelligence",
  },
  {
    number: "03",
    icon: DatabaseZap,
    title: "Generate semantic memory",
    description:
      "Source chunks, documentation, dependencies, and summaries become embeddings stored in ChromaDB for repository-aware search and retrieval.",
    signal: "Vector index",
  },
  {
    number: "04",
    icon: Bot,
    title: "Run LangGraph agents",
    description:
      "Specialized AI agents analyze architecture, dependency flow, execution paths, risk patterns, and likely bugs with traceable reasoning steps.",
    signal: "Agent graph",
  },
  {
    number: "05",
    icon: MessagesSquare,
    title: "Ask, debug, and document",
    description:
      "Developers use AI chat, debugging tools, dependency maps, and documentation generators grounded in the actual repository context.",
    signal: "Developer workflow",
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" className="border-t border-white/10">
      <FadeIn>
        <SectionHeader
          eyebrow="How it works"
          title="From repository upload to actionable codebase intelligence."
          description="DevFlow AI turns raw source code into a searchable, explainable, AI-ready knowledge graph. The pipeline is built for developer workflows, not generic document chat."
          align="center"
        />
      </FadeIn>

      <div className="relative mt-14">
        <div className="flow-rail absolute left-6 top-10 hidden h-[calc(100%-5rem)] w-px bg-gradient-to-b from-cyan-200/50 via-violet-200/30 to-emerald-200/50 lg:block" />
        <div className="grid gap-4">
          {steps.map((step, index) => (
            <FadeIn key={step.title}>
              <Card className="group scanline relative overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white/[0.075]">
                <span className="data-spark data-spark-hover" />
                <div className="grid gap-0 lg:grid-cols-[120px_1fr_240px]">
                  <div className="flex items-center gap-4 border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
                    <span className="font-mono text-sm text-white/38">{step.number}</span>
                    <span className="flex size-11 items-center justify-center rounded-md border border-primary/25 bg-primary/12 text-primary shadow-glow transition duration-300 group-hover:scale-105">
                      <step.icon aria-hidden="true" className="size-5" />
                    </span>
                  </div>
                  <div className="p-5 lg:p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                      {index === 2 ? (
                        <Badge tone="cyan" className="status-pulse">
                          Retrieval ready
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62">
                      {step.description}
                    </p>
                  </div>
                  <div className="border-t border-white/10 p-5 lg:border-l lg:border-t-0 lg:p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/34">
                      Output
                    </p>
                    <p className="mt-3 font-display text-lg font-semibold text-gradient">
                      {step.signal}
                    </p>
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}
