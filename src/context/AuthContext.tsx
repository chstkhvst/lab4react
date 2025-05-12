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

/**
 * Роли пользователей в системе
 */
export enum UserRole {
  Admin = "admin",
  User = "user",
}

/**
 * Интерфейс контекста аутентификации
 */
interface AuthContextType {
  /** Текущий авторизованный пользователь */
  user: LoginResponse | null
  /** Детальная информация о текущем пользователе */
  currentUser: CurrentUser | null
  /** Загрузка данных текущего пользователя */
  fetchCurrentUser: () => Promise<void>
  /** Авторизация пользователя */
  login: (userName: string, password: string) => Promise<void>
  /** Выход пользователя из системы */
  logout: () => void
  /** Регистрация нового пользователя */
  register: (data: RegisterRequest) => Promise<void>
  /** Флаг, является ли пользователь администратором */
  isAdmin: boolean
  /** Флаг загрузки данных */
  isLoading: boolean
  /** Получение списка всех пользователей */
  getAllUsers: () => Promise<User[]>
}

// Создание контекста аутентификации
const AuthContext = createContext<AuthContextType | null>(null)

/**
 * Провайдер контекста аутентификации
 * @param children - дочерние компоненты
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse | null>(null)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Загрузка данных текущего пользователя
   */
  const fetchCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error("Не удалось получить текущего пользователя:", error)
      setCurrentUser(null)
    }
  }

  /**
   * Получение списка всех пользователей
   * @returns Промис с массивом пользователей
   */
  const getAllUsers = async (): Promise<User[]> => {
    return await authService.getAllUsers()
  }

  // Эффект для первичной загрузки данных пользователя
  useEffect(() => {
    const token = authService.getToken()
    if (token) {
      const storedUser = localStorage.getItem("user")
      if (storedUser) setUser(JSON.parse(storedUser))
      fetchCurrentUser()
    }
    setIsLoading(false)
  }, [])

  /**
   * Авторизация пользователя
   * @param userName - имя пользователя
   * @param password - пароль
   */
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

  /**
   * Регистрация нового пользователя
   * @param data - данные для регистрации
   */
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

  /**
   * Выход пользователя из системы
   */
  const logout = () => {
    authService.logout();
    authService.removeToken()
    localStorage.removeItem("user")
    setUser(null)
    setCurrentUser(null)
  }

  // Проверка роли пользователя
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

/**
 * Хук для доступа к контексту аутентификации
 * @returns Контекст аутентификации
 * @throws Ошибка, если хук используется вне провайдера
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthContext }