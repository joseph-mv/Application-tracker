import { GuestGuard } from "@/features/auth/components/GuestGuard"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GuestGuard>
      <div className="flex min-h-full flex-1 items-center justify-center bg-muted/30 px-4 py-10 sm:px-6 sm:py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </GuestGuard>
  )
}
