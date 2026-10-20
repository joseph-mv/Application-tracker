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
  fields: { field: string }[],
  columns: string[]
): Record<string, string> {
  const mapping: Record<string, string> = {}

  for (const { field } of fields) {
    const match = columns.find(
      (column) =>
        column.toLowerCase() === field.toLowerCase()
    )
    mapping[field] = match ?? ""
  }

  return mapping
}
