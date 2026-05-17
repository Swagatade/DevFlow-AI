"use client";

import {
  Bug,
  Download,
  GitBranch,
  MessageSquareCode,
  PanelLeftClose,
  PanelLeftOpen,
  SearchCode,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

const navigationItems = [
  { label: "Analyze Repo", href: "#analyze", icon: GitBranch },
  { label: "Downloads", href: "#downloads", icon: Download },
  { label: "AI Explanation", href: "#analysis", icon: SearchCode },
  { label: "AI Chat", href: "#chat", icon: MessageSquareCode },
  { label: "Debug / VS Code", href: "#debug", icon: Bug },
] as const;

export function Sidebar({
  collapsed,
  mobileOpen,
  onCollapse,
  onCloseMobile,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onCloseMobile: () => void;
}) {
  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-white/10 bg-background/72 backdrop-blur-2xl transition-[width] duration-300 lg:flex lg:flex-col",
          collapsed ? "w-[5.5rem]" : "w-[17.5rem]",
        )}
      >
        <SidebarContent collapsed={collapsed} onCollapse={onCollapse} />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition lg:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!mobileOpen}
        onClick={onCloseMobile}
      >
        <aside
          className={cn(
            "h-full w-[19rem] max-w-[86vw] border-r border-white/10 bg-background/94 shadow-glow transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <Logo collapsed={false} />
            <button
              type="button"
              aria-label="Close sidebar"
              className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-white/68"
              onClick={onCloseMobile}
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
          <nav className="space-y-1 px-3 py-4" aria-label="Dashboard navigation">
            <NavigationItems collapsed={false} onNavigate={onCloseMobile} />
          </nav>
          <Workspace collapsed={false} />
        </aside>
      </div>
    </>
  );
}

function SidebarContent({
  collapsed,
  onCollapse,
}: {
  collapsed: boolean;
  onCollapse: () => void;
}) {
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <>
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <Logo collapsed={collapsed} />
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className={cn(
            "flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-white/58 transition hover:border-primary/30 hover:text-primary",
            collapsed && "mx-auto",
          )}
          onClick={onCollapse}
        >
          <ToggleIcon aria-hidden="true" className="size-4" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Dashboard navigation">
        <NavigationItems collapsed={collapsed} />
      </nav>
      <Workspace collapsed={collapsed} />
    </>
  );
}

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <a
      href="/dashboard"
      className={cn("flex min-w-0 items-center gap-3", collapsed && "justify-center")}
      aria-label="DevFlow AI dashboard"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/12 shadow-glow">
        <Sparkles aria-hidden="true" className="size-4 text-primary" />
      </span>
      {!collapsed ? (
        <span className="truncate font-display text-base font-semibold text-white">
          DevFlow AI
        </span>
      ) : null}
    </a>
  );
}

function NavigationItems({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      {navigationItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
            "text-white/62 hover:border hover:border-primary/25 hover:bg-primary/12 hover:text-white",
            collapsed && "justify-center px-0",
          )}
        >
          <item.icon
            aria-hidden="true"
            className="size-4 shrink-0 text-primary"
          />
          {!collapsed ? <span className="truncate">{item.label}</span> : null}
        </a>
      ))}
    </>
  );
}

function Workspace({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="border-t border-white/10 p-3">
      <div
        className={cn(
          "rounded-card border border-white/10 bg-white/[0.055] p-3 shadow-inner-line",
          collapsed && "flex justify-center p-2",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-200 to-emerald-200 font-display text-sm font-semibold text-background">
            DF
          </span>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">Repo Analyzer</p>
              <p className="truncate text-xs text-white/42">Ollama + VS Code</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
