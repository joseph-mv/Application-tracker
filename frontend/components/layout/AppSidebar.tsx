import Link from "next/link"
import {
  BarChart3,
  Building2,
  CalendarDays,
  ContactRound,
  LayoutDashboard,
} from "lucide-react"

import { cn } from "@/lib/utils"

const navigation = [
  { label: "Applications", icon: LayoutDashboard, href: "#" },
  { label: "Companies", icon: Building2, href: "/home", active: true },
  { label: "Contacts", icon: ContactRound, href: "#" },
  { label: "Interviews", icon: CalendarDays, href: "#" },
  { label: "Analytics", icon: BarChart3, href: "#" },
]

export function AppSidebar() {
  return (
    <aside className="fixed top-16 bottom-0 left-0 z-40 hidden w-64 flex-col justify-between border-r border-outline-variant/20 bg-surface-container-lowest px-space-sm py-space-md lg:flex">
      <div className="flex flex-col gap-space-xs">
        <p className="px-space-sm py-space-xs text-label-sm tracking-wider text-on-surface-variant uppercase">
          Pipeline & CRM
        </p>
        <nav aria-label="Primary navigation" className="flex flex-col gap-space-xs">
          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.label}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-space-sm rounded-lg px-space-md py-space-sm text-body-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface",
                  item.active &&
                    "bg-primary-container font-medium text-primary-foreground hover:bg-primary-container hover:text-primary-foreground"
                )}
                href={item.href}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-space-sm">
        <div className="flex flex-col">
          <span className="text-label-sm text-on-surface">Active Hunt</span>
          <span className="text-caption text-on-surface-variant">
            Q2 Senior Frontend
          </span>
        </div>
        <span className="size-2.5 rounded-full bg-secondary-container" />
      </div>
    </aside>
  )
}
