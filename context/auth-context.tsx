"use client"

import type React from "react"
import { createContext, useState, useContext, type ReactNode, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Simulate checking for existing session on app load
  useEffect(() => {
    // In a real app, you would check for a token in AsyncStorage
    // and validate it with your backend
    const checkAuth = async () => {
      try {
        // Simulate a delay for checking authentication
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demo purposes, we'll start as logged out
        setIsAuthenticated(false)
        setUser(null)
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any non-empty credentials
      if (email && password) {
        // In a real app, you would validate credentials with your backend
        // and store the returned token
        setUser({
          id: "1",
          name: "John Doe",
          email: email,
        })
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any non-empty inputs
      if (name && email && password) {
        // In a real app, you would register the user with your backend
        // and store the returned token
        setUser({
          id: "1",
          name: name,
          email: email,
        })
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.error("Signup failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // In a real app, you would clear the token from storage
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
