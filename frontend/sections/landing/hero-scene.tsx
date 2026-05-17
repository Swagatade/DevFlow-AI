"use client";

import { motion } from "framer-motion";
import { Bug, Code2, Database, GitBranch, Network, Sparkles } from "lucide-react";

const graphNodes = [
  { label: "api/routes.py", x: "15%", y: "22%", tone: "border-cyan-200/30 bg-cyan-300/12" },
  { label: "auth.ts", x: "43%", y: "12%", tone: "border-emerald-200/30 bg-emerald-300/12" },
  { label: "parser.rs", x: "72%", y: "26%", tone: "border-violet-200/30 bg-violet-300/12" },
  { label: "tests/", x: "10%", y: "72%", tone: "border-amber-200/30 bg-amber-300/12" },
  { label: "services/", x: "88%", y: "73%", tone: "border-rose-200/30 bg-rose-300/12" },
];

const floatingCards = [
  {
    icon: Bug,
    title: "Root cause",
    text: "Null path in auth middleware",
    className: "left-2 top-16 sm:left-8 lg:left-0",
  },
  {
    icon: Network,
    title: "Dependency map",
    text: "42 file relationships indexed",
    className: "right-2 top-24 sm:right-12 lg:right-0",
  },
];

export function HeroScene() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-aurora-mesh" />
      <div className="absolute inset-0 futuristic-grid animate-grid-pulse opacity-35" />
      <div className="absolute inset-0 noise-overlay opacity-20" />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-cyan blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.76, 0.45] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-x-0 top-24 mx-auto hidden h-[42rem] max-w-7xl md:block">
        <svg className="absolute inset-0 h-full w-full opacity-40" role="presentation">
          <defs>
            <linearGradient id="repo-line-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgb(103 232 249)" stopOpacity="0.8" />
              <stop offset="52%" stopColor="rgb(167 139 250)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="rgb(110 231 183)" stopOpacity="0.72" />
            </linearGradient>
          </defs>
          <path
            className="flow-path"
            d="M180 170 C 335 80, 510 80, 665 180 S 900 330, 1040 230"
            fill="none"
            stroke="url(#repo-line-gradient)"
            strokeWidth="1.2"
          />
          <path
            className="flow-path"
            d="M260 455 C 390 305, 565 365, 815 185"
            fill="none"
            stroke="url(#repo-line-gradient)"
            strokeWidth="1"
          />
          <path
            className="flow-path"
            d="M340 110 C 430 280, 540 410, 780 470"
            fill="none"
            stroke="url(#repo-line-gradient)"
            strokeWidth="1"
          />
        </svg>

        {graphNodes.map((node, index) => (
          <motion.div
            key={node.label}
            className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium text-white/72 shadow-inner-line backdrop-blur-xl ${node.tone}`}
            style={{ left: node.x, top: node.y }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5 + index, repeat: Infinity, ease: "easeInOut" }}
          >
            <Code2 className="size-3.5 text-primary" />
            <span className="size-1.5 rounded-full bg-primary status-pulse" />
            {node.label}
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-x-4 top-24 mx-auto hidden h-[27rem] max-w-7xl overflow-visible lg:block">
        {floatingCards.map((card, index) => (
          <motion.div
            key={card.title}
            className={`absolute w-64 overflow-hidden rounded-card border border-white/12 bg-white/[0.07] p-4 shadow-glow backdrop-blur-2xl ${card.className}`}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 7 + index, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="data-spark" />
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-md border border-primary/25 bg-primary/12">
                <card.icon className="size-4 text-primary" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{card.title}</p>
                <p className="text-xs text-white/52">{card.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="absolute bottom-16 right-[12%] hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-xs font-medium text-white/62 backdrop-blur-xl md:flex"
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="size-1.5 rounded-full bg-primary status-pulse" />
        <Sparkles className="size-3.5 text-primary" />
        repository-aware AI indexing
      </motion.div>
      <div className="absolute left-[8%] top-[46%] hidden size-24 rounded-full border border-cyan-200/10 bg-cyan-300/10 blur-xl md:block" />
      <div className="absolute right-[16%] top-[18%] hidden size-32 rounded-full border border-violet-200/10 bg-violet-300/10 blur-xl md:block" />
      <Database className="absolute bottom-28 left-[18%] hidden size-8 text-emerald-200/40 md:block" />
      <GitBranch className="absolute right-[22%] top-32 hidden size-7 text-cyan-200/40 md:block" />
    </div>
  );
}
