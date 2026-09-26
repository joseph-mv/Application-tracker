import { Building2, Plus, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"

export function DirectoryHeader({
  onAddCompany,
}: {
  onAddCompany?: () => void
}) {
  return (
    <section className="flex flex-col justify-between gap-space-md md:flex-row md:items-center">
      <div>
        <div className="mb-1 flex items-center gap-space-xs text-caption tracking-wider text-primary uppercase">
          <Building2 className="size-4" />
          <span>Organization Directory</span>
        </div>
        <h1 className="text-headline-xl tracking-tight text-on-surface">
          Companies
        </h1>
        <p className="mt-0.5 text-body-md text-on-surface-variant">
          Manage and track organizations you are actively applying to or
          exploring
        </p>
      </div>
      <div className="flex items-center gap-space-sm self-start md:self-auto">
        <Button
          className="h-11 rounded-xl bg-surface-container-lowest px-4 text-on-surface shadow-elevation-card hover:bg-surface-container-high"
          variant="ghost"
        >
          <Upload className="text-outline" />
          Import
        </Button>
        <Button
          className="h-11 rounded-xl bg-primary-container px-5 text-primary-foreground shadow-elevation-card hover:bg-primary-container/90"
          onClick={onAddCompany}
        >
          <Plus />
          Add Company
        </Button>
      </div>
    </section>
  )
}
