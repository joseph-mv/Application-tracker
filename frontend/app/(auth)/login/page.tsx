import type { Metadata } from "next"

import { LoginForm } from "@/features/auth/components/LoginForm"

export const metadata: Metadata = {
  title: "Sign in | ApplyTrack",
  description: "Sign in to continue tracking your job applications.",
}

export default function LoginPage() {
  return <LoginForm />
}
