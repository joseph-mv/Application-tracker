import { CompanyImportField } from "@/services/company.services"
import * as XLSX from "xlsx"

export async function getExcelColumnNames(file: File): Promise<string[]> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: "array" })
  const firstSheetName = workbook.SheetNames[0]

  if (!firstSheetName) {
    throw new Error("The spreadsheet has no sheets")
  }

  const sheet = workbook.Sheets[firstSheetName]
  const rows = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(
    sheet,
    {
      header: 1,
      defval: "",
    }
  )
  const headerRow = rows[0]

  if (!headerRow?.length) {
    throw new Error("The spreadsheet has no column headers")
  }

  const columns = new Set<string>();
  let index = 0;
  for (const cell of headerRow) {
    const name = String(cell).trim() || `Column ${index + 1}`;
    index++;

    if (columns.has(name)) {
      throw new Error(`The spreadsheet has duplicate column headers: "${name}" , so add proper unique column names`)
    }

    if (name) {
      columns.add(name);
    }
  }

  if (columns.size === 0) {
    throw new Error("The spreadsheet has no column headers");
  }

  return [...columns];
}

export function buildInitialColumnMapping(
  fields: { name: string }[],
  columns: string[]
): Record<string, string> {
  const mapping: Record<string, string> = {}

  for (const { name } of fields) {
    const match = columns.find(
      (column) =>
        column.toLowerCase() === name.toLowerCase()
    )
    mapping[name] = match ?? ""
  }

  return mapping
}

export type ColumnMappingIssue = {
  field: string
  column: string | null
  row: number | null
  reason: string
}

export type ColumnMappingResult = {
  issues: ColumnMappingIssue[]
  issuedRows: Set<number>
  validRows: number[]
}

type SheetCell = string | number | boolean | Date | null
type SheetRow = SheetCell[]

const BOOLEAN_TEXT = new Set(["true", "false", "yes", "no", "1", "0"])
const DATE_TEXT = /^\d{4}-\d{2}-\d{2}$/
const TIME_TEXT = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/

function headerName(cell: SheetCell, index: number): string {
  return String(cell ?? "").trim() || `Column ${index + 1}`
}

async function readFirstSheetRows(file: File): Promise<SheetRow[]> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true })
  const firstSheetName = workbook.SheetNames[0]

  if (!firstSheetName) {
    throw new Error("The spreadsheet has no sheets")
  }

  const sheet = workbook.Sheets[firstSheetName]
  return XLSX.utils.sheet_to_json<SheetRow>(sheet, {
    header: 1,
    defval: "",
  })
}

function isEmptyRow(row: SheetRow | undefined): boolean {
  if (!row?.length) {
    return true
  }

  return row.every((cell) => isBlankCell(cell))
}

function isBlankCell(value: SheetCell): boolean {
  if (value === null || value === undefined || value === "") {
    return true
  }

  return typeof value === "string" && value.trim() === ""
}

function cellText(value: SheetCell): string {
  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof value === "string") {
    return value.trim()
  }

  if (value === null || value === undefined) {
    return ""
  }

  return String(value).trim()
}

function cellsUnderColumn(
  rows: SheetRow[],
  columnName: string
): { found: boolean; cells: { row: number; value: SheetCell }[] } {
  const headerRow = rows[0] ?? []
  const columnIndex = headerRow.findIndex(
    (cell, index) => headerName(cell, index) === columnName
  )

  if (columnIndex === -1) {
    return { found: false, cells: [] }
  }

  const cells: { row: number; value: SheetCell }[] = []

  for (let index = 1; index < rows.length; index++) {
    const row = rows[index]
    if (isEmptyRow(row)) {
      continue
    }

    cells.push({
      row: index + 1,
      value: row[columnIndex] ?? "",
    })
  }

  return { found: true, cells }
}

function constraintNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function asFiniteNumber(value: SheetCell): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  const text = cellText(value)
  if (!text) {
    return null
  }

  const parsed = Number(text)
  return Number.isFinite(parsed) ? parsed : null
}

function enumValues(field: CompanyImportField): string[] {
  const values = field.constraints.enum
  if (!Array.isArray(values)) {
    return []
  }

  return values.map((item) => String(item))
}

