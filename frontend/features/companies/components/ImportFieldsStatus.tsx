import { CircleAlert, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const statusStyles = {
  pending: {
    panel: "bg-surface-container-low/40",
    icon: "text-primary",
    description: "text-on-surface-variant",
  },
  error: {
    panel: "bg-destructive/5 ring-1 ring-destructive/15",
    icon: "text-destructive",
    description: "text-destructive",
  },
} as const

export function ImportFieldsStatus({
  status,
  title,
  description,
}: {
  status: keyof typeof statusStyles
  title: string
  description: string
}) {
  const styles = statusStyles[status]
  const Icon = status === "pending" ? Loader2 : CircleAlert

  return (
    <div
      aria-live={status === "pending" ? "polite" : undefined}
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-2xl px-space-xl py-space-xl text-center",
        styles.panel
      )}
      role={status === "pending" ? "status" : "alert"}
    >
      <div className="mb-space-md flex size-16 items-center justify-center rounded-full bg-surface-container-lowest shadow-elevation-card">
        <Icon
          className={cn(
            "size-7",
            styles.icon,
            status === "pending" && "animate-spin"
          )}
        />
      </div>
      <p className="text-headline-sm text-on-surface">{title}</p>
      <p className={cn("mt-space-xs max-w-md text-body-md", styles.description)}>
        {description}
      </p>
    </div>
  )
}
