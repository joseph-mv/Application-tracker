"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import {
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Link2,
  MapPin,
  SlidersHorizontal,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  companySchema,
  type CompanyFormValues,
} from "@/features/companies/schemas/company.schema"

const defaultValues: CompanyFormValues = {
  name: "",
  website: "",
  industry: "Software & Technology",
  companyType: "Product / B2B SaaS",
  size: "51-200 employees",
  location: "",
  linkedinUrl: "",
  logoUrl: "",
  notes: "",
}

const industryOptions = [
  "Software & Technology",
  "Fintech & Payments",
  "Healthcare & Biotech",
  "Consumer & E-commerce",
  "Deeptech & Hardware",
]

const companyTypeOptions = [
  "Product / B2B SaaS",
  "Direct-to-Consumer",
  "Consultancy / Agency",
  "Non-Profit / Public",
]

const companySizeOptions = [
  "1-50 employees",
  "51-200 employees",
  "201-1,000 employees",
  "1,000+ employees",
]

type AddCompanyDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddCompany: (values: CompanyFormValues) => void
}

function OptionalLabel({
  htmlFor,
  children,
  compact = false,
}: {
  htmlFor: string
  children: React.ReactNode
  compact?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <FieldLabel
        className={compact ? "text-label-sm" : "text-label-md"}
        htmlFor={htmlFor}
      >
        {children}
      </FieldLabel>
      <span className="text-caption font-normal text-outline">
        {compact ? "(opt.)" : "(optional)"}
      </span>
    </div>
  )
}

function FormSelect({
  control,
  name,
  label,
  options,
}: {
  control: ReturnType<typeof useForm<CompanyFormValues>>["control"]
  name: "industry" | "companyType" | "size"
  label: string
  options: string[]
}) {
  const id = `company-${name}`

  return (
    <Field className="gap-1">
      <OptionalLabel compact htmlFor={id}>
        {label}
      </OptionalLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            onValueChange={(value) => field.onChange(value ?? "")}
            value={field.value || null}
          >
            <SelectTrigger
              aria-label={label}
              className="h-10 w-full border-0 bg-surface-container-lowest px-3 text-body-sm text-on-surface shadow-none"
              id={id}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </Field>
  )
}

