"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiService } from "@/services/api"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      if (token) {
        const response = await apiService.getProfile()
        setUser(response.user)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("auth-token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await apiService.login(email, password)
    setUser(response.user)
  }

  const signup = async (name: string, email: string, password: string) => {
    const response = await apiService.signup(name, email, password)
    
    setUser(response.user)
  }

  const logout = () => {
    apiService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
