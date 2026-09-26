export type CompanyCategory = "active" | "saved"
export type CompanyLogo = "letter" | "figma" | "linear" | "vercel" | "airbnb"
export type BadgeTone = "primary" | "neutral" | "success" | "warning" | "info"

export type Company = {
  id: string
  name: string
  website: string
  category: CompanyCategory
  roles: string[]
  openRoles: number
  industry: string
  stage: string
  stageTone: BadgeTone
  description: string
  location: string
  updatedAt: string
  logo: CompanyLogo
  logoText?: string
  logoUrl?: string
  verified?: boolean
  priority?: boolean
}

export type Metric = {
  id: string
  label: string
  value: string
  detail: string
  icon: "building" | "briefcase" | "users" | "clock"
  tone: "primary" | "info" | "success" | "warning"
  positive?: boolean
}

export const dashboardSummary = {
  companyCount: 12,
  trackedJobCount: 28,
}

export const filterCounts = {
  all: 12,
  active: 8,
  saved: 4,
}

export const metrics: Metric[] = [
  {
    id: "pipeline",
    label: "Tracked Pipeline",
    value: "12",
    detail: "+3 this month",
    icon: "building",
    tone: "primary",
    positive: true,
  },
  {
    id: "openings",
    label: "Active Openings",
    value: "13",
    detail: "Across 6 teams",
    icon: "briefcase",
    tone: "info",
  },
  {
    id: "contacts",
    label: "Direct Contacts",
    value: "19",
    detail: "7 warm intros",
    icon: "users",
    tone: "success",
    positive: true,
  },
  {
    id: "upcoming",
    label: "Upcoming Stage",
    value: "3",
    detail: "Interviews pending",
    icon: "clock",
    tone: "warning",
  },
]

export const companies: Company[] = [
  {
    id: "stripe",
    name: "Stripe",
    website: "stripe.com",
    category: "active",
    roles: ["Staff Frontend Engineer", "Senior Backend Engineer", "Product Manager"],
    openRoles: 3,
    industry: "Fintech",
    stage: "Offer Stage",
    stageTone: "success",
    description:
      "Financial infrastructure platform for the internet. Currently interviewing for Staff Frontend and Senior Backend roles.",
    location: "San Francisco, CA",
    updatedAt: "2h ago",
    logo: "letter",
    logoText: "S",
    verified: true,
  },
  {
    id: "figma",
    name: "Figma",
    website: "figma.com",
    category: "active",
    roles: ["Design Technologist", "Systems Architect"],
    openRoles: 2,
    industry: "Design Tools",
    stage: "Tech Screen",
    stageTone: "warning",
    description:
      "Collaborative interface design platform. Tracking Design Technologist and Systems Architect openings.",
    location: "SF / Remote",
    updatedAt: "Yesterday",
    logo: "figma",
  },
  {
    id: "linear",
    name: "Linear",
    website: "linear.app",
    category: "active",
    roles: ["Senior Product Engineer"],
    openRoles: 1,
    industry: "Productivity",
    stage: "Applied",
    stageTone: "success",
    description:
      "Issue tracking tool built for high-performance product teams. Application submitted for Senior Product Engineer.",
    location: "Remote",
    updatedAt: "3d ago",
    logo: "linear",
    priority: true,
  },
  {
    id: "notion",
    name: "Notion",
    website: "notion.so",
    category: "saved",
    roles: ["Frontend Infrastructure", "Mobile Lead"],
    openRoles: 4,
    industry: "Workspace",
    stage: "Bookmarked",
    stageTone: "info",
    description:
      "Connected workspace for wiki, docs, and project management. Tracking upcoming Q3 roles in Developer Platform.",
    location: "New York, NY",
    updatedAt: "May 12",
    logo: "letter",
    logoText: "N",
  },
  {
    id: "vercel",
    name: "Vercel",
    website: "vercel.com",
    category: "active",
    roles: ["DX Engineer"],
    openRoles: 2,
    industry: "Cloud / DevTools",
    stage: "Referral Sent",
    stageTone: "success",
    description:
      "Frontend cloud developer platform. Reached out to Staff DX Lead for internal team alignment.",
    location: "Remote",
    updatedAt: "May 10",
    logo: "vercel",
  },
  {
    id: "airbnb",
    name: "Airbnb",
    website: "airbnb.com",
    category: "saved",
    roles: ["Design Systems Specialist"],
    openRoles: 1,
    industry: "Hospitality",
    stage: "Watching",
    stageTone: "info",
    description:
      "Global vacation rental and lodging experiences. Monitoring openings within Core UX Foundations.",
    location: "San Francisco, CA",
    updatedAt: "May 8",
    logo: "airbnb",
  },
]
