import { z } from "zod"

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or fewer`)
    .optional()

export const companySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(255, "Company name must be 255 characters or fewer"),
  website: optionalText(255, "Website"),
  industry: optionalText(255, "Industry"),
  companyType: optionalText(100, "Company type"),
  size: optionalText(100, "Company size"),
  location: optionalText(500, "Location"),
  linkedinUrl: optionalText(500, "LinkedIn URL"),
  logoUrl: optionalText(2_000, "Logo URL"),
  notes: optionalText(2_000, "Notes"),
})

export type CompanyFormValues = z.infer<typeof companySchema>
