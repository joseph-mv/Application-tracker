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

export type CompanyCreate = {
  name: string
  domain?: string | null
  website?: string | null
  career_page_url?: string | null
  linkedin_url?: string | null
  industry?: string | null
  company_type?: "product" | "service" | "hybrid" | null
  size?: string | null
  headquarters_location?: string | null
  logo_url?: string | null
  notes?: string | null
}

export async function importCompanies(records: CompanyCreate[]) {
  return apiFetch("/api/v1/companies/import", {
    method: "POST",
    body: JSON.stringify(records),
  })
}
