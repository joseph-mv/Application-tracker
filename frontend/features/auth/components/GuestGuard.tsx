"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen"
import { useAuthSnapshot } from "@/features/auth/lib/auth-store"

type GuestGuardProps = {
  children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter()
  const auth = useAuthSnapshot()

  useEffect(() => {
    if (!auth.ready) return

    if (auth.token) {
      router.replace("/home")
    }
  }, [auth.ready, auth.token, router])

  if (!auth.ready || auth.token) {
    return <AuthLoadingScreen />
  }

  return children
}