function typeMismatch(value: SheetCell, field: CompanyImportField): string | null {
  const text = cellText(value)

  switch (field.type) {
    case "string":
      return null
    case "integer":
      if (typeof value === "number" && Number.isInteger(value)) {
        return null
      }
      if (/^-?\d+$/.test(text)) {
        return null
      }
      return `Expected integer, got "${text}"`
    case "float":
    case "decimal":
      if (asFiniteNumber(value) !== null) {
        return null
      }
      return `Expected ${field.type}, got "${text}"`
    case "boolean":
      if (typeof value === "boolean") {
        return null
      }
      if (BOOLEAN_TEXT.has(text.toLowerCase())) {
        return null
      }
      return `Expected boolean, got "${text}"`
    case "url":
      try {
        new URL(text)
        return null
      } catch {
        return `Expected url, got "${text}"`
      }
    case "email": {
      const at = text.indexOf("@")
      const domain = at >= 0 ? text.slice(at + 1) : ""
      if (
        at > 0 &&
        text.lastIndexOf("@") === at &&
        !text.includes(" ") &&
        domain.includes(".")
      ) {
        return null
      }
      return `Expected email, got "${text}"`
    }
    case "date":
      if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return null
      }
      if (DATE_TEXT.test(text)) {
        return null
      }
      return `Expected date (YYYY-MM-DD), got "${text}"`
    case "datetime":
      if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return null
      }
      if (text && !Number.isNaN(Date.parse(text))) {
        return null
      }
      return `Expected datetime, got "${text}"`
    case "time":
      if (TIME_TEXT.test(text)) {
        return null
      }
      return `Expected time (HH:MM or HH:MM:SS), got "${text}"`
    case "enum": {
      const allowed = enumValues(field)
      if (allowed.includes(text)) {
        return null
      }
      return `Expected one of ${allowed.join(", ") || "an allowed value"}, got "${text}"`
    }
    default:
      return null
  }
}

function constraintMismatch(
  value: SheetCell,
  field: CompanyImportField
): string | null {
  const constraints = field.constraints
  const text = cellText(value)
  const numeric = asFiniteNumber(value)

  const minLength = constraintNumber(constraints.min_length)
  if (minLength !== null && text.length < minLength) {
    return `Must be at least ${minLength} characters`
  }

  const maxLength = constraintNumber(constraints.max_length)
  if (maxLength !== null && text.length > maxLength) {
    return `Must be at most ${maxLength} characters`
  }

  if (typeof constraints.pattern === "string") {
    try {
      const pattern = new RegExp(`^(?:${constraints.pattern})$`)
      if (!pattern.test(text)) {
        return `Must match pattern ${constraints.pattern}`
      }
    } catch {
      return `Must match pattern ${constraints.pattern}`
    }
  }

  const ge = constraintNumber(constraints.ge)
  if (ge !== null && (numeric === null || numeric < ge)) {
    return `Must be at least ${ge}`
  }

  const gt = constraintNumber(constraints.gt)
  if (gt !== null && (numeric === null || numeric <= gt)) {
    return `Must be greater than ${gt}`
  }

  const le = constraintNumber(constraints.le)
  if (le !== null && (numeric === null || numeric > le)) {
    return `Must be at most ${le}`
  }

  const lt = constraintNumber(constraints.lt)
  if (lt !== null && (numeric === null || numeric >= lt)) {
    return `Must be less than ${lt}`
  }

  const multipleOf = constraintNumber(constraints.multiple_of)
  if (multipleOf !== null) {
    if (numeric === null || multipleOf === 0) {
      return `Must be a multiple of ${constraints.multiple_of}`
    }
    const quotient = numeric / multipleOf
    if (Math.abs(quotient - Math.round(quotient)) > 1e-8) {
      return `Must be a multiple of ${multipleOf}`
    }
  }

  const maxDigits = constraintNumber(constraints.max_digits)
  const decimalPlaces = constraintNumber(constraints.decimal_places)
  if (maxDigits !== null || decimalPlaces !== null) {
    const digits = text.replace(/^-/, "").replace(".", "")
    const fraction = text.includes(".") ? text.split(".")[1] ?? "" : ""

    if (maxDigits !== null && digits.replace(/\D/g, "").length > maxDigits) {
      return `Must have at most ${maxDigits} digits`
    }

    if (decimalPlaces !== null && fraction.length > decimalPlaces) {
      return `Must have at most ${decimalPlaces} decimal places`
    }
  }

  if (Array.isArray(constraints.enum)) {
    const allowed = enumValues(field)
    if (!allowed.includes(text)) {
      return `Must be one of ${allowed.join(", ")}`
    }
  }

  return null
}

