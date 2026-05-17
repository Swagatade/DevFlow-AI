import { AuthShell } from "@/components/layout/auth-shell";
import type { WithChildren } from "@/types/ui";

export default function AuthLayout({ children }: WithChildren) {
  return <AuthShell>{children}</AuthShell>;
}
