import {
  Bot,
  Bug,
  CloudUpload,
  Code2,
  FileCode2,
  GitBranch,
  MessagesSquare,
  Network,
  PanelTop,
  ShieldCheck,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/section";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const previews = [
  {
    icon: CloudUpload,
    title: "Repository upload",
    text: "Connect GitHub, paste a repo URL, or upload a ZIP to create an indexed workspace.",
    meta: "12 languages detected",
  },
  {
    icon: Bot,
    title: "AI analysis",
    text: "Agents summarize architecture, critical paths, dependencies, TODOs, and risky code.",
    meta: "5 agents completed",
  },
  {
    icon: Network,
    title: "Dependency graph",
    text: "Explore how files, packages, services, APIs, and jobs connect across the repository.",
    meta: "38,910 edges",
  },
  {
    icon: Bug,
    title: "Debugging dashboard",
    text: "Paste stack traces and logs to identify likely root causes and files to inspect first.",
    meta: "24 suspects ranked",
  },
  {
    icon: MessagesSquare,
    title: "AI chat interface",
    text: "Ask repository-aware questions with answers grounded in source files and docs.",
    meta: "Sources attached",
  },
  {
    icon: GitBranch,
    title: "Architecture visualization",
    text: "See modules, entry points, database access, request flows, and integration boundaries.",
    meta: "7 services mapped",
  },
];

const repositoryTabs = [
  { label: "Overview", value: "Indexed", icon: PanelTop },
  { label: "Architecture", value: "7 services", icon: Network },
  { label: "Debugging", value: "24 suspects", icon: Bug },
  { label: "AI Chat", value: "Sources on", icon: MessagesSquare },
  { label: "Docs", value: "Drafted", icon: FileCode2 },
];

const repoSignals = [
  { label: "Files", value: "12.4k" },
  { label: "Edges", value: "38.9k" },
  { label: "Langs", value: "12" },
];

