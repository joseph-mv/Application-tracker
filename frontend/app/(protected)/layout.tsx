import { AppHeader } from "@/components/layout/AppHeader"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { AuthGuard } from "@/features/auth/components/AuthGuard"
import { dashboardSummary } from "@/features/companies/data/companies"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-surface">
        <AppHeader
          companyCount={dashboardSummary.companyCount}
          trackedJobCount={dashboardSummary.trackedJobCount}
        />
        <AppSidebar />
        <div className="pt-16 lg:pl-64">
          <main className="min-h-[calc(100vh-4rem)] w-full bg-surface px-space-margin-mobile py-space-lg lg:px-space-margin">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
