"use client"

import { useMemo, useState } from "react"

import { cn } from "@/lib/utils"
import {
  companies,
  metrics,
  type Company,
} from "@/features/companies/data/companies"
import { AddCompanyDialog } from "@/features/companies/components/AddCompanyDialog"
import { CompanyCard } from "@/features/companies/components/CompanyCard"
import {
  CompanyToolbar,
  type CompanyFilter,
  type CompanyView,
} from "@/features/companies/components/CompanyToolbar"
import { DirectoryHeader } from "@/features/companies/components/DirectoryHeader"
import { EmptyState } from "@/features/companies/components/EmptyState"
import { MetricCards } from "@/features/companies/components/MetricCards"
import type { CompanyFormValues } from "@/features/companies/schemas/company.schema"

export function CompaniesDirectory() {
  const [companyList, setCompanyList] = useState(companies)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [filter, setFilter] = useState<CompanyFilter>("all")
  const [query, setQuery] = useState("")
  const [view, setView] = useState<CompanyView>("grid")

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return companyList.filter((company) => {
      const matchesFilter =
        filter === "all" || company.category === filter
      const searchableText = [
        company.name,
        company.website,
        company.industry,
        ...company.roles,
      ]
        .join(" ")
        .toLowerCase()

      return (
        matchesFilter &&
        (!normalizedQuery || searchableText.includes(normalizedQuery))
      )
    })
  }, [companyList, filter, query])

  function handleAddCompany(values: CompanyFormValues) {
    const normalizedWebsite = values.website
      ?.replace(/^https?:\/\//i, "")
      .replace(/\/$/, "")
    const newCompany: Company = {
      id: crypto.randomUUID(),
      name: values.name,
      website: normalizedWebsite || "",
      category: "active",
      roles: [],
      openRoles: 0,
      industry: values.industry || "Uncategorized",
      stage: "New",
      stageTone: "primary",
      description:
        values.notes ||
        `${values.name} was recently added to your company directory.`,
      location: values.location || "Location not added",
      updatedAt: "Just now",
      logo: "letter",
      logoText: values.name.charAt(0).toUpperCase(),
      logoUrl: values.logoUrl,
    }

    setCompanyList((current) => [newCompany, ...current])
    setFilter("all")
    setQuery("")
  }

  return (
    <div className="flex w-full flex-col gap-space-xl">
      <DirectoryHeader onAddCompany={() => setIsAddOpen(true)} />
      <MetricCards metrics={metrics} />
      <CompanyToolbar
        filter={filter}
        onFilterChange={setFilter}
        onQueryChange={setQuery}
        onViewChange={setView}
        query={query}
        view={view}
      />

      {filteredCompanies.length > 0 ? (
        <>
          <section
            aria-label="Companies"
            className={cn(
              "grid gap-space-lg",
              view === "grid"
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1 gap-space-md"
            )}
          >
            {filteredCompanies.map((company) => (
              <CompanyCard company={company} key={company.id} />
            ))}
          </section>
          <EmptyState
            onAddCompany={() => setIsAddOpen(true)}
            preview
          />
        </>
      ) : (
        <EmptyState onAddCompany={() => setIsAddOpen(true)} />
      )}
      <AddCompanyDialog
        onAddCompany={handleAddCompany}
        onOpenChange={setIsAddOpen}
        open={isAddOpen}
      />
    </div>
  )
}
