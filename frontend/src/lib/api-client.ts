const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean>
}

/**
 * Shared API Client to communicate with Hono Backend
 */
export async function apiClient<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { params, headers, ...customConfig } = options

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
            ...headers,
        },
        credentials: "include", // Include cookies for cross-origin if needed
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
