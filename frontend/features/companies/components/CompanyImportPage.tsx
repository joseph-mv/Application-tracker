"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Upload } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getCompanyImportFields } from "@/services/company.services"

export function CompanyImportPage() {
  const {
    data: fields = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["companies", "import-fields"],
    queryFn: getCompanyImportFields,
  })

  return (
    <div className="flex w-full flex-col gap-space-xl">
      <section className="flex flex-col justify-between gap-space-md md:flex-row md:items-center">
        <div>
          <div className="mb-1 flex items-center gap-space-xs text-caption tracking-wider text-primary uppercase">
            <Upload className="size-4" />
            <span>Company Import</span>
          </div>
          <h1 className="text-headline-xl tracking-tight text-on-surface">
            Import companies
          </h1>
          <p className="mt-0.5 text-body-md text-on-surface-variant">
            These are the company fields available for import
          </p>
        </div>
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-11 rounded-xl bg-surface-container-lowest px-4 text-on-surface shadow-elevation-card hover:bg-surface-container-high"
          )}
          href="/home"
        >
          <ArrowLeft className="text-outline" />
          Back to companies
        </Link>
      </section>

      {isPending ? (
        <p className="text-body-md text-on-surface-variant">
          Loading import fields...
        </p>
      ) : error ? (
        <p className="text-body-md text-destructive">
          {error instanceof Error
            ? error.message
            : "Unable to load import fields"}
        </p>
      ) : (
        <ul className="flex flex-col gap-space-sm">
          {fields.map((field) => (
            <li
              className="flex items-center justify-between rounded-xl bg-surface-container-lowest px-space-md py-space-sm shadow-elevation-card"
              key={field.field}
            >
              <span className="text-body-md font-medium text-on-surface">
                {field.field}
              </span>
              <span className="text-body-md text-on-surface-variant">
                {field.type}
                {field.required ? " · required" : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
