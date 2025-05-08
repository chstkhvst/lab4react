import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ApiError,
  CurrentUser,
  User
} from "../models/auth.models"

/**
 * Сервис для работы с аутентификацией и пользователями
 */
class AuthService {
  /** Базовый URL API */
  private baseUrl: string
  /** Ключ для хранения JWT токена в localStorage */
  private tokenKey = "jwtToken"

  /**
   * Создает экземпляр AuthService
   * @param {string} baseUrl - Базовый URL API
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Выполняет вход пользователя
   * @param {LoginRequest} credentials - Данные для входа
   * @returns {Promise<LoginResponse>} Ответ с токеном авторизации
   * @throws {Error} Если вход не удался
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/api/Account/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Login failed")
    }

    return (await response.json()) as LoginResponse
  }

  /**
   * Регистрирует нового пользователя
   * @param {RegisterRequest} data - Данные для регистрации
   * @returns {Promise<RegisterResponse>} Ответ с результатом регистрации
   * @throws {Error} Если регистрация не удалась
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${this.baseUrl}/api/Account/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text(); 
      console.error("Ошибка регистрации:", response.status, errorText);
      throw new Error("Registration failed");
    }
    return (await response.json()) as RegisterResponse
  }

  /**
   * Сохраняет токен в localStorage
   * @param {string} token - JWT токен
   */
  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token)
  }

  /**
   * Получает токен из localStorage
   * @returns {string | null} Токен или null, если не найден
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  /**
   * Удаляет токен из localStorage
   */
  removeToken(): void {
    localStorage.removeItem(this.tokenKey)
  }

  /**
   * Проверяет, аутентифицирован ли пользователь
   * @returns {boolean} true если токен существует
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  /**
   * Получает список всех пользователей
   * @returns {Promise<User[]>} Список пользователей
   * @throws {Error} Если требуется авторизация или произошла ошибка запроса
   */
  async getAllUsers(): Promise<User[]> {
    try {
      console.log('BaseURL:', this.baseUrl);
      const token = this.getToken();
      if (!token) throw new Error("Требуется авторизация");
  
      const response = await fetch(`${this.baseUrl}/api/account/all-users`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });
  
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Received data:', data);
      return data;
    } catch (error) {
      console.error("Полная ошибка в getAllUsers:", error);
      throw new Error("Не удалось загрузить пользователей. Проверьте консоль для деталей.");
    }
  }

  /**
   * Получает данные текущего пользователя
   * @returns {Promise<CurrentUser>} Данные пользователя
   * @throws {Error} Если токен не найден или произошла ошибка запроса
   */
  async getCurrentUser(): Promise<CurrentUser> {
    const token = this.getToken()
    if (!token) throw new Error("No token found")
  
    const response = await fetch(`${this.baseUrl}/api/account/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
  
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch user: ${errorText}`)
    }
    return await response.json()
  }

  /**
   * Обновляет профиль пользователя
   * @param {object} data - Данные для обновления
   * @param {string} data.fullName - Полное имя
   * @param {string} data.phoneNumber - Номер телефона
   * @returns {Promise<any>} Результат обновления
   * @throws {Error} Если произошла ошибка при обновлении
   */
  async updateUserProfile(data: {
    fullName: string;
    phoneNumber: string;
  }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/account/editprofile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.getToken()}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update profile: ${errorText}`);
    }
    
    return await response.json();
  }
}

/** Экспортированный экземпляр AuthService с пустым базовым URL */
export const authService = new AuthService("")