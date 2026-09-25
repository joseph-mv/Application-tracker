import type { Metadata } from "next"

import { SignupForm } from "@/features/auth/components/SignupForm"

export const metadata: Metadata = {
  title: "Create account | ApplyTrack",
  description: "Create your ApplyTrack account to organize job applications.",
}

export default function SignupPage() {
  return <SignupForm />
}
