import Link from "next/link";
import {
  BrainCircuit,
  CheckCircle2,
  Code2,
  Database,
  LockKeyhole,
  Server,
  Terminal,
  Workflow,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/section";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const openSourcePrinciples = [
  {
    icon: LockKeyhole,
    title: "Your code stays private",
    description:
      "Run DevFlow AI inside your own environment with local model execution through Ollama.",
  },
  {
    icon: BrainCircuit,
    title: "Bring open models",
    description:
      "Use self-hosted models from Ollama for repository chat, debugging, documentation, and analysis.",
  },
  {
    icon: Server,
    title: "Self-hostable by design",
    description:
      "Next.js, FastAPI, PostgreSQL, ChromaDB, LangGraph, and Ollama can run on your machine or server.",
  },
];

const stackItems = [
  { label: "Ollama", value: "Local LLM runtime", icon: BrainCircuit },
  { label: "LangGraph", value: "Agent workflows", icon: Workflow },
  { label: "ChromaDB", value: "Semantic memory", icon: Database },
  { label: "FastAPI", value: "Private backend", icon: Server },
  { label: "Tree-sitter", value: "Code intelligence", icon: Code2 },
  { label: "PostgreSQL", value: "Workspace data", icon: Database },
];

const guarantees = [
  "No mandatory cloud AI provider",
  "No paid tier lock-in",
  "No proprietary runtime dependency",
  "Designed for local-first development",
  "Open-source stack from frontend to AI pipeline",
  "Ready for private repository analysis",
];

export function OpenSourceSection() {
  return (
    <Section id="open-source" className="overflow-hidden border-t border-white/10">
      <div
        className="absolute inset-x-0 top-20 h-[28rem] bg-radial-cyan blur-3xl"
        aria-hidden="true"
      />
      <FadeIn>
        <SectionHeader
          eyebrow="Open source"
          title="Fully open-source codebase intelligence, powered by Ollama."
          description="DevFlow AI is built for developers who want private, self-hosted AI workflows. Run local models with Ollama, index repositories with open infrastructure, and keep analysis close to your code."
          align="center"
        />
      </FadeIn>

      <div className="relative mt-12 grid gap-4 lg:grid-cols-3">
        {openSourcePrinciples.map((item) => (
          <FadeIn key={item.title}>
            <Card className="group relative h-full overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white/[0.075]">
              <span className="data-spark data-spark-hover" />
              <div className="mb-5 flex size-12 items-center justify-center rounded-md border border-primary/25 bg-primary/12 text-primary shadow-glow">
                <item.icon aria-hidden="true" className="size-5" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/58">{item.description}</p>
            </Card>
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <div className="gradient-border mt-5 rounded-card">
          <Card className="scanline overflow-hidden p-0">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="cyan" className="status-pulse">
                    Ollama ready
                  </Badge>
                  <Badge tone="mint">Self-hosted</Badge>
                  <Badge tone="violet">Open-source</Badge>
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-white">
                  Analyze repositories with local AI models.
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/60">
                  DevFlow AI connects repository parsing, embeddings, vector retrieval, and
                  agent reasoning to Ollama so teams can inspect private codebases without
                  sending source to external model APIs.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="https://github.com"
                    className={buttonVariants({ variant: "secondary", size: "lg" })}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View GitHub
                  </Link>
                  <Link
                    href="/#documentation"
                    className={buttonVariants({ variant: "outline", size: "lg" })}
                  >
                    Self-hosting docs
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="rounded-md border border-white/10 bg-black/24 p-4 font-mono text-sm shadow-inner-line">
                  <div className="mb-4 flex items-center gap-2 text-white/42">
                    <Terminal aria-hidden="true" className="size-4 text-primary" />
                    local runtime
                  </div>
                  <p className="text-white/74">
                    <span className="text-primary">$</span> ollama pull codellama
                  </p>
                  <p className="mt-2 text-white/74">
                    <span className="text-primary">$</span> devflow index ./repository
                  </p>
                  <p className="mt-2 text-white/74">
                    <span className="text-primary">$</span> devflow chat --local-model
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {stackItems.map((item) => (
                    <div
                      key={item.label}
                      className="group relative overflow-hidden rounded-md border border-white/10 bg-white/[0.045] px-4 py-3 transition duration-300 hover:border-primary/25 hover:bg-primary/10"
                    >
                      <span className="data-spark data-spark-hover" />
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.07] text-primary">
                          <item.icon aria-hidden="true" className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">{item.label}</p>
                          <p className="truncate text-xs text-white/44">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </FadeIn>

      <div className="relative mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {guarantees.map((guarantee) => (
          <FadeIn key={guarantee}>
            <div className="flex h-full items-center gap-3 rounded-md border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white/70 shadow-inner-line backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/10">
              <CheckCircle2
                aria-hidden="true"
                className="size-4 shrink-0 text-emerald-200"
              />
              {guarantee}
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
