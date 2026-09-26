"use client"

import { useSyncExternalStore } from "react"

export type StoredUser = {
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

function subscribeToAuth(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange)
  window.addEventListener(AUTH_STORE_EVENT, onStoreChange)

  return () => {
    window.removeEventListener("storage", onStoreChange)
    window.removeEventListener(AUTH_STORE_EVENT, onStoreChange)
  }
}

export function useAuthSnapshot() {
  return useSyncExternalStore(
    subscribeToAuth,
    readAuthSnapshot,
    () => serverAuthSnapshot
  )
}

export function notifyAuthStorageChange() {
  window.dispatchEvent(new Event(AUTH_STORE_EVENT))
}

export function clearAuthSession() {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user")
}
