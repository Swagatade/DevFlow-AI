import Link from "next/link";
import type { Route } from "next";
import { BriefcaseBusiness, GitBranch, MessageCircle, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";

const productLinks = [
  { label: "Features", href: "/#features" },
  { label: "Technology", href: "/#technology" },
  { label: "Demo", href: "/#demo" },
  { label: "Open source", href: "/#open-source" },
];

const docsLinks = [
  { label: "Getting started", href: "/#how-it-works" },
  { label: "Repository onboarding", href: "/#features" },
  { label: "Architecture intelligence", href: "/#capabilities" },
  { label: "API reference", href: "/#technology" },
];

const openSourceLinks = [
  { label: "GitHub", href: "https://github.com" },
  { label: "Contributing", href: "/#documentation" },
  { label: "Self-hosting", href: "/#open-source" },
  { label: "Roadmap", href: "/#demo" },
];

export function SiteFooter() {
  return (
    <footer id="documentation" className="border-t border-white/10 py-12">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="DevFlow AI home"
            >
              <span className="flex size-9 items-center justify-center rounded-md border border-primary/30 bg-primary/12 shadow-glow">
                <Sparkles aria-hidden="true" className="size-4 text-primary" />
              </span>
              <span className="font-display text-base font-semibold text-white">
                DevFlow AI
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/54">
              Open-source AI-powered codebase intelligence for understanding, debugging,
              documenting, and analyzing repositories instantly.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[
                { label: "GitHub", icon: GitBranch, href: "https://github.com" },
                { label: "Twitter", icon: MessageCircle, href: "https://twitter.com" },
                {
                  label: "LinkedIn",
                  icon: BriefcaseBusiness,
                  href: "https://linkedin.com",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="flex size-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-white/58 transition hover:border-primary/30 hover:text-primary"
                  rel="noreferrer"
                  target="_blank"
                >
                  <item.icon aria-hidden="true" className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Documentation" links={docsLinks} />
          <FooterColumn title="Open source" links={openSourceLinks} />
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/42 sm:flex-row">
          <p>DevFlow AI</p>
          <p>Built for developers who need to understand complex code fast.</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h2 className="font-display text-sm font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-3">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href as Route}
            className="block text-sm text-white/52 transition hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
