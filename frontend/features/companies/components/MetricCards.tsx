import {
  BriefcaseBusiness,
  Building2,
  Clock3,
  TrendingUp,
  UsersRound,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Metric } from "@/features/companies/data/companies"

const icons = {
  building: Building2,
  briefcase: BriefcaseBusiness,
  users: UsersRound,
  clock: Clock3,
}

const iconTones = {
  primary: "bg-primary-fixed text-primary",
  info: "bg-surface-container-highest text-on-primary-fixed-variant",
  success: "bg-secondary-fixed text-on-secondary-fixed-variant",
  warning: "bg-tertiary-fixed text-tertiary",
}

export function MetricCards({ metrics }: { metrics: Metric[] }) {
  return (
    <section className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = icons[metric.icon]

        return (
          <Card
            key={metric.id}
            className="flex-row items-center justify-between gap-3 border-0 bg-surface-container-lowest p-space-md py-space-md shadow-elevation-card ring-0"
          >
            <div className="flex flex-col">
              <span className="text-caption tracking-wider text-on-surface-variant uppercase">
                {metric.label}
              </span>
              <span
                className={cn(
                  "mt-1 text-headline-lg text-on-surface",
                  metric.tone === "warning" && "text-tertiary"
                )}
              >
                {metric.value}
              </span>
              <span
                className={cn(
                  "mt-0.5 flex items-center gap-1 text-body-sm text-on-surface-variant",
                  metric.positive && "text-on-secondary-container"
                )}
              >
                {metric.positive && <TrendingUp className="size-4" />}
                {metric.detail}
              </span>
            </div>
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                iconTones[metric.tone]
              )}
            >
              <Icon className="size-5.5" />
            </span>
          </Card>
        )
      })}
    </section>
  )
}
