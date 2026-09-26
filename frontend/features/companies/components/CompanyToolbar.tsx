import { Grid2X2, List, Search, SlidersHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { filterCounts } from "@/features/companies/data/companies"

export type CompanyFilter = "all" | "active" | "saved"
export type CompanyView = "grid" | "list"

type CompanyToolbarProps = {
  filter: CompanyFilter
  query: string
  view: CompanyView
  onFilterChange: (filter: CompanyFilter) => void
  onQueryChange: (query: string) => void
  onViewChange: (view: CompanyView) => void
}

const tabs: { id: CompanyFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active Applications" },
  { id: "saved", label: "Saved" },
]

export function CompanyToolbar({
  filter,
  query,
  view,
  onFilterChange,
  onQueryChange,
  onViewChange,
}: CompanyToolbarProps) {
  return (
    <section className="flex flex-col justify-between gap-space-md rounded-2xl bg-surface-container-lowest p-space-sm shadow-elevation-card lg:flex-row lg:items-center">
      <div className="flex items-center gap-space-xs overflow-x-auto">
        {tabs.map((tab) => {
          const active = filter === tab.id

          return (
            <Button
              key={tab.id}
              className={cn(
                "h-9 shrink-0 rounded-xl px-space-md text-label-md",
                active
                  ? "bg-primary-container text-primary-foreground hover:bg-primary-container/90"
                  : "text-on-surface-variant hover:bg-surface-container"
              )}
              onClick={() => onFilterChange(tab.id)}
              variant="ghost"
            >
              {tab.label}
              <Badge
                className={cn(
                  "min-w-5 border-0 px-1.5 py-0 text-caption",
                  active
                    ? "bg-surface-container-lowest/20 text-primary-foreground"
                    : "bg-surface-container text-on-surface-variant"
                )}
              >
                {filterCounts[tab.id]}
              </Badge>
            </Button>
          )
        })}
      </div>

      <div className="flex items-center gap-space-sm">
        <div className="relative min-w-0 flex-1 lg:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-outline" />
          <Input
            aria-label="Filter companies"
            className="h-10 border-0 bg-surface-container-low pl-9 shadow-none placeholder:text-outline focus-visible:bg-surface-container-highest"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Filter by company or role..."
            value={query}
          />
        </div>
        <div className="flex shrink-0 items-center rounded-xl bg-surface-container-low p-1">
          <Button
            aria-label="Grid view"
            className={cn(
              "size-7 rounded-lg text-on-surface-variant",
              view === "grid" &&
                "bg-surface-container-lowest text-primary shadow-elevation-card hover:bg-surface-container-lowest"
            )}
            onClick={() => onViewChange("grid")}
            size="icon-sm"
            variant="ghost"
          >
            <Grid2X2 />
          </Button>
          <Button
            aria-label="List view"
            className={cn(
              "size-7 rounded-lg text-on-surface-variant",
              view === "list" &&
                "bg-surface-container-lowest text-primary shadow-elevation-card hover:bg-surface-container-lowest"
            )}
            onClick={() => onViewChange("list")}
            size="icon-sm"
            variant="ghost"
          >
            <List />
          </Button>
        </div>
        <Button
          className="h-10 shrink-0 rounded-xl bg-surface-container-low px-3 text-on-surface-variant hover:bg-surface-container-high"
          variant="ghost"
        >
          <SlidersHorizontal />
          <span className="hidden sm:inline">Sort</span>
        </Button>
      </div>
    </section>
  )
}
