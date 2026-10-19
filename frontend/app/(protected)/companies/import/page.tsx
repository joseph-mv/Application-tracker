import type { Metadata } from "next"

import { CompanyImportPage } from "@/features/companies/components/CompanyImportPage"

export const metadata: Metadata = {
  title: "Import Companies | Job Tracker",
  description: "Review company fields available for import.",
}

export default function ImportCompaniesPage() {
  return <CompanyImportPage />
}
