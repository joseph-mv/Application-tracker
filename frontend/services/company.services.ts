import { apiFetch } from "@/lib/api"

export type CompanyImportField = {
  name: string
  type: string
  required: boolean
  constraints: Record<string, unknown>
}

export async function getCompanyImportFields(): Promise<CompanyImportField[]> {
  return apiFetch("/api/v1/companies/import-fields") as Promise<
    CompanyImportField[]
  >
}