export function DemoPreviewSection() {
  return (
    <Section id="demo" className="overflow-hidden border-t border-white/10">
      <FadeIn>
        <SectionHeader
          eyebrow="Demo preview"
          title="A realistic workspace for analyzing real repositories."
          description="The product surface is designed around the jobs developers actually do: ingest, inspect, debug, document, ask, and improve."
          align="center"
        />
      </FadeIn>

      <FadeIn className="mt-12">
        <div className="gradient-border rounded-card">
          <div className="glass-panel-strong scanline overflow-hidden rounded-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-300/80" />
                <span className="size-2.5 rounded-full bg-amber-300/80" />
                <span className="size-2.5 rounded-full bg-emerald-300/80" />
              </div>
              <Badge tone="cyan">devflow workspace</Badge>
            </div>

            <div className="grid gap-0 xl:grid-cols-[360px_minmax(0,1fr)]">
              <aside className="min-w-0 border-b border-white/10 p-5 sm:p-6 xl:border-b-0 xl:border-r">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/12 shadow-glow status-pulse">
                    <GitBranch aria-hidden="true" className="size-5 text-primary" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="min-w-0 truncate font-display text-lg font-semibold text-white">
                        acme/platform
                      </p>
                      <Badge tone="mint" className="shrink-0">
                        Live index
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-white/52">
                      Indexed 4 minutes ago after scanning source, docs, dependencies, and
                      configuration.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {repoSignals.map((signal) => (
                    <div
                      key={signal.label}
                      className="min-w-0 rounded-md border border-white/10 bg-white/[0.055] px-3 py-3 text-center transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white/[0.075]"
                    >
                      <p className="truncate font-display text-lg font-semibold text-white">
                        {signal.value}
                      </p>
                      <p className="mt-1 truncate text-xs uppercase tracking-[0.16em] text-white/35">
                        {signal.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-2">
                  {repositoryTabs.map((item, index) => (
                    <div
                      key={item.label}
                      className={`group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md border px-3 py-3 text-sm text-white/66 transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10 ${
                        index === 0
                          ? "border-primary/30 bg-primary/10"
                          : "border-white/10 bg-white/[0.045]"
                      }`}
                    >
                      <span className="flex size-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.055] text-primary transition duration-300 group-hover:shadow-glow">
                        <item.icon aria-hidden="true" className="size-4" />
                      </span>
                      <span className="min-w-0 truncate font-medium text-white/78">
                        {item.label}
                      </span>
                      <span
                        className={`shrink-0 rounded-full border border-white/10 bg-black/18 px-2 py-1 text-[11px] ${
                          index === 0 ? "text-cyan-100 status-pulse" : "text-white/42"
                        }`}
                      >
                        {index === 0 ? "Active" : item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </aside>

              <div className="relative min-w-0 p-5 sm:p-6">
                <div
                  className="absolute inset-8 rounded-full bg-radial-cyan blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative mb-5 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
                  <Card className="scanline min-h-52 overflow-hidden p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
                          <Code2 aria-hidden="true" className="size-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-display text-lg font-semibold text-white">
                            Analysis pipeline
                          </p>
                          <p className="text-sm text-white/48">
                            Tree-sitter to agent graph
                          </p>
                        </div>
                      </div>
                      <Badge tone="cyan" className="status-pulse">
                        Running
                      </Badge>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {["Parse AST", "Embed code", "Rank bugs"].map((item) => (
                        <div
                          key={item}
                          className="relative overflow-hidden rounded-md border border-white/10 bg-black/18 px-3 py-3 text-center text-sm text-white/62"
                        >
                          <span className="data-spark" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="meter-flow h-full w-[78%] rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-emerald-300 shadow-glow" />
                    </div>
                  </Card>

                  <Card className="scanline min-h-52 overflow-hidden p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-emerald-200/20 bg-emerald-300/10 text-emerald-100">
                        <ShieldCheck aria-hidden="true" className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-lg font-semibold text-white">
                          Repository health
                        </p>
                        <p className="text-sm text-white/48">Ready for team onboarding</p>
                      </div>
                    </div>
                    <div className="mt-5 space-y-3">
                      {[
                        ["Docs coverage", "82%"],
                        ["Risk hotspots", "6"],
                        ["Debug traces", "14"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-sm transition duration-300 hover:border-emerald-200/20 hover:bg-emerald-300/10"
                        >
                          <span className="min-w-0 truncate text-white/58">{label}</span>
                          <span className="shrink-0 font-medium text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="relative grid auto-rows-fr gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {previews.map((preview) => (
                    <Card
                      key={preview.title}
                      className="group relative min-h-56 overflow-hidden bg-black/16 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white/[0.065]"
                    >
                      <span className="data-spark data-spark-hover" />
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.07] text-primary transition duration-300 group-hover:shadow-glow">
                          <preview.icon aria-hidden="true" className="size-5" />
                        </span>
                        <span className="max-w-full rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1 text-xs text-white/44">
                          {preview.meta}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-lg font-semibold text-white">
                        {preview.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-white/58">{preview.text}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <Card className="scanline mt-5 overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
            <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
              <div className="mb-4 flex items-center gap-3">
                <FileCode2 aria-hidden="true" className="size-5 text-primary" />
                <p className="font-display font-semibold text-white">AI code explanation</p>
              </div>
              <p className="font-mono text-sm leading-7 text-white/64">
                This request enters `api/routes.py`, validates the session in `auth.ts`,
                calls `billing/service.ts`, then writes a subscription event through the
                queue worker.
              </p>
            </div>
            <div className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <Bug aria-hidden="true" className="size-5 text-primary" />
                <p className="font-display font-semibold text-white">
                  Debugging recommendation
                </p>
              </div>
              <p className="font-mono text-sm leading-7 text-white/64">
                The stack trace points to a missing cache key after `getAccount()` returns
                null. Inspect `middleware/auth.ts` before changing the payment handler.
              </p>
            </div>
          </div>
        </Card>
      </FadeIn>
    </Section>
  );
}
