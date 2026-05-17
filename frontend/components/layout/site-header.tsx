"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button, buttonVariants } from "@/components/ui/button";
import { marketingNavItems } from "@/lib/navigation";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/store/ui-store";

export function SiteHeader() {
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const toggleMobileNav = useUiStore((state) => state.toggleMobileNav);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-2xl">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="DevFlow AI home">
          <span className="flex size-9 items-center justify-center rounded-md border border-primary/30 bg-primary/12 shadow-glow">
            <Sparkles aria-hidden="true" className="size-4 text-primary" />
          </span>
          <span className="font-display text-base font-semibold tracking-normal text-white">
            DevFlow AI
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {marketingNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-white/62 transition hover:bg-white/[0.06] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "text-white/70",
            })}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className={buttonVariants({ variant: "primary", size: "sm" })}
          >
            Start free
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <Button
          aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
          className="md:hidden"
          variant="secondary"
          size="icon"
          onClick={toggleMobileNav}
        >
          {mobileNavOpen ? (
            <X aria-hidden="true" className="size-4" />
          ) : (
            <Menu aria-hidden="true" className="size-4" />
          )}
        </Button>
      </Container>

      <AnimatePresence>
        {mobileNavOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t border-white/10 bg-background/95 shadow-glow backdrop-blur-2xl md:hidden"
          >
            <Container className="space-y-3 py-4">
              {marketingNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="block rounded-md px-3 py-3 text-sm font-medium text-white/72 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "md" }),
                    "w-full",
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "primary", size: "md" }),
                    "w-full",
                  )}
                >
                  Start free
                </Link>
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
