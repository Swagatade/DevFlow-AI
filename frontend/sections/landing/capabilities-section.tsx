import {
  BrainCircuit,
  Code2,
  FileSearch,
  MessageSquareCode,
  Network,
  ShieldCheck,
  Sparkles,
  TestTube2,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/section";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const capabilities = [
  "Understand repository structure",
  "Explain execution flow",
  "Analyze APIs and services",
  "Detect bugs and vulnerabilities",
  "Generate code explanations",
  "Create onboarding docs",
  "Generate tests",
  "Provide repository-aware AI chat",
  "Semantic code search",
  "Architecture intelligence",
];

const visualItems = [
  { icon: FileSearch, label: "semantic search", value: "find feature owners" },
  { icon: Network, label: "architecture map", value: "routes to services" },
  { icon: ShieldCheck, label: "risk scan", value: "dependency warnings" },
  { icon: TestTube2, label: "test strategy", value: "edge cases generated" },
  { icon: MessageSquareCode, label: "repo chat", value: "answers with sources" },
  { icon: Code2, label: "flow explain", value: "request lifecycle traced" },
];

export function CapabilitiesSection() {
  return (
    <Section id="capabilities" className="overflow-hidden border-t border-white/10">
      <div
        className="absolute inset-x-0 top-1/4 h-[32rem] bg-radial-cyan blur-3xl"
        aria-hidden="true"
      />
      <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <FadeIn>
          <SectionHeader
            eyebrow="AI capabilities"
            title="Ask deeper questions because the AI understands the repository."
            description="DevFlow AI grounds every answer in parsed code, vector retrieval, dependency context, and agent analysis so developers get useful explanations instead of vague summaries."
          />
          <div className="mt-7 flex flex-wrap gap-2">
            <Badge tone="cyan">Repository-aware</Badge>
            <Badge tone="violet">AST-backed</Badge>
            <Badge tone="mint">Open-source</Badge>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="gradient-border rounded-card">
            <Card className="scanline relative overflow-hidden p-6">
              <div
                className="absolute inset-0 futuristic-grid opacity-20"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-primary/30 bg-primary/12 shadow-glow status-pulse">
                  <BrainCircuit aria-hidden="true" className="size-9 text-primary" />
                </div>
                <p className="mt-5 text-center font-display text-xl font-semibold text-white">
                  Repository intelligence engine
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {visualItems.map((item) => (
                    <div
                      key={item.label}
                      className="group relative overflow-hidden rounded-md border border-white/10 bg-black/24 p-4 shadow-inner-line backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/10"
                    >
                      <span className="data-spark data-spark-hover" />
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.07] text-primary transition duration-300 group-hover:shadow-glow">
                          <item.icon aria-hidden="true" className="size-4" />
                        </span>
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-white/38">
                            {item.label}
                          </p>
                          <p className="mt-1 text-sm font-medium text-white/78">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </FadeIn>
      </div>

      <div className="relative mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {capabilities.map((capability) => (
          <FadeIn key={capability}>
            <div className="group flex h-full items-center gap-3 rounded-md border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white/70 shadow-inner-line backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/10">
              <Sparkles aria-hidden="true" className="size-4 shrink-0 text-primary" />
              {capability}
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
