import { apiFetch } from "@/lib/api"

export type TokenResponse = {
  access_token: string
  refresh_token: string
  token_type: string
}

export type User = {
  id: string
  name: string
  email: string
  logo_url: string | null
}

export async function signup(params: {
  name: string
  email: string
  password: string
}) {
  return apiFetch("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(params),
  })
}

export async function login(params: {
  email: string
  password: string
}): Promise<TokenResponse> {
  return apiFetch("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(params),
  }) as Promise<TokenResponse>
}

export async function getCurrentUser(): Promise<User> {
  return apiFetch("/api/v1/auth/me") as Promise<User>
}

export async function establishSession(
  email: string,
  password: string
): Promise<User> {
  const response = await login({ email, password })

  localStorage.setItem("access_token", response.access_token)
  localStorage.setItem("refresh_token", response.refresh_token)

  const user = await getCurrentUser()
  localStorage.setItem("user", JSON.stringify(user))

  return user
}
