import { getAccessToken } from "./AuthConfig"

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = "ApiError"
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE"

interface RequestOptions {
  endpoint: string
  method: RequestMethod
  body?: unknown | BodyInit
  includeAuth?: boolean
}

const apiRequest = async <T>({ endpoint, method, body, includeAuth = true }: RequestOptions): Promise<T> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (includeAuth) {
    const token = await getAccessToken()
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Okänt fel har inträffat" }))
    throw new ApiError(response.status, errorData.message)
  }

  return response.status === 204 ? ({} as T) : await response.json()
}

export const Get = <T>(endpoint: string) => apiRequest<T>({ endpoint, method: "GET" })
export const Post = <T>(endpoint: string, body: any) => apiRequest<T>({ endpoint, method: "POST", body })
export const Put = <T>(endpoint: string, body: any) => apiRequest<T>({ endpoint, method: "PUT", body })
export const Delete = <T>(endpoint: string) => apiRequest<T>({ endpoint, method: "DELETE" })
