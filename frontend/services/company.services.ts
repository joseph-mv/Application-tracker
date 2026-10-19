import { apiFetch } from "@/lib/api"

export type CompanyImportField = {
  field: string
  type: string
  required: boolean
}

export async function getCompanyImportFields(): Promise<CompanyImportField[]> {
  return apiFetch("/api/v1/companies/import-fields") as Promise<
    CompanyImportField[]
  >
}
