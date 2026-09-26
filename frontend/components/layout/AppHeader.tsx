import {
  Bell,
  BriefcaseBusiness,
  Search,
  Settings,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserAccountMenu } from "@/components/layout/UserAccountMenu"

type AppHeaderProps = {
  companyCount: number
  trackedJobCount: number
}

export function AppHeader({
  companyCount,
  trackedJobCount,
}: AppHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/25 bg-surface-container-lowest/90 backdrop-blur-xl">
      <div className="flex h-16 w-full items-center justify-between gap-space-md px-space-lg">
        <div className="flex shrink-0 items-center gap-space-lg">
          <div className="flex items-center gap-space-sm">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary-fixed text-primary">
              <BriefcaseBusiness className="size-4.5" />
            </span>
            <span className="text-headline-md tracking-tight text-on-surface">
              Job Tracker
            </span>
          </div>
          <div className="hidden items-center gap-space-xs xl:flex">
            <Badge className="border-0 bg-surface-container text-on-surface-variant hover:bg-surface-container">
              {companyCount} Companies
            </Badge>
            <Badge className="border-0 bg-primary-fixed text-on-primary-fixed-variant hover:bg-primary-fixed">
              {trackedJobCount} Tracked Jobs
            </Badge>
          </div>
        </div>

        <div className="relative mx-auto hidden max-w-xl flex-1 md:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-outline" />
          <Input
            aria-label="Search companies and roles"
            className="h-10 border-0 bg-surface-container-low pl-10 shadow-none placeholder:text-outline focus-visible:bg-surface-container-lowest"
            placeholder="Search companies, roles..."
          />
        </div>

        <div className="flex shrink-0 items-center gap-space-sm">
          <Button
            aria-label="Notifications"
            className="text-on-surface-variant cursor-pointer"
            size="icon-lg"
            variant="ghost"
          >
            <Bell />
          </Button>
          <Button
            aria-label="Settings"
            className="text-on-surface-variant cursor-pointer"
            size="icon-lg"
            variant="ghost"
          >
            <Settings />
          </Button>
          <UserAccountMenu />
        </div>
      </div>
    </header>
  )
}
