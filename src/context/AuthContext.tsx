import React, { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/AuthService"
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  CurrentUser,
  User
} from "../models/auth.models"

export enum UserRole {
  Admin = "admin",
  User = "user",
}

interface AuthContextType {
  user: LoginResponse | null
  currentUser: CurrentUser | null
  fetchCurrentUser: () => Promise<void>
  login: (userName: string, password: string) => Promise<void>
  logout: () => void
  register: (data: RegisterRequest) => Promise<void>
  isAdmin: boolean
  isLoading: boolean,
  getAllUsers: () => Promise<User[]> 
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse | null>(null)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error("Не удалось получить текущего пользователя:", error)
      setCurrentUser(null)
    }
  }

  const getAllUsers = async (): Promise<User[]> => {
    return await authService.getAllUsers()
  }

  useEffect(() => {
    const token = authService.getToken()
    if (token) {

      const storedUser = localStorage.getItem("user")
      if (storedUser) setUser(JSON.parse(storedUser))
      fetchCurrentUser()
    }
    setIsLoading(false)
  }, [])

  const login = async (userName: string, password: string) => {
    try {
      const response = await authService.login({ userName, password })
      authService.storeToken(response.token)
      localStorage.setItem("user", JSON.stringify(response))
      setUser(response)
      await fetchCurrentUser()
    } catch (error) {
      console.error("Ошибка входа:", error)
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const response: RegisterResponse = await authService.register(data)
      authService.storeToken(response.token)
      localStorage.setItem("user", JSON.stringify(response))
      setUser(response)
      await fetchCurrentUser()
    } catch (error) {
      console.error("Ошибка регистрации:", error)
      throw error
    }
  }

  const logout = () => {
    authService.removeToken()
    localStorage.removeItem("user")
    setUser(null)
    setCurrentUser(null)
  }

  const isAdmin = user?.userRole === UserRole.Admin

  return (
    <AuthContext.Provider value={{
      user,
      currentUser,
      fetchCurrentUser,
      login,
      logout,
      register,
      isAdmin,
      isLoading,
      getAllUsers
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthContext }