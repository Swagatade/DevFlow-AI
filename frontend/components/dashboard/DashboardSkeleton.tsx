export function DashboardSkeleton() {
  return (
    <div className="rounded-card border border-white/10 bg-white/[0.045] p-5 shadow-inner-line">
      <div className="space-y-3">
        <div className="h-3 w-28 animate-pulse rounded-full bg-white/10" />
        <div className="h-10 animate-pulse rounded-md bg-white/[0.08]" />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="h-16 animate-pulse rounded-md bg-white/[0.06]" />
          <div className="h-16 animate-pulse rounded-md bg-white/[0.06]" />
          <div className="h-16 animate-pulse rounded-md bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}
