import Link from "next/link";
import {
  Activity,
  Boxes,
  BrainCircuit,
  GitBranch,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { dashboardNavItems } from "@/lib/navigation";
import type { WithChildren } from "@/types/ui";

const sidebarIcons = [LayoutDashboard, BrainCircuit, GitBranch, Boxes];

export function DashboardShell({ children }: WithChildren) {
  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-aurora-mesh opacity-80" aria-hidden="true" />
      <div className="fixed inset-0 futuristic-grid opacity-20" aria-hidden="true" />
      <div className="relative grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-white/10 bg-background/68 backdrop-blur-2xl lg:block">
          <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
            <span className="flex size-9 items-center justify-center rounded-md border border-primary/30 bg-primary/12 shadow-glow">
              <Sparkles aria-hidden="true" className="size-4 text-primary" />
            </span>
            <span className="font-display font-semibold text-white">DevFlow AI</span>
          </div>
          <nav className="space-y-1 px-4 py-6" aria-label="Dashboard navigation">
            {dashboardNavItems.map((item, index) => {
              const Icon = sidebarIcons[index] ?? LayoutDashboard;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/62 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-background/72 backdrop-blur-2xl">
            <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                  Command Center
                </p>
                <h1 className="truncate font-display text-lg font-semibold text-white">
                  Autonomous delivery overview
                </h1>
              </div>
              <div className="hidden min-w-72 items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white/44 shadow-inner-line md:flex">
                <Search aria-hidden="true" className="size-4" />
                Search agents, deploys, traces
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="icon" aria-label="Activity">
                  <Activity aria-hidden="true" className="size-4" />
                </Button>
                <Button variant="secondary" size="icon" aria-label="Settings">
                  <Settings aria-hidden="true" className="size-4" />
                </Button>
              </div>
            </div>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
