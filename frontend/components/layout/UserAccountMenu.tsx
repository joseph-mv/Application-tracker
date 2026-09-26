"use client"

import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  clearAuthSession,
  notifyAuthStorageChange,
  useAuthSnapshot,
} from "@/features/auth/lib/auth-store"

function getInitials(name?: string) {
  if (!name) {
    return null
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

export function UserAccountMenu() {
  const router = useRouter()
  const auth = useAuthSnapshot()
  const initials = getInitials(auth.user?.name)

  function handleLogout() {
    clearAuthSession()
    notifyAuthStorageChange()
    console.log("Logging out")
    router.replace("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="cursor-pointer rounded-full outline-none transition-transform duration-100 ease-in-out hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar className="size-8 bg-primary text-primary-foreground">
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
            {initials || <User className="size-4" />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 rounded-xl bg-surface-container-lowest p-2 text-on-surface shadow-elevation-menu ring-1 ring-outline-variant/20"
        sideOffset={8}
      >
        <div className="min-w-0 px-2 py-2">
          <p className="truncate text-label-md font-semibold text-on-surface">
            {auth.user?.name || "User"}
          </p>
          {auth.user?.email && (
            <p className="mt-0.5 truncate text-body-sm text-on-surface-variant">
              {auth.user.email}
            </p>
          )}
        </div>
        <DropdownMenuSeparator className="my-1 bg-outline-variant/30" />
        <DropdownMenuItem
          className="h-9 cursor-pointer rounded-lg px-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
          onClick={handleLogout}
          variant="destructive"
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
