import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ApiError,
  CurrentUser,
  User
} from "../models/auth.models"

class AuthService {
  private baseUrl: string
  private tokenKey = "jwtToken"

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

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

  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token)
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey)
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
  async getAllUsers(): Promise<User[]> {
    try {
      console.log('BaseURL:', this.baseUrl); // Добавьте лог
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
  
      console.log('Response status:', response.status); // Лог статуса
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Received data:', data); // Лог данных
      return data;
    } catch (error) {
      console.error("Полная ошибка в getAllUsers:", error);
      throw new Error("Не удалось загрузить пользователей. Проверьте консоль для деталей.");
    }
  }
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

export const authService = new AuthService("") 
