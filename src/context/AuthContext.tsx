import React, { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/AuthService"
import { LoginResponse } from "../models/auth.models"

export enum UserRole {
  Admin = "admin",
  User = "user",
}

interface AuthContextType {
  user: LoginResponse | null
  login: (userName: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
}

// Контекст создается с начальным значением null
const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse | null>(null)

  useEffect(() => {
    const token = authService.getToken()
    if (token) {
      const storedUser = localStorage.getItem("user")
      if (storedUser) setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (userName: string, password: string) => {
    try {
      const response = await authService.login({ userName, password })
      authService.storeToken(response.token)
      localStorage.setItem("user", JSON.stringify(response))
      setUser(response)
    } catch (error) {
      console.error("Ошибка входа:", error)
      throw error
    }
  }

  const logout = () => {
    authService.removeToken()
    localStorage.removeItem("user")
    setUser(null)
  }

  const isAdmin = user?.userRole === UserRole.Admin

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

// Кастомный хук
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthContext }