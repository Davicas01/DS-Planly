"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  onboardingCompleted?: boolean
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (data: SignupData) => Promise<void>
  updateUser: (data: Partial<User>) => void
}

interface SignupData {
  name: string
  email: string
  password: string
  objectives: string[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const authData = localStorage.getItem("planly_auth")
    if (authData) {
      const parsedAuthData = JSON.parse(authData)
      setUser(parsedAuthData.user)
      setToken(parsedAuthData.token)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication
      if (email === "demo@planly.com" && password === "demo123") {
        const user = {
          id: "1",
          name: "Demo User",
          email,
          onboardingCompleted: true,
        }

        const authData = {
          user,
          token: "mock-jwt-token",
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        }

        localStorage.setItem("planly_auth", JSON.stringify(authData))

        setUser(user)
        setToken("mock-jwt-token")
        setIsAuthenticated(true)

        router.push("/dashboard")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      throw error
    }
  }

  const signup = async (data: SignupData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const user = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        onboardingCompleted: false,
      }

      // Store signup data for verification flow
      localStorage.setItem(
        "planly_signup",
        JSON.stringify({
          ...data,
          userId: user.id,
        }),
      )

      router.push("/auth/verify-email")
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    localStorage.removeItem("planly_auth")
    localStorage.removeItem("planly_signup")
    localStorage.removeItem("planly_onboarding_completed")

    setUser(null)
    setToken(null)
    setIsAuthenticated(false)

    router.push("/")
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }

      setUser(updatedUser)

      // Update localStorage
      const authData = localStorage.getItem("planly_auth")
      if (authData) {
        const parsed = JSON.parse(authData)
        parsed.user = updatedUser
        localStorage.setItem("planly_auth", JSON.stringify(parsed))
      }
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    signup,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
