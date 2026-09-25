"use client"

import { useEffect, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

type StoredUser = {
  name: string
  email: string
}

type AuthSnapshot = {
  ready: boolean
  token: string | null
  user: StoredUser | null
}

const serverAuthSnapshot: AuthSnapshot = {
  ready: false,
  token: null,
  user: null,
}

const AUTH_STORE_EVENT = "applytrack-auth-change"

let clientAuthSnapshot: AuthSnapshot | null = null
let cachedToken: string | null | undefined
let cachedStoredUser: string | null | undefined

function readAuthSnapshot(): AuthSnapshot {
  const token = localStorage.getItem("access_token")
  const storedUser = localStorage.getItem("user")

  if (
    clientAuthSnapshot &&
    cachedToken === token &&
    cachedStoredUser === storedUser
  ) {
    return clientAuthSnapshot
  }

  cachedToken = token
  cachedStoredUser = storedUser
  clientAuthSnapshot = {
    ready: true,
    token,
    user: storedUser ? (JSON.parse(storedUser) as StoredUser) : null,
  }
  return clientAuthSnapshot
}

function notifyAuthStorageChange() {
  window.dispatchEvent(new Event(AUTH_STORE_EVENT))
}

function subscribeToAuth(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange)
  window.addEventListener(AUTH_STORE_EVENT, onStoreChange)
  return () => {
    window.removeEventListener("storage", onStoreChange)
    window.removeEventListener(AUTH_STORE_EVENT, onStoreChange)
  }
}

function useAuthSnapshot() {
  return useSyncExternalStore(
    subscribeToAuth,
    readAuthSnapshot,
    () => serverAuthSnapshot
  )
}

export default function Home() {
  const router = useRouter()
  const auth = useAuthSnapshot()

  useEffect(() => {
    if (auth.ready && !auth.token) {
      router.push("/login")
    }
  }, [auth.ready, auth.token, router])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    notifyAuthStorageChange()
    router.push("/login")
  }

  if (!auth.ready || !auth.token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Welcome, {auth.user?.name || "User"}!</h1>
        <p className="text-muted-foreground">
          You are successfully logged in to ApplyTrack.
        </p>
        <Button onClick={handleLogout} variant="destructive" className="w-full">
          Sign out
        </Button>
      </div>
    </div>
  )
}
