import type { NavItem } from "@/types/navigation";

export const marketingNavItems: NavItem[] = [
  { label: "Features", href: "/#features" },
  { label: "Technology", href: "/#technology" },
  { label: "Open source", href: "/#open-source" },
  { label: "Documentation", href: "/#documentation" },
];

export const dashboardNavItems: NavItem[] = [
  { label: "Analyze Repo", href: "/dashboard#analyze" },
  { label: "Downloads", href: "/dashboard#downloads" },
  { label: "AI Explanation", href: "/dashboard#analysis" },
  { label: "AI Chat", href: "/dashboard#chat" },
  { label: "Debug / IBM Bob", href: "/dashboard#debug" },
];
