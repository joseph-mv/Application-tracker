"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen"
import { useAuthSnapshot } from "@/features/auth/lib/auth-store"

export default function RootRedirectPage() {
  const router = useRouter()
  const auth = useAuthSnapshot()

  useEffect(() => {
    if (!auth.ready) return

    if (!auth.token) {
      router.replace("/login")
    } else {
      router.replace("/home")
    }
  }, [auth.ready, auth.token, router])

  return <AuthLoadingScreen />
}
