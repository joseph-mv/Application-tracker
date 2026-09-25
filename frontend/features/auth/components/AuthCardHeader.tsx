import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type AuthCardHeaderProps = {
  title: string
  description: string
}

export function AuthCardHeader({ title, description }: AuthCardHeaderProps) {
  return (
    <CardHeader className="gap-2 pb-2 text-center sm:text-left">
      <p className="text-sm font-semibold tracking-tight text-primary">
        Application Tracker
      </p>
      <CardTitle className="text-xl font-semibold tracking-tight">
        {title}
      </CardTitle>
      <CardDescription className="text-balance">{description}</CardDescription>
    </CardHeader>
  )
}
