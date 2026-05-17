import type { Metadata } from "next";
import { AuthCard } from "@/components/app/auth-card";

export const metadata: Metadata = {
  title: "Log In",
};

export default function LoginPage() {
  return <AuthCard mode="login" />;
}
