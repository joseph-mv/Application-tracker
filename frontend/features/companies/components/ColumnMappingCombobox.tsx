"use client"

import { useState } from "react"
import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const NONE_VALUE = "__none__"

type ColumnMappingComboboxProps = {
  value: string
  columns: string[]
  disabled?: boolean
  optional?: boolean
  onChange: (column: string) => void
}

export function ColumnMappingCombobox({
  value,
  columns,
  disabled = false,
  optional = true,
  onChange,
}: ColumnMappingComboboxProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={
          <Button
            className="w-56 justify-between font-normal"
            disabled={disabled}
            variant="outline"
          />
        }
      >
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {value || (disabled ? "Choose a file first" : "Select column")}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-0">
        <Command>
          <CommandInput placeholder="Search columns..." />
          <CommandList>
            <CommandEmpty>No column found.</CommandEmpty>
            <CommandGroup>
              {optional ? (
                <CommandItem
                  data-checked={!value || undefined}
                  value={NONE_VALUE}
                  onSelect={() => {
                    onChange("")
                    requestAnimationFrame(() => setOpen(false))
                  }}
                >
                  None
                </CommandItem>
              ) : null}
              {columns.map((column) => (
                <CommandItem
                  data-checked={value === column || undefined}
                  key={column}
                  value={column}
                  onSelect={() => {
                    onChange(
                      column === value && optional ? "" : column
                    )
                    requestAnimationFrame(() => setOpen(false))
                  }}
                >
                  {column}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
