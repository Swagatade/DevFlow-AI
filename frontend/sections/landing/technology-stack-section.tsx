import {
  Boxes,
  BrainCircuit,
  Database,
  Fingerprint,
  GitBranch,
  KeyRound,
  Server,
  Workflow,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/section";
import { FadeIn } from "@/components/motion/fade-in";
import { Card } from "@/components/ui/card";

const technologies = [
  {
    name: "Ollama",
    role: "Local AI model execution",
    description:
      "Runs open models on your machine or private infrastructure so teams can keep code analysis self-hosted.",
    icon: BrainCircuit,
    tone: "from-cyan-300/18",
  },
  {
    name: "LangGraph",
    role: "Multi-agent AI workflows",
    description:
      "Coordinates parsing, retrieval, debugging, architecture analysis, and documentation agents as a traceable graph.",
    icon: Workflow,
    tone: "from-violet-300/18",
  },
  {
    name: "FastAPI",
    role: "Backend APIs",
    description:
      "Serves repository ingestion, chat, analysis jobs, auth-aware requests, and integration endpoints.",
    icon: Server,
    tone: "from-emerald-300/18",
  },
  {
    name: "ChromaDB",
    role: "Semantic code search",
    description:
      "Stores embeddings for files, functions, docs, dependencies, and generated summaries.",
    icon: Database,
    tone: "from-amber-300/18",
  },
  {
    name: "Tree-sitter",
    role: "Code parsing and AST analysis",
    description:
      "Extracts language-aware structure so AI answers can reference real symbols, imports, routes, and call paths.",
    icon: GitBranch,
    tone: "from-cyan-300/18",
  },
  {
    name: "PostgreSQL",
    role: "Application database",
    description:
      "Persists users, workspaces, repositories, indexing state, analysis runs, and saved artifacts.",
    icon: Boxes,
    tone: "from-rose-300/18",
  },
  {
    name: "Next.js",
    role: "Frontend framework",
    description:
      "Powers the responsive product interface for onboarding, dashboards, chat, debugging, and architecture views.",
    icon: Fingerprint,
    tone: "from-emerald-300/18",
  },
  {
    name: "Auth.js",
    role: "Authentication system",
    description:
      "Provides secure sign-in foundations for teams, private repositories, and self-hosted deployments.",
    icon: KeyRound,
    tone: "from-violet-300/18",
  },
];

export function TechnologyStackSection() {
  return (
    <Section id="technology" className="overflow-hidden border-t border-white/10">
      <div
        className="absolute inset-x-0 top-20 h-96 bg-radial-cyan blur-3xl"
        aria-hidden="true"
      />
      <FadeIn>
        <SectionHeader
          eyebrow="Technology"
          title="Open-source infrastructure for private AI code analysis."
          description="DevFlow AI is built with self-hostable technologies that can run in your own environment while still delivering modern AI-native product workflows."
          align="center"
        />
      </FadeIn>

      <div className="relative mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {technologies.map((tech) => (
          <FadeIn key={tech.name}>
            <Card
              className={`group relative h-full overflow-hidden bg-gradient-to-br ${tech.tone} to-transparent p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white/[0.07]`}
            >
              <span className="data-spark data-spark-hover" />
              <div className="mb-5 flex size-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.07] text-primary transition duration-300 group-hover:shadow-glow">
                <tech.icon aria-hidden="true" className="size-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{tech.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary/80">{tech.role}</p>
              <p className="mt-4 text-sm leading-6 text-white/58">{tech.description}</p>
            </Card>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