export function AddCompanyDialog({
  open,
  onOpenChange,
  onAddCompany,
}: AddCompanyDialogProps) {
  const [detailsOpen, setDetailsOpen] = useState(true)
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues,
  })
  const logoUrl = useWatch({ control, name: "logoUrl" })
  const companyName = useWatch({ control, name: "name" })

  function handleDialogChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset(defaultValues)
      setDetailsOpen(true)
    }
    onOpenChange(nextOpen)
  }

  function onSubmit(values: CompanyFormValues) {
    onAddCompany(values)
    handleDialogChange(false)
  }

  return (
    <Dialog onOpenChange={handleDialogChange} open={open}>
      <DialogContent
        className="max-h-[calc(100vh-2rem)] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden rounded-2xl border-0 bg-surface-container-lowest p-0 shadow-elevation-modal ring-0 sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader className="relative gap-0 px-space-lg pt-space-lg pb-space-md text-left">
          <span className="text-caption font-bold tracking-wider text-primary uppercase">
            Directory Registry
          </span>
          <DialogTitle className="mt-0.5 text-headline-lg tracking-tight text-on-surface">
            Add Company
          </DialogTitle>
          <DialogDescription className="sr-only">
            Add a company to your job search directory.
          </DialogDescription>
          <DialogClose
            aria-label="Close dialog"
            className="absolute top-space-lg right-space-lg flex size-9 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <X className="size-5" />
          </DialogClose>
        </DialogHeader>

        <form
          className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto]"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-space-md overflow-y-auto px-space-lg py-space-sm">
            <Field className="gap-1.5" data-invalid={!!errors.name}>
              <FieldLabel
                className="gap-1 text-label-md text-on-surface"
                htmlFor="company-name"
              >
                Company Name
                <span className="font-bold text-destructive">*</span>
              </FieldLabel>
              <Input
                aria-invalid={!!errors.name}
                className="h-11 rounded-xl border-0 bg-surface-container-low px-3.5 text-body-md shadow-none placeholder:text-outline focus-visible:bg-surface-container-lowest"
                id="company-name"
                placeholder="e.g. Acme Corp"
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field className="gap-1.5">
              <OptionalLabel htmlFor="company-website">Website</OptionalLabel>
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3.5 text-body-sm text-outline select-none">
                  https://
                </span>
                <Input
                  className="h-11 rounded-xl border-0 bg-surface-container-low pr-3.5 pl-20 text-body-md shadow-none placeholder:text-outline focus-visible:bg-surface-container-lowest"
                  id="company-website"
                  placeholder="acme.com"
                  {...register("website")}
                />
              </div>
              <FieldError errors={[errors.website]} />
            </Field>

            <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-low/60 p-space-md">
              <button
                aria-expanded={detailsOpen}
                className="group flex items-center justify-between text-left"
                onClick={() => setDetailsOpen((current) => !current)}
                type="button"
              >
                <span className="flex items-center gap-2 text-label-md font-semibold text-on-surface">
                  <SlidersHorizontal className="size-4.5 text-primary" />
                  Additional Details
                </span>
                <span className="flex items-center gap-1 text-caption text-on-surface-variant transition-colors group-hover:text-on-surface">
                  {detailsOpen ? "Active" : "Show"}
                  {detailsOpen ? (
                    <ChevronUp className="size-4.5" />
                  ) : (
                    <ChevronDown className="size-4.5" />
                  )}
                </span>
              </button>

              {detailsOpen && (
                <div className="grid grid-cols-1 gap-space-sm pt-1">
                  <FormSelect
                    control={control}
                    label="Industry"
                    name="industry"
                    options={industryOptions}
                  />
                  <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
                    <FormSelect
                      control={control}
                      label="Company Type"
                      name="companyType"
                      options={companyTypeOptions}
                    />
                    <FormSelect
                      control={control}
                      label="Company Size"
                      name="size"
                      options={companySizeOptions}
                    />
                  </div>

                  <Field className="gap-1">
                    <OptionalLabel compact={false} htmlFor="company-location">
                      Headquarters Location
                    </OptionalLabel>
                    <div className="relative flex items-center">
                      <MapPin className="pointer-events-none absolute left-3 size-4 text-outline" />
                      <Input
                        className="h-10 border-0 bg-surface-container-lowest pl-9 text-body-sm shadow-none placeholder:text-outline"
                        id="company-location"
                        placeholder="e.g. San Francisco, CA"
                        {...register("location")}
                      />
                    </div>
                  </Field>

                  <Field className="gap-1">
                    <OptionalLabel compact={false} htmlFor="company-linkedin">
                      LinkedIn URL
                    </OptionalLabel>
                    <div className="relative flex items-center">
                      <Link2 className="pointer-events-none absolute left-3 size-4 text-outline" />
                      <Input
                        className="h-10 border-0 bg-surface-container-lowest pl-9 text-body-sm shadow-none placeholder:text-outline"
                        id="company-linkedin"
                        placeholder="linkedin.com/company/..."
                        {...register("linkedinUrl")}
                      />
                    </div>
                  </Field>

                  <Field className="gap-1">
                    <OptionalLabel compact={false} htmlFor="company-logo">
                      Logo URL
                    </OptionalLabel>
                    <div className="flex items-center gap-space-sm">
                      <Input
                        className="h-10 border-0 bg-surface-container-lowest px-3 text-body-sm shadow-none placeholder:text-outline"
                        id="company-logo"
                        placeholder="https://acme.com/logo.png"
                        {...register("logoUrl")}
                      />
                      <Avatar className="size-9 bg-surface-container-lowest">
                        {logoUrl && (
                          <AvatarImage
                            alt={`${companyName || "Company"} logo preview`}
                            src={logoUrl}
                          />
                        )}
                        <AvatarFallback className="bg-surface-container-lowest">
                          <Building2 className="size-4 text-outline" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </Field>

                  <Field className="gap-1">
                    <OptionalLabel compact={false} htmlFor="company-notes">
                      Notes
                    </OptionalLabel>
                    <Textarea
                      className="min-h-20 resize-none border-0 bg-surface-container-lowest p-3 text-body-sm shadow-none placeholder:text-outline"
                      id="company-notes"
                      placeholder="Add initial thoughts, referral contacts, or hiring notes..."
                      rows={3}
                      {...register("notes")}
                    />
                  </Field>
                </div>
              )}
            </section>
          </div>

          <DialogFooter className="m-0 mt-space-md flex-row justify-end rounded-none border-0 bg-surface-container-low px-space-lg py-space-md">
            <DialogClose
              render={
                <Button
                  className="h-10 rounded-xl px-space-md text-on-surface-variant"
                  type="button"
                  variant="ghost"
                />
              }
            >
              Cancel
            </DialogClose>
            <Button
              className="h-10 rounded-xl bg-primary-container px-5 text-primary-foreground shadow-elevation-card hover:bg-primary-container/90"
              disabled={isSubmitting}
              type="submit"
            >
              <Check />
              Save Company
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
