import {
  BookOpenText,
  Bug,
  FileCode2,
  FlaskConical,
  Network,
  Radar,
  ShieldAlert,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/section";
import { FadeIn } from "@/components/motion/fade-in";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Radar,
    title: "Repository Intelligence",
    description:
      "Understand repository architecture instantly with module, service, route, and ownership summaries.",
  },
  {
    icon: Bug,
    title: "AI Debugging",
    description:
      "Analyze stack traces, error logs, failing tests, and code paths to detect likely root causes.",
  },
  {
    icon: Network,
    title: "Dependency Mapping",
    description:
      "Visualize relationships between files, packages, services, APIs, database calls, and background jobs.",
  },
  {
    icon: BookOpenText,
    title: "AI Documentation",
    description:
      "Generate README files, onboarding guides, architecture notes, API docs, and module explanations.",
  },
  {
    icon: ShieldAlert,
    title: "Security Scanner",
    description:
      "Detect vulnerable packages, risky patterns, exposed configuration, and security-sensitive code paths.",
  },
  {
    icon: FlaskConical,
    title: "AI Test Generator",
    description:
      "Generate unit tests, integration cases, mocks, edge cases, and regression coverage from code context.",
  },
];

export function FeaturesSection() {
  return (
    <Section id="features" className="border-t border-white/10">
      <FadeIn>
        <SectionHeader
          eyebrow="Features"
          title="Everything developers need to understand and improve a repository."
          description="DevFlow AI combines static code structure, semantic retrieval, and agentic reasoning so teams can move through unfamiliar code with confidence."
          align="center"
        />
      </FadeIn>

      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <FadeIn key={feature.title}>
            <Card className="group relative h-full overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.085]">
              <span className="data-spark data-spark-hover" />
              <CardHeader>
                <div className="mb-5 flex size-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.07] text-primary transition group-hover:border-primary/40 group-hover:bg-primary/12">
                  <feature.icon aria-hidden="true" className="size-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <Card className="scanline mt-5 overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
              <div className="flex size-12 items-center justify-center rounded-md border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
                <FileCode2 aria-hidden="true" className="size-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold text-white">
                Repository onboarding, compressed from days to minutes.
              </h3>
              <p className="mt-4 text-sm leading-6 text-white/58">
                New developers can ask how services fit together, where a feature lives, why
                a test fails, and what to read first without waiting for tribal knowledge.
              </p>
            </div>
            <div className="grid gap-3 p-6 sm:grid-cols-2">
              {[
                "Entry points and route maps",
                "Package and service boundaries",
                "Execution flow explanations",
                "Risky dependency summaries",
                "Setup and environment guidance",
                "Owner-ready onboarding docs",
              ].map((item) => (
                <div
                  key={item}
                  className="group relative overflow-hidden rounded-md border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white/70 transition duration-300 hover:border-primary/25 hover:bg-primary/10"
                >
                  <span className="data-spark data-spark-hover" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </FadeIn>
    </Section>
  );
}
