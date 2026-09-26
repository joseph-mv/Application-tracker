import { Building2, Eye, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export function EmptyState({
  preview = false,
  onAddCompany,
}: {
  preview?: boolean
  onAddCompany?: () => void
}) {
  return (
    <section className="mt-space-lg flex flex-col gap-space-sm">
      {preview && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-space-xs text-label-sm tracking-wider text-outline uppercase">
            <Eye className="size-4.5" />
            <span>Empty State Component Spec</span>
          </div>
          <span className="hidden text-caption text-outline sm:inline">
            Previewing zero-pipeline fallback
          </span>
        </div>
      )}
      <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-surface-container-low/40 p-space-xl text-center">
        <div className="relative mb-space-md flex size-20 items-center justify-center rounded-full bg-surface-container-lowest shadow-elevation-card">
          <Building2 className="size-9 text-primary" />
          <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary-fixed text-primary">
            <Plus className="size-3.5" />
          </span>
        </div>
        <h3 className="mb-space-xs text-headline-md text-on-surface">
          No companies tracked yet
        </h3>
        <p className="mx-auto mb-space-lg max-w-md text-body-md text-on-surface-variant">
          Start tracking the companies you want to work for and their open
          opportunities. Keep notes, contacts, and interview stages organized
          in one place.
        </p>
        <Button
          className="h-11 rounded-xl bg-primary-container px-6 text-primary-foreground shadow-elevation-card hover:bg-primary-container/90"
          onClick={onAddCompany}
        >
          <Plus />
          Add Company
        </Button>
      </div>
    </section>
  )
}
