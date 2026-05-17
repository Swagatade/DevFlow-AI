import type { WithChildren } from "@/types/ui";

export function DashboardLayout({ children }: WithChildren) {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <div className="fixed inset-0 bg-aurora-mesh opacity-70" aria-hidden="true" />
      <div className="fixed inset-0 futuristic-grid opacity-16" aria-hidden="true" />
      <div className="relative min-h-screen">{children}</div>
    </main>
  );
}
