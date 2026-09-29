import type { AuthResponse, User } from "../types"
import type {
    LoginFormValues,
    RegisterEmployeeFormValues,
} from "../schemas/auth-schema"
import { apiClient } from "@/lib/api-client"

export const authService = {
    /**
     * Login request to Hono Backend
     */
    async login(data: LoginFormValues): Promise<AuthResponse> {
        return apiClient<AuthResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        })
    },

    /**
     * Register employee request to Hono Backend
     */
    async registerEmployee(
        data: RegisterEmployeeFormValues,
    ): Promise<AuthResponse> {
        return apiClient<AuthResponse>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        })
    },

    /**
     * Get current authenticated user profile
     */
    async getProfile(): Promise<User> {
        return apiClient<User>("/api/auth/me")
    },

    /**
     * Logout user
     */
    async logout(): Promise<{ success: boolean }> {
        return apiClient<{ success: boolean }>("/api/auth/logout", {
            method: "POST",
        })
    },
}
