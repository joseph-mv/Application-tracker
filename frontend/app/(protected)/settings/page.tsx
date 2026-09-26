import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings | Job Tracker",
  description: "Manage your account and preferences.",
}

export default function SettingsPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-headline-sm text-on-surface">Settings</h1>
      <p className="text-body-md text-on-surface-variant">
        Account and preference settings will appear here.
      </p>
    </div>
  )
}
