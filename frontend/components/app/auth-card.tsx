"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, GitBranch, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

type AuthMode = "login" | "signup";

const copy = {
  login: {
    title: "Welcome back",
    description: "Enter your workspace credentials to continue.",
    action: "Log in",
    alternate: "New to DevFlow AI?",
    alternateHref: "/signup",
    alternateLabel: "Create an account",
  },
  signup: {
    title: "Create your workspace",
    description: "Start with a secure developer workflow foundation.",
    action: "Create account",
    alternate: "Already have an account?",
    alternateHref: "/login",
    alternateLabel: "Log in",
  },
} as const;

export function AuthCard({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const content = copy[mode];
  const showName = mode === "signup";

  const continueToDashboard = () => {
    window.localStorage.setItem("devflow-demo-auth", "true");
    router.push("/dashboard");
  };

  return (
    <Card className="mx-auto w-full max-w-md p-6 sm:p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/90">
          DevFlow AI
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-normal text-white">
          {content.title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-white/58">{content.description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="secondary" type="button" onClick={continueToDashboard}>
          <GitBranch aria-hidden="true" className="size-4" />
          GitHub
        </Button>
        <Button variant="secondary" type="button" onClick={continueToDashboard}>
          <Mail aria-hidden="true" className="size-4" />
          Email SSO
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/34">
        <span className="h-px flex-1 bg-white/10" />
        or
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form
        className="space-y-4"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          continueToDashboard();
        }}
      >
        {showName ? (
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Ada Lovelace"
              required
            />
          </div>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="Enter your password"
            required
          />
        </div>

        <Button className="w-full" size="lg" type="submit">
          {content.action}
          <ArrowRight aria-hidden="true" className="size-5" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/56">
        {content.alternate}{" "}
        <Link
          href={content.alternateHref}
          className="font-medium text-primary hover:text-cyan-200"
        >
          {content.alternateLabel}
        </Link>
      </p>
    </Card>
  );
}
