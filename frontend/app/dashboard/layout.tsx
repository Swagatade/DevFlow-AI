import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import type { WithChildren } from "@/types/ui";

export default function DashboardRouteLayout({ children }: WithChildren) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
