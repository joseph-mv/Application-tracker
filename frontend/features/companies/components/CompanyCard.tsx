import {
  BadgeCheck,
  Clock3,
  ExternalLink,
  Globe2,
  MapPin,
  MoreVertical,
  Star,
  Telescope,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type {
  BadgeTone,
  Company,
} from "@/features/companies/data/companies"

const badgeTones: Record<BadgeTone, string> = {
  primary: "bg-primary-fixed text-on-primary-fixed-variant",
  neutral: "bg-surface-container text-on-surface-variant",
  success: "bg-secondary-container/40 text-on-secondary-container",
  warning: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  info: "bg-surface-container-highest text-on-surface-variant",
}

function CompanyLogo({ company }: { company: Company }) {
  const shared =
    "flex size-12 shrink-0 items-center justify-center rounded-xl shadow-inner"

  if (company.logoUrl) {
    return (
      <Avatar className="size-12 rounded-xl">
        <AvatarImage
          alt={`${company.name} logo`}
          className="rounded-xl"
          src={company.logoUrl}
        />
        <AvatarFallback className="rounded-xl bg-primary-fixed text-headline-md font-bold text-primary">
          {company.logoText}
        </AvatarFallback>
      </Avatar>
    )
  }

  if (company.logo === "figma") {
    return (
      <span className={cn(shared, "bg-surface-container-highest")}>
        <svg aria-hidden="true" className="h-7 w-5" viewBox="0 0 38 57">
          <path d="M19 28.5A9.5 9.5 0 1 1 38 28.5a9.5 9.5 0 0 1-19 0" fill="#1ABCFE" />
          <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0" fill="#0ACF83" />
          <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19z" fill="#FF7262" />
          <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5" fill="#F24E1E" />
          <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5" fill="#A259FF" />
        </svg>
      </span>
    )
  }

  if (company.logo === "linear") {
    return (
      <span className={cn(shared, "bg-inverse-surface text-inverse-on-surface")}>
        <span className="h-6 w-6 -rotate-45 rounded-full border-4 border-current border-r-transparent" />
      </span>
    )
  }

  if (company.logo === "vercel") {
    return (
      <span className={cn(shared, "bg-inverse-surface text-inverse-on-surface")}>
        <span className="h-0 w-0 border-r-[12px] border-b-[21px] border-l-[12px] border-r-transparent border-b-current border-l-transparent" />
      </span>
    )
  }

  if (company.logo === "airbnb") {
    return (
      <span className={cn(shared, "bg-error-container text-destructive")}>
        <Telescope className="size-6" />
      </span>
    )
  }

  return (
    <span className={cn(shared, "bg-primary-fixed text-headline-md font-bold text-primary")}>
      {company.logoText}
    </span>
  )
}

export function CompanyCard({ company }: { company: Company }) {
  const remote = company.location.toLowerCase().includes("remote")

  return (
    <Card className="group gap-0 border-0 bg-surface-container-lowest py-0 shadow-elevation-card ring-0 transition-all hover:-translate-y-0.5 hover:shadow-elevation-lift">
      <div className="flex flex-1 flex-col gap-space-md p-space-lg">
        <div className="flex items-start justify-between">
          <div className="flex min-w-0 items-center gap-space-md">
            <CompanyLogo company={company} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-headline-sm text-on-surface transition-colors group-hover:text-primary">
                  {company.name}
                </h2>
                {company.verified && (
                  <BadgeCheck
                    aria-label="Verified pipeline target"
                    className="size-4 text-on-secondary-container"
                  />
                )}
                {company.priority && (
                  <Star
                    aria-label="Top priority"
                    className="size-4 text-primary"
                  />
                )}
              </div>
              {company.website ? (
                <a
                  className="flex items-center gap-0.5 text-body-sm text-outline transition-colors hover:text-primary"
                  href={`https://${company.website}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  {company.website}
                  <ExternalLink className="size-3.5" />
                </a>
              ) : (
                <span className="text-body-sm text-outline">
                  Website not added
                </span>
              )}
            </div>
          </div>
          <Button
            aria-label={`More options for ${company.name}`}
            className="text-outline"
            size="icon-sm"
            variant="ghost"
          >
            <MoreVertical />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-space-xs">
          <Badge className="gap-1 border-0 bg-primary-fixed px-3 text-on-primary-fixed-variant hover:bg-primary-fixed">
            <span className="size-1.5 rounded-full bg-primary" />
            {company.openRoles} open {company.openRoles === 1 ? "role" : "roles"}
          </Badge>
          <Badge className="border-0 bg-surface-container text-on-surface-variant hover:bg-surface-container">
            {company.industry}
          </Badge>
          <Badge
            className={cn(
              "border-0 hover:opacity-90",
              badgeTones[company.stageTone]
            )}
          >
            {company.stage}
          </Badge>
        </div>

        <p className="line-clamp-2 text-body-sm text-on-surface-variant">
          {company.description}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 bg-surface-container-low/60 px-space-lg py-3">
        <div className="flex min-w-0 items-center gap-1 text-body-sm text-outline">
          {remote ? (
            <Globe2 className="size-4 shrink-0" />
          ) : (
            <MapPin className="size-4 shrink-0" />
          )}
          <span className="truncate">{company.location}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-caption text-outline">
          <Clock3 className="size-3.5" />
          <span>{company.updatedAt}</span>
        </div>
      </div>
    </Card>
  )
}
