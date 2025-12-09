/**
 * types/auth.ts
 * Authentication-related types and interfaces
 */

export interface AuthForm {
  email: string
  password: string
  rememberMe: boolean
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}
