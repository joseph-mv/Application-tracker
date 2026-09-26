import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Job Tracker",
  description: "Overview of your job search pipeline.",
}

export default function DashboardPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-headline-sm text-on-surface">Dashboard</h1>
      <p className="text-body-md text-on-surface-variant">
        Your application overview will appear here.
      </p>
    </div>
  )
}
