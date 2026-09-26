import type { Metadata } from "next"

import { CompaniesDirectory } from "@/features/companies/components/CompaniesDirectory"

export const metadata: Metadata = {
  title: "Companies | Job Tracker",
  description: "Manage and track companies in your job search pipeline.",
}

export default function HomePage() {
  return <CompaniesDirectory />
}
