"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Upload } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColumnMappingCombobox } from "@/features/companies/components/ColumnMappingCombobox"
import { ImportFieldsStatus } from "@/features/companies/components/ImportFieldsStatus"
import {
  buildInitialColumnMapping,
  getExcelColumnNames,
} from "@/features/companies/lib/excel-columns"
import { cn } from "@/lib/utils"
import { getCompanyImportFields } from "@/services/company.services"

const CONSTRAINT_LABELS: Record<string, string> = {
  min_length: "min length",
  max_length: "max length",
  ge: "min",
  gt: "greater than",
  le: "max",
  lt: "less than",
  multiple_of: "multiple of",
  max_digits: "max digits",
  decimal_places: "decimal places",
  pattern: "pattern",
  enum: "one of",
}

function formatConstraintValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(", ")
  }

  if (value === null || value === undefined) {
    return ""
  }

  return String(value)
}

function formatConstraints(constraints: Record<string, unknown>): string {
  const parts = Object.entries(constraints).flatMap(([key, value]) => {
    const formatted = formatConstraintValue(value)
    if (!formatted) {
      return []
    }

    const label = CONSTRAINT_LABELS[key] ?? key.replaceAll("_", " ")
    return [`${label} ${formatted}`]
  })

  return parts.length > 0 ? parts.join(" · ") : "None"
}

export function CompanyImportPage() {
  const {
    data: fields = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["companies", "import-fields"],
    queryFn: getCompanyImportFields,
  })
  const [columns, setColumns] = useState<string[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [parseError, setParseError] = useState<string | null>(null)
  const hasFile = columns.length > 0

  console.log("fields", fields)


  const usedColumns = useMemo(
    () => new Set(Object.values(mapping).filter(Boolean)),
    [mapping]
  )

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      setColumns([])
      setMapping({})
      setParseError(null)
      return
    }

    try {
      const names = await getExcelColumnNames(file)
      setColumns(names)
      setMapping(buildInitialColumnMapping(fields, names))
      setParseError(null)
    } catch (requestError: unknown) {
      setColumns([])
      setMapping({})
      setParseError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to read spreadsheet columns"
      )
    }
  }

  function handleMappingChange(fieldName: string, column: string) {
    setMapping((current) => ({
      ...current,
      [fieldName]: column,
    }))
  }

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
        <ImportFieldsStatus
          description="Fetching the company fields available for import."
          status="pending"
          title="Loading import fields"
        />
      ) : error ? (
        <ImportFieldsStatus
          description={
            error instanceof Error
              ? error.message
              : "Unable to load import fields"
          }
          status="error"
          title="Could not load import fields"
        />
      ) : (
        <div className="flex flex-col gap-space-md">
          <p className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md text-on-surface">
            Check your excel before matching with type and constraints
          </p>

          <div className="flex max-w-md flex-col gap-space-xs">
            <Label htmlFor="company-import-file">Excel file</Label>
            <Input
              accept=".xlsx,.xls"
              id="company-import-file"
              onChange={handleFileChange}
              type="file"
            />
            {parseError ? (
              <p className="text-body-md text-destructive">{parseError}</p>
            ) : null}
          </div>

          <ul className="flex flex-col gap-space-sm">
            {fields.map((field) => {
              const availableColumns = columns.filter(
                (column) =>
                  column === mapping[field.name] || !usedColumns.has(column)
              )

              return (
                <li
                  className="flex items-center justify-between gap-space-md rounded-xl bg-surface-container-lowest px-space-md py-space-sm shadow-elevation-card"
                  key={field.name}
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-body-md font-medium text-on-surface">
                      {field.name}
                      {field.required ? (
                        <span
                          aria-hidden="true"
                          className="ml-1 text-destructive"
                        >
                          *
                        </span>
                      ) : null}
                    </span>
                    <span className="text-caption text-on-surface-variant">
                      Type: {field.type}
                    </span>
                    <span className="text-caption text-outline">
                      Constraints: {formatConstraints(field.constraints)}
                    </span>
                  </div>
                  <ColumnMappingCombobox
                    optional={!field.required}
                    columns={availableColumns}
                    disabled={!hasFile}
                    onChange={(column) =>
                      handleMappingChange(field.name, column)
                    }
                    value={mapping[field.name] ?? ""}
                  />
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
