"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  getCompanyImportFields,
  type CompanyImportField,
} from "@/services/company.services"

export function CompanyImportPage() {
  const [fields, setFields] = useState<CompanyImportField[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    getCompanyImportFields()
      .then((data) => {
        if (!isMounted) {
          return
        }
        setFields(data)
        setError(null)
      })
      .catch((requestError: unknown) => {
        if (!isMounted) {
          return
        }
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load import fields"
        )
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

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

      {isLoading ? (
        <p className="text-body-md text-on-surface-variant">
          Loading import fields...
        </p>
      ) : error ? (
        <p className="text-body-md text-destructive">{error}</p>
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
