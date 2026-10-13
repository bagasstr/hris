const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>
    auth?: boolean
}

function getAuthHeaders(): Record<string, string> {
    if (typeof window === "undefined") return {}
    const token = localStorage.getItem("auth_token")
    if (token) return { Authorization: `Bearer ${token}` }
    return {}
}

/**
 * Shared API Client to communicate with Hono Backend
 */
export async function apiClient<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { params, headers, auth = true, ...customConfig } = options

    let url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

    if (params) {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value))
            }
        })
        const queryString = searchParams.toString()
        if (queryString) {
            url += `?${queryString}`
        }
    }

    const config: RequestInit = {
        headers: {
            "Content-Type": "application/json",
            ...(auth ? getAuthHeaders() : {}),
            ...headers,
        },
        credentials: "include",
        ...customConfig,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
        let errorMessage = `API error: ${response.statusText}`
        try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
            // response was not json
        }
        throw new Error(errorMessage)
    }

    return response.json() as Promise<T>
}

export function setAuthToken(token: string) {
    if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token)
    }
}

export function clearAuthToken() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
    }
}

export function getToken(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem("auth_token")
    }
    return null
}
