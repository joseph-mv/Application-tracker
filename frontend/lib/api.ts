const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

function parseErrorMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object") {
    return undefined
  }

  const record = data as Record<string, unknown>

  if (typeof record.detail === "string") {
    return record.detail
  }

  if (typeof record.message === "string") {
    return record.message
  }

  return undefined
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null

  const headers = new Headers(options.headers)
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMessage = "An error occurred"
    try {
      const data = await response.json()
      errorMessage = parseErrorMessage(data) ?? errorMessage
    } catch {
      // Fallback
    }
    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}