export async function verifyColumnMapping(
  fields: CompanyImportField[],
  columns: string[],
  mapping: Record<string, string>,
  file: File
): Promise<ColumnMappingResult> {
  const issues: ColumnMappingIssue[] = []
  const rows = await readFirstSheetRows(file)
  const issuedRows = new Set<number>()
  let hasMappingIssue = false

  for (const field of fields) {
    const column = mapping[field.name]

    if (field.required && !column) {
      hasMappingIssue = true
      issues.push({
        field: field.name,
        column: null,
        row: null,
        reason: "Required column is not mapped",
      })
      continue
    }

    if (column) {
      if (!columns.includes(column)) {
        hasMappingIssue = true
        issues.push({
          field: field.name,
          column,
          row: null,
          reason: `Mapped column "${column}" is not in the spreadsheet`,
        })
        continue
      }

      const { found, cells } = cellsUnderColumn(rows, column)
      if (!found) {
        issues.push({
          field: field.name,
          column,
          row: null,
          reason: `Mapped column "${column}" is not in the spreadsheet`,
        })
        continue
      }

      for (const cell of cells) {
        if (isBlankCell(cell.value)) {
          if (field.required) {
            issues.push({
              field: field.name,
              column,
              row: cell.row,
              reason: "Required value is empty",
            })
            issuedRows.add(cell.row)
          }
          continue
        }

        const typeReason = typeMismatch(cell.value, field)
        if (typeReason) {
          issues.push({
            field: field.name,
            column,
            row: cell.row,
            reason: typeReason,
          })
          issuedRows.add(cell.row)
          continue
        }

        const constraintReason = constraintMismatch(cell.value, field)
        if (constraintReason) {
          issues.push({
            field: field.name,
            column,
            row: cell.row,
            reason: constraintReason,
          })
          issuedRows.add(cell.row)
        }
      }
    }
  }

  const validRows: number[] = []

  if (!hasMappingIssue) {
    for (let index = 1; index < rows.length; index++) {
      const rowNumber = index + 1
      if (isEmptyRow(rows[index]) || issuedRows.has(rowNumber)) {
        continue
      }
      validRows.push(rowNumber)
    }
  }

  return { issues, issuedRows, validRows }
}

function coerceCellValue(
  value: SheetCell,
  field: CompanyImportField
): unknown {
  const text = cellText(value)

  switch (field.type) {
    case "integer": {
      if (typeof value === "number" && Number.isInteger(value)) {
        return value
      }
      return Number.parseInt(text, 10)
    }
    case "float":
    case "decimal":
      return asFiniteNumber(value)
    case "boolean": {
      if (typeof value === "boolean") {
        return value
      }
      const normalized = text.toLowerCase()
      return normalized === "true" || normalized === "yes" || normalized === "1"
    }
    default:
      return text
  }
}

export async function buildRecordsFromValidRows(
  file: File,
  fields: CompanyImportField[],
  mapping: Record<string, string>,
  validRows: number[]
): Promise<Record<string, unknown>[]> {
  const rows = await readFirstSheetRows(file)
  const headerRow = rows[0] ?? []
  const columnIndexes = new Map<string, number>()

  headerRow.forEach((cell, index) => {
    columnIndexes.set(headerName(cell, index), index)
  })

  const validRowSet = new Set(validRows)
  const records: Record<string, unknown>[] = []

  for (const rowNumber of validRows) {
    const row = rows[rowNumber - 1]
    if (!validRowSet.has(rowNumber) || !row) {
      continue
    }

    const record: Record<string, unknown> = {}

    for (const field of fields) {
      const column = mapping[field.name]
      if (!column) {
        continue
      }

      const columnIndex = columnIndexes.get(column)
      if (columnIndex === undefined) {
        continue
      }

      const cell = row[columnIndex] ?? ""
      if (isBlankCell(cell)) {
        continue
      }

      record[field.name] = coerceCellValue(cell, field)
    }

    records.push(record)
  }

  return records
}